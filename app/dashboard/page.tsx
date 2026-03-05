"use client"

import { useSession } from "next-auth/react"
import { Navbar } from "@/components/Navbar"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, FileText, Clock, Trash2, Edit3, ArrowUpRight, LayoutDashboard, RefreshCcw, LogIn, Sparkles, CheckSquare, Square, ChevronRight, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { listCVs, deleteCV, deleteManyCVs } from "@/lib/actions"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Modal, message, Checkbox } from "antd"
import { ExclamationCircleFilled } from "@ant-design/icons"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [cvs, setCvs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<'DRAFT' | 'COMPLETED' | 'DOWNLOADED'>('DRAFT')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Hydration fix
  useEffect(() => {
    setMounted(true)
    console.log("DASHBOARD: Mounted. Status:", status)
  }, [status])

  const fetchCVs = async () => {
    const userId = session?.user?.id || (session?.user as any)?.sub
    if (!userId) {
      if (status === "unauthenticated") {
        setIsLoading(false)
        setError("Your session has expired. Please log in to continue.")
      }
      return
    }
    
    setIsLoading(true)
    setError(null)
    
    try {
      const res = await listCVs(userId)
      if (res.success && res.cvs) {
        setCvs(res.cvs)
      } else {
        setError(res.error || "We couldn't reach your drafts right now.")
      }
    } catch (err) {
      console.error("DASHBOARD_FETCH: Fatal Error:", err)
      setError("The system is experiencing a heavy load. Please retry in a moment.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated" && mounted) {
      fetchCVs()
    } else if (status === "unauthenticated" && mounted) {
      const timer = setTimeout(() => {
        setIsLoading(false)
        setError("Your session has expired. Please log in to continue.")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [session, status, mounted])

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    const currentTabCVs = cvs.filter(cv => cv.status === activeTab)
    if (selectedIds.length === currentTabCVs.length && currentTabCVs.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(currentTabCVs.map(cv => cv.id))
    }
  }

  const showDeleteConfirm = (id: string) => {
    Modal.confirm({
      title: "Delete this CV?",
      icon: <ExclamationCircleFilled />,
      content: "This action will permanently remove your created CV. This cannot be undone.",
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
            setSelectedIds(prev => prev.filter(i => i !== id))
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

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return
    Modal.confirm({
      title: `Delete ${selectedIds.length} CVs?`,
      icon: <ExclamationCircleFilled />,
      content: `This action will permanently remove ${selectedIds.length} selected items. This cannot be undone.`,
      okText: "Delete All",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        const userId = session?.user?.id || (session?.user as any)?.sub
        if (!userId) return
        try {
          const res = await deleteManyCVs(selectedIds, userId)
          if (res.success) {
            message.success(`${selectedIds.length} CVs deleted successfully`)
            setSelectedIds([])
            fetchCVs()
          } else {
            message.error(res.error || "Failed to delete items")
          }
        } catch (error) {
          message.error("An error occurred during bulk deletion")
        }
      }
    })
  }

  const filteredCVs = cvs.filter(cv => cv.status === activeTab)

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
              Welcome back, {session?.user?.name?.split(' ')[0] || "member"}. Your career assets are managed here.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col lg:flex-row items-center gap-6"
          >
            {/* Tab Filters */}
            <div className="flex bg-white/5 p-1.5 rounded-[24px] border border-border-custom backdrop-blur-xl shrink-0">
              {(['DRAFT', 'COMPLETED', 'DOWNLOADED'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab)
                    setSelectedIds([])
                  }}
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

            <div className="flex items-center gap-3">
              {selectedIds.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={handleBulkDelete}
                  className="px-6 py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center space-x-2 group"
                >
                  <Trash2 size={16} />
                  <span>Delete ({selectedIds.length})</span>
                </motion.button>
              )}
              
              <Link 
                href="/templates"
                className="px-8 py-4 bg-linear-to-r from-brand-action to-brand-secondary text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all flex items-center space-x-3 active:scale-95 group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                <span>New CV</span>
              </Link>
            </div>
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
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={`${activeTab}-table`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              {filteredCVs.length > 0 ? (
                <div className="overflow-x-auto rounded-[40px] border border-border-custom bg-white/[0.02] backdrop-blur-3xl shadow-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border-custom bg-white/[0.03]">
                        <th className="px-8 py-6 w-16">
                          <button 
                            onClick={toggleSelectAll}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              selectedIds.length === filteredCVs.length && filteredCVs.length > 0
                                ? "bg-brand-action border-brand-action text-white" 
                                : "border-border-custom hover:border-foreground/20"
                            }`}
                          >
                            {(selectedIds.length === filteredCVs.length && filteredCVs.length > 0) && <CheckSquare size={14} />}
                          </button>
                        </th>
                        <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Career Asset</th>
                        <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Layout</th>
                        <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Last Modified</th>
                        <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Status</th>
                        <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Management</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-custom/50">
                      {filteredCVs.map((cv) => (
                        <tr 
                          key={cv.id} 
                          className={`group hover:bg-brand-action/[0.03] transition-colors cursor-pointer ${selectedIds.includes(cv.id) ? 'bg-brand-action/[0.05]' : ''}`}
                          onClick={() => toggleSelect(cv.id)}
                        >
                          <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => toggleSelect(cv.id)}
                              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                selectedIds.includes(cv.id) 
                                  ? "bg-brand-action border-brand-action text-white" 
                                  : "border-border-custom hover:border-brand-action/40"
                              }`}
                            >
                              {selectedIds.includes(cv.id) && <CheckSquare size={14} />}
                            </button>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-2xl flex items-center justify-center shadow-lg border ${
                                cv.status === 'COMPLETED' ? 'bg-brand-success/10 text-brand-success border-brand-success/10' :
                                cv.status === 'DOWNLOADED' ? 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/10' :
                                'bg-brand-action/10 text-brand-action border-brand-action/10'
                              }`}>
                                <FileText size={20} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-black tracking-tight text-lg text-foreground group-hover:text-brand-action transition-colors">{cv.name || "Untitled CV"}</span>
                                <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">{cv.id.substring(0, 8)}...</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <span className="text-xs font-black uppercase tracking-widest text-foreground/50 bg-white/5 px-3 py-1 rounded-full border border-border-custom">
                              {cv.templateId || 'Standard'}
                            </span>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex items-center space-x-2 text-xs font-bold text-foreground/40 italic">
                               <Clock size={12} className="text-brand-action/40" />
                               <span>{formatDistanceToNow(new Date(cv.updatedAt))} ago</span>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className={`inline-flex px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] rounded-full border ${
                              cv.status === 'COMPLETED' ? 'bg-brand-success/10 text-brand-success border-brand-success/20' :
                              cv.status === 'DOWNLOADED' ? 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20' :
                              'bg-brand-action/10 text-brand-action border-brand-action/20'
                            }`}>
                              {cv.status === 'COMPLETED' ? 'Finished' : cv.status === 'DOWNLOADED' ? 'Acquired' : 'Draft'}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              {/* Modify/Edit link */}
                              <Link 
                                href={
                                  ["midnight"].includes(cv.templateId)
                                    ? `/builder?template=${cv.templateId}&cvId=${cv.id}`
                                    : `/builder/${cv.id}`
                                }
                                className="p-3 bg-brand-action/10 text-brand-action hover:bg-brand-action hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
                                title="Edit Asset"
                              >
                                <Edit3 size={18} />
                              </Link>
                              
                              <button 
                                onClick={() => showDeleteConfirm(cv.id)}
                                className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
                                title="Purge Asset"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-40 text-center space-y-8 bg-white/[0.02] border border-dashed border-border-custom rounded-[64px]">
                  <div className="w-32 h-32 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto text-foreground/10 border border-border-custom transform rotate-3 hover:rotate-0 transition-all duration-700">
                    <FileText size={64} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-foreground/30 italic">No Assets Found</h3>
                    <p className="text-sm text-foreground/10 font-bold uppercase tracking-widest max-w-xs mx-auto">Your professional catalog is empty. Begin your journey.</p>
                  </div>
                  <Link href="/builder" className="inline-flex px-10 py-5 bg-brand-action text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
                    Start building
                  </Link>
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
