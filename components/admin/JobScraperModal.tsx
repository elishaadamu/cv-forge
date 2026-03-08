"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Link as LinkIcon, 
  Zap, 
  Loader2, 
  AlertCircle,
  X,
  Sparkles
} from "lucide-react"
import { scrapeJobUrl, parseJobHtml, ScrapedJob } from "@/app/admin/jobs/actions"

interface JobScraperModalProps {
  isOpen: boolean
  onClose: () => void
  onScrapeSuccess: (job: ScrapedJob) => void
}

export function JobScraperModal({ isOpen, onClose, onScrapeSuccess }: JobScraperModalProps) {
  const [url, setUrl] = useState("")
  const [htmlInput, setHtmlInput] = useState("")
  const [showHtmlInput, setShowHtmlInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset modal state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setUrl("")
      setHtmlInput("")
      setShowHtmlInput(false)
      setError(null)
      setLoading(false)
    }
  }, [isOpen])

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    setError(null)

    try {
      const result = await scrapeJobUrl(url)
      if ("error" in result) {
        setError(result.error)
        setShowHtmlInput(true)
      } else {
        onScrapeSuccess(result)
        onClose()
      }
    } catch (err) {
      setError("An unexpected error occurred while scraping.")
      setShowHtmlInput(true)
    } finally {
      setLoading(false)
    }
  }

  const handleHtmlParse = async () => {
    if (!htmlInput) return
    setLoading(true)
    try {
      const result = await parseJobHtml(htmlInput, url)
      onScrapeSuccess(result)
      onClose()
    } catch (err) {
      setError("Failed to parse HTML.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center px-4 sm:px-0">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/90 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-2xl bg-card border border-border-custom shadow-2xl rounded-[40px] overflow-hidden"
          >
            {/* Design accents */}
            <div className="absolute top-0 right-0 p-12 -mr-12 -mt-12 bg-brand-action/10 blur-[80px] rounded-full" />
            
            <div className="relative p-8 sm:p-12">
               <div className="flex items-center justify-between mb-8 sm:mb-10">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-brand-action/10 rounded-[24px] flex items-center justify-center text-brand-action shadow-inner">
                       <Zap size={32} className="fill-brand-action/20" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black tracking-tight text-foreground">AI Job Scraper</h2>
                      <p className="text-[10px] uppercase font-black tracking-[0.2em] text-brand-action mt-1.5 flex items-center gap-2">
                        <Sparkles size={12} />
                        Automated Data Extraction
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose} 
                    className="w-12 h-12 flex items-center justify-center hover:bg-secondary rounded-2xl transition-all text-muted-foreground hover:text-foreground group active:scale-95 border border-transparent hover:border-border-custom"
                  >
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                  </button>
               </div>

               <form onSubmit={handleScrape} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 ml-4 flex items-center gap-2">
                      <LinkIcon size={12} className="text-brand-action" />
                      Job Listing URL
                    </label>
                    <div className="relative group">
                      <input 
                        required
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://linkedin.com/jobs/view/..."
                        className="w-full bg-secondary/30 border border-border-custom rounded-[28px] px-8 py-7 outline-none focus:border-brand-action/50 transition-all font-bold text-lg placeholder:text-muted-foreground/10 shadow-2xl focus:bg-secondary/50 text-foreground"
                        disabled={loading}
                      />
                      <button 
                        type="submit"
                        disabled={loading || !url}
                        className="absolute right-3 top-3 bottom-3 px-10 bg-brand-action hover:bg-brand-action/90 text-white rounded-[22px] font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center gap-3 shadow-xl shadow-brand-action/20"
                      >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                        Start Scraping
                      </button>
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground/30 ml-6 tracking-wide">
                      Supports LinkedIn, Indeed, Glassdoor, and most modern job boards.
                    </p>
                  </div>

                  <AnimatePresence>
                    {showHtmlInput && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-8 border-t border-border-custom space-y-6">
                          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-4 mb-4">
                            <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                            <div>
                              <p className="text-[11px] font-black text-foreground uppercase tracking-wider">Direct Access Restricted</p>
                              <p className="text-[10px] font-bold text-red-400/80 leading-relaxed mt-1">
                                The source website is protecting its content. Use the fallback method below to continue.
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-4 flex items-center gap-2">
                              <Zap size={12} className="text-brand-action" />
                              Page Source Fallback
                            </label>
                            <textarea 
                              value={htmlInput}
                              onChange={(e) => setHtmlInput(e.target.value)}
                              placeholder="1. Open job URL in browser&#10;2. Right-click -> View Page Source&#10;3. Select All (Ctrl+A) -> Copy (Ctrl+C)&#10;4. Paste here (Ctrl+V)"
                              className="w-full bg-secondary/30 border border-border-custom rounded-[28px] p-6 outline-none focus:border-brand-action/50 transition-all font-mono text-[11px] text-muted-foreground/50 h-52 resize-none scrollbar-hide focus:bg-secondary/50"
                            />
                            <button 
                              onClick={handleHtmlParse}
                              type="button"
                              disabled={loading || !htmlInput}
                              className="w-full py-6 bg-secondary/50 hover:bg-secondary text-foreground rounded-[24px] font-black text-[11px] uppercase tracking-widest border border-border-custom transition-all active:scale-[0.99] flex items-center justify-center gap-3"
                            >
                              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={16} />}
                              Process Source Code
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && !showHtmlInput && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400"
                    >
                      <AlertCircle size={18} />
                      <span className="text-xs font-bold leading-none">{error}</span>
                    </motion.div>
                  )}
               </form>

               {/* Hint Section */}
               <div className="mt-12 flex items-center justify-center gap-6 opacity-30">
                  <div className="h-px flex-1 bg-border-custom" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground">Secure Extraction</span>
                  <div className="h-px flex-1 bg-border-custom" />
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
