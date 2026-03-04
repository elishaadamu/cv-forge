"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getCVPreview } from "@/lib/actions"
import { Loader2, AlertCircle, Home } from "lucide-react"
import Link from "next/link"

import { ModernProfessional, CVData } from "@/components/templates/ModernProfessional"
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

export default function PreviewPage() {
  const params = useParams()
  const id = params.id as string
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setIsLoading(true)
        const res = await getCVPreview(id)
        if (res.success && res.data) {
          setCvData(res.data)
        } else {
          setError(res.error || "Failed to load CV preview.")
        }
      } catch (err) {
        setError("An unexpected error occurred.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchPreview()
  }, [id])

  const renderTemplate = () => {
    if (!cvData) return null
    switch (cvData.templateId) {
      case "classic":
        return <ClassicTable data={cvData} />
      case "executive":
        return <ExecutiveTwoColumn data={cvData} />
      case "minimal":
        return <MinimalATS data={cvData} />
      case "creative":
        return <CreativePortfolio data={cvData} />
      case "startup":
        return <StartupTech data={cvData} />
      case "executive-board":
        return <ExecutiveBoard data={cvData} />
      case "midnight":
        return <MidnightElegance data={cvData} />
      case "bold-impact":
        return <BoldImpact data={cvData} />
      case "corporate":
        return <CorporateClean data={cvData} />
      case "fresh":
        return <FreshMinimal data={cvData} />
      case "refined":
        return <RefinedClassic data={cvData} />
      default:
        return <ModernProfessional data={cvData} />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-brand-action animate-spin mb-4" />
        <p className="text-neutral-500 font-medium font-mono uppercase tracking-widest text-xs">Fetching Professional Identity...</p>
      </div>
    )
  }

  if (error || !cvData) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-xl border border-neutral-200 text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mx-auto">
            <AlertCircle size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight">Preview Unavailable</h1>
            <p className="text-neutral-500 text-sm leading-relaxed">
              {error || "This CV link may have expired or is no longer available to the public."}
            </p>
          </div>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-lg"
          >
            <Home size={16} />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100 py-12 px-4 flex justify-center overflow-x-hidden">
      <div 
        className="bg-white shadow-2xl origin-top sm:scale-100 scale-[0.6] sm:mb-0 -mb-[40%]"
        style={{ width: "210mm", minHeight: "297mm" }}
      >
        {renderTemplate()}
      </div>
    </div>
  )
}
