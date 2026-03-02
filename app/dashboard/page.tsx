"use client"

import { useSession } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, FileText, Clock, Trash2, Edit3, ArrowUpRight, LayoutDashboard, RefreshCcw, LogIn, Sparkles } from "lucide-react"
import Link from "next/link"
import { listCVs, deleteCV } from "@/lib/actions"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Modal, message } from "antd"
import { ExclamationCircleFilled } from "@ant-design/icons"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [cvs, setCvs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'DRAFT' | 'COMPLETED' | 'DOWNLOADED'>('DRAFT')

  // Hydration fix
  useEffect(() => {
    setMounted(true)
    console.log("DASHBOARD: Mounted. Status:", status)
  }, [status])

  const fetchCVs = async () => {
    const userId = session?.user?.id || (session?.user as any)?.sub
    console.log("DASHBOARD_FETCH: Triggered. Status:", status, "UserId:", userId)
    
    if (!userId) {
      if (status === "unauthenticated") {
        setIsLoading(false)
        setError("Your session has expired. Please log in to continue.")
      }
      // If status is still 'loading', we just wait.
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const res = await listCVs(userId)
      console.log("DASHBOARD_FETCH: Response Success:", !!res.success)
      if (res.success && res.cvs) {
        setCvs(res.cvs)
      } else {
        setError(res.error || "We couldn't reach your drafts right now.")
      }
    } catch (err) {
      console.error("DASHBOARD_FETCH: Fatal Error:", err)
      setError("The Forge is experiencing a heavy load. Please retry in a moment.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Only fetch if we are definitively authenticated
    if (status === "authenticated" && mounted) {
      fetchCVs()
    } else if (status === "unauthenticated" && mounted) {
      // Small delay to allow session sync in case of fast redirection
      const timer = setTimeout(() => {
        setIsLoading(false)
        setError("Your session has expired. Please log in to continue.")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [session, status, mounted])

  const showDeleteConfirm = (id: string) => {
    Modal.confirm({
      title: "Delete this CV?",
      icon: <ExclamationCircleFilled />,
      content: "This action will permanently remove your forged CV. This cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        const userId = session?.user?.id || (session?.user as any)?.sub
        if (!userId) return
        try {
          const res = await deleteCV(id, userId)
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

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-brand-action selection:text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-action/10 rounded-full text-brand-action border border-brand-action/20">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Career Hub</span>
            </div>
            <h1 className="text-6xl font-black tracking-tight leading-none text-foreground">
              Your <span className="text-brand-action">Dashboard</span>
            </h1>
            <p className="text-foreground/40 font-medium max-w-sm">
              Welcome back, {session?.user?.name?.split(' ')[0] || "member"}. Your career assets are ready for your next move.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            {/* Tab Filters */}
            <div className="flex bg-white/5 p-1.5 rounded-[24px] border border-border-custom backdrop-blur-xl">
              {(['DRAFT', 'COMPLETED', 'DOWNLOADED'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                      ? "bg-brand-action text-white shadow-lg shadow-brand-action/20" 
                      : "text-foreground/40 hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {tab === 'DRAFT' ? 'Blueprints' : tab === 'COMPLETED' ? 'Finished' : 'Acquired'}
                </button>
              ))}
            </div>

            <Link 
              href="/builder"
              className="px-8 py-5 bg-linear-to-r from-brand-action to-brand-secondary text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all flex items-center space-x-3 active:scale-95 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
              <span>New CV</span>
            </Link>
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-40 space-y-8"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-brand-action/10 border-t-brand-action rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCcw className="text-brand-action/40 animate-spin-reverse" size={32} />
                </div>
              </div>
              <div className="text-center space-y-2">
                <span className="text-xl font-black uppercase tracking-[0.3em] text-foreground/40 block">Loading Your Profile</span>
                <p className="text-sm text-foreground/20 italic font-medium">Synchronizing your professional data...</p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/5 border border-red-500/20 rounded-[48px] p-16 text-center space-y-8 max-w-2xl mx-auto shadow-2xl"
            >
              <div className="w-24 h-24 bg-red-500/10 rounded-[32px] flex items-center justify-center text-red-500 mx-auto transform rotate-6 hover:rotate-0 transition-transform duration-500">
                <ExclamationCircleFilled style={{ fontSize: '40px' }} />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-black italic">Access Restricted</h2>
                <p className="text-foreground/50 font-medium text-lg">{error}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={fetchCVs}
                  className="px-10 py-4 bg-brand-action text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-brand-action/20"
                >
                  Force Retry
                </button>
                <Link 
                  href="/login"
                  className="px-10 py-4 bg-white/5 border border-border-custom hover:border-foreground rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center"
                >
                  <LogIn size={16} className="mr-2" />
                  Relogin
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={`${activeTab}-grid`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
              {activeTab === 'DRAFT' && (
                <Link href="/builder" className="group relative h-[420px] rounded-[56px] border-4 border-dashed border-border-custom hover:border-brand-action/40 transition-all flex flex-col items-center justify-center space-y-8 hover:bg-brand-action/5 active:scale-95 overflow-hidden">
                  <div className="w-28 h-28 bg-white/5 rounded-[36px] flex items-center justify-center text-foreground/10 group-hover:text-brand-action group-hover:bg-brand-action/20 group-hover:rotate-12 transition-all duration-700 shadow-inner">
                    <Plus size={56} />
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-3xl font-black text-foreground/20 group-hover:text-brand-action transition-colors block">Create New</span>
                    <span className="text-xs font-black uppercase tracking-[0.5em] text-foreground/5 group-hover:text-brand-action/40">Start Building</span>
                  </div>
                </Link>
              )}

              {cvs.filter(cv => cv.status === activeTab).map((cv, i) => (
                <motion.div
                   key={cv.id}
                   layout
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ duration: 0.4 }}
                   className="relative h-[420px] bg-white/5 border border-border-custom rounded-[56px] p-12 hover:border-brand-action/50 hover:bg-white/10 transition-all group overflow-hidden shadow-2xl hover:shadow-brand-action/10"
                >
                  <div className="absolute top-10 right-12 z-20 flex flex-col items-end gap-2">
                    <div className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-full border backdrop-blur-md ${
                      cv.status === 'COMPLETED' ? 'bg-brand-success/10 text-brand-success border-brand-success/20' :
                      cv.status === 'DOWNLOADED' ? 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20' :
                      'bg-brand-action/10 text-brand-action border-brand-action/20'
                    }`}>
                      {cv.status === 'COMPLETED' ? 'Finished' : cv.status === 'DOWNLOADED' ? 'Acquired' : 'Draft'}
                    </div>
                  </div>
                  
                  <div className="h-full flex flex-col justify-between relative z-10">
                    <div className="space-y-10">
                      <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-xl border ${
                        cv.status === 'COMPLETED' ? 'bg-brand-success/10 text-brand-success border-brand-success/10' :
                        cv.status === 'DOWNLOADED' ? 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/10' :
                        'bg-brand-action/10 text-brand-action border-brand-action/10'
                      }`}>
                        <FileText size={48} />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-4xl font-black tracking-tighter leading-none line-clamp-2 text-foreground group-hover:text-brand-action transition-colors">{cv.name || "Untitled CV"}</h3>
                        <div className="flex items-center space-x-3 text-xs text-foreground/30 font-bold uppercase tracking-widest">
                          <Clock size={16} className="text-brand-action/40" />
                          <span>Modified {formatDistanceToNow(new Date(cv.updatedAt))} ago</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                       <Link 
                         href={`/builder/${cv.id}`} 
                         className="flex-1 h-20 bg-brand-action text-white hover:bg-white hover:text-brand-action transition-all rounded-[32px] flex items-center justify-center font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 group/btn"
                       >
                         <Edit3 size={24} className="mr-3 group-hover/btn:scale-120 transition-transform" />
                         {cv.status === 'DRAFT' ? 'Forge' : 'Refine'}
                       </Link>
                       <button 
                         onClick={() => showDeleteConfirm(cv.id)}
                         className="w-20 h-20 bg-white/5 border border-border-custom text-red-500/40 hover:bg-red-500 hover:text-white hover:border-transparent rounded-[32px] transition-all shadow-sm active:scale-95 flex items-center justify-center"
                       >
                         <Trash2 size={28} />
                       </button>
                    </div>
                  </div>

                  <ArrowUpRight size={240} className="absolute -bottom-24 -right-24 text-foreground/5 group-hover:text-brand-action/10 transition-colors duration-1000 pointer-events-none stroke-3" />
                </motion.div>
              ))}

              {cvs.filter(cv => cv.status === activeTab).length === 0 && activeTab !== 'DRAFT' && (
                <div className="col-span-full py-20 text-center space-y-6">
                  <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto text-foreground/10 border border-dashed border-border-custom">
                    <FileText size={64} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-foreground/40 italic">Nothing forged yet</h3>
                    <p className="text-sm text-foreground/20 font-medium">Build your first CV to see it appear here.</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Decorative Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-10">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-action rounded-full blur-[250px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-primary rounded-full blur-[250px]" />
      </div>
    </div>
  )
}
