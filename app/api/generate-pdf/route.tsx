// @ts-nocheck
import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Chrome executable path for Windows (development)
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

    // For Vercel production, we'll use a simpler approach
    // Since puppeteer requires a browser binary which isn't available in serverless
    // We'll return an error message suggesting to download locally
    // Detect environments
    const isVercel = process.env.VERCEL === '1'
    const isRender = process.env.RENDER === 'true' || process.env.NODE_ENV === 'production'
    
    if (isVercel) {
      // On Vercel, we can't run Puppeteer due to serverless limitations (unless using sparticuz/chromium-min)
      return NextResponse.json({
        error: 'PDF generation is only available in development mode or on Render',
        details: 'Vercel serverless functions have limitations for Puppeteer. Use a local environment or Render for PDF generation.'
      }, { status: 503 })
    }

    // Set up launch options
    const launchOptions = {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      headless: true,
    }

    // Use hardcoded path for Windows (development)
    // For Render (Linux), let Puppeteer find its own Chromium or use the user-defined executable path
    if (process.platform === 'win32' && !isRender) {
      console.log('PDF Generation: Windows detected, using', CHROME_PATH)
      launchOptions.executablePath = CHROME_PATH
    } else if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      console.log('PDF Generation: Using provided PUPPETEER_EXECUTABLE_PATH:', process.env.PUPPETEER_EXECUTABLE_PATH)
      launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH
    } else {
      console.log('PDF Generation: Let Puppeteer handle browser launch (standard installation)')
    }

    console.log('PDF Generation: Launching browser...')
    browser = await puppeteer.launch(launchOptions)

    console.log('PDF Generation: Browser launched successfully')
    const page = await browser.newPage()
    console.log('PDF Generation: Navigating to render page...')
    await page.goto(renderUrl, { waitUntil: 'networkidle0', timeout: 60000 })

    // Wait for content to render
    await page.waitForSelector('#cv-root', { timeout: 10000 })
    
    // Wait a bit more for any lazy-loaded content
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Aggressively remove any cookie consent banners or popups
    await page.evaluate(() => {
      // Remove ALL elements that might be cookie/consent related
      const selectors = [
        '#cookie-consent', '.cookie-consent', '#cookie-banner', '.cookie-banner',
        '#privacy-shield', '.privacy-shield', '[data-cookie]', '[data-consent]',
        '.gdpr-consent', '#gdpr-consent', '.cookie-notice', '#cookie-notice',
        '[class*="cookie"]', '[class*="consent"]', '[class*="privacy"]',
        '[id*="cookie"]', '[id*="consent"]', '[id*="privacy"]',
        'nav', 'footer', 'header:not(#cv-root header)', '.navbar', '.footer',
        '[role="dialog"]', '[role="alertdialog"]', '.modal', '.overlay',
        '.ant-modal', '.ant-notification', '.Toastify', '[class*="toast"]',
        '[class*="notification"]', '[class*="banner"]', '[class*="popup"]',
      ]
      selectors.forEach(selector => {
        try {
          document.querySelectorAll(selector).forEach(el => {
            // Don't remove cv-root
            if (el.id !== 'cv-root' && !el.closest('#cv-root')) {
              el.remove()
            }
          })
        } catch (e) {
          // Ignore invalid selectors
        }
      })
      
      // Remove any fixed/sticky overlays
      document.querySelectorAll('*').forEach(el => {
        const style = window.getComputedStyle(el)
        if ((style.position === 'fixed' || style.position === 'sticky') && 
            !el.closest('#cv-root')) {
          el.remove()
        }
      })
      
      // Remove any element containing consent-related text (with null check)
      document.querySelectorAll('*').forEach(el => {
        const text = el.innerText
        if (text && (text.toLowerCase().includes('cookie') || text.toLowerCase().includes('privacy') || text.toLowerCase().includes('consent')) &&
            !el.closest('#cv-root') && el.children.length === 0) {
          el.remove()
        }
      })
    })

    // Generate PDF
    console.log('PDF Generation: Generating PDF buffer...')
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { 
        top: '0mm',
        right: '0mm', 
        bottom: '0mm', 
        left: '0mm',
      },
      tagged: true,
      displayHeaderFooter: false,
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
