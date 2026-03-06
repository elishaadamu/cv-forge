// @ts-nocheck
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// PDFShift API Key
const PDFSHIFT_API_KEY = process.env.PDFSHIFT_API_KEY || 'sk_a74db5048046f9dd33ec3d7e24f82954cd5e6263'

// Chrome executable path for Windows (local development)
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

export async function POST(req: Request) {
  let browser = null
  try {
    const { cvData, templateId } = await req.json()

    if (!cvData) {
      return NextResponse.json({ error: 'CV data is required' }, { status: 400 })
    }

    // Get the base URL for the render page
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const encodedData = encodeURIComponent(JSON.stringify(cvData))
    const renderUrl = `${baseUrl}/pdf-render?data=${encodedData}&template=${templateId || 'modern'}`

    // Check if running locally (development) or on Vercel/Render (production)
    const isLocal = process.env.NODE_ENV === 'development'
    const isVercel = process.env.VERCEL === '1'
    const isRender = process.env.RENDER === 'true'
    const isProduction = isVercel || isRender
    
    // Use PDFShift on production (Vercel/Render), Puppeteer locally
    if (isLocal) {
      // ===== LOCAL DEVELOPMENT: Use Puppeteer =====
      console.log('PDF Generation: Using Puppeteer (local)')
      
      browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
        headless: true,
      })

      const page = await browser.newPage()
      
      // Log URL for debugging (truncated)
      console.log('PDF Generation: Navigating to render URL (data length:', encodedData.length, ')')
      
      await page.goto(renderUrl, { waitUntil: 'networkidle2', timeout: 60000 })
      
      // Wait for #cv-root (it should be there immediately now)
      await page.waitForSelector('#cv-root', { timeout: 15000 })
      
      // Wait for content to render and fonts to load
      await new Promise(resolve => setTimeout(resolve, 3000))

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        tagged: true,
      })

      await browser.close()
      console.log('PDF Generation: PDF generated successfully via Puppeteer (local)')

      return new NextResponse(Buffer.from(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${(cvData.personalInfo?.fullName || 'CV').replace(/\s+/g, '_')}_CV.pdf"`
        }
      })

    } else {
      // ===== PRODUCTION (Render/Vercel): Use PDFShift =====
      console.log('PDF Generation: Using PDFShift (production)')

      const response = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
        method: 'POST',
        headers: {
          'X-API-Key': PDFSHIFT_API_KEY,
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          source: renderUrl,
          margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          },
          format: 'A4'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('PDFShift Error:', error)
        throw new Error(error.message || 'Failed to generate PDF with PDFShift')
      }

      const pdfBuffer = await response.arrayBuffer()
      console.log('PDF Generation: PDF generated successfully via PDFShift')

      return new NextResponse(Buffer.from(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${(cvData.personalInfo?.fullName || 'CV').replace(/\s+/g, '_')}_CV.pdf"`
        }
      })
    }
  } catch (error: any) {
    console.error('PDF Generation Error:', error)
    if (error.stack) {
      console.error('Error stack:', error.stack)
    }
    if (browser) {
      await browser.close().catch(() => {})
    }
    return NextResponse.json({
      error: 'Failed to generate PDF',
      details: error.message || 'Unknown error'
    }, { status: 500 })
  }
}
