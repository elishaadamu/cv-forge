"use client"

import { Suspense, useState, useEffect, useMemo } from "react"
import { Navbar } from "@/components/Navbar"
import { JSearchJob, getAggregatedJobs } from "@/lib/jobs"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ShareButton } from "@/components/jobs/ShareButton"
import { CVBanner } from "@/components/jobs/CVBanner"
import { 
  Search, 
  MapPin, 
  DollarSign, 
  Clock, 
  ExternalLink, 
  Filter,
  Building2,
  Zap,
  Loader2,
  ChevronRight,
  Globe,
  Briefcase,
  X
} from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { countryCodes } from "@/lib/countries"

dayjs.extend(relativeTime)

export default function AggregatedJobSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-action" size={48} />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}

function SearchContent() {
  const [jobs, setJobs] = useState<JSearchJob[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [datePosted, setDatePosted] = useState("all")
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [employmentType, setEmploymentType] = useState("")
  const [experience, setExperience] = useState("")
  const [country, setCountry] = useState("US")
  const [error, setError] = useState<string | null>(null)
  
  const [selectedJob, setSelectedJob] = useState<JSearchJob | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedId = searchParams.get("selected")

  useEffect(() => {
    if (selectedId) {
      const job = jobs.find(j => j.job_id === selectedId)
      if (job) {
        setSelectedJob(job)
      } else {
        const fetchJob = async () => {
          try {
            const res = await fetch(`/api/jobs/details?job_id=${selectedId}`)
            const data = await res.json()
            if (data.status === "OK" && data.data?.[0]) {
              setSelectedJob(data.data[0])
            }
          } catch (err) {
            console.error(err)
          }
        }
        fetchJob()
      }
    } else {
      setSelectedJob(null)
    }
  }, [selectedId, jobs])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query) return
    
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.append("query", query)
      if (location) params.append("location", location)
      if (datePosted) params.append("date_posted", datePosted)
      if (remoteOnly) params.append("remote_only", "true")
      if (employmentType) params.append("employment_types", employmentType)
      if (experience) params.append("job_requirements", experience)
      if (country) params.append("country", country)

      const res = await fetch(`/api/jobs/search?${params.toString()}`)
      const data = await res.json()
      
      if (data.status === "OK") {
        setJobs(data.data)
      } else {
        setError(data.message || "Search failed. Please ensure your API key is configured correctly on the server.")
      }
    } catch (err) {
      setError("An error occurred while fetching jobs.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="relative mb-16 text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl mt-10 lg:text-6xl font-black tracking-tight text-foreground">
              Global <span className="text-brand-action">Aggregator</span>
            </h1>
            <p className="text-foreground/60 max-w-2xl mx-auto text-lg pt-2 transition-colors duration-500">
              Search millions of openings from Indeed, LinkedIn, Glassdoor, and more—all in one place.
            </p>
          </motion.div>
        </div>

        {/* CV Builder Banner */}
        <div className="mb-16 max-w-4xl mx-auto">
          <CVBanner />
        </div>

        {/* Search Controls */}
        <section className="max-w-5xl mx-auto mb-10 space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-brand-action/10 blur-xl group-focus-within:bg-brand-action/20 transition-all rounded-3xl" />
              <div className="relative bg-card-bg border border-border-custom p-2.5 rounded-2xl flex items-center gap-4 transition-colors duration-500">
                <Search className="text-foreground/40 group-focus-within:text-brand-action transition-colors" />
                <input 
                  type="text"
                  placeholder="What job are you looking for?"
                  className="w-full bg-transparent border-none outline-none font-bold placeholder:text-foreground/20 text-foreground"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="md:w-64 relative group">
              <div className="relative bg-card-bg border border-border-custom p-2.5 rounded-2xl flex items-center gap-4 transition-colors duration-500">
                <MapPin className="text-foreground/40" />
                <input 
                  type="text"
                  placeholder="Location (e.g. Nigeria)"
                  className="w-full bg-transparent border-none outline-none font-bold placeholder:text-foreground/20 text-foreground"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="px-10 py-3 bg-brand-action hover:bg-brand-action/90 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
              Search
            </button>
          </form>

          {/* New Filters Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 py-4 border-y border-border-custom">
             {/* Date Posted */}
             <div className="flex items-center gap-3 bg-card-bg border border-border-custom px-4 py-2 rounded-xl focus-within:border-brand-action/50 transition-colors">
                <Clock size={14} className="text-foreground/40" />
                <div className="flex flex-col">
                  <label className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-action">Timeframe</label>
                  <select 
                    className="bg-transparent text-xs font-bold outline-none appearance-none cursor-pointer text-foreground pl-[5px]"
                    value={datePosted}
                    onChange={(e) => setDatePosted(e.target.value)}
                  >
                    <option value="all" className="bg-card-bg">Any Time</option>
                    <option value="today" className="bg-card-bg">Today Only</option>
                    <option value="3days" className="bg-card-bg">Last 3 Days</option>
                    <option value="week" className="bg-card-bg">This Week</option>
                    <option value="month" className="bg-card-bg">This Month</option>
                  </select>
                </div>
             </div>

             {/* Country */}
             <div className="flex items-center gap-3 bg-card-bg border border-border-custom px-4 py-2 rounded-xl focus-within:border-brand-action/50 transition-colors">
                <Globe size={14} className="text-foreground/40" />
                <div className="flex flex-col">
                  <label className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-action">Country</label>
                  <select 
                    className="bg-transparent text-xs font-bold outline-none appearance-none cursor-pointer text-foreground max-w-[120px] truncate pl-[5px]"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="" className="bg-card-bg">Global</option>
                    {countryCodes.map(c => (
                      <option key={c.iso} value={c.iso} className="bg-card-bg">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
             </div>

             {/* Type */}
             <div className="flex items-center gap-3 bg-card-bg border border-border-custom px-4 py-2 rounded-xl focus-within:border-brand-action/50 transition-colors">
                <Briefcase size={14} className="text-foreground/40" />
                <div className="flex flex-col">
                  <label className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-action">Job Type</label>
                  <select 
                    className="bg-transparent text-xs font-bold outline-none appearance-none cursor-pointer text-foreground pl-[5px]"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                  >
                    <option value="" className="bg-card-bg">All Types</option>
                    <option value="FULLTIME" className="bg-card-bg">Full-time</option>
                    <option value="CONTRACTOR" className="bg-card-bg">Contract</option>
                    <option value="PARTTIME" className="bg-card-bg">Part-time</option>
                    <option value="INTERN" className="bg-card-bg">Internship</option>
                  </select>
                </div>
             </div>

             {/* Experience */}
             <div className="flex items-center gap-3 bg-card-bg border border-border-custom px-4 py-2 rounded-xl focus-within:border-brand-action/50 transition-colors">
                <Filter size={14} className="text-foreground/40" />
                <div className="flex flex-col">
                  <label className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-action">Experience</label>
                  <select 
                    className="bg-transparent text-xs font-bold outline-none appearance-none cursor-pointer text-foreground pl-[5px]"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    <option value="" className="bg-card-bg">Any Level</option>
                    <option value="no_experience" className="bg-card-bg">Entry Level / None</option>
                    <option value="under_3_years_experience" className="bg-card-bg">Under 3 Years</option>
                    <option value="more_than_3_years_experience" className="bg-card-bg">3+ Years / Senior</option>
                    <option value="no_degree" className="bg-card-bg">No Degree Required</option>
                  </select>
                </div>
             </div>

             <button 
               onClick={() => setRemoteOnly(!remoteOnly)}
               className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all text-xs font-bold ${
                 remoteOnly 
                 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" 
                 : "bg-card-bg border-border-custom text-foreground/40 hover:bg-background"
               }`}
             >
               <Zap size={14} />
               Remote Only
             </button>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-foreground/20 transition-colors duration-500">
             <span>Powered by JSearch API</span>
             <span>•</span>
             <span>Indeed</span>
             <span>•</span>
             <span>LinkedIn</span>
             <span>•</span>
             <span>Glassdoor</span>
          </div>
        </section>

        {/* Results */}
        <div className="space-y-6">
          {error && (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-500 text-center font-bold">
              {error}
            </div>
          )}

          {!loading && jobs.length === 0 && !error && (
            <div className="text-center py-20 opacity-40">
               <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-foreground" />
               </div>
               <p className="text-lg font-bold italic text-foreground">Enter a keyword and location to start your search</p>
            </div>
          )}

          {loading ? (
             <div className="grid gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-44 bg-card-bg border border-border-custom rounded-[32px] animate-pulse" />
                ))}
             </div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence>
                {jobs.map((job, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={job.job_id}
                    className="group bg-card-bg hover:bg-background border border-border-custom hover:border-brand-action/50 rounded-[32px] p-8 transition-all relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-8 shadow-xl hover:shadow-brand-action/10"
                  >
                    {/* Employer Image */}
                    <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center p-2 border border-border-custom shrink-0 overflow-hidden">
                       {job.employer_logo ? (
                         <img src={job.employer_logo} alt={job.employer_name} className="max-w-full max-h-full object-contain" />
                       ) : (
                         <Building2 className="text-foreground/20" size={24} />
                       )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                       <h3 className="text-xl md:text-2xl font-black group-hover:text-brand-action transition-colors text-foreground">
                         {job.job_title}
                       </h3>
                       <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-foreground/40 text-sm font-bold">
                          <div className="flex items-center gap-2">
                            <Building2 size={14} className="text-brand-action" />
                            <span>{job.employer_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <MapPin size={14} />
                             <span>{job.job_location || job.job_city || job.job_country || "Remote"}</span>
                          </div>
                          {job.job_is_remote && (
                             <div className="flex items-center gap-2 text-emerald-400">
                                <Globe size={14} />
                                <span>Remote</span>
                             </div>
                          )}
                          {(job.job_min_salary || job.job_max_salary) && (
                             <div className="flex items-center gap-2 text-brand-action">
                                <DollarSign size={14} />
                                <span className="uppercase">
                                  {job.job_salary_currency} {job.job_min_salary?.toLocaleString()} 
                                  {job.job_max_salary ? ` - ${job.job_max_salary.toLocaleString()}` : ""}
                                  {job.job_salary_period ? ` / ${job.job_salary_period.toLowerCase()}` : ""}
                                </span>
                             </div>
                          )}
                          <div className="flex items-center gap-2">
                             <Clock size={14} />
                             <span>{dayjs(job.job_posted_at_datetime_utc).fromNow()}</span>
                          </div>
                       </div>
                       
                       {/* Brief highlights if available */}
                       {job.job_highlights?.Qualifications && (
                         <div className="pt-2 hidden md:block">
                           <p className="text-[10px] text-foreground/30 truncate max-w-xl">
                             <span className="text-brand-action font-black uppercase tracking-widest mr-2">Requirement:</span> 
                             {job.job_highlights.Qualifications[0]}
                           </p>
                         </div>
                       )}
                    </div>

                    <div className="flex items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-border-custom w-full md:w-auto">
                       <button 
                        onClick={() => {
                          setSelectedJob(job)
                          router.push(`/jobs/search?selected=${job.job_id}`, { scroll: false })
                        }}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-foreground/10 hover:bg-brand-action/20 hover:text-brand-action rounded-2xl font-black text-xs uppercase tracking-widest text-foreground/70 transition-all active:scale-95 whitespace-nowrap border border-border-custom hover:border-brand-action/40"
                       >
                         View Details
                         <ChevronRight size={14} />
                       </button>
                       <a 
                         href={job.job_apply_link} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         onClick={(e) => {
                           e.stopPropagation();
                           if (job.job_apply_link) {
                             window.open(job.job_apply_link, '_blank', 'noopener,noreferrer');
                             e.preventDefault();
                           }
                         }}
                         className="flex items-center justify-center w-14 h-14 bg-brand-action hover:bg-brand-action/90 text-white rounded-2xl transition-all active:scale-95 shadow-lg shadow-brand-action/20 shrink-0"
                       >
                         <ExternalLink size={20} />
                       </a>
                    </div>

                    <Zap className="absolute -right-6 -bottom-6 text-foreground/2 -rotate-12 group-hover:text-brand-action/5 transition-colors pointer-events-none" size={120} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Job Description Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-9999 flex items-center justify-center px-4 md:px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedJob(null)
                router.push('/jobs/search', { scroll: false })
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[85vh] md:max-h-[85vh] bg-[#0F172A] text-white border border-slate-800 rounded-[32px] md:rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-slate-800 flex items-start md:items-center justify-between gap-4 shrink-0 bg-[#0F172A] rounded-t-[32px] md:rounded-t-[40px]">
                <div className="flex items-start md:items-center gap-4 md:gap-6 min-w-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 p-2 flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                    {selectedJob.employer_logo ? (
                      <img src={selectedJob.employer_logo} alt={selectedJob.employer_name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Building2 className="text-white/40" size={24} />
                    )}
                  </div>
                  <div className="min-w-0 mt-1">
                    <h2 className="text-lg md:text-2xl font-black text-white">{selectedJob.job_title}</h2>
                    <p className="text-brand-action font-bold uppercase tracking-widest text-[10px] md:text-xs mt-1">{selectedJob.employer_name} • {selectedJob.job_city || selectedJob.job_location || 'Remote'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedJob(null)
                    router.push('/jobs/search', { scroll: false })
                  }}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors text-white shrink-0 -mt-2 -mr-2 md:m-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1 min-h-[40vh] prose prose-invert prose-premium max-w-none scrollbar-hide bg-[#1E293B]">
                <div 
                  dangerouslySetInnerHTML={{ __html: (selectedJob.job_description || "No detailed description available.").replace(/<p[^>]*>\s*(<span[^>]*>\s*)*(&nbsp;|\u00a0|\s)*(\s*<\/span>)*\s*<\/p>/gi, '') }} 
                  className="text-white/80 leading-relaxed font-medium text-sm md:text-base prose-headings:text-white prose-strong:text-white prose-a:text-brand-action prose-p:text-white/80 prose-li:text-white/80"
                />
              </div>

              {/* Footer */}
              <div className="p-6 md:p-8 border-t border-slate-800 bg-[#0F172A] flex flex-col md:flex-row items-center justify-between gap-6 shrink-0 rounded-b-[32px] md:rounded-b-[40px]">
                <div className="flex flex-wrap gap-2 md:gap-4 justify-center md:justify-start w-full md:w-auto">
                  <span className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/70 border border-white/10">
                    {selectedJob.job_employment_type?.replace(/_/g, " ") || "Full Time"}
                  </span>
                  {selectedJob.job_is_remote && (
                    <span className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                      Remote
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto justify-end">
                    <div className="shrink-0 flex items-center justify-center dark:text-white text-white">
                      <ShareButton variant="icon" />
                    </div>
                    <a 
                      href={selectedJob.job_apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 md:flex-none flex justify-center items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-brand-action text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-action/20 hover:scale-[1.02] active:scale-95 transition-all text-center whitespace-nowrap"
                    >
                      Confirm & Apply
                      <ExternalLink size={18} />
                    </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
