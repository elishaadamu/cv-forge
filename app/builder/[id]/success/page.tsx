"use client"

import { Navbar } from "@/components/Navbar"
import { motion } from "framer-motion"
import { 
  Download, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  ArrowLeft, 
  LayoutDashboard,
  Share2,
  ExternalLink,
  Zap,
  Loader2,
  Copy,
  Mail,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  MessageCircle
} from "lucide-react"
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
import { getCV, saveCV } from "@/lib/actions"
import { useSession } from "next-auth/react"
import { useEffect, useState, useRef } from "react"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import Link from "next/link"
import { useParams } from "next/navigation"
import { message, Dropdown, MenuProps } from "antd"

export default function SuccessPage() {
  const { data: session } = useSession()
  const params = useParams()
  const id = params.id as string
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false) // true after off-screen template has painted
  const cvRef = useRef<HTMLDivElement>(null)

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/preview/${id}` : ""
  const shareTitle = "Check out my new CV created on CV Forge!"

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    message.success("Link copied to clipboard!")
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Professional CV",
          text: shareTitle,
          url: shareUrl,
        })
      } catch (err) {
        console.log("Share failed:", err)
      }
    } else {
      handleCopyLink()
    }
  }

  const shareItems: MenuProps['items'] = [
    {
      key: 'native',
      label: 'Share via App',
      icon: <Share2 size={16} />,
      onClick: handleNativeShare
    },
    {
      type: 'divider',
    },
    {
      key: 'copy',
      label: 'Copy Link',
      icon: <Copy size={16} />,
      onClick: handleCopyLink
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: <MessageCircle size={16} />,
      onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`, '_blank')
    },
    {
      key: 'email',
      label: 'Email',
      icon: <Mail size={16} />,
      onClick: () => window.open(`mailto:?subject=${encodeURIComponent("My Professional CV")}&body=${encodeURIComponent(shareTitle + "\n\n" + shareUrl)}`, '_blank')
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: <Facebook size={16} />,
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: <Linkedin size={16} />,
      onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    {
      key: 'twitter',
      label: 'Twitter / X',
      icon: <Twitter size={16} />,
      onClick: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank')
    }
  ]

  useEffect(() => {
    if (!session) return // still loading session
    if (!session?.user?.id) {
      setIsLoading(false)
      return
    }
    const fetchData = async () => {
      setIsLoading(true)
      const res = await getCV(id, session.user.id)
      if (res.success && res.data) {
        setCvData(res.data)
        // Give the off-screen template ~400ms to paint before enabling downloads
        setTimeout(() => setIsReady(true), 400)
      }
      setIsLoading(false)
    }
    fetchData()
  }, [id, session])

  const handleDownload = async (type: string) => {
    if (!cvRef.current || !cvData || !isReady) {
      setExportError("CV is still loading. Please wait a moment and try again.")
      setTimeout(() => setExportError(null), 4000)
      return
    }
    
    setIsExporting(type)
    setExportError(null)

    try {
      if (session?.user?.id) {
         await saveCV(session.user.id, { ...cvData, templateId: cvData.templateId, status: "DOWNLOADED" }, id)
      }

      const element = cvRef.current

      // Wait for all images in the template to fully load
      const images = Array.from(element.getElementsByTagName("img"))
      await Promise.all(
        images.map(
          (img) =>
            img.complete
              ? Promise.resolve()
              : new Promise<void>((resolve) => {
                  img.onload = () => resolve()
                  img.onerror = () => resolve()
                })
        )
      )

      // Small delay to ensure everything is painted
      await new Promise((r) => setTimeout(r, 200))

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: element.scrollWidth,
        height: element.scrollHeight,
      })

      const imgData = canvas.toDataURL("image/png", 1.0)

      if (type === ".png") {
        const link = document.createElement("a")
        link.download = `${cvData.personalInfo.fullName.replace(/\s+/g, "_") || "CV"}_CV.png`
        link.href = imgData
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else if (type === ".pdf") {
        // Client-side PDF generation using html2canvas + jsPDF
        const a4WidthPx = element.scrollWidth // already 210mm wide
        const a4HeightMM = 297
        const a4WidthMM = 210
        const scaleFactor = a4WidthMM / a4WidthPx

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        })

        const totalHeightPx = element.scrollHeight
        const pageHeightPx = a4HeightMM / scaleFactor
        const totalPages = Math.ceil(totalHeightPx / pageHeightPx)

        for (let page = 0; page < totalPages; page++) {
          if (page > 0) pdf.addPage()

          const pageCanvas = await html2canvas(element, {
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: "#ffffff",
            width: a4WidthPx,
            height: pageHeightPx,
            y: page * pageHeightPx,
            windowHeight: pageHeightPx,
          })

          const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.8)
          pdf.addImage(pageImgData, "JPEG", 0, 0, a4WidthMM, a4HeightMM, undefined, "FAST")
        }

        pdf.save(`${cvData.personalInfo.fullName.replace(/\s+/g, "_") || "CV"}_CV.pdf`)
      } else if (type === ".docx") {
        const response = await fetch("/api/generate-docx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvData }),
        })

        if (!response.ok) throw new Error("Failed to generate DOCX")

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${cvData.personalInfo.fullName.replace(/\s+/g, "_") || "CV"}_CV.docx`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
      message.success("Asset Acquired Successfully!")
    } catch (error) {
      console.error("Export error:", error)
      setExportError("Export failed. Please try again.")
      setTimeout(() => setExportError(null), 4000)
    } finally {
      setIsExporting(null)
    }
  }

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

  const downloadOptions = [
    {
      title: "PDF Document",
      desc: "Best for applications & printing. Layout-perfect.",
      icon: FileText,
      gradient: "from-red-500 to-rose-600",
      glow: "group-hover:shadow-red-500/30",
      ext: ".pdf",
    },
    {
      title: "Word / Google Docs",
      desc: "Editable format for manual customisation.",
      icon: Zap,
      gradient: "from-blue-500 to-indigo-600",
      glow: "group-hover:shadow-blue-500/30",
      ext: ".docx",
    },
    {
      title: "High-Res Image",
      desc: "Perfect for social media & portfolios.",
      icon: ImageIcon,
      gradient: "from-emerald-500 to-teal-600",
      glow: "group-hover:shadow-emerald-500/30",
      ext: ".png",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Off-screen render container — must NOT use visibility:hidden/opacity:0/display:none */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-9999px",
          top: "0px",
          width: "210mm",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div ref={cvRef} style={{ width: "210mm" }}>{renderTemplate()}</div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        
        {/* Navigation Links moved to the Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 py-6 border-b border-border-custom px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 text-foreground/40 hover:text-brand-action font-black uppercase tracking-widest text-xs transition-all duration-200 hover:-translate-x-1"
          >
            <LayoutDashboard size={18} />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href={`/builder/${id}`}
              className="flex items-center gap-2.5 text-foreground/40 hover:text-brand-action font-black uppercase tracking-widest text-xs transition-all duration-200"
            >
              <ArrowLeft size={18} />
              <span>Continue Editing</span>
            </Link>
            
            <div className="w-1.5 h-1.5 bg-border-custom rounded-full" />
            
            <Dropdown menu={{ items: shareItems }} placement="bottomRight" trigger={['click']}>
              <button className="flex items-center gap-2.5 text-foreground/40 hover:text-brand-action font-black uppercase tracking-widest text-xs transition-all duration-200 outline-none">
                <Share2 size={18} />
                <span>Share Link</span>
              </button>
            </Dropdown>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-action/10 flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-brand-action" />
            </div>
            <p className="text-foreground/40 font-black uppercase tracking-widest text-xs">Loading your CV…</p>
          </div>
        )}

        {!isLoading && (
        <div className="max-w-3xl mx-auto text-center space-y-8 mb-16">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-24 h-24 bg-brand-success/15 border border-brand-success/20 rounded-[32px] flex items-center justify-center text-brand-success mx-auto shadow-2xl shadow-brand-success/20"
          >
            <CheckCircle2 size={48} strokeWidth={1.5} />
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-black tracking-tight"
            >
              CV{" "}
              <span className="text-brand-success">Created Successfully.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-foreground/50 font-medium"
            >
              Your professional identity is ready. Choose your preferred export
              format below.
            </motion.p>
          </div>
        </div>
        )}

        {/* Error Banner */}
        {exportError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold text-center"
          >
            {exportError}
          </motion.div>
        )}

        {/* Download Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {downloadOptions.map((opt, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              onClick={() => !isExporting && handleDownload(opt.ext)}
              disabled={!!isExporting}
              className={`group relative text-left w-full bg-white/5 border border-white/10 rounded-[28px] p-8 hover:bg-white/8 hover:border-white/20 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${isExporting === opt.ext ? "" : "hover:-translate-y-1"}`}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-linear-to-br ${opt.gradient} flex items-center justify-center text-white mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}
              >
                {isExporting === opt.ext ? (
                  <Loader2 className="animate-spin" size={28} />
                ) : (
                  <opt.icon size={28} />
                )}
              </div>

              {/* Text */}
              <h3 className="text-xl font-black mb-1.5">{opt.title}</h3>
              <p className="text-sm text-foreground/40 font-medium leading-relaxed mb-8">
                {opt.desc}
              </p>

              {/* Download button row */}
              <div
                className={`w-full py-4 rounded-xl border flex items-center justify-center gap-2.5 font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                  isExporting === opt.ext
                    ? "bg-brand-action/20 border-brand-action/30 text-brand-action"
                    : "bg-white/5 border-white/10 group-hover:bg-brand-action group-hover:border-brand-action group-hover:text-white group-hover:shadow-lg"
                } ${opt.glow}`}
              >
                {isExporting === opt.ext ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Exporting…</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Download {opt.ext}</span>
                  </>
                )}
              </div>

              {/* Background blur blob */}
              <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-white/3 rounded-full blur-3xl group-hover:bg-brand-action/10 transition-all duration-500 pointer-events-none" />
            </motion.button>
          ))}
        </div>

        {/* Pro Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="p-8 bg-white/5 border border-border-custom rounded-[32px] max-w-2xl mx-auto flex items-start gap-6"
        >
          <div className="w-12 h-12 bg-brand-action/10 border border-brand-action/20 rounded-2xl flex items-center justify-center text-brand-action shrink-0">
            <ExternalLink size={22} />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-black tracking-tight">
              Pro Tip: ATS Resilience
            </h4>
            <p className="text-sm text-foreground/40 font-medium leading-relaxed">
              Recruiters and Applicant Tracking Systems (ATS) prefer the{" "}
              <span className="text-foreground/70 font-black">PDF format</span>{" "}
              as it preserves your design layout perfectly across all devices and
              platforms.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
