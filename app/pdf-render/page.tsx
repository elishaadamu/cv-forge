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
    <div id="cv-root" style={{ width: "210mm", margin: "0 auto", background: "#fff" }}>
      <TemplateComponent />
    </div>
  )
}

export default function PdfRenderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PdfRenderContent />
    </Suspense>
  )
}
