"use client"

import { useState, useEffect, useMemo } from "react"
import { Navbar } from "@/components/Navbar"
import { JSearchJob, getAggregatedJobs } from "@/lib/jobs"
import { motion, AnimatePresence } from "framer-motion"
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
  Briefcase
} from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export default function AggregatedJobSearchPage() {
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
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="relative mb-16 text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight">
              Global <span className="text-brand-action">Aggregator</span>
            </h1>
            <p className="text-brand-text-muted max-w-2xl mx-auto text-lg pt-2">
              Search millions of openings from Indeed, LinkedIn, Glassdoor, and more—all in one place.
            </p>
          </motion.div>
        </div>

        {/* Search Controls */}
        <section className="max-w-5xl mx-auto mb-16 space-y-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-brand-action/10 blur-xl group-focus-within:bg-brand-action/20 transition-all rounded-3xl" />
              <div className="relative bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                <Search className="text-white/40 group-focus-within:text-brand-action transition-colors" />
                <input 
                  type="text"
                  placeholder="What job are you looking for?"
                  className="w-full bg-transparent border-none outline-none font-bold placeholder:text-white/20"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="md:w-64 relative group">
              <div className="relative bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                <MapPin className="text-white/40" />
                <input 
                  type="text"
                  placeholder="Location (e.g. Nigeria)"
                  className="w-full bg-transparent border-none outline-none font-bold placeholder:text-white/20"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-brand-action hover:bg-brand-action/90 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
              Search
            </button>
          </form>

          {/* New Filters Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 py-4 border-y border-white/5">
             {/* Date Posted */}
             <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl focus-within:border-brand-action/50 transition-colors">
                <Clock size={14} className="text-white/40" />
                <div className="flex flex-col">
                  <label className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-action">Timeframe</label>
                  <select 
                    className="bg-transparent text-xs font-bold outline-none appearance-none cursor-pointer"
                    value={datePosted}
                    onChange={(e) => setDatePosted(e.target.value)}
                  >
                    <option value="all" className="bg-[#0f172a]">Any Time</option>
                    <option value="today" className="bg-[#0f172a]">Today Only</option>
                    <option value="3days" className="bg-[#0f172a]">Last 3 Days</option>
                    <option value="week" className="bg-[#0f172a]">This Week</option>
                    <option value="month" className="bg-[#0f172a]">This Month</option>
                  </select>
                </div>
             </div>

             {/* Country */}
             <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl focus-within:border-brand-action/50 transition-colors">
                <Globe size={14} className="text-white/40" />
                <div className="flex flex-col">
                  <label className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-action">Country (ISO)</label>
                  <input 
                    type="text"
                    maxLength={2}
                    placeholder="US"
                    className="bg-transparent text-xs font-bold outline-none w-8 uppercase"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
             </div>

             {/* Type */}
             <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl focus-within:border-brand-action/50 transition-colors">
                <Briefcase size={14} className="text-white/40" />
                <div className="flex flex-col">
                  <label className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-action">Job Type</label>
                  <select 
                    className="bg-transparent text-xs font-bold outline-none appearance-none cursor-pointer"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                  >
                    <option value="" className="bg-[#0f172a]">All Types</option>
                    <option value="FULLTIME" className="bg-[#0f172a]">Full-time</option>
                    <option value="CONTRACTOR" className="bg-[#0f172a]">Contract</option>
                    <option value="PARTTIME" className="bg-[#0f172a]">Part-time</option>
                    <option value="INTERN" className="bg-[#0f172a]">Internship</option>
                  </select>
                </div>
             </div>

             {/* Experience */}
             <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl focus-within:border-brand-action/50 transition-colors">
                <Filter size={14} className="text-white/40" />
                <div className="flex flex-col">
                  <label className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-action">Experience</label>
                  <select 
                    className="bg-transparent text-xs font-bold outline-none appearance-none cursor-pointer"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    <option value="" className="bg-[#0f172a]">Any Level</option>
                    <option value="no_experience" className="bg-[#0f172a]">Entry Level / None</option>
                    <option value="under_3_years_experience" className="bg-[#0f172a]">Under 3 Years</option>
                    <option value="more_than_3_years_experience" className="bg-[#0f172a]">3+ Years / Senior</option>
                    <option value="no_degree" className="bg-[#0f172a]">No Degree Required</option>
                  </select>
                </div>
             </div>

             <button 
               onClick={() => setRemoteOnly(!remoteOnly)}
               className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all text-xs font-bold ${
                 remoteOnly 
                 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                 : "bg-white/5 border-white/10 text-white/40"
               }`}
             >
               <Zap size={14} />
               Remote Only
             </button>
          </div>
          
          <div className="mt-4 flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/20">
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
               <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} />
               </div>
               <p className="text-lg font-bold italic">Enter a keyword and location to start your search</p>
            </div>
          )}

          {loading ? (
             <div className="grid gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-44 bg-white/5 border border-white/10 rounded-[32px] animate-pulse" />
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
                    className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-brand-action/50 rounded-[32px] p-8 transition-all relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-8"
                  >
                    {/* Employer Image */}
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center p-2 border border-white/5 shrink-0 overflow-hidden">
                       {job.employer_logo ? (
                         <img src={job.employer_logo} alt={job.employer_name} className="max-w-full max-h-full object-contain" />
                       ) : (
                         <Building2 className="text-white/20" size={24} />
                       )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                       <h3 className="text-xl md:text-2xl font-black group-hover:text-brand-action transition-colors truncate">
                         {job.job_title}
                       </h3>
                       <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-brand-text-muted text-sm font-bold">
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
                           <p className="text-[10px] text-white/30 truncate max-w-xl">
                             <span className="text-brand-action font-black uppercase tracking-widest mr-2">Requirement:</span> 
                             {job.job_highlights.Qualifications[0]}
                           </p>
                         </div>
                       )}
                    </div>

                    <div className="flex items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 w-full md:w-auto">
                       <a 
                        href={job.job_apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-brand-action text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-action/90 transition-all active:scale-95 shadow-lg shadow-brand-action/20"
                       >
                         Apply Now
                         <ExternalLink size={14} />
                       </a>
                    </div>

                    <Zap className="absolute -right-6 -bottom-6 text-white/2 -rotate-12 group-hover:text-brand-action/5 transition-colors" size={120} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
