"use client"

import { useState, useEffect, useMemo } from "react"
import { Navbar } from "@/components/Navbar"
import { Job, getRemoteJobs } from "@/lib/jobs"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  ExternalLink, 
  Filter,
  X,
  ChevronRight,
  Globe,
  Building2,
  Zap,
  Loader2
} from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export default function JobListingPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters state
  const [filters, setFilters] = useState({
    jobType: "All",
    location: "All",
    minSalary: 0,
    daysOwn: "All"
  })
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async (query?: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRemoteJobs(query)
      setJobs(data.jobs || [])
    } catch (err) {
      setError("Failed to load jobs. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchJobs(search)
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Category filter
      if (activeCategory !== "All" && job.category !== activeCategory) return false
      
      // Job Type filter
      if (filters.jobType !== "All" && job.job_type !== filters.jobType.toLowerCase().replace(" ", "_")) return false
      
      // Location filter
      if (filters.location === "Worldwide" && job.candidate_required_location.toLowerCase() !== "worldwide") return false
      if (filters.location === "Specific" && !job.candidate_required_location.toLowerCase().includes(search.toLowerCase())) return false
      
      // Salary filter
      if (filters.minSalary === 1 && !job.salary) return false

      // Publication Date filter
      if (filters.daysOwn !== "All") {
        const days = parseInt(filters.daysOwn)
        const pubDate = dayjs(job.publication_date)
        if (dayjs().diff(pubDate, 'day') > days) return false
      }

      return true
    })
  }, [jobs, activeCategory, filters])

  const categories = ["All", ...Array.from(new Set(jobs.map(j => j.category)))].slice(0, 10)

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* Header Section */}
        <div className="relative mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight">
              Remote <span className="text-brand-action">Jobs</span> Forge
            </h1>
            <p className="text-brand-text-muted max-w-2xl mx-auto text-lg pt-2">
              Discover your next remote challenge. Hand-picked opportunities from across the globe, updated in real-time.
            </p>
          </motion.div>

          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-action/10 blur-[120px] rounded-full -z-10" />
        </div>

        {/* Search Bar Area */}
        <section className="sticky top-24 z-30 mb-12">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto relative group">
            <div className="absolute inset-0 bg-brand-action/20 blur-2xl group-focus-within:bg-brand-action/30 transition-all rounded-3xl" />
            <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-2 rounded-3xl flex items-center shadow-2xl overflow-hidden shadow-brand-action/5">
              <div className="pl-6 text-brand-text-muted transition-colors group-focus-within:text-brand-action">
                <Search size={24} strokeWidth={2.5} />
              </div>
              <input 
                type="text" 
                placeholder="Search by title, company, or keywords (e.g. React, Senior, Remote)..."
                className="w-full bg-transparent border-none outline-none px-6 py-4 text-lg font-bold placeholder:text-white/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button 
                type="submit"
                className="hidden md:flex items-center gap-2 px-8 py-4 bg-brand-action hover:bg-brand-action/90 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-brand-action/20"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
                Search
              </button>
            </div>
          </form>
        </section>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 shrink-0 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl sticky top-48">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black flex items-center gap-3">
                  <Filter size={20} className="text-brand-action" />
                  Filters
                </h2>
                <button 
                  onClick={() => setFilters({ jobType: "All", location: "All", minSalary: 0, daysOwn: "All" })}
                  className="text-[10px] font-black uppercase tracking-widest text-brand-action hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Category Radio Group */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                          activeCategory === cat 
                          ? "bg-brand-action text-white border-brand-action shadow-lg shadow-brand-action/20" 
                          : "bg-white/5 border-transparent text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/5 w-full" />

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Work Model</h3>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-action transition-all font-bold text-sm"
                    value={filters.jobType}
                    onChange={(e) => setFilters(f => ({ ...f, jobType: e.target.value }))}
                  >
                    <option value="All">All Types</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Location Preference</h3>
                  <div className="space-y-2">
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-action transition-all font-bold text-sm"
                      value={filters.location}
                      onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
                    >
                      <option value="All">Anywhere</option>
                      <option value="Worldwide">Worldwide Only</option>
                      <option value="Specific">Specific Region</option>
                    </select>
                    {filters.location === "Specific" && (
                      <input 
                        type="text"
                        placeholder="e.g. USA, UK, Europe..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-action transition-all font-bold text-sm"
                        onChange={(e) => setSearch(e.target.value)} // Re-uses search for region if specific
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Salary Range</h3>
                  <div className="flex flex-col gap-2">
                     <button
                        onClick={() => setFilters(f => ({ ...f, minSalary: f.minSalary === 1 ? 0 : 1 }))}
                        className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-between ${
                          filters.minSalary === 1 
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                          : "bg-white/5 border-transparent text-white/40 hover:bg-white/10"
                        }`}
                      >
                        Est. Salary Included
                        {filters.minSalary === 1 && <Zap size={12} fill="currentColor" />}
                      </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Time Posted</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Today", value: "1" },
                      { label: "Past 3 days", value: "3" },
                      { label: "Past Week", value: "7" },
                      { label: "Past Month", value: "30" }
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setFilters(f => ({ ...f, daysOwn: opt.value }))}
                        className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          filters.daysOwn === opt.value 
                          ? "bg-brand-action/20 border-brand-action text-white" 
                          : "bg-white/5 border-transparent text-white/40 hover:bg-white/10"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-brand-action/10 border border-brand-action/20 rounded-2xl">
                 <p className="text-[10px] text-white/60 font-bold leading-relaxed italic text-center">
                   Job data provided by Remotive. 
                   Updated max 4 times per day.
                 </p>
              </div>
            </div>
          </aside>

          {/* Job Listings Grid */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-xl font-black">
                {loading ? "Discovering..." : `${filteredJobs.length} Opportunities Found`}
              </h2>
              <div className="text-white/40 text-xs font-bold font-mono">
                {activeCategory} / {filters.jobType}
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(v => (
                  <div key={v} className="h-40 bg-white/5 border border-white/10 rounded-[32px] animate-pulse" />
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredJobs.map((job, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      key={job.id}
                      className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-brand-action/50 rounded-[32px] p-8 transition-all relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-8 shadow-2xl hover:shadow-brand-action/10"
                    >
                      {/* Company Image */}
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/10 flex-shrink-0 flex items-center justify-center p-2 border border-white/5 group-hover:border-brand-action/30 transition-colors">
                        {job.company_logo ? (
                          <img src={job.company_logo} alt={job.company_name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <Building2 className="text-white/20" size={32} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-brand-action/10 text-brand-action text-[10px] font-black uppercase tracking-widest rounded-lg">
                            {job.category}
                          </span>
                          <span className="px-3 py-1 bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5">
                            {job.job_type.replace(/_/g, " ")}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black group-hover:text-brand-action transition-colors truncate">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-brand-text-muted text-sm font-bold">
                          <div className="flex items-center gap-2">
                            <Building2 size={16} />
                            <span>{job.company_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>{job.candidate_required_location}</span>
                          </div>
                          {job.salary && (
                            <div className="flex items-center gap-2 text-emerald-400">
                              <DollarSign size={16} />
                              <span>{job.salary}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{dayjs(job.publication_date).fromNow()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                        <button 
                          onClick={() => setSelectedJob(job)}
                          className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-xs uppercase tracking-widest text-white transition-all active:scale-95 whitespace-nowrap"
                        >
                          View Details
                          <ChevronRight size={14} />
                        </button>
                        <a 
                          href={job.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={() => console.log("Applying for job:", job)}
                          className="flex items-center justify-center w-14 h-14 bg-brand-action hover:bg-brand-action/90 text-white rounded-2xl transition-all active:scale-95 shadow-lg shadow-brand-action/20 shrink-0"
                        >
                          <ExternalLink size={20} />
                        </a>
                      </div>
                      
                      {/* Decorative Background Icon */}
                      <Zap className="absolute -right-6 -bottom-6 text-white/2 -rotate-12 group-hover:text-brand-action/5 transition-colors" size={160} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 border border-white/10 rounded-[40px] p-20 text-center space-y-6"
              >
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                   <Briefcase size={40} className="text-white/20" />
                </div>
                <h3 className="text-2xl font-bold">No jobs matching your search</h3>
                <p className="text-brand-text-muted max-w-md mx-auto">
                  Try adjusting your keywords or filters. Sometimes less specific searches reveal more hidden gems.
                </p>
                <button 
                  onClick={() => {
                    setSearch("")
                    setActiveCategory("All")
                    fetchJobs()
                  }}
                  className="px-8 py-4 bg-brand-action text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-action/20"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Job Description Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[80vh] bg-[#0F172A] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 p-2 flex items-center justify-center border border-white/5 overflow-hidden">
                    {selectedJob.company_logo ? (
                      <img src={selectedJob.company_logo} alt={selectedJob.company_name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Building2 className="text-white/20" size={24} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">{selectedJob.title}</h2>
                    <p className="text-brand-action font-bold uppercase tracking-widest text-xs">{selectedJob.company_name} • {selectedJob.candidate_required_location}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto prose prose-invert prose-brand max-w-none scrollbar-hide">
                <div 
                  dangerouslySetInnerHTML={{ __html: selectedJob.description }} 
                  className="text-white/60 leading-relaxed font-bold"
                />
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-white/5 bg-white/2 flex items-center justify-between shrink-0">
                <div className="flex gap-4">
                  <span className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                    {selectedJob.category}
                  </span>
                  <span className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                    {selectedJob.job_type.replace(/_/g, " ")}
                  </span>
                </div>
                <a 
                  href={selectedJob.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => console.log("Final Application Data:", selectedJob)}
                  className="flex items-center gap-3 px-10 py-5 bg-brand-action text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-action/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Confirm & Apply
                  <ExternalLink size={18} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer / Credits */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 opacity-50 grayscale hover:grayscale-0 transition-all cursor-crosshair">
            <span className="text-xs font-black uppercase tracking-tighter">Source:</span>
            <img src="https://remotive.com/job/2088644/logo" alt="Remotive" className="h-6 w-auto" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
            © 2026 CV FORGE JOBS • Premium Remote Talent Network
          </p>
          <div className="flex gap-6 text-xs font-bold text-white/40">
            <a href="#" className="hover:text-brand-action transition-colors">API TOS</a>
            <a href="#" className="hover:text-brand-action transition-colors">Legal notice</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
