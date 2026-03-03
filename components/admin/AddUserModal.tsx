"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, UserPlus, Loader2, Shield, User as UserIcon } from "lucide-react"
import { adminCreateUser } from "@/lib/actions"
import { message } from "antd"
import { motion, AnimatePresence } from "framer-motion"

export function AddUserModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "USER" as "USER" | "ADMIN"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    
    const res = await adminCreateUser(formData)
    
    if (res.success) {
      message.success(res.message)
      setIsOpen(false)
      setFormData({ name: "", email: "", phone: "", role: "USER" })
      router.refresh()
    } else {
      message.error(res.error)
    }
    setIsPending(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative group flex items-center space-x-3 bg-brand-action text-white px-6 py-3.5 rounded-[20px] font-black text-sm hover:-translate-y-1 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(var(--brand-action),0.5)] active:scale-95 overflow-hidden"
      >
         <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-[20px]" />
         <UserPlus size={18} className="relative z-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
         <span className="relative z-10">Add New Member</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 sm:px-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30, rotateX: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30, rotateX: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md bg-card/90 backdrop-blur-2xl border border-white/10 dark:border-white/5 shadow-2xl rounded-[32px] overflow-hidden"
              style={{ transformPerspective: 1000 }}
            >
              {/* Header Gradient Overlay */}
              <div className="absolute top-0 left-0 right-0 h-40 bg-linear-to-br from-brand-action/20 via-transparent to-transparent opacity-60 pointer-events-none" />

              <div className="relative p-6 sm:p-8 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-linear-to-br from-brand-action to-brand-action/80 rounded-[20px] flex items-center justify-center text-white shadow-lg shadow-brand-action/30">
                       <UserPlus size={24} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black tracking-tight text-foreground leading-none">New Identity</h2>
                       <p className="text-[10px] uppercase font-black tracking-widest text-brand-action mt-1.5 opacity-80">Manual Deployment</p>
                    </div>
                 </div>
                 <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-xl transition-all bg-secondary/50 text-muted-foreground hover:text-foreground active:rotate-90">
                    <X size={18} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="relative p-6 sm:p-8 pt-0 space-y-6">
                 <div className="space-y-5">
                    <div className="space-y-2 group">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 group-focus-within:text-brand-action transition-colors">Full Name</label>
                       <input 
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g. John Doe"
                          className="w-full bg-secondary/30 border border-white/5 focus:border-brand-action/50 focus:bg-secondary/50 rounded-[20px] px-5 py-4 text-sm font-bold outline-none transition-all text-foreground placeholder:text-muted-foreground/30 shadow-inner"
                       />
                    </div>

                    <div className="space-y-2 group">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 group-focus-within:text-brand-action transition-colors">Email Address</label>
                       <input 
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="john@example.com"
                          className="w-full bg-secondary/30 border border-white/5 focus:border-brand-action/50 focus:bg-secondary/50 rounded-[20px] px-5 py-4 text-sm font-bold outline-none transition-all text-foreground placeholder:text-muted-foreground/30 shadow-inner"
                       />
                    </div>

                    <div className="space-y-2 group">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 group-focus-within:text-brand-action transition-colors">Phone Number (Password)</label>
                       <input 
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="e.g. 1234567890"
                          className="w-full bg-secondary/30 border border-white/5 focus:border-brand-action/50 focus:bg-secondary/50 rounded-[20px] px-5 py-4 text-sm font-bold outline-none transition-all text-foreground placeholder:text-muted-foreground/30 shadow-inner"
                       />
                    </div>

                 </div>

                 <button 
                    disabled={isPending}
                    className="relative w-full overflow-hidden bg-brand-action text-white py-5 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-action/20 hover:shadow-brand-action/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none group mt-8"
                 >
                    <div className="absolute top-0 bottom-0 -left-full w-[200%] bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-0 group-hover:translate-x-1/2 transition-transform duration-1000 ease-in-out" />
                    {isPending ? <Loader2 size={18} className="animate-spin" /> : (
                       <div className="flex items-center gap-2 relative z-10">
                          <span>Deploy Credentials</span>
                          <UserPlus size={16} className="opacity-70 group-hover:rotate-12 transition-transform" />
                       </div>
                    )}
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
