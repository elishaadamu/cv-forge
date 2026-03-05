// @ts-nocheck
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Chrome executable path for Windows
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

    console.log('PDF Generation: Rendering from URL:', renderUrl)

    // Launch Puppeteer with explicit Chrome path
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      headless: true,
    })

    console.log('PDF Generation: Browser launched successfully')
    const page = await browser.newPage()
    console.log('PDF Generation: Navigating to render page...')
    await page.goto(renderUrl, { waitUntil: 'networkidle0', timeout: 60000 })

    // Wait for content to render
    await page.waitForSelector('#cv-root', { timeout: 10000 })

    // Generate PDF
    console.log('PDF Generation: Generating PDF buffer...')
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      tagged: true,
    })

    console.log('PDF Generation: PDF generated successfully')
    await browser.close()

    // Return PDF as a Response
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${(cvData.personalInfo?.fullName || 'CV').replace(/\s+/g, '_')}_CV.pdf"`
      }
    })
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
