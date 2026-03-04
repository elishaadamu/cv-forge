import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium-min'
import { ModernProfessional } from '@/components/templates/ModernProfessional'
import { ClassicTable } from '@/components/templates/ClassicTable'
import { ExecutiveTwoColumn } from '@/components/templates/ExecutiveTwoColumn'
import { MinimalATS } from '@/components/templates/MinimalATS'
import { CreativePortfolio } from '@/components/templates/CreativePortfolio'
import { StartupTech } from '@/components/templates/StartupTech'
import { ExecutiveBoard } from '@/components/templates/ExecutiveBoard'
import { MidnightElegance } from '@/components/templates/MidnightElegance'
import { BoldImpact } from '@/components/templates/BoldImpact'
import { CorporateClean } from '@/components/templates/CorporateClean'
import { FreshMinimal } from '@/components/templates/FreshMinimal'
import { RefinedClassic } from '@/components/templates/RefinedClassic'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Set up executable path based on OS (production vs development)
// For local Windows development, you might need to point to your Chrome executable 
// if puppeteer-core doesn't find it automatically.
const CHROMIUM_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

export async function POST(req: Request) {
  try {
    const { cvData, templateId } = await req.json()

    if (!cvData) {
      return NextResponse.json({ error: 'CV data is required' }, { status: 400 })
    }

    // 1. Pick the template
    let TableComponent
    switch (templateId) {
      case 'classic':
        TableComponent = ClassicTable
        break
      case 'executive':
        TableComponent = ExecutiveTwoColumn
        break
      case 'minimal':
        TableComponent = MinimalATS
        break
      case 'creative':
        TableComponent = CreativePortfolio
        break
      case 'startup':
        TableComponent = StartupTech
        break
      case 'executive-board':
        TableComponent = ExecutiveBoard
        break
      case 'midnight':
        TableComponent = MidnightElegance
        break
      case 'bold-impact':
        TableComponent = BoldImpact
        break
      case 'corporate':
        TableComponent = CorporateClean
        break
      case 'fresh':
        TableComponent = FreshMinimal
        break
      case 'refined':
        TableComponent = RefinedClassic
        break
      default:
        TableComponent = ModernProfessional
        break
    }

    // 2. Render to Static HTML
    // We use a dynamic require to avoid Next.js build-time errors with react-dom/server
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const ReactDomServer = require('react-dom/server')
    const contentHtml = ReactDomServer.renderToStaticMarkup(<TableComponent data={cvData} />)
    
    // Construct full HTML document for Puppeteer
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { margin: 0; padding: 0; background: #fff; }
            /* Force exact colors and backgrounds */
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
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

    // 3. Launch Puppeteer
    const isProd = process.env.NODE_ENV === 'production'
    
    // Configure based on environment
    let browser
    if (isProd) {
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      })
    } else {
      // Development (Local Windows usually)
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: CHROMIUM_PATH, // Change this if Chrome is installed elsewhere
        headless: true,
      })
    }
    
    const page = await browser.newPage()
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' })
    
    // 4. Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    })

    await browser.close()

    // 5. Return PDF as a Response
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cvData.personalInfo.fullName.replace(/\s+/g, '_')}_CV.pdf"`
      }
    })
  } catch (error) {
    console.error('PDF Generation Error:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
