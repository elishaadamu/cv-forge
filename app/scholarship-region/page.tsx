import { getScholarshipRegions, ScholarshipRegionFilters } from "@/app/scholarship-region/actions"
import { Navbar } from "@/components/Navbar"
import { ScholarshipRegionSearch } from "@/components/scholarship-region/ScholarshipRegionSearch"
import { CopyBriefButton } from "@/components/jobs/CopyBriefButton"
import { 
  GraduationCap, 
  Building2, 
  MapPin, 
  Clock, 
  ExternalLink,
  Sparkles,
  Zap
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export const dynamic = "force-dynamic"


interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ScholarshipRegionPage({ searchParams }: PageProps) {
  const sParams = await searchParams
  const currentPage = Number(typeof sParams.page === 'string' ? sParams.page : '1') || 1
  
  const filters: ScholarshipRegionFilters = {
    q: typeof sParams.q === 'string' ? sParams.q : undefined,
    country: typeof sParams.country === 'string' ? sParams.country : undefined,
    type: typeof sParams.type === 'string' ? sParams.type : undefined,
    page: currentPage,
    limit: 30
  }

  const { scholarships, pagination } = await getScholarshipRegions(filters)
  
  // Fetch recent scholarships for sidebar (7 items)
  const { scholarships: recentScholarships } = await getScholarshipRegions({ ...filters, limit: 7, page: 1 });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />

      <main className="max-w-7xl mt-16 md:mt-10 mx-auto px-6 py-16 lg:py-24 space-y-20">
        {/* Header */}
        <div className="relative text-center space-y-10 max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">
              <Sparkles size={12} fill="currentColor" />
              Global Scholarships
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-none">
              Scholarships <br /> <span className="text-emerald-500">Worldwide</span>
            </h1>
            <p className="text-foreground/50 text-base md:text-lg font-bold leading-relaxed max-w-2xl mx-auto">
              International scholarships, fully funded programs, and grants curated from top global sources. Updated regularly.
            </p>
          </div>
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[350px] bg-emerald-500/5 blur-[140px] rounded-full -z-10" />
        </div>

        <div className="space-y-10">
          <div className="bg-card/30 backdrop-blur-md border border-border-custom rounded-[40px] p-2 shadow-xl max-w-3xl mx-auto">
            <ScholarshipRegionSearch />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex items-center justify-between px-6">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Showing {scholarships.length} global scholarships
                </h2>
              </div>

              {scholarships.length === 0 ? (
                <div className="bg-card/30 backdrop-blur-md border border-border-custom rounded-[48px] p-20 text-center space-y-6 shadow-xl">
                  <div className="w-24 h-24 bg-foreground/5 rounded-full flex items-center justify-center mx-auto">
                    <GraduationCap size={40} className="text-foreground/20" />
                  </div>
                  <h2 className="text-2xl font-black text-foreground">No matches found</h2>
                  <p className="text-foreground/40 max-w-sm mx-auto font-bold leading-relaxed">
                    Try adjusting your search keywords to find more opportunities.
                  </p>
                  <Link 
                    href="/scholarship-region" 
                    className="inline-flex py-3 px-8 bg-emerald-500/10 text-emerald-500 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                  >
                    Reset Search
                  </Link>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {scholarships.map((scholarship: any) => (
                      <article
                        key={scholarship.id}
                        className="group bg-card border border-border-custom hover:border-emerald-500/40 rounded-[32px] overflow-hidden transition-all relative flex flex-col shadow-lg hover:shadow-emerald-500/10"
                      >
                        <Link href={`/scholarship-region/${scholarship.id}`} className="block relative aspect-video overflow-hidden bg-foreground/5 border-b border-border-custom">
                          {scholarship.image ? (
                            <img 
                              src={scholarship.image} 
                              alt={scholarship.company} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building2 className="text-foreground/10" size={64} />
                            </div>
                          )}
                          <div className="absolute top-4 right-4 z-10">
                            <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/10">
                              {scholarship.type || 'Scholarship'}
                            </span>
                          </div>
                        </Link>

                        {/* Content */}
                        <div className="p-8 flex-1 flex flex-col">
                          <div className="flex-1 space-y-6">
                            <Link href={`/scholarship-region/${scholarship.id}`}>
                              <h2 className="text-xl md:text-2xl mb-5 font-black group-hover:text-emerald-500 transition-colors text-foreground leading-tight">
                                {scholarship.title}
                              </h2>
                            </Link>
                            
                            <div className="flex flex-wrap gap-4">
                              
                              <div className="flex items-center gap-2 text-xs font-bold text-foreground/50">
                                <MapPin size={14} className="text-emerald-500" />
                                <span>{scholarship.country || 'International'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs font-bold text-foreground/50">
                                <Clock size={14} className="text-emerald-500" />
                                <span>{scholarship.postedAt ? formatDistanceToNow(new Date(scholarship.postedAt), { addSuffix: true }) : 'Recently'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-8 pt-6 border-t border-border-custom flex items-center justify-between gap-4">
                             <CopyBriefButton 
                              jobData={{
                                title: scholarship.title,
                                company: scholarship.company,
                                url: `https://cvmyjob.online/scholarship-region?selected=${scholarship.id}`,
                                description: scholarship.description,
                                type: 'scholarship'
                              }}
                            />
                            <Link
                              href={`/scholarship-region/${scholarship.id}`}
                              className="flex-1 flex items-center justify-center px-6 py-3.5 bg-emerald-500 text-white hover:bg-emerald-500/90 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                            >
                              Explore Opportunity
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-10">
                      <Link
                        href={{
                          pathname: "/scholarship-region",
                          query: { ...sParams, page: Math.max(1, currentPage - 1) }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-border-custom transition-all ${currentPage === 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-foreground/5 hover:border-foreground/20'}`}
                      >
                        Prev
                      </Link>
                      
                      <div className="flex items-center gap-2">
                        {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map(p => (
                          <Link
                            key={p}
                            href={{
                              pathname: "/scholarship-region",
                              query: { ...sParams, page: p }
                            }}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all border ${p === currentPage ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-card border-border-custom text-foreground/40 hover:border-foreground/20 hover:text-foreground'}`}
                          >
                            {p}
                          </Link>
                        ))}
                      </div>

                      <Link
                        href={{
                          pathname: "/scholarship-region",
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

            <aside className="lg:col-span-4 space-y-8">
              <div className="sticky top-28 space-y-6">
                <div className="bg-card border border-border-custom rounded-[32px] p-8 shadow-xl space-y-8 max-h-[calc(100vh-160px)] flex flex-col">
                  <div className="flex items-center gap-4 shrink-0">
                    <h3 className="text-sm font-black uppercase tracking-widest whitespace-nowrap">More Opportunities</h3>
                    <div className="h-1 flex-1 bg-emerald-500/20 rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 w-1/2 bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                  
                  <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
                    {recentScholarships.map((rs: any) => (
                      <Link 
                        key={rs.id} 
                        href={`/scholarship-region/${rs.id}`}
                        className="group flex gap-5 items-center"
                      >
                        <div className="w-28 h-24 rounded-2xl overflow-hidden bg-foreground/5 border border-border-custom shrink-0 group-hover:border-emerald-500/30 transition-colors shadow-sm">
                          {rs.image ? (
                            <img src={rs.image} alt={rs.company} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Building2 size={24} className="text-foreground/20" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1.5 min-w-0">
                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">
                            {rs.type || 'Scholarship'}
                          </span>
                          <h4 className="text-[13px] font-black leading-tight text-foreground/80 group-hover:text-emerald-500 transition-colors line-clamp-2">
                            {rs.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-foreground/30 uppercase tracking-tighter">
                            <span className="truncate">{rs.company}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(rs.postedAt))}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <Link 
                    href="/scholarship-region"
                    className="block w-full py-4 bg-foreground/5 hover:bg-emerald-500/10 hover:text-emerald-500 border border-border-custom hover:border-emerald-500/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all shrink-0"
                  >
                    Load More
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <footer className="border-t border-border-custom py-10 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">
            © 2026 CVMyJob — Global Scholarship Hub
          </p>
          <div className="flex items-center gap-8">
            <Link href="/graduate-programs" className="text-xs font-bold text-foreground/40 hover:text-emerald-500 transition-colors">Graduate Programs</Link>
            <Link href="/blog" className="text-xs font-bold text-foreground/40 hover:text-emerald-500 transition-colors">Career Advice</Link>
            <Link href="/jobs" className="text-xs font-bold text-foreground/40 hover:text-emerald-500 transition-colors">Remote Jobs</Link>
            <Link href="/ats" className="text-xs font-bold text-emerald-500 hover:underline">ATS Checker</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
