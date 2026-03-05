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

    // Ensure all required fields exist to prevent rendering crashes
    cvData.personalInfo = cvData.personalInfo || {}
    cvData.experience = cvData.experience || []
    cvData.education = cvData.education || []
    cvData.skills = cvData.skills || []
    cvData.projects = cvData.projects || []

    // 1. Pick the template
    let TableComponent: any
    switch (templateId) {
      case 'classic':
        TableComponent = (await import('@/components/templates/ClassicTable')).ClassicTable
        break
      case 'executive':
        TableComponent = (await import('@/components/templates/ExecutiveTwoColumn')).ExecutiveTwoColumn
        break
      case 'minimal':
        TableComponent = (await import('@/components/templates/MinimalATS')).MinimalATS
        break
      case 'creative':
        TableComponent = (await import('@/components/templates/CreativePortfolio')).CreativePortfolio
        break
      case 'startup':
        TableComponent = (await import('@/components/templates/StartupTech')).StartupTech
        break
      case 'executive-board':
        TableComponent = (await import('@/components/templates/ExecutiveBoard')).ExecutiveBoard
        break
      case 'midnight':
        TableComponent = (await import('@/components/templates/MidnightElegance')).MidnightElegance
        break
      case 'bold-impact':
        TableComponent = (await import('@/components/templates/BoldImpact')).BoldImpact
        break
      case 'corporate':
        TableComponent = (await import('@/components/templates/CorporateClean')).CorporateClean
        break
      case 'fresh':
        TableComponent = (await import('@/components/templates/FreshMinimal')).FreshMinimal
        break
      case 'refined':
        TableComponent = (await import('@/components/templates/RefinedClassic')).RefinedClassic
        break
      default:
        TableComponent = (await import('@/components/templates/ModernProfessional')).ModernProfessional
        break
    }

    // 2. Render to Static HTML
    const { renderToStaticMarkup } = await import('react-dom/server')
    const contentHtml = renderToStaticMarkup(TableComponent({ data: cvData }))

    // Construct full HTML document for Puppeteer
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { margin: 0; padding: 0; background: #fff; font-family: Georgia, 'Times New Roman', serif; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            * { user-select: text !important; -webkit-user-select: text !important; -moz-user-select: text !important; -ms-user-select: text !important; }
            @page { margin: 0; size: A4; }
          </style>
        </head>
        <body>
          <div id="cv-root" style="width: 210mm; margin: 0 auto;">
            ${contentHtml}
          </div>
        </body>
      </html>
    `

    // 3. Launch Puppeteer with explicit Chrome path
    console.log('PDF Generation: Launching browser from', CHROME_PATH)

    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--disable-web-security'],
      headless: true,
    })

    console.log('PDF Generation: Browser launched successfully')
    const page = await browser.newPage()
    console.log('PDF Generation: Setting content...')
    await page.setContent(fullHtml, { waitUntil: 'networkidle0', timeout: 60000 })

    // 4. Generate PDF
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

    // 5. Return PDF as a Response
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
