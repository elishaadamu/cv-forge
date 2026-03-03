"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Trash2, 
  MoreHorizontal,
  Loader2,
  FileSearch,
  DownloadCloud
} from "lucide-react"
import { adminDeleteCV } from "@/lib/actions"
import { message, Modal } from "antd"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface CVActionsProps {
  cvId: string
  cvName: string
}

export function CVActions({ cvId, cvName }: CVActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleDelete = () => {
    setIsOpen(false)
    Modal.confirm({
      title: `Confirm Purge`,
      content: `Are you certain you want to permanently delete the professional record "${cvName}"? This action is irreversible.`,
      okText: "Yes, Purge Record",
      okType: "danger",
      cancelText: "Retreat",
      onOk: async () => {
        setIsUpdating(true)
        const res = await adminDeleteCV(cvId)
        if (res.success) {
          message.success("Asset purged from grid system")
          router.refresh()
        } else {
          message.error(res.error)
        }
        setIsUpdating(false)
      }
    })
  }

  return (
    <div className="relative inline-block text-left">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 bg-secondary/30 hover:bg-secondary rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-all active:scale-95 shadow-sm"
      >
        <MoreHorizontal size={16} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-100" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-2 w-56 p-1.5 bg-card border border-border shadow-2xl rounded-2xl z-110 backdrop-blur-xl"
            >
              <div className="px-3 py-2 border-b border-border/10 mb-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-80">Asset Controls</p>
              </div>
              
              <Link 
                  href={`/builder/${cvId}`}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-secondary text-[11px] font-black uppercase tracking-wider transition-all text-foreground"
              >
                  <FileSearch size={14} className="text-brand-action" />
                  <span>Audit Document</span>
              </Link>

              <button 
                  onClick={() => message.info("Mock backup initiated")}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-secondary text-[11px] font-black uppercase tracking-wider transition-all text-foreground"
              >
                  <DownloadCloud size={14} className="text-indigo-500" />
                  <span>Backup Asset</span>
              </button>

              <button 
                  onClick={handleDelete}
                  disabled={isUpdating}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-red-500/10 text-red-500 text-[11px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
              >
                  <Trash2 size={14} />
                  <span>Purge Record</span>
              </button>

              {isUpdating && (
                  <div className="flex items-center justify-center p-2">
                     <Loader2 size={14} className="animate-spin text-brand-action" />
                  </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
