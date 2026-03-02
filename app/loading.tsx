"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center space-y-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <div className="w-20 h-20 rounded-3xl bg-brand-action/10 border-2 border-brand-action/20 flex items-center justify-center text-brand-action shadow-2xl shadow-brand-action/20">
          <Loader2 size={40} className="animate-spin" />
        </div>
        
        {/* Decorative pulses */}
        <motion.div 
          animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-3xl bg-brand-action"
        />
      </motion.div>
      
      <div className="space-y-1 text-center">
        <h3 className="text-xl font-black tracking-tight">Forging Excellence</h3>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">Preparing your professional workspace</p>
      </div>
    </div>
  )
}
