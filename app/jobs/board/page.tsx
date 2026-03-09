import { getJobPostings, JobFilters } from "@/app/admin/jobs/job-actions"
import { Navbar } from "@/components/Navbar"
import { JobBoardFilters } from "@/components/jobs/JobBoardFilters"
import { CVBanner } from "@/components/jobs/CVBanner"
import { JobNav } from "@/components/jobs/JobNav"
import { JobBoardSearch } from "@/components/jobs/JobBoardSearch"
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  ExternalLink,
  Zap
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Job Board | cvmyjob — Curated Opportunities",
  description: "Hand-picked job opportunities posted directly by cvmyjob. Apply to premium roles from top companies.",
  openGraph: {
    title: "Job Board | cvmyjob — Curated Opportunities",
    description: "Hand-picked job opportunities from top companies, vetted by the cvmyjob team.",
    images: [{
      url: '/logo.png',
      width: 1200,
      height: 630,
      alt: 'cvmyjob Job Board'
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "cvmyjob Job Board",
    description: "Apply to premium, hand-picked roles on the cvmyjob Board.",
    images: ['/logo.png'],
  }
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function JobBoardPage({ searchParams }: PageProps) {
  const sParams = await searchParams
  const currentPage = Number(typeof sParams.page === 'string' ? sParams.page : '1') || 1
  
  const filters: JobFilters = {
    q: typeof sParams.q === 'string' ? sParams.q : undefined,
    country: typeof sParams.country === 'string' ? sParams.country : undefined,
    state: typeof sParams.state === 'string' ? sParams.state : undefined,
    type: typeof sParams.type === 'string' ? sParams.type : undefined,
    page: currentPage,
    limit: 10
  }

  const { jobs, pagination } = await getJobPostings(filters)

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />

      <main className="max-w-7xl mt-16 md:mt-10 mx-auto px-6 py-16 lg:py-24 space-y-20">
        <JobNav />
        {/* Header */}
        <div className="relative text-center space-y-10 max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-action/10 border border-brand-action/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-brand-action">
              <Zap size={12} fill="currentColor" />
              CVMyJob Board
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-none">
              Find Your Next <br /> <span className="text-brand-action">Big Opportunity</span>
            </h1>
            <p className="text-foreground/50 text-base md:text-lg font-bold leading-relaxed max-w-2xl mx-auto">
              Verified roles from elite companies, indexed daily. Every opportunity is vetted by our team.
            </p>
          </div>
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 w-full h-[350px] bg-brand-action/5 blur-[140px] rounded-full -z-10" />
        </div>

        {/* TOP BANNER */}
        <CVBanner />
        {/* Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sidebar - FILTERS MOVE HERE */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="sticky top-28 bg-card border border-border-custom rounded-[32px] p-6 shadow-xl">
               <JobBoardFilters initialFilters={filters} />
            </div>
          </aside>
        
          <div className="lg:col-span-9 space-y-8">
            <div className="bg-card/30 backdrop-blur-md border border-border-custom rounded-[40px] p-2 shadow-xl">
              <JobBoardSearch />
            </div>
            
            <div className="flex items-center justify-between px-6">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Showing {jobs.length} verified listings
              </h2>
            </div>

            {jobs.length === 0 ? (
              <div className="bg-card/30 backdrop-blur-md border border-border-custom rounded-[48px] p-20 text-center space-y-6 shadow-xl">
                <div className="w-24 h-24 bg-foreground/5 rounded-full flex items-center justify-center mx-auto">
                  <Briefcase size={40} className="text-foreground/20" />
                </div>
                <h2 className="text-2xl font-black text-foreground">No matches found</h2>
                <p className="text-foreground/40 max-w-sm mx-auto font-bold leading-relaxed">
                  Try adjusting your filters or search keywords to find more opportunities.
                </p>
                <Link 
                  href="/jobs/board" 
                  className="inline-flex py-3 px-8 bg-brand-action/10 text-brand-action rounded-2xl text-xs font-black uppercase tracking-widest border border-brand-action/20 hover:bg-brand-action/20 transition-all"
                >
                  Reset Filters
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="space-y-6">
                  {jobs.map((job: any) => (
                    <article
                      key={job.id}
                      className="group bg-card border border-border-custom hover:border-brand-action/40 rounded-[40px] p-8 md:p-10 transition-all relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-8 shadow-xl hover:shadow-brand-action/10"
                    >
                      {/* Logo */}
                      <div className="w-20 h-20 rounded-2xl bg-foreground/5 shrink-0 flex items-center justify-center border border-border-custom group-hover:border-brand-action/30 transition-colors overflow-hidden p-2">
                        {job.image ? (
                          <img src={job.image} alt={job.company} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <Building2 className="text-foreground/20" size={32} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-brand-action/10 text-brand-action text-[9px] font-black uppercase tracking-widest rounded-lg">
                            {job.type}
                          </span>
                          <span className="px-3 py-1 bg-foreground/5 text-foreground/50 text-[9px] font-black uppercase tracking-widest rounded-lg border border-border-custom">
                            Verified
                          </span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-black group-hover:text-brand-action transition-colors truncate text-foreground">
                          {job.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-sm font-bold text-foreground/50">
                          <span className="flex items-center gap-2">
                            <Building2 size={14} />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin size={14} />
                            {[job.state, job.country].filter(Boolean).join(", ")}
                          </span>
                          {job.salary && (
                            <span className="flex items-center gap-2 text-brand-action">
                              <DollarSign size={14} />
                              <span className="uppercase text-[10px] opacity-70">{job.currency}</span>
                              {job.salary}
                            </span>
                          )}
                          <span className="flex items-center gap-2 opacity-50">
                            <Clock size={14} />
                            {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-3 shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-border-custom">
                        <Link
                          href={`/jobs/board/${job.id}`}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-foreground/5 hover:bg-brand-action/10 hover:text-brand-action border border-border-custom hover:border-brand-action/30 rounded-2xl font-black text-xs uppercase tracking-widest text-foreground/60 transition-all active:scale-95 whitespace-nowrap"
                        >
                          View Details
                        </Link>
                        {job.applyUrl && (
                          <a
                            href={job.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-12 h-12 bg-brand-action hover:bg-brand-action/90 text-white rounded-2xl transition-all active:scale-95 shadow-lg shadow-brand-action/20 shrink-0"
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>

                      <Zap className="absolute -right-6 -bottom-6 text-foreground/2 group-hover:text-brand-action/5 transition-colors pointer-events-none -rotate-12" size={160} />
                    </article>
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-10">
                    <Link
                      href={{
                        pathname: "/jobs/board",
                        query: { ...sParams, page: Math.max(1, currentPage - 1) }
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-border-custom transition-all ${currentPage === 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-foreground/5 hover:border-foreground/20'}`}
                    >
                      Prev
                    </Link>
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                        <Link
                          key={p}
                          href={{
                            pathname: "/jobs/board",
                            query: { ...sParams, page: p }
                          }}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all border ${p === currentPage ? 'bg-brand-action border-brand-action text-white shadow-lg shadow-brand-action/30' : 'bg-card border-border-custom text-foreground/40 hover:border-foreground/20 hover:text-foreground'}`}
                        >
                          {p}
                        </Link>
                      ))}
                    </div>

                    <Link
                      href={{
                        pathname: "/jobs/board",
                        query: { ...sParams, page: Math.min(pagination.totalPages, currentPage + 1) }
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-border-custom transition-all ${currentPage === pagination.totalPages ? 'opacity-30 pointer-events-none' : 'hover:bg-foreground/5 hover:border-foreground/20'}`}
                    >
                      Next
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border-custom py-10 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">
            © 2026 CVMyJob — Premium Job Board Hub
          </p>
          <div className="flex items-center gap-8">
            <Link href="/blog" className="text-xs font-bold text-foreground/40 hover:text-brand-action transition-colors">Career Advice</Link>
            <Link href="/jobs" className="text-xs font-bold text-foreground/40 hover:text-brand-action transition-colors">Remote Jobs</Link>
            <Link href="/ats" className="text-xs font-bold text-brand-action hover:underline">ATS Checker</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
