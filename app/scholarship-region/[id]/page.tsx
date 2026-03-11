import { getScholarshipRegionById } from "@/app/scholarship-region/actions"
import { listCVs } from "@/lib/actions"
import { Navbar } from "@/components/Navbar"
import { ShareButton } from "@/components/jobs/ShareButton"
import { 
  Building2, 
  MapPin, 
  Clock, 
  ExternalLink,
  FileText,
  ChevronLeft,
  Calendar,
  Globe,
  GraduationCap
} from "lucide-react"
import { CVBanner } from "@/components/jobs/CVBanner"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { notFound } from "next/navigation"
import { auth } from "@/auth"

interface PageProps {
  params: Promise<{ id: string }>
}


export default async function ScholarshipRegionDetailPage({ params }: PageProps) {
  const { id } = await params
  const { scholarship, success } = await getScholarshipRegionById(id)
  
  if (!success || !scholarship) {
    notFound()
  }

  const session = await auth()
  let userCVs: any[] = []
  if (session?.user?.id) {
    const cvRes = await listCVs()
    if (cvRes.success && cvRes.cvs) {
      userCVs = cvRes.cvs
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-500">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Back Button */}
        <Link 
          href="/scholarship-region"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground/40 hover:text-emerald-500 transition-colors mb-12 group"
        >
          <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
            <ChevronLeft size={16} />
          </div>
          Back to Global Scholarships
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Header Card */}
            <div className="bg-card border border-border-custom rounded-[48px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col gap-8 items-center relative z-10 text-center md:text-left">
                 
                {scholarship.image && (
                 <div className="relative w-full max-h-[450px] aspect-21/9 rounded-[32px] overflow-hidden border border-white/10 shadow-inner group/featured">
                   <img 
                     src={scholarship.image.startsWith('http') ? scholarship.image : (scholarship.image.startsWith('/') ? scholarship.image : `/${scholarship.image}`)} 
                     alt={scholarship.title}
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
                   />
                   <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-bottom p-8">
                      <div className="mt-auto space-y-2">
                        <div className="w-12 h-1.5 bg-emerald-500 rounded-full" />
                        <p className="text-white text-xs font-black uppercase tracking-[0.2em]">Global Program Highlights</p>
                      </div>
                   </div>
                 </div>
               )}
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap gap-2">
                       <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
                        {scholarship.type || 'Scholarship'}
                      </span>
                      <span className="px-3 py-1 bg-foreground/5 text-foreground/40 text-[10px] font-black uppercase tracking-widest rounded-lg border border-border-custom">
                        Global Opportunity
                      </span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-foreground">
                      {scholarship.title}
                    </h1>
                    
                    <div className="flex flex-wrap mt-6 items-center gap-x-6 gap-y-3 text-sm font-bold text-foreground/50">
                      <span className="flex items-center gap-2">
                        <MapPin size={16} className="text-emerald-500" />
                        {scholarship.country || 'International'}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={16} className="text-emerald-500" />
                        Posted {scholarship.postedAt ? formatDistanceToNow(new Date(scholarship.postedAt), { addSuffix: true }) : 'Recently'}
                      </span>
                    </div>
                  </div>
               </div>

               <GraduationCap className="absolute -right-12 -bottom-12 text-foreground/2 -rotate-12 pointer-events-none" size={300} />
            </div>

            {/* Description */}
            <div className="bg-card/30 backdrop-blur-xl border border-border-custom rounded-[48px] p-8 md:p-12 shadow-xl space-y-8">
               <div className="flex items-center gap-4 border-b border-border-custom pb-8">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <FileText size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-foreground">Scholarship Details</h2>
               </div>

              
               
               <div 
                  className="prose prose-invert prose-emerald max-w-none 
                  text-foreground/70 font-medium leading-relaxed
                  prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tight
                  prose-p:mb-6 prose-ul:mb-6 prose-li:mb-2
                  prose-strong:text-emerald-500"
                  dangerouslySetInnerHTML={{ __html: scholarship.description }} 
               />

               {scholarship.applyUrl && (
                  <div className="pt-10">
                    <a 
                      href={scholarship.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-500 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-500/90 transition-all hover:-translate-y-1 active:scale-95"
                    >
                      Apply Now
                      <ExternalLink size={18} />
                    </a>
                  </div>
               )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Action Card */}
            <div className="sticky top-32 space-y-8">
              
              {/* Main Actions Box */}
              <div className="bg-card border border-border-custom rounded-[40px] p-8 shadow-2xl space-y-6">
                
                {/* SHARE BUTTON */}
                <ShareButton 
                  jobData={{
                    title: scholarship.title,
                    company: scholarship.company,
                    url: `${typeof window !== 'undefined' ? window.location.origin : ''}/scholarship-region/${scholarship.id}`,
                    description: scholarship.description,
                    type: 'scholarship'
                  }}
                />

                {/* CHOOSE CV BUTTON / SECTION */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-2">
                    <FileText size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Apply with CV</span>
                  </div>
                  
                  {userCVs.length > 0 ? (
                    <div className="space-y-3">
                       {userCVs.slice(0, 3).map((cv) => (
                         <button 
                           key={cv.id}
                           className="w-full p-4 bg-foreground/5 hover:bg-white/8 border border-border-custom rounded-2xl transition-all text-left flex items-center justify-between group"
                         >
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <FileText size={18} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-foreground truncate max-w-[150px]">{cv.name}</span>
                                <span className="text-[9px] font-black text-foreground/20 uppercase tracking-widest">Last used {formatDistanceToNow(new Date(cv.updatedAt))} ago</span>
                              </div>
                           </div>
                           <div className="w-6 h-6 rounded-full border border-border-custom flex items-center justify-center group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                              <ChevronLeft size={14} className="rotate-180" />
                           </div>
                         </button>
                       ))}
                       {userCVs.length > 3 && (
                         <Link href="/dashboard" className="block text-center text-[10px] font-black uppercase tracking-widest text-emerald-500 mt-4 hover:opacity-70">
                            See All {userCVs.length} CVs
                         </Link>
                       )}
                    </div>
                  ) : (
                    <div className="p-8 border border-dashed border-border-custom rounded-3xl text-center space-y-4 bg-foreground/2">
                       <FileText className="mx-auto text-foreground/10" size={32} />
                       <p className="text-[10px] font-bold text-foreground/30 leading-relaxed">
                         {session ? "You haven't created any CVs yet." : "Login to use your saved CVs."}
                       </p>
                       <Link 
                        href={session ? "/templates" : "/login"}
                        className="inline-block px-6 py-3 bg-emerald-500/10 text-emerald-500 rounded-xl font-black text-[9px] uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                       >
                         {session ? "Create CV" : "Login Now"}
                       </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] p-8 space-y-6">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Quick Summary</h3>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs font-bold text-foreground/60">
                       <Calendar size={16} className="text-emerald-500" />
                       <span>Type: {scholarship.type || 'Scholarship'}</span>
                    </div>
                    {scholarship.deadline && (
                    <div className="flex items-center gap-4 text-xs font-bold text-foreground/60">
                       <Clock size={16} className="text-emerald-500" />
                       <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                    </div>
                    )}
                    <div className="flex items-center gap-4 text-xs font-bold text-foreground/60">
                       <Globe size={16} className="text-emerald-500" />
                       <span>Location: {scholarship.country || 'International'}</span>
                    </div>
                 </div>
              </div>

            </div>
          </aside>
        </div>

        {/* CV Banner for Global Scholarships */}
        <div className="mt-24">
          <CVBanner />
        </div>
      </main>
    </div>
  )
}
