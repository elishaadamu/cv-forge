"use client"

import { Navbar } from "@/components/Navbar"
import { motion } from "framer-motion"
import { CheckCircle2, ShieldCheck, Zap, BarChart3, Search, Info } from "lucide-react"

export default function ATSPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <header className="text-center space-y-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-action/10 rounded-full border border-brand-action/20 text-brand-action text-xs font-black uppercase tracking-widest mb-4"
          >
            <ShieldCheck size={14} />
            <span>ATS Compliance Engine v1.0</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight"
          >
            Analyze for <span className="text-brand-action">Success.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-foreground/50 max-w-2xl mx-auto font-medium"
          >
            Our AI-driven ATS analyzer checks your CV against modern recruitment filters to ensure you never get filtered out.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
           {/* Main Analyzer Mockup */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.3 }}
             className="lg:col-span-2 bg-white/5 border border-border-custom rounded-[40px] p-12 relative overflow-hidden group"
           >
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <h3 className="text-2xl font-black">CV Health Check</h3>
                       <p className="text-sm text-foreground/40 font-bold uppercase tracking-widest">Scanning technical keywords...</p>
                    </div>
                    <div className="w-20 h-20 rounded-3xl bg-brand-action/10 border border-brand-action/20 flex items-center justify-center text-brand-action">
                       <BarChart3 size={32} />
                    </div>
                 </div>

                 <div className="space-y-6">
                    {[
                      { label: "Keyword Optimization", score: 94, status: "Excellent" },
                      { label: "Formatting & Structure", score: 88, status: "Strong" },
                      { label: "Contact Info Visibility", score: 100, status: "Perfect" },
                      { label: "Measurable Achievements", score: 72, status: "Needs Work" },
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-end">
                           <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
                           <span className="text-xs font-black text-brand-action">{item.status} ({item.score}%)</span>
                        </div>
                        <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${item.score}%` }}
                             transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                             className="h-full bg-brand-action rounded-full shadow-[0_0_10px_rgba(var(--brand-action-rgb),0.5)]" 
                           />
                        </div>
                      </div>
                    ))}
                 </div>

                 <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex -space-x-3">
                       {[1,2,3,4].map(i => (
                          <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-slate-800 flex items-center justify-center text-[10px] font-black">
                             JD
                          </div>
                       ))}
                       <div className="w-10 h-10 rounded-full border-2 border-background bg-brand-action flex items-center justify-center text-[10px] font-black text-white">
                          +12
                       </div>
                    </div>
                    <button className="px-8 py-3 bg-white text-black rounded-2xl font-black text-sm hover:scale-105 transition-transform active:scale-95 shadow-xl">
                       Get Full Audit
                    </button>
                 </div>
              </div>
              
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-action/10 rounded-full blur-[100px] group-hover:bg-brand-action/20 transition-colors" />
           </motion.div>

           {/* Features / Tips */}
           <div className="space-y-8">
              {[
                { title: "Smart Keywords", desc: "We identify the missing skills recruiters are looking for in your niche.", icon: Search, col: "text-brand-action" },
                { title: "Instant Feedback", desc: "Get real-time scoring as you type your CV in our builder.", icon: Zap, col: "text-brand-secondary" },
                { title: "Trusted by Pros", desc: "Our engine is modeled after the top 5 ATS systems worldwide.", icon: CheckCircle2, col: "text-brand-success" },
              ].map((f, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="p-8 bg-white/5 border border-border-custom rounded-[32px] hover:border-white/20 transition-all group"
                >
                   <div className={`w-12 h-12 rounded-2xl bg-white/5 mb-6 flex items-center justify-center ${f.col} group-hover:bg-white/10 transition-colors`}>
                      <f.icon size={24} />
                   </div>
                   <h4 className="text-xl font-black mb-2">{f.title}</h4>
                   <p className="text-sm text-foreground/40 font-medium leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Info Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-10 bg-brand-action text-white rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-brand-action/30"
        >
           <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                 <Info size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Expert Insight</span>
              </div>
              <h3 className="text-3xl font-black tracking-tight">Ready to pass the filter?</h3>
              <p className="text-white/80 font-medium max-w-xl">Use any of our premium templates—they are all pre-optimized for 99.9% ATS compatibility right out of the box.</p>
           </div>
           <button className="px-10 py-5 bg-black text-white rounded-2xl font-black text-xl hover:translate-x-2 transition-transform shadow-2xl border border-white/10 active:scale-95">
              Start Forging
           </button>
        </motion.div>
      </main>
    </div>
  )
}
