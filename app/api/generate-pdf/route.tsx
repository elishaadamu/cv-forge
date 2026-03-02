import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import { ModernProfessional } from '@/components/templates/ModernProfessional'
import { ClassicTable } from '@/components/templates/ClassicTable'
import { ExecutiveTwoColumn } from '@/components/templates/ExecutiveTwoColumn'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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
          <div id="cv-root" style="width: 850px; margin: 0 auto;">
            ${contentHtml}
          </div>
        </body>
      </html>
    `

    // 3. Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
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
