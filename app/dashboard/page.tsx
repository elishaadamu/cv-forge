"use client"

import { useSession } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
import { motion } from "framer-motion"
import { Plus, FileText, Clock, Trash2, Edit3, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { listCVs, deleteCV } from "@/lib/actions"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Loader2 } from "lucide-react"
import { Modal, message } from "antd"
import { ExclamationCircleFilled } from "@ant-design/icons"

export default function DashboardPage() {
  const { data: session } = useSession()
  const [cvs, setCvs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCVs = async () => {
    if (!session?.user?.id) return
    setIsLoading(true)
    const res = await listCVs(session.user.id)
    if (res.success && res.cvs) {
      setCvs(res.cvs)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCVs()
  }, [session])

  const showDeleteConfirm = (id: string) => {
    Modal.confirm({
      title: "Delete this CV?",
      icon: <ExclamationCircleFilled />,
      content: "This action will permanently remove your forged CV. This cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        if (!session?.user?.id) return
        try {
          const res = await deleteCV(id, session.user.id)
          if (res.success) {
            message.success("CV deleted successfully")
            fetchCVs()
          } else {
            message.error(res.error || "Failed to delete CV")
          }
        } catch (error) {
          message.error("An error occurred during deletion")
        }
      },
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1"
          >
            <h1 className="text-4xl font-black tracking-tight">Your <span className="text-brand-action">Forge</span></h1>
            <p className="text-foreground/50 font-medium">Welcome back, {session?.user?.name?.split(' ')[0] || "member"}. Keep forging your future.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link 
              href="/builder"
              className="px-10 py-5 bg-linear-to-r from-orange-500 to-brand-action text-white rounded-[24px] font-black text-xl shadow-[0_20px_50px_-10px_rgba(231,111,60,0.5)] hover:shadow-[0_30px_70px_-10px_rgba(231,111,60,0.7)] hover:-translate-y-1 transition-all flex items-center space-x-3 active:scale-95 group"
            >
              <Plus size={28} className="group-hover:rotate-90 transition-transform duration-500" />
              <span>Forge New CV</span>
            </Link>
          </motion.div>
        </header>

        {/* CV Grid Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Create New CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative h-80 rounded-[40px] border-2 border-dashed border-border-custom hover:border-brand-action/50 transition-all flex flex-col items-center justify-center space-y-4 cursor-pointer hover:bg-brand-action/5 active:scale-95"
          >
            <Link href="/builder" className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-foreground/20 group-hover:text-brand-action group-hover:bg-brand-action/10 transition-colors">
                <Plus size={32} />
              </div>
              <span className="text-lg font-bold text-foreground/40 group-hover:text-brand-action transition-colors">Start a new project</span>
            </Link>
          </motion.div>

          {/* Real CV Items */}
          {isLoading ? (
            <div className="h-80 col-span-1 md:col-span-2 lg:col-span-1 rounded-[40px] bg-white/5 border border-border-custom flex flex-col items-center justify-center space-y-4">
              <Loader2 className="animate-spin text-brand-action" size={32} />
              <span className="text-sm font-black uppercase tracking-widest text-foreground/20">Loading Forge...</span>
            </div>
          ) : (
            cvs.map((cv, i) => (
              <motion.div
                 key={cv.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 * (i + 1) }}
                 className="relative h-80 bg-white/5 border border-border-custom rounded-[40px] p-8 hover:border-brand-action/30 hover:bg-white/10 transition-all group overflow-hidden"
              >
                <div className="absolute top-6 right-8">
                  <div className="px-3 py-1 bg-brand-success/10 text-brand-success text-[10px] font-black uppercase tracking-wider rounded-full border border-brand-success/20">
                    {i === 0 ? "Latest Draft" : "Saved"}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="w-14 h-14 bg-brand-action/10 rounded-2xl flex items-center justify-center text-brand-action">
                    <FileText size={28} />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-xl font-black tracking-tight line-clamp-1">{cv.name || "Untitled CV"}</h3>
                    <div className="flex items-center space-x-2 text-sm text-foreground/40 font-bold">
                      <Clock size={14} />
                      <span>Modified {formatDistanceToNow(new Date(cv.updatedAt))} ago</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-4">
                     <Link 
                       href={`/builder/${cv.id}`} 
                       className="flex-1 h-14 bg-white/5 border border-white/10 hover:bg-brand-action hover:border-transparent hover:text-white transition-all rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-widest shadow-sm active:scale-95 group"
                     >
                       <Edit3 size={16} className="mr-2 group-hover:scale-110 transition-transform" />
                       Review & Edit
                     </Link>
                     <button 
                       onClick={() => showDeleteConfirm(cv.id)}
                       className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
                       title="Delete project"
                     >
                       <Trash2 size={20} />
                     </button>
                  </div>
                </div>

                <ArrowUpRight size={100} className="absolute -bottom-8 -right-8 text-foreground/5 group-hover:text-brand-action/10 transition-colors pointer-events-none" />
              </motion.div>
            ))
          )}
        </section>

        {/* Stats / Recent Activity */}
        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Active Designs", val: "1", col: "text-brand-action" },
            { label: "Templates Explored", val: "12", col: "text-brand-secondary" },
            { label: "ATS Score (Avg)", val: "88%", col: "text-brand-success" }
          ].map((stat, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 + (i * 0.1) }}
               className="p-8 bg-white/5 border border-border-custom rounded-3xl"
             >
               <p className="text-xs font-black uppercase tracking-widest text-foreground/30 mb-1">{stat.label}</p>
               <h4 className={`text-4xl font-black ${stat.col}`}>{stat.val}</h4>
             </motion.div>
          ))}
        </section>
      </main>
    </div>
  )
}
