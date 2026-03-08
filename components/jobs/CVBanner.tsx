"use client"

import { 
  Sparkles, 
  ArrowRight, 
  FileText 
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function CVBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group bg-linear-to-br from-brand-action/20 via-brand-action/5 to-transparent border border-brand-action/40 rounded-[32px] p-8 md:p-10 overflow-hidden shadow-2xl shadow-brand-action/5"
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-action/20 rounded-full text-[9px] font-black uppercase tracking-widest text-brand-action">
            <Sparkles size={12} />
            ATS Optimization Ready
          </div>
          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
            Apply with the <br /> 
            <span className="text-brand-action">Perfect CV</span>
          </h3>
          <p className="text-foreground/50 font-bold max-w-md leading-relaxed text-sm">
            Tired of being ghosted? Our AI-optimized templates are designed to beat the bots and impress recruiters. Choose your base below.
          </p>
        </div>
        <Link 
          href="/templates" 
          className="flex items-center gap-4 px-10 py-5 bg-brand-action hover:bg-brand-action/90 text-white rounded-[24px] font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-brand-action/30 shrink-0"
        >
          <FileText size={20} />
          Choose CV Template
          <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-action/10 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-action/5 blur-[60px] rounded-full pointer-events-none" />
      <FileText size={260} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 opacity-[0.03] text-brand-secondary pointer-events-none -rotate-12" />
    </motion.div>
  )
}
