"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Zap, 
  Loader2, 
  Building2, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  CheckCircle2, 
  Eye,
  FileEdit,
  Globe,
  Plus,
  Sparkles,
  RefreshCcw,
  Link as LinkIcon,
  ArrowRight,
  ChevronDown,
  X,
  Wand2,
  PenLine,
  Calendar,
  ClipboardPaste,
  Sparkle
} from "lucide-react"
import { formatJobDescription } from "@/lib/formatJobDescription"
import { ScrapedJob, refineJobDescription } from "./actions"
import { createJobPosting } from "./job-actions"
import { useRef } from "react"
import { JobScraperModal } from "@/components/admin/JobScraperModal"
import { RichTextEditor } from "@/components/admin/RichTextEditor"
import countriesData from "@/lib/countries-data.json"
import { Search } from "lucide-react"

const WORK_TYPES = {
  "Full-time": "Full-time",
  "Part-time": "Part-time",
  "Contract": "Contract",
  "Freelance": "Freelance",
  "Internship": "Internship",
  "Temporary": "Temporary"
}

export default function AdminJobsPage() {
  const [loading, setLoading] = useState(false)
  const [jobData, setJobData] = useState<ScrapedJob | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isScraperOpen, setIsScraperOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const [stateSearch, setStateSearch] = useState("")
  const [isRefining, setIsRefining] = useState(false)
  const [showFormatter, setShowFormatter] = useState(false)
  const [rawText, setRawText] = useState("")
  const [currencies, setCurrencies] = useState<Record<string, string>>({"usd": "United States Dollar"})
  
  const countryDropdownRef = useRef<HTMLDivElement>(null)
  const stateDropdownRef = useRef<HTMLDivElement>(null)
  const activeItemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json")
      .then(res => res.json())
      .then(data => setCurrencies(data))
      .catch(err => console.error("Failed to fetch currencies", err))

    const handleClickOutside = (event: MouseEvent) => {
        if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
          setIsCountryDropdownOpen(false)
        }
        if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
          setIsStateDropdownOpen(false)
        }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Scroll active item into view
  useEffect(() => {
    if ((isCountryDropdownOpen || isStateDropdownOpen) && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [isCountryDropdownOpen, isStateDropdownOpen])

  const handleUpdateField = (field: keyof ScrapedJob, value: any) => {
    setJobData(prev => prev ? { ...prev, [field]: value } : null)
  }

  const [isPosting, setIsPosting] = useState(false)
  const [postError, setPostError] = useState<string | null>(null)

  const handlePostJob = async () => {
    if (!jobData) return
    setLoading(true)
    setPostError(null)
    const result = await createJobPosting({
      title: jobData.title,
      company: jobData.company,
      country: jobData.country,
      state: jobData.state,
      type: jobData.type,
      salary: jobData.salary,
      currency: jobData.currency,
      description: jobData.description,
      image: jobData.image,
      applyUrl: jobData.applyUrl,
      contractDuration: (jobData as any).contractDuration,
    })
    setLoading(false)
    if (result.success) {
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        setJobData(null)
      }, 3000)
    } else {
      setPostError(result.error || "Failed to post job. Please try again.")
    }
  }

  const handleRefineDescription = async () => {
    if (!jobData) return
    setIsRefining(true)
    const result = await refineJobDescription(
      jobData.description,
      jobData.title,
      jobData.company
    )
    setIsRefining(false)
    if ("refined" in result) {
      setJobData({ ...jobData, description: result.refined })
    }
  }

  const startManualEntry = () => {
    setJobData({
      title: "",
      company: "",
      description: "",
      image: "",
      url: "",
      country: "Remote",
      state: "",
      salary: "",
      currency: "usd",
      type: "Full-time",
      applyUrl: "",
    })
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-foreground">
            <div className="w-12 h-12 bg-brand-action/10 rounded-2xl flex items-center justify-center text-brand-action">
              <Briefcase size={28} />
            </div>
            Job CMS <span className="text-brand-action tracking-[-0.05em]">Forge</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl font-bold uppercase tracking-[0.2em] text-[10px] opacity-60">
            Publish premium opportunities using AI-driven extraction or manually crafted listings.
          </p>
        </div>

        {jobData && !isSuccess && (
          <div className="flex items-center gap-3">
             {showPreview ? (
               <button 
                 onClick={() => setShowPreview(false)}
                 className="px-6 py-3.5 bg-brand-action/10 hover:bg-brand-action/20 text-brand-action rounded-[20px] font-black text-[10px] uppercase tracking-widest border border-brand-action/30 transition-all flex items-center gap-2 active:scale-95"
               >
                 <PenLine size={14} />
                 Back to Edit
               </button>
             ) : (
               <>
                 <button 
                   onClick={() => setIsScraperOpen(true)}
                   className="px-6 py-3.5 bg-secondary/50 hover:bg-secondary text-foreground rounded-[20px] font-black text-[10px] uppercase tracking-widest border border-border-custom transition-all flex items-center gap-2 active:scale-95"
                 >
                   <RefreshCcw size={14} className="text-brand-action" />
                   Scrape New
                 </button>
                 <button 
                   onClick={() => setShowPreview(true)}
                   className="px-6 py-3.5 bg-secondary/50 hover:bg-secondary text-foreground rounded-[20px] font-black text-[10px] uppercase tracking-widest border border-border-custom transition-all flex items-center gap-2 active:scale-95"
                 >
                   <Eye size={14} className="text-brand-action" />
                   Preview
                 </button>
                 <button 
                   onClick={() => setJobData(null)}
                   className="px-6 py-3.5 bg-secondary/50 hover:bg-secondary text-foreground rounded-[20px] font-black text-[10px] uppercase tracking-widest border border-border-custom transition-all flex items-center gap-2 active:scale-95"
                 >
                   Reset
                 </button>
               </>
             )}
          </div>
        )}
      </header>

      <JobScraperModal 
        isOpen={isScraperOpen}
        onClose={() => setIsScraperOpen(false)}
        onScrapeSuccess={(data) => {
          setJobData(data)
          setIsScraperOpen(false)
        }}
      />


      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-card border border-border-custom rounded-[48px] p-20 text-center space-y-8 shadow-2xl relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--brand-success),0.05),transparent_70%)]" />
             <div className="w-24 h-24 bg-brand-success/10 rounded-[32px] flex items-center justify-center text-brand-success mx-auto relative z-10">
                <CheckCircle2 size={48} />
             </div>
             <div className="space-y-3 relative z-10">
                <h2 className="text-4xl font-black tracking-tight text-foreground">Job Successfully Posted</h2>
                <p className="text-muted-foreground font-bold max-w-md mx-auto leading-relaxed">
                  The listing has been indexed and is now live for all candidates on the platform.
                </p>
             </div>
             <div className="pt-4 flex justify-center gap-4 relative z-10">
                <button 
                  onClick={() => setJobData(null)}
                  className="px-8 py-4 bg-brand-action text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-action/20 hover:scale-105 transition-all active:scale-95"
                >
                  Post Another
                </button>
                <button 
                  onClick={() => window.location.href = "/jobs"}
                  className="px-8 py-4 bg-secondary text-foreground rounded-2xl font-black text-xs uppercase tracking-widest border border-border-custom hover:bg-secondary/80 transition-all"
                >
                  View Live Site
                </button>
             </div>
          </motion.div>
        ) : jobData ? (
          <AnimatePresence mode="wait">
            {showPreview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-8"
              >
                {/* Preview label */}
                <div className="flex items-center gap-3">
                  <Eye size={20} className="text-brand-action" />
                  <h2 className="text-xl font-black tracking-tight text-foreground">Listing Preview</h2>
                  <span className="px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-brand-action/10 text-brand-action rounded-lg border border-brand-action/20">Draft</span>
                </div>

                {/* Hero card */}
                <div className="bg-card border border-border-custom rounded-[40px] p-10 md:p-14 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-action/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
                    {/* Logo */}
                    <div className="w-24 h-24 rounded-[24px] bg-secondary/50 flex items-center justify-center overflow-hidden border border-border-custom shadow-inner shrink-0">
                      {jobData.image ? (
                        <img src={jobData.image} alt={jobData.company} className="w-full h-full object-contain" />
                      ) : (
                        <Building2 className="text-muted-foreground/20" size={40} />
                      )}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-brand-action/10 text-brand-action text-[9px] font-black uppercase tracking-widest rounded-lg">{jobData.type}</span>
                        <span className="px-3 py-1 bg-secondary/50 text-muted-foreground text-[9px] font-black uppercase tracking-widest rounded-lg border border-border-custom">Draft</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-foreground leading-tight">{jobData.title || "Untitled Position"}</h3>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-bold text-muted-foreground">
                        <span className="flex items-center gap-2"><Building2 size={14} className="text-brand-action/50" />{jobData.company || "Company"}</span>
                        <span className="flex items-center gap-2"><MapPin size={14} className="text-brand-action/50" />
                          {[jobData.state, jobData.country].filter(Boolean).join(", ") || "Remote"}
                        </span>
                        {jobData.salary && (
                          <span className="flex items-center gap-2 text-brand-action">
                            <DollarSign size={14} className="opacity-70" />
                            <span className="uppercase text-[10px] opacity-70 mr-0.5">{jobData.currency}</span>
                            {jobData.salary}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Salary footer */}
                  <div className="relative z-10 mt-8 pt-6 border-t border-border-custom flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Salary Package</span>
                      <div className="text-brand-action font-black flex items-center gap-1">
                        <span className="opacity-60 uppercase text-[10px] mr-1">{jobData.currency}</span>
                        {jobData.salary || "Competitive"}
                      </div>
                    </div>
                    <button disabled className="flex items-center gap-2 px-8 py-4 bg-brand-action/40 text-white/60 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed">
                      Apply Now
                    </button>
                  </div>
                  <div className="absolute -right-8 -bottom-8 text-brand-action/5 -rotate-12 pointer-events-none"><Zap size={180} /></div>
                </div>

                {/* Description card */}
                {jobData.description && (
                  <div className="bg-card border border-border-custom rounded-[40px] p-10 md:p-14 shadow-xl">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-8 h-8 bg-brand-action/10 rounded-xl flex items-center justify-center"><Briefcase size={14} className="text-brand-action" /></div>
                      <h3 className="text-sm font-black uppercase tracking-[0.15em] text-foreground">Job Description</h3>
                    </div>
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none [&_h2]:text-foreground [&_h2]:font-black [&_h3]:text-foreground [&_h3]:font-bold [&_h4]:text-foreground [&_strong]:text-foreground [&_p]:text-foreground [&_li]:text-foreground [&_li]:mb-1 [&_ul]:text-foreground [&_ol]:text-foreground [&_a]:text-brand-action"
                      dangerouslySetInnerHTML={{ __html: jobData.description }}
                    />
                  </div>
                )}

                {/* Back + Post row */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="flex-1 py-5 bg-secondary/50 hover:bg-secondary text-foreground rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 border border-border-custom"
                  >
                    <PenLine size={16} className="text-brand-action" />
                    Back to Edit
                  </button>
                  <button
                    onClick={handlePostJob}
                    disabled={loading}
                    className="flex-2 py-5 bg-brand-action hover:bg-brand-action/90 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-brand-action/20 disabled:opacity-60"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                    Post to Platform
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-8"
              >
                {/* Section Label */}
                <div className="flex items-center gap-3">
                  <FileEdit size={20} className="text-brand-action" />
                  <h2 className="text-xl font-black tracking-tight text-foreground">Refine Information</h2>
                </div>

            <div className="bg-card border border-border-custom rounded-[40px] p-8 md:p-10 space-y-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-action/60 via-brand-action/20 to-transparent" />

              {/* Responsive field grid:
                  Mobile:  2-2-2-1-1 (pairs, then each full-width)
                  Tablet:  2-2-2-2   (all pairs)
                  Desktop: 3-3-2     (3 / 3 / 2) */}
              <div className="grid grid-cols-12 gap-6">
                {/* --- Row 1: Title, Company, Country --- */}
                <div className="col-span-12 lg:col-span-4">
                  <InputField label="Job Title" icon={<Briefcase size={14} />} value={jobData.title} onChange={(v) => handleUpdateField("title", v)} />
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <InputField label="Company Name" icon={<Building2 size={14} />} value={jobData.company} onChange={(v) => handleUpdateField("company", v)} />
                </div>
                <div className="col-span-12 lg:col-span-4">
                   <SearchableSelect
                      label="Country"
                      icon={<Globe size={14} />}
                      value={jobData.country}
                      isOpen={isCountryDropdownOpen}
                      onToggle={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      onClose={() => setIsCountryDropdownOpen(false)}
                      search={countrySearch}
                      onSearchChange={setCountrySearch}
                      options={["Remote", "Worldwide", ...countriesData.map(c => c.name)]}
                      onChange={(v) => {
                        handleUpdateField("country", v)
                        handleUpdateField("state", "") // Reset state when country changes
                      }}
                      placeholder="Search country..."
                      dropdownRef={countryDropdownRef}
                      activeRef={activeItemRef}
                   />
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <SearchableSelect
                      label="State / Province"
                      icon={<MapPin size={14} />}
                      value={jobData.state || ""}
                      isOpen={isStateDropdownOpen}
                      onToggle={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                      onClose={() => setIsStateDropdownOpen(false)}
                      search={stateSearch}
                      onSearchChange={setStateSearch}
                      options={countriesData.find(c => c.name === jobData.country)?.states.map(s => s.name) || []}
                      onChange={(v) => handleUpdateField("state", v)}
                      placeholder={jobData.country ? "Search state..." : "Select country first"}
                      disabled={!jobData.country || !countriesData.find(c => c.name === jobData.country)?.states.length}
                      dropdownRef={stateDropdownRef}
                      activeRef={activeItemRef}
                   />
                </div>
                {/* --- Row 2: Work Type / Salary / Currency --- */}
                <div className="col-span-6 lg:col-span-4">
                  <SelectField label="Work Type" icon={<Briefcase size={14} />} value={jobData.type} options={WORK_TYPES} onChange={(v) => handleUpdateField("type", v)} />
                </div>
                <div className="col-span-6 lg:col-span-4">
                  <InputField label="Salary Amount" icon={<DollarSign size={14} />} value={jobData.salary} onChange={(v) => handleUpdateField("salary", v)} />
                </div>
                <div className="col-span-6 lg:col-span-4">
                  <SelectField label="Currency" icon={<Globe size={14} />} value={jobData.currency} options={currencies} onChange={(v) => handleUpdateField("currency", v)} />
                </div>
                {/* --- Row 3: Banner URL / Apply URL --- */}
                <div className="col-span-6">
                  <InputField label="Banner / Logo URL" icon={<LinkIcon size={14} />} value={jobData.image} onChange={(v) => handleUpdateField("image", v)} />
                </div>
                <div className="col-span-6">
                  <InputField label="Apply URL" icon={<ArrowRight size={14} />} value={jobData.applyUrl || ""} onChange={(v) => handleUpdateField("applyUrl" as any, v)} />
                </div>
              </div>

              {/* Conditional duration row for Contract / Part-time / Temporary */}
              {["Contract", "Part-time", "Temporary"].includes(jobData.type) && (
                <div className="flex flex-col gap-2">
                  <label className="ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Calendar size={12} className="text-brand-action/60" />
                    Duration Range
                    <span className="ml-1 text-brand-action/50 normal-case tracking-normal font-bold text-[9px]">(optional)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <SelectField
                      label="From"
                      icon={<ArrowRight size={14} />}
                      value={(jobData as any).durationFrom || ""}
                      options={{
                        "": "Select start",
                        "1 week": "1 week",
                        "2 weeks": "2 weeks",
                        "1 month": "1 month",
                        "2 months": "2 months",
                        "3 months": "3 months",
                        "4 months": "4 months",
                        "6 months": "6 months",
                        "9 months": "9 months",
                        "12 months": "12 months",
                        "18 months": "18 months",
                        "2 years": "2 years",
                      }}
                      onChange={(v) => {
                        const to = (jobData as any).durationTo || ""
                        const combined = v && to ? `${v} – ${to}` : v || to || ""
                        setJobData({ ...jobData, contractDuration: combined, durationFrom: v, durationTo: to } as any)
                      }}
                    />
                    <SelectField
                      label="To"
                      icon={<ArrowRight size={14} />}
                      value={(jobData as any).durationTo || ""}
                      options={{
                        "": "Select end",
                        "1 week": "1 week",
                        "2 weeks": "2 weeks",
                        "1 month": "1 month",
                        "2 months": "2 months",
                        "3 months": "3 months",
                        "4 months": "4 months",
                        "6 months": "6 months",
                        "9 months": "9 months",
                        "12 months": "12 months",
                        "18 months": "18 months",
                        "2 years": "2 years",
                      }}
                      onChange={(v) => {
                        const from = (jobData as any).durationFrom || ""
                        const combined = from && v ? `${from} – ${v}` : from || v || ""
                        setJobData({ ...jobData, contractDuration: combined, durationFrom: from, durationTo: v } as any)
                      }}
                    />
                  </div>
                  {(jobData as any).contractDuration && (
                    <p className="ml-4 text-[10px] font-black text-brand-action/70">
                      Duration: {(jobData as any).contractDuration}
                    </p>
                  )}
                </div>
              )}

              {/* Description — always full width */}
              <div className="flex flex-col gap-2">
                {/* Toolbar row */}
                <div className="ml-4 mb-2 flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    Job Description (Rich Text)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setShowFormatter(!showFormatter); setRawText("") }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-[14px] font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 border ${
                        showFormatter
                          ? "bg-foreground/10 border-foreground/20 text-foreground"
                          : "bg-secondary/50 border-border-custom text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <ClipboardPaste size={12} />
                      {showFormatter ? "Cancel" : "Format Raw Text"}
                    </button>
                    <button
                      type="button"
                      onClick={handleRefineDescription}
                      disabled={isRefining}
                      className="flex items-center gap-2 px-4 py-2 rounded-[14px] bg-brand-action/10 hover:bg-brand-action/20 border border-brand-action/20 text-brand-action font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRefining ? (
                        <><Loader2 size={12} className="animate-spin" />Refining...</>
                      ) : (
                        <><Wand2 size={12} />Refine with AI</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Paste-and-format panel */}
                <AnimatePresence>
                  {showFormatter && (
                    <motion.div
                      key="formatter"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-secondary/20 border border-border-custom rounded-2xl p-5 mb-4 space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-foreground/5 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                            <ClipboardPaste size={14} className="text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-foreground">Paste Raw Text</p>
                            <p className="text-[10px] font-bold text-muted-foreground/60 mt-0.5 leading-relaxed">
                              Paste any plain text — headers, bullets, paragraphs. The formatter detects structure and converts to clean HTML instantly.
                            </p>
                          </div>
                        </div>
                        <textarea
                          value={rawText}
                          onChange={(e) => setRawText(e.target.value)}
                          placeholder={`Paste plain text here…\n\nResponsibilities\n- Build scalable APIs\n- Lead code reviews\n\nRequirements\n• 3+ years of experience in Node.js\n• Strong communication skills`}
                          rows={10}
                          className="w-full px-4 py-3 bg-card border border-border-custom rounded-xl text-sm font-mono text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-brand-action/30 resize-y leading-relaxed"
                        />
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-[9px] font-bold text-muted-foreground/40 leading-relaxed">
                            Detects: section headers · bullet lists · bold salary &amp; experience · cleans whitespace
                          </p>
                          <button
                            type="button"
                            disabled={!rawText.trim()}
                            onClick={() => {
                              const html = formatJobDescription(rawText)
                              handleUpdateField("description", html)
                              setShowFormatter(false)
                              setRawText("")
                            }}
                            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Sparkle size={12} />
                            Format &amp; Apply
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isRefining && (
                  <div className="w-full h-2 bg-secondary/30 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-linear-to-r from-brand-action/40 via-brand-action to-brand-action/40 rounded-full animate-pulse" style={{ width: "100%" }} />
                  </div>
                )}
                <RichTextEditor
                  value={jobData.description}
                  onChange={(v) => handleUpdateField("description", v)}
                  placeholder="Enter detailed job description, benefits, and requirements..."
                />
              </div>

              {/* Error */}
              {postError && (
                <div className="px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold">
                  {postError}
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowPreview(true)}
                  className="flex-1 py-5 bg-secondary/50 hover:bg-secondary text-foreground rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 border border-border-custom"
                >
                  <Eye size={16} className="text-brand-action" />
                  Preview Listing
                </button>
                <button 
                  onClick={handlePostJob}
                  disabled={loading}
                  className="flex-2 py-5 bg-brand-action hover:bg-brand-action/90 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-2xl shadow-brand-action/20 disabled:opacity-60"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  Post to Platform
                </button>
              </div>
              </div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Scrape Action Card */}
            <button 
              onClick={() => setIsScraperOpen(true)}
              className="group relative h-[400px] bg-linear-to-br from-brand-action/10 via-card to-card border border-border-custom rounded-[48px] p-12 text-left overflow-hidden transition-all hover:border-brand-action/40 hover:-translate-y-1 active:scale-[0.99] shadow-2xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--brand-action),0.1),transparent_50%)]" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-20 h-20 bg-brand-action rounded-[28px] flex items-center justify-center text-white shadow-2xl shadow-brand-action/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Zap size={40} className="fill-white/20" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-brand-action font-black text-[10px] uppercase tracking-[0.4em]">Fastest Route</p>
                    <h3 className="text-3xl font-black tracking-tight text-foreground leading-tight">AI Scraping <br/> <span className="opacity-40">Auto-Extraction</span></h3>
                  </div>
                  <p className="text-muted-foreground font-bold text-sm max-w-xs leading-relaxed opacity-60">
                    Paste any job URL and let our advanced algorithm extract all details in seconds.
                  </p>
                  <div className="pt-4 flex items-center gap-3 text-brand-action font-black text-[10px] uppercase tracking-widest group-hover:gap-5 transition-all">
                    <span>Initiate Scan</span>
                    <Plus size={16} />
                  </div>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity text-foreground">
                <LinkIcon size={300} />
              </div>
            </button>

            {/* Manual Entry Action Card */}
            <button 
              onClick={startManualEntry}
              className="group relative h-[400px] bg-card border border-border-custom border-dashed rounded-[48px] p-12 text-left overflow-hidden transition-all hover:border-brand-action/20 hover:-translate-y-1 active:scale-[0.99]"
            >
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-20 h-20 bg-secondary/50 rounded-[28px] flex items-center justify-center text-muted-foreground group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                  <FileEdit size={32} />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-muted-foreground font-black text-[10px] uppercase tracking-[0.4em]">Blank Slate</p>
                    <h3 className="text-3xl font-black tracking-tight text-foreground leading-tight">Manual <br/> <span className="opacity-40">Entry Mode</span></h3>
                  </div>
                  <p className="text-muted-foreground font-bold text-sm max-w-xs leading-relaxed opacity-60">
                    Craft your listing from scratch with full control over every detail.
                  </p>
                  <div className="pt-4 flex items-center gap-3 text-brand-action/60 font-black text-[10px] uppercase tracking-widest group-hover:gap-5 transition-all">
                    <span>Build Manually</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-[0.03] text-foreground">
                <Briefcase size={300} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function InputField({ label, icon, value, onChange, placeholder }: { label: string, icon: React.ReactNode, value: string, onChange: (v: string) => void, placeholder?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-4 mb-2 flex items-center gap-2">
        <span className="text-brand-action opacity-60">{icon}</span>
        {label}
      </label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-secondary/30 border border-border-custom rounded-[20px] px-6 py-4 outline-none focus:border-brand-action/50 transition-all font-bold text-sm placeholder:text-muted-foreground/30 text-foreground focus:bg-secondary/50 shadow-inner"
      />
    </div>
  )
}

function SelectField({ label, icon, value, options, onChange }: { label: string, icon: React.ReactNode, value: string, options: Record<string, string>, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-4 mb-2 flex items-center gap-2">
        <span className="text-brand-action opacity-60">{icon}</span>
        {label}
      </label>
      <div className="relative group">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white dark:bg-[#0F172A] border border-border-custom rounded-[20px] px-6 py-4 outline-none focus:border-brand-action/50 transition-all font-bold text-sm text-gray-900 dark:text-white focus:bg-secondary/50 shadow-inner appearance-none cursor-pointer pr-12"
        >
          {Object.entries(options).map(([code, name]) => (
            <option key={code} value={code} className="bg-white dark:bg-[#0F172A] text-gray-900 dark:text-white">
              {code.length <= 4 && code.toUpperCase() !== name.substring(0, code.length).toUpperCase() ? `${code.toUpperCase()} - ${name}` : name}
            </option>
          ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/40 group-focus-within:text-brand-action transition-colors">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  )
}

function SearchableSelect({ 
  label, 
  icon, 
  value, 
  options, 
  onChange, 
  isOpen, 
  onToggle, 
  onClose,
  search, 
  onSearchChange,
  placeholder = "Search...",
  disabled = false,
  dropdownRef,
  activeRef
}: { 
  label: string, 
  icon: React.ReactNode, 
  value: string, 
  options: string[], 
  onChange: (v: string) => void,
  isOpen: boolean,
  onToggle: () => void,
  onClose: () => void,
  search: string,
  onSearchChange: (v: string) => void,
  placeholder?: string,
  disabled?: boolean,
  dropdownRef: React.RefObject<HTMLDivElement | null>,
  activeRef: React.RefObject<HTMLDivElement | null>
}) {
  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 ml-4 mb-2 flex items-center gap-2">
        <span className="text-brand-action opacity-60">{icon}</span>
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className={`w-full bg-white dark:bg-[#0F172A] border border-border-custom rounded-[20px] px-6 py-4 outline-none transition-all font-bold text-sm flex items-center justify-between text-left ${disabled ? 'opacity-50 cursor-not-allowed' : 'focus:border-brand-action/50 hover:bg-secondary/30'}`}
      >
        <span className={value ? "text-gray-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}>
          {value || "Select..."}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-slate-500 dark:text-slate-400`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-[#0F172A] border border-border-custom rounded-[20px] shadow-2xl z-[100] overflow-hidden"
          >
            <div className="p-4 border-b border-border-custom flex items-center gap-3 bg-white dark:bg-[#0F172A]">
              <Search size={14} className="text-slate-500 dark:text-slate-400" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholder}
                className="bg-transparent border-none outline-none text-sm font-bold w-full text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            <div className="max-h-60 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-brand-action bg-white dark:bg-[#0F172A]">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt}
                    ref={opt === value ? activeRef : null}
                    onClick={(e) => {
                      e.stopPropagation()
                      onChange(opt)
                      onClose()
                      onSearchChange("")
                    }}
                    className={`px-4 py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors ${opt === value ? 'bg-brand-action text-white' : 'hover:bg-brand-action hover:text-white text-slate-800 dark:text-slate-200'}`}
                  >
                    {opt}
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-xs text-slate-500 dark:text-slate-400 font-bold italic">
                  No results found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
