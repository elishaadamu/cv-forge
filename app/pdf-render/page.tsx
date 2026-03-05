// @ts-nocheck
"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { ModernProfessional } from "@/components/templates/ModernProfessional"
import { ClassicTable } from "@/components/templates/ClassicTable"
import { ExecutiveTwoColumn } from "@/components/templates/ExecutiveTwoColumn"
import { MinimalATS } from "@/components/templates/MinimalATS"
import { CreativePortfolio } from "@/components/templates/CreativePortfolio"
import { StartupTech } from "@/components/templates/StartupTech"
import { ExecutiveBoard } from "@/components/templates/ExecutiveBoard"
import { MidnightElegance } from "@/components/templates/MidnightElegance"
import { BoldImpact } from "@/components/templates/BoldImpact"
import { CorporateClean } from "@/components/templates/CorporateClean"
import { FreshMinimal } from "@/components/templates/FreshMinimal"
import { RefinedClassic } from "@/components/templates/RefinedClassic"

function PdfRenderContent() {
  const searchParams = useSearchParams()
  const [cvData, setCvData] = useState(null)
  const [templateId, setTemplateId] = useState("modern")

  useEffect(() => {
    try {
      const dataParam = searchParams.get("data")
      const template = searchParams.get("template") || "modern"
      if (dataParam) {
        setCvData(JSON.parse(decodeURIComponent(dataParam)))
        setTemplateId(template)
      }
    } catch (e) {
      console.error("Failed to parse CV data:", e)
    }
  }, [searchParams])

  const TemplateComponent = () => {
    switch (templateId) {
      case "classic": return <ClassicTable data={cvData} isEditable={false} />
      case "executive": return <ExecutiveTwoColumn data={cvData} isEditable={false} />
      case "minimal": return <MinimalATS data={cvData} isEditable={false} />
      case "creative": return <CreativePortfolio data={cvData} isEditable={false} />
      case "startup": return <StartupTech data={cvData} isEditable={false} />
      case "executive-board": return <ExecutiveBoard data={cvData} isEditable={false} />
      case "midnight": return <MidnightElegance data={cvData} isEditable={false} />
      case "bold-impact": return <BoldImpact data={cvData} isEditable={false} />
      case "corporate": return <CorporateClean data={cvData} isEditable={false} />
      case "fresh": return <FreshMinimal data={cvData} isEditable={false} />
      case "refined": return <RefinedClassic data={cvData} isEditable={false} />
      default: return <ModernProfessional data={cvData} isEditable={false} />
    }
  }

  if (!cvData) {
    return <div>Loading...</div>
  }

  return (
    <>
      {/* Hide all non-CV elements for PDF - comprehensive list */}
      <style>{`
        /* Hide everything by default */
        body > *:not(#cv-root):not(#__next):not(.pdf-render-container) {
          display: none !important;
        }
        
        /* Hide cookie banners, consent dialogs, and other non-essential elements */
        #cookie-consent, .cookie-consent, #cookie-banner, .cookie-banner,
        #privacy-shield, .privacy-shield, [data-cookie], [data-consent],
        .gdpr-consent, #gdpr-consent, .cookie-notice, #cookie-notice,
        [class*="cookie"], [class*="consent"], [class*="privacy"],
        [id*="cookie"], [id*="consent"], [id*="privacy"],
        /* Hide navbar, footer, and other app chrome */
        nav, footer, header:not(#cv-root header), .navbar, .footer,
        /* Hide any overlays, modals, dialogs */
        [role="dialog"], [role="alertdialog"], .modal, .overlay,
        /* Hide fixed/sticky elements */
        [style*="position: fixed"], [style*="position: sticky"],
        /* Hide by selector patterns */
        .ant-modal, .ant-notification, .Toastify, [class*="toast"],
        [class*="notification"], [class*="banner"], [class*="popup"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          width: 0 !important;
          overflow: hidden !important;
        }
        
        /* Force show only cv-root */
        #cv-root {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        /* PDF Page break controls - keep section headers from appearing at bottom */
        #cv-root section,
        #cv-root [style*="margin-bottom"],
        #cv-root div[data-section],
        .cv-section {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        
        /* Prevent section titles from being alone at bottom of page */
        #cv-root h1,
        #cv-root h2,
        #cv-root h3,
        #cv-root h4,
        #cv-root h5,
        #cv-root h6,
        #cv-root [style*="text-transform: uppercase"],
        #cv-root p[style*="font-weight: 700"],
        .cv-section-title {
          break-after: avoid;
          page-break-after: avoid;
        }
        
        /* Add margin to top of sections for cleaner page breaks */
        #cv-root > div > div {
          margin-top: 8pt;
        }
        
        /* Add top margin to content on page 2, 3, 4+ */
        .cv-section {
          margin-top: 40pt;
        }
        
        .cv-section:first-child {
          margin-top: 0;
        }
        
        /* Force page break with margin */
        .page-break {
          break-before: page;
          page-break-before: always;
          margin-top: 150pt !important;
          padding-top: 50pt !important;
        }
      `}</style>
      <div id="cv-root" style={{ width: "210mm", margin: "0 auto", background: "#fff" }}>
        <TemplateComponent />
      </div>
    </>
  )
}

export default function PdfRenderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PdfRenderContent />
    </Suspense>
  )
}
