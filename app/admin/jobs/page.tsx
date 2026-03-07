"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Link as LinkIcon, 
  Zap, 
  Loader2, 
  Building2, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  FileEdit,
  Globe,
  Plus
} from "lucide-react"
import { scrapeJobUrl, ScrapedJob, parseJobHtml } from "./actions"

export default function AdminJobsPage() {
  const [url, setUrl] = useState("")
  const [htmlInput, setHtmlInput] = useState("")
  const [showHtmlInput, setShowHtmlInput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [jobData, setJobData] = useState<ScrapedJob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    setError(null)
    setJobData(null)
    setIsSuccess(false)

    try {
      const result = await scrapeJobUrl(url)
      if ("error" in result) {
        setError(result.error)
        setShowHtmlInput(true)
      } else {
        setJobData(result)
        setShowHtmlInput(false)
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
    const result = await parseJobHtml(htmlInput, url)
    setJobData(result)
    setShowHtmlInput(false)
    setError(null)
  }

  const handleUpdateField = (field: keyof ScrapedJob, value: string) => {
    if (jobData) {
      setJobData({ ...jobData, [field]: value })
    }
  }

  const handlePostJob = () => {
    setLoading(true)
    // Simulate backend work
    setTimeout(() => {
      setLoading(false)
      setIsSuccess(true)
      // Reset form after a few seconds
      setTimeout(() => {
        setIsSuccess(false)
        setJobData(null)
        setUrl("")
      }, 3000)
    }, 1500)
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="space-y-4">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Briefcase className="text-brand-action" size={32} />
          Job CMS <span className="text-brand-action">Forge</span>
        </h1>
        <p className="text-brand-text-muted max-w-2xl font-bold uppercase tracking-wider text-[10px]">
          Seamlessly post new opportunities to the platform by scraping existing job listings or manual entry.
        </p>
      </header>

      {/* URL Scraper Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-brand-action/5 blur-[100px] -z-10 rounded-full" />
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-3xl shadow-2xl">
          <form onSubmit={handleScrape} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 mb-1 flex items-center gap-2">
                <LinkIcon size={12} />
                Job Listing URL
              </label>
              <div className="relative group">
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://linkedin.com/jobs/view/..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-brand-action transition-all font-bold text-lg placeholder:text-white/10"
                  required
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 px-8 bg-brand-action hover:bg-brand-action/90 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                  Scrape Details
                </button>
              </div>
            </div>
            {showHtmlInput && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="pt-6 border-t border-white/5 space-y-4"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 mb-1 flex items-center gap-2">
                    <Zap size={12} />
                    Scraper blocked? Paste Page HTML here
                  </label>
                  <textarea 
                    value={htmlInput}
                    onChange={(e) => setHtmlInput(e.target.value)}
                    placeholder="Right click job page -> View Source -> Copy and Paste here..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-brand-action transition-all font-mono text-[10px] text-white/40 h-32 resize-none"
                  />
                  <button 
                    onClick={handleHtmlParse}
                    type="button"
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all"
                  >
                    Parse Direct HTML
                  </button>
                </div>
              </motion.div>
            )}
            {error && !showHtmlInput && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-xs font-bold pl-4"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}
          </form>
        </div>
      </section>

      <AnimatePresence>
        {jobData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid lg:grid-cols-2 gap-10"
          >
            {/* Edit Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <FileEdit size={20} className="text-brand-action" />
                <h2 className="text-xl font-black tracking-tight">Refine Information</h2>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-6 backdrop-blur-xl">
                <div className="grid sm:grid-cols-2 gap-6">
                  <InputField 
                    label="Job Title" 
                    icon={<Briefcase size={14} />} 
                    value={jobData.title} 
                    onChange={(v) => handleUpdateField("title", v)} 
                  />
                  <InputField 
                    label="Company Name" 
                    icon={<Building2 size={14} />} 
                    value={jobData.company} 
                    onChange={(v) => handleUpdateField("company", v)} 
                  />
                  <InputField 
                    label="Location" 
                    icon={<MapPin size={14} />} 
                    value={jobData.location} 
                    onChange={(v) => handleUpdateField("location", v)} 
                  />
                  <InputField 
                    label="Salary Range" 
                    icon={<DollarSign size={14} />} 
                    value={jobData.salary} 
                    onChange={(v) => handleUpdateField("salary", v)} 
                  />
                  <InputField 
                    label="Logo / Image URL" 
                    icon={<Globe size={14} />} 
                    value={jobData.image} 
                    onChange={(v) => handleUpdateField("image", v)} 
                  />
                  <InputField 
                    label="Work Type" 
                    icon={<Briefcase size={14} />} 
                    value={jobData.type} 
                    onChange={(v) => handleUpdateField("type", v)} 
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2 mb-1 flex items-center gap-2">
                    Job Description
                  </label>
                  <textarea 
                    value={jobData.description}
                    onChange={(e) => handleUpdateField("description", e.target.value)}
                    rows={6}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-brand-action transition-all font-bold text-sm text-white/60 resize-none scrollbar-hide"
                  />
                </div>

                <div className="pt-4">
                   <button 
                    onClick={handlePostJob}
                    disabled={loading}
                    className="w-full py-5 bg-brand-action hover:bg-brand-action/90 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-brand-action/20"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                    {isSuccess ? "Job Posted Successfully!" : "Add to Platform"}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <Eye size={20} className="text-brand-action" />
                <h2 className="text-xl font-black tracking-tight">Live Preview</h2>
              </div>

              <div className="sticky top-32">
                <div className="bg-white/5 border border-white/10 border-dashed rounded-[40px] p-10 flex items-center justify-center">
                  <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-4 relative overflow-hidden group">
                     {/* Preview Card Mock (Similarity to real job card) */}
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/5">
                          {jobData.image ? (
                            <img src={jobData.image} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <Building2 className="text-white/20" size={24} />
                          )}
                        </div>
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 bg-brand-action/10 text-brand-action text-[8px] font-black uppercase tracking-widest rounded">
                            {jobData.type}
                          </span>
                          <h3 className="text-lg font-black truncate">{jobData.title || "Job Title"}</h3>
                          <div className="text-[10px] font-bold text-white/40 flex items-center gap-3">
                             <span className="flex items-center gap-1"><Building2 size={10} /> {jobData.company || "Company"}</span>
                             <span className="flex items-center gap-1"><MapPin size={10} /> {jobData.location || "Remote"}</span>
                          </div>
                        </div>
                     </div>
                     <p className="text-[11px] text-white/40 font-bold line-clamp-3 leading-relaxed">
                        {jobData.description || "No description provided."}
                     </p>
                     <div className="pt-4 flex items-center justify-between border-t border-white/5">
                        <div className="text-emerald-400 text-[10px] font-black flex items-center gap-1">
                           <DollarSign size={10} />
                           {jobData.salary || "Competitive"}
                        </div>
                        <div className="flex gap-2">
                           <div className="w-8 h-8 rounded-lg bg-white/10" />
                           <div className="w-8 h-8 rounded-lg bg-brand-action" />
                        </div>
                     </div>
                     <div className="absolute -right-4 -bottom-4 text-brand-action/5 -rotate-12">
                        <Zap size={100} />
                     </div>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-brand-action/10 border border-brand-action/20 rounded-2xl flex items-start gap-4">
                   <CheckCircle2 className="text-brand-action shrink-0" size={20} />
                   <div>
                     <p className="text-xs font-black uppercase tracking-wider text-white">Algorithm Ready</p>
                     <p className="text-[10px] font-bold text-white/60 leading-relaxed mt-1">
                        Our AI system has successfully extracted the structure. You can now finalize and publish.
                     </p>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!jobData && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 border border-white/10 border-dashed rounded-[40px] py-24 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <LinkIcon size={32} className="text-white/20" />
          </div>
          <div className="space-y-2">
            <p className="text-brand-text-muted font-bold text-sm">Paste a URL above to automatically populate the job details.</p>
            <p className="text-white/20 font-bold text-[10px] uppercase tracking-widest">OR</p>
          </div>
          <button 
            onClick={() => setJobData({
              title: "",
              company: "",
              description: "",
              image: "",
              url: "",
              location: "Remote",
              salary: "",
              type: "Full-time"
            })}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 transition-all active:scale-95"
          >
            Start Manual Entry
          </button>
        </motion.div>
      )}
    </div>
  )
}

function InputField({ label, icon, value, onChange }: { label: string, icon: React.ReactNode, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-2 mb-1 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-action transition-all font-bold text-sm placeholder:text-white/10 text-white/80"
      />
    </div>
  )
}
