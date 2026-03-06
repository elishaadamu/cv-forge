import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { 
  FileText, 
  Search,
  Calendar,
  User as UserIcon,
  Download,
  Filter,
  Eye,
  Trash2,
  Database,
  ArrowUpRight
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { AdminFilters } from "@/components/admin/AdminFilters"
import { CVActions } from "@/components/admin/CVActions"

export default async function AdminCVsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth()

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/")
  }

  const resolvedSearchParams = await searchParams
  const query = (resolvedSearchParams.q as string) || ""
  const statusFilter = (resolvedSearchParams.status as string) || undefined
  const currentPage = Number(resolvedSearchParams.page) || 1
  const pageSize = 12

  const where = {
    AND: [
      {
        OR: [
          { name: { contains: query, mode: 'insensitive' as const } },
          { user: { name: { contains: query, mode: 'insensitive' as const } } },
          { user: { email: { contains: query, mode: 'insensitive' as const } } },
        ],
      },
      statusFilter ? { status: statusFilter } : {},
    ],
  }

  const [cvs, totalCount] = await Promise.all([
    prisma.cV.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          }
        }
      }
    }),
    prisma.cV.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-brand-action">
            <Database size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Global Asset Grid</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight leading-none">Database <span className="text-brand-action">Assets</span></h1>
          <p className="text-muted-foreground font-medium">Monitoring and auditing every professional record.</p>
        </div>
        
        <div className="flex bg-secondary/30 p-1.5 rounded-2xl">
           <div className="px-6 py-3 rounded-xl bg-card shadow-sm flex flex-col items-center">
              <span className="text-2xl font-black text-brand-action">{totalCount}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Total CVs</span>
           </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card glass border border-gray-300 rounded-[24px] p-4 shadow-sm relative z-40">
        <AdminFilters 
          placeholder="Search by title or member..." 
          filterKey="status"
          filterOptions={[
            { label: "DRAFT (Blueprints)", value: "DRAFT" },
            { label: "COMPLETED (Finalized)", value: "COMPLETED" },
            { label: "DOWNLOADED (Exported)", value: "DOWNLOADED" }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
        {cvs.map((cv) => (
          <div key={cv.id} className="group bg-card glass rounded-[24px] p-4 shadow-sm relative z-20 overflow-visible">
              <div className="absolute top-4 right-4 z-20">
                  <CVActions cvId={cv.id} cvName={cv.name} />
              </div>

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 ${
                  cv.status === 'DOWNLOADED' ? 'bg-green-500/10 text-green-500' :
                  cv.status === 'COMPLETED' ? 'bg-brand-action/10 text-brand-action' :
                  'bg-orange-500/10 text-orange-500'
              }`}>
                  <FileText size={24} />
              </div>

              <div className="space-y-3 mb-6">
                  <h3 className="text-lg font-black leading-tight line-clamp-2 text-foreground/90 transition-colors h-12">
                      {cv.name || "Untitled CV"}
                  </h3>
                  
                  <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                           {cv.user.image ? (
                              <img src={cv.user.image} className="w-6 h-6 rounded-lg object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                           ) : (
                              <div className="w-6 h-6 rounded-lg bg-secondary flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                                  {cv.user.name?.charAt(0) || "U"}
                              </div>
                           )}
                           <span className="text-[10px] font-bold truncate text-muted-foreground">{cv.user.name || cv.user.email}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                         <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">{formatDistanceToNow(new Date(cv.updatedAt))} ago</span>
                         <span className={`text-[8px] font-black tracking-widest px-2 py-0.5 rounded-lg ${
                             cv.status === 'DOWNLOADED' ? 'bg-green-500/10 text-green-500' :
                             cv.status === 'COMPLETED' ? 'bg-brand-action/10 text-brand-action' :
                             'bg-orange-500/10 text-orange-500'
                         }`}>
                             {cv.status}
                         </span>
                      </div>
                  </div>
              </div>

              <div className="flex items-center gap-2">
                 <Link href={`/builder?cvId=${cv.id}`} className="flex-1 py-2.5 bg-secondary hover:bg-brand-action hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center shadow-sm">
                    Audit Assets
                 </Link>
              </div>
          </div>
        ))}

        {cvs.length === 0 && (
          <div className="col-span-full py-32 text-center space-y-4 opacity-50">
             <FileText size={80} className="mx-auto text-muted-foreground" />
             <h3 className="text-2xl font-black italic">No records in this grid</h3>
             <p className="text-sm font-medium">Try another search or reset the filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
         <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
               Registry Data: <span className="text-foreground">{totalCount} items found</span>
            </div>
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/admin/cvs?page=${p}${query ? `&q=${query}` : ""}${statusFilter ? `&status=${statusFilter}` : ""}`}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black transition-all ${
                    currentPage === p 
                      ? "bg-brand-action text-white shadow-xl shadow-brand-action/30 scale-110" 
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
         </div>
      )}
    </div>
  )
}
