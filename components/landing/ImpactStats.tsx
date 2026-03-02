"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { ShieldCheck, Zap, Globe, CheckCircle2, Target } from "lucide-react"

function CountingNumber({ value, suffix = "" }: { value: number, suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    let start = 0
    const end = value
    const duration = 2000
    const increment = end / (duration / 16)
    
    if (end === 0) {
      setDisplayValue(0)
      return
    }

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayValue(end)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, 16)
    
    return () => clearInterval(timer)
  }, [value])

  return (
    <span>{displayValue}{suffix}</span>
  )
}

export function ImpactStats() {
  const stats = [
    { 
      label: "Watermarks Removed", 
      value: 100, 
      suffix: "%", 
      desc: "Clean, professional PDFs",
      icon: CheckCircle2,
      color: "text-brand-success",
      bg: "bg-brand-success/10"
    },
    { 
      label: "CV Match Rate", 
      value: 94, 
      suffix: "%", 
      desc: "Precision role alignment",
      icon: Target,
      color: "text-brand-secondary",
      bg: "bg-brand-secondary/10"
    },
    { 
      label: "Developer Hosted", 
      value: 24, 
      suffix: "/7", 
      desc: "Always online & fast",
      icon: Zap,
      color: "text-brand-action",
      bg: "bg-brand-action/10"
    },
    { 
      label: "Usage Cost", 
      value: 0, 
      prefix: "$", 
      desc: "No subscriptions ever",
      icon: Globe,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10"
    }
  ]

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-action rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-secondary rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ y: -8 }}
              className="group relative p-10 bg-white/5 border border-white/5 rounded-[40px] text-center overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-black/20"
            >
              <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon Container */}
              <div className={`w-16 h-16 mx-auto mb-8 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                <stat.icon size={32} strokeWidth={2.5} />
              </div>

              {/* Stat Value */}
              <div className="text-6xl font-black tracking-tight mb-3 text-foreground transition-colors duration-300">
                {stat.prefix && <span className="text-3xl align-top mr-0.5 opacity-50">{stat.prefix}</span>}
                <CountingNumber value={stat.value} suffix={stat.suffix} />
              </div>

              {/* Labels */}
              <div className="space-y-2">
                <div className="text-sm font-black uppercase tracking-[0.2em] text-foreground/80">{stat.label}</div>
                <p className="text-xs text-foreground/40 font-black uppercase tracking-widest leading-loose">{stat.desc}</p>
              </div>

              {/* Bottom Decoration Accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.color.replace('text', 'bg')} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
