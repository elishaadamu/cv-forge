"use client"

import { motion } from "framer-motion"
import { HeartHandshake } from "lucide-react"

export function DonationSection() {
  return (
    <section className="py-32 px-4 bg-brand-primary/5 dark:bg-black/20">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass rounded-[56px] p-12 lg:p-24 text-center relative overflow-hidden flex flex-col items-center border-2 border-brand-action/30"
        >
          {/* Background Accent */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-action opacity-5 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full" />
          
          <div className="w-24 h-24 rounded-full bg-brand-action/10 flex items-center justify-center mb-10 text-brand-action">
            <HeartHandshake size={48} className="animate-pulse" />
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-[1.1]">Support Our Mission.</h2>
          <p className="text-xl lg:text-2xl text-foreground/70 max-w-2xl font-medium leading-relaxed mb-12">
            CVForge is 100% free and community-driven. Your donations help us maintain servers and keep premium tools accessible to everyone.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
             <button className="px-12 py-5 bg-brand-action text-white rounded-[24px] font-black text-xl flex items-center space-x-3 shadow-xl hover:shadow-brand-action/40 hover:-translate-y-1 transition-all">
                <span>Support via Paystack</span>
             </button>
             <button className="px-12 py-5 bg-white/10 dark:bg-white/5 border border-border-custom rounded-[24px] font-black text-xl flex items-center space-x-3 hover:bg-white/20 transition-all">
                <span>Flutterwave</span>
             </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
