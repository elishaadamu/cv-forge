import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { 
  Users, 
  Search,
  Calendar,
  Shield,
  User as UserIcon,
  Filter,
  MoreVertical,
  Mail,
  Eye,
  Trash2,
  Plus,
  UserPlus
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { AdminFilters } from "@/components/admin/AdminFilters"
import { UserActions } from "@/components/admin/UserActions"
import { AddUserModal } from "@/components/admin/AddUserModal"

export default async function AdminUsersPage({
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
  const roleFilter = (resolvedSearchParams.role as string) || undefined
  const currentPage = Number(resolvedSearchParams.page) || 1
  const pageSize = 10

  const where = {
    AND: [
      {
        OR: [
          { name: { contains: query, mode: 'insensitive' as const } },
          { email: { contains: query, mode: 'insensitive' as const } },
        ],
      },
      roleFilter ? { role: roleFilter as any } : {},
    ],
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: {
        _count: {
          select: { cvs: true }
        }
      }
    }),
    prisma.user.count({ where }),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-brand-action">
            <Users size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Global Repository</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">System Users</h1>
          <p className="text-muted-foreground font-medium">Manage permissions and monitor network growth</p>
        </div>
        
        <AddUserModal />
      </div>

      {/* Filters & Search */}
      <div className="bg-card glass border border-gray-300 dark:border-gray-800 rounded-[24px] p-4 shadow-sm relative z-40">
        <AdminFilters 
          placeholder="Filter by name or email..." 
          filterKey="role"
          filterOptions={[
            { label: "Standard Members", value: "USER" },
            { label: "Administrators", value: "ADMIN" }
          ]}
        />
      </div>

      {/* User Table */}
      <div className="bg-card glass rounded-[24px] p-4 shadow-sm relative z-10">
        <div className="overflow-x-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/20   border-b border-gray-300 dark:border-white/10">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground rounded-tl-[24px]">Identity</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground text-center">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground text-center">Assets</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Joined</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground text-right rounded-tr-[24px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/50 transition-colors group relative">
                  <td className="px-6 py-4 relative">
                    <div className="flex items-center space-x-3">
                      {user.image ? (
                         <img src={user.image} alt="" className="w-10 h-10 rounded-xl object-cover group-hover:opacity-100 transition-all" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-brand-action/5 flex items-center justify-center text-brand-action font-black text-xs">
                            {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm truncate">{user.name || "Anonymous"}</span>
                        <span className="text-[10px] text-muted-foreground truncate font-medium">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center relative">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        (user as any).role === "ADMIN" 
                          ? "bg-indigo-500/10 text-indigo-500" 
                          : "bg-secondary text-muted-foreground"
                      }`}>
                        {(user as any).role}
                      </div>
                  </td>
                  <td className="px-6 py-4 text-center relative">
                      <span className="text-sm font-black">{user._count.cvs}</span>
                  </td>
                  <td className="px-6 py-4 relative">
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {formatDistanceToNow(new Date(user.createdAt))} ago
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative overflow-visible">
                     <UserActions userId={user.id} userRole={(user as any).role as any} userName={user.name || user.email || ""} />
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                     <div className="flex flex-col items-center justify-center space-y-4 opacity-50">
                        <Users size={64} className="text-muted-foreground" />
                        <h3 className="text-2xl font-black text-foreground">Registry Empty</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">No matching identities found in our database.</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 text-sm font-medium">
         <div className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">
            Showing <span className="text-foreground">{(currentPage - 1) * pageSize + 1}</span> - <span className="text-foreground">{Math.min(currentPage * pageSize, totalCount)}</span> of <span className="text-foreground">{totalCount} members</span>
         </div>
         
         {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/admin/users?page=${p}${query ? `&q=${query}` : ""}${roleFilter ? `&role=${roleFilter}` : ""}`}
                  className={`h-10 px-4 flex items-center justify-center rounded-xl font-black transition-all ${
                    currentPage === p 
                      ? "bg-brand-action text-white shadow-lg shadow-brand-action/20" 
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
         )}
      </div>
    </div>
  )
}
