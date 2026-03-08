import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { 
  Users, 
  FileText, 
  Download, 
  PlusCircle, 
  TrendingUp, 
  ShieldCheck,
  Calendar,
  Search,
  Activity,
  UserPlus
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default async function AdminDashboardPage() {
  const session = await auth()

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/")
  }

  // Fetch stats with error handling
  let userCount = 0
  let cvsCount = 0
  let draftCvsCount = 0
  let downloadedCvsCount = 0
  let recentUsers: any[] = []
  let recentCvs: any[] = []

  try {
    const [
      uCount,
      cCount,
      dCount,
      dlCount,
      rUsers,
      rCvs
    ] = await Promise.all([
      prisma.user.count(),
      prisma.cV.count(),
      prisma.cV.count({ where: { status: "DRAFT" } }),
      prisma.cV.count({ where: { status: "DOWNLOADED" } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 6
      }),
      prisma.cV.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true
            }
          }
        }
      })
    ])

    userCount = uCount
    cvsCount = cCount
    draftCvsCount = dCount
    downloadedCvsCount = dlCount
    recentUsers = rUsers
    recentCvs = rCvs
  } catch (error) {
    console.error("Dashboard data fetch failed:", error)
    // We'll show the dashboard with 0 stats if DB is down
  }

  const stats = [
    { name: "Total Members", value: userCount, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Active Assets", value: cvsCount, icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Blueprints", value: draftCvsCount, icon: PlusCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
    { name: "Total Exports", value: downloadedCvsCount, icon: Download, color: "text-green-500", bg: "bg-green-500/10" },
  ]

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-brand-action">
            <Activity size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Network Authority</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight leading-none">System <span className="text-brand-action">Intelligence</span></h1>
          <p className="text-muted-foreground font-medium">Real-time heuristics and member management console.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <Link href="/admin/jobs" className="flex items-center space-x-2 bg-secondary hover:bg-secondary/80 px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all">
              Jobs Forge
           </Link>
           <Link href="/admin/users" className="flex items-center space-x-2 bg-secondary hover:bg-secondary/80 px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all">
              Registry
           </Link>
           <Link href="/admin/cvs" className="flex items-center space-x-2 bg-brand-action text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-action/20 hover:translate-y-[-2px] transition-all">
              Audit Assets
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-20">
        {stats.map((stat) => (
          <div key={stat.name} className="group bg-card glass rounded-[24px] p-6 shadow-sm hover:border-brand-action/20 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">{stat.name}</h3>
              <p className="text-3xl font-black text-foreground tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-card glass rounded-[24px] p-4 shadow-sm relative z-20 h-fit">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight text-foreground">Recently <span className="text-brand-action">Joined</span></h2>
            <Link href="/admin/users" className="text-[10px] font-black text-brand-action hover:underline uppercase tracking-widest">View All</Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentUsers.map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-secondary/5 transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                     {user.image ? (
                         <img src={user.image} className="w-8 h-8 rounded-lg border border-white/10 group-hover:scale-105 transition-transform object-cover" />
                     ) : (
                      <div className="w-8 h-8 rounded-lg bg-brand-action/10 border border-brand-action/10 flex items-center justify-center text-brand-action font-black text-[10px]">
                          {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
                      </div>
                     )}
                  </div>
                  <div>
                    <p className="text-xs font-black text-foreground">{user.name || "Member"}</p>
                    <p className="text-[9px] text-muted-foreground font-bold truncate max-w-[120px]">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">
                    {formatDistanceToNow(new Date(user.createdAt))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent CVs */}
        <div className="bg-card glass rounded-[24px] p-4 shadow-sm relative z-20 h-fit">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight text-foreground">Recent <span className="text-purple-500">Assets</span></h2>
            <Link href="/admin/cvs" className="text-[10px] font-black text-purple-500 hover:underline uppercase tracking-widest">Grid View</Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentCvs.map((cv) => (
              <div key={cv.id} className="p-4 flex items-center justify-between hover:bg-secondary/5 transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/10 group-hover:bg-purple-500 group-hover:text-white transition-all">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-foreground truncate">{cv.name}</p>
                    <p className="text-[9px] text-muted-foreground font-bold truncate max-w-[120px]">{cv.user.name || cv.user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                   <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{cv.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
