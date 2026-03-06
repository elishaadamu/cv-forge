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
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      const dataParam = searchParams.get("data")
      const template = searchParams.get("template") || "modern"
      
      if (dataParam) {
        const decodedData = decodeURIComponent(dataParam)
        const parsedData = JSON.parse(decodedData)
        setCvData(parsedData)
        setTemplateId(template)
      } else {
        setError("No CV data provided in URL")
      }
    } catch (e) {
      console.error("Failed to parse CV data:", e)
      setError("Failed to parse CV data: " + e.message)
    }
  }, [searchParams])

  const TemplateComponent = () => {
    if (!cvData) return null
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

  return (
    <>
      <style>{`
        body > *:not(#cv-root):not(#__next):not(.pdf-render-container) {
          display: none !important;
        }
        
        #cv-root {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        #cv-root section,
        #cv-root [style*="margin-bottom"],
        #cv-root div[data-section],
        .cv-section {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        
        #cv-root h1, #cv-root h2, #cv-root h3, #cv-root h4, #cv-root h5, #cv-root h6,
        #cv-root [style*="text-transform: uppercase"],
        #cv-root p[style*="font-weight: 700"],
        .cv-section-title {
          break-after: avoid;
          page-break-after: avoid;
        }
      `}</style>
      <div id="cv-root" style={{ width: "210mm", margin: "0 auto", background: "#fff", minHeight: "297mm" }}>
        {error ? (
          <div style={{ padding: "40px", color: "red", border: "1px solid red", margin: "20px" }}>
            <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>PDF Render Error</h1>
            <p>{error}</p>
          </div>
        ) : !cvData ? (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <p>Initializing professional layout...</p>
          </div>
        ) : (
          <TemplateComponent />
        )}
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
