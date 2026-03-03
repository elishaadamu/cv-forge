"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Loader2, 
  Zap, 
  Search,
  ChevronRight
} from "lucide-react"
import { analyzeCVATS } from "@/lib/actions"
import { MarkdownText } from "./MarkdownText"

interface ATSAuditPanelProps {
  isOpen: boolean
  onClose: () => void
  cvData: any
}

export function ATSAuditPanel({ isOpen, onClose, cvData }: ATSAuditPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [jobDescription, setJobDescription] = useState("")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAudit = async () => {
    setIsAnalyzing(true)
    setError(null)
    try {
      const res = await analyzeCVATS(cvData, jobDescription)
      if (res.success) {
        setResult(res.analysis)
      } else {
        setError(res.error || "Analysis failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass": return "text-brand-success"
      case "warning": return "text-amber-400"
      case "fail": return "text-red-400"
      default: return "text-foreground/40"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass": return <CheckCircle2 size={16} />
      case "warning": return <AlertTriangle size={16} />
      case "fail": return <AlertCircle size={16} />
      default: return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-200"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background/80 backdrop-blur-2xl border-l border-white/10 z-200 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-action/20 flex items-center justify-center text-brand-action">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">ATS Audit</h2>
                  <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Digital Gatekeeper Scan</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
              {!result && !isAnalyzing && (
                <div className="space-y-6">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                       <Zap size={18} className="text-brand-action" />
                       Target Specific Role?
                    </h3>
                    <p className="text-sm text-foreground/50">Paste the job description below to check for specific keyword matching.</p>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste Job Description here..."
                      className="w-full h-32 bg-black/20 border border-white/10 rounded-2xl p-4 text-sm focus:border-brand-action/50 focus:ring-1 focus:ring-brand-action/50 transition-all outline-none resize-none"
                    />
                  </div>

                  <button
                    onClick={handleAudit}
                    className="w-full py-4 bg-brand-action text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-brand-action/20 hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Search size={18} />
                    Start ATS Scan
                  </button>
                </div>
              )}

              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-brand-action/10 border-t-brand-action animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-brand-action">
                      <ShieldCheck size={32} />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-lg font-black tracking-tight">Analyzing CV…</h3>
                    <p className="text-sm text-foreground/40">Gemini is checking sections & keywords</p>
                  </div>
                </div>
              )}

              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Score Gauge */}
                  <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96" cy="96" r="80"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-white/5"
                      />
                      <motion.circle
                        cx="96" cy="96" r="80"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={502.6}
                        initial={{ strokeDashoffset: 502.6 }}
                        animate={{ strokeDashoffset: 502.6 - (502.6 * result.score) / 100 }}
                        className="text-brand-action shadow-lg"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black tabular-nums">{result.score}</span>
                      <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">ATS Score</span>
                    </div>
                  </div>

                  {/* Checks Checklist */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-foreground/40 uppercase tracking-[0.2em] mb-4">Audit Breakdown</h4>
                    {result.checks.map((check: any, i: number) => (
                      <div key={i} className="group p-4 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-4 hover:bg-white/10 transition-colors">
                        <div className={`mt-0.5 ${getStatusColor(check.status)}`}>
                          {getStatusIcon(check.status)}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold leading-none">{check.label}</p>
                          <MarkdownText content={check.message} className="text-xs text-foreground/40 leading-relaxed font-medium" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Suggestions */}
                  <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] space-y-4">
                    <h4 className="text-xs font-black text-brand-action uppercase tracking-[0.2em]">Quick Improvements</h4>
                    <ul className="space-y-3">
                      {result.suggestions.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-foreground/70 font-medium">
                          <ChevronRight size={16} className="mt-0.5 text-brand-action shrink-0" />
                          <MarkdownText content={s} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Secondary Action */}
                  <button
                    onClick={() => setResult(null)}
                    className="w-full py-4 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-colors"
                  >
                    Run New Scan
                  </button>
                </motion.div>
              )}

              {error && (
                <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-bold">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
