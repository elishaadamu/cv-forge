"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Briefcase, MapPin, DollarSign, Clock, ChevronRight, Building2, Zap, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Job, getRemoteJobs } from "@/lib/jobs"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export function FeaturedJobs() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchFeaturedJobs() {
      try {
        const data = await getRemoteJobs()
        // Take the first 4 jobs for the landing page
        setJobs(data.jobs?.slice(0, 4) || [])
      } catch (err) {
        console.error("Failed to load featured jobs:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedJobs()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-action/5 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-secondary/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-brand-action/10 border border-brand-action/20 text-brand-action text-xs font-black uppercase tracking-widest"
            >
              <Zap size={14} fill="currentColor" />
              <span>Opportunities Forge</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-black tracking-tight"
            >
              Your Next <span className="bg-linear-to-r from-brand-action to-brand-secondary bg-clip-text text-transparent">Global Career</span> Starts Today
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-foreground/60 text-lg font-medium"
            >
              Discover high-impact remote roles from the world's most innovative companies. Selected, verified, and updated daily.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-auto"
          >
            <form 
              onSubmit={handleSearch}
              className="relative group"
            >
              <div className="absolute inset-0 bg-brand-action/20 blur-xl group-focus-within:bg-brand-action/30 transition-all rounded-2xl" />
              <div className="relative flex items-center bg-background/50 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 focus-within:border-brand-action/50 transition-all">
                <div className="pl-4 text-foreground/40 group-focus-within:text-brand-action transition-colors">
                  <Search size={18} />
                </div>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by role or skill..."
                  className="bg-transparent border-none outline-none px-4 py-2 w-full lg:w-64 font-bold text-sm placeholder:text-foreground/20"
                />
                <button 
                  type="submit"
                  className="bg-brand-action text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-action/90 transition-all active:scale-95 whitespace-nowrap"
                >
                  Search Jobs
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[280px] bg-white/5 border border-white/10 rounded-[32px] animate-pulse" />
            ))
          ) : (
            <AnimatePresence>
              {jobs.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-white/5 hover:bg-white/8 border border-white/10 hover:border-brand-action/50 rounded-[32px] p-6 lg:p-8 transition-all duration-500 overflow-hidden"
                >
                  {/* Floating Action */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-4 group-hover:translate-x-0">
                    <div className="w-10 h-10 rounded-full bg-brand-action flex items-center justify-center text-white shadow-lg shadow-brand-action/30">
                      <ArrowRight size={18} />
                    </div>
                  </div>

                  {/* Logo */}
                  <div className="w-12 h-12 rounded-xl bg-white/10 p-2 border border-white/5 mb-6 overflow-hidden flex items-center justify-center group-hover:border-brand-action/30 transition-colors">
                    {job.company_logo ? (
                      <img src={job.company_logo} alt={job.company_name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Building2 className="text-white/20" size={24} />
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-action">{job.company_name}</p>
                      <h3 className="text-lg font-black leading-tight group-hover:text-brand-action transition-colors line-clamp-2">
                        {job.title}
                      </h3>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-2 text-foreground/40 text-[11px] font-bold">
                        <MapPin size={12} className="text-brand-action/60" />
                        <span>{job.candidate_required_location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/40 text-[11px] font-bold">
                        <Clock size={12} className="text-brand-action/60" />
                        <span>{dayjs(job.publication_date).fromNow()}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-bold">
                          <DollarSign size={12} />
                          <span>{job.salary}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link 
                    href={`/jobs?selected=${job.id}`}
                    className="absolute inset-0 z-10"
                  />
                  
                  {/* Design Flare */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-action/5 rounded-full blur-2xl group-hover:bg-brand-action/10 transition-colors" />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            href="/jobs"
            className="inline-flex items-center space-x-3 text-sm font-black uppercase tracking-[0.2em] group"
          >
            <span className="text-foreground/40 group-hover:text-foreground transition-colors">Explore All 2,400+ Remote Roles</span>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-brand-action group-hover:border-brand-action group-hover:text-white transition-all">
              <ChevronRight size={18} />
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
