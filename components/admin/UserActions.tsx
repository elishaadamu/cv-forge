"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  Loader2,
  MoreHorizontal
} from "lucide-react"
import { deleteUser, updateUserRole } from "@/lib/actions"
import { message, Modal } from "antd"
import { motion, AnimatePresence } from "framer-motion"

interface UserActionsProps {
  userId: string
  userRole: "ADMIN" | "USER"
  userName: string
}

export function UserActions({ userId, userRole, userName }: UserActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const handleDelete = () => {
    setIsOpen(false)
    Modal.confirm({
      title: `Confirm Excision`,
      content: `Are you certain you want to permanently delete the identity: ${userName}? All associated data will be purged.`,
      okText: "Yes, Exterminate",
      okType: "danger",
      cancelText: "Retreat",
      onOk: async () => {
        setIsUpdating(true)
        const res = await deleteUser(userId)
        if (res.success) {
          message.success("Identity purged from main grid")
          router.refresh()
        } else {
          message.error(res.error)
        }
        setIsUpdating(false)
      }
    })
  }

  const handleToggleRole = async () => {
    const newRole = userRole === "ADMIN" ? "USER" : "ADMIN"
    setIsUpdating(true)
    const res = await updateUserRole(userId, newRole)
    if (res.success) {
        message.success(res.message)
        router.refresh()
    } else {
        message.error(res.error)
    }
    setIsUpdating(false)
    setIsOpen(false)
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
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-80">Identity Tools</p>
              </div>
              
              <button 
                  onClick={handleToggleRole}
                  disabled={isUpdating}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-secondary text-[11px] font-black uppercase tracking-wider transition-all disabled:opacity-50 text-foreground"
              >
                  {userRole === "ADMIN" ? (
                      <><ShieldAlert size={14} className="text-orange-500" /> <span className="text-orange-500">Demote Identity</span></>
                  ) : (
                      <><ShieldCheck size={14} className="text-brand-action" /> <span className="text-brand-action">Promote Identity</span></>
                  )}
              </button>

              <button 
                  onClick={handleDelete}
                  disabled={isUpdating}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-red-500/10 text-red-500 text-[11px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
              >
                  <Trash2 size={14} />
                  <span>Purge Identity</span>
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
