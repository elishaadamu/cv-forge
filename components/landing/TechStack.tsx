"use client"

import { motion } from "framer-motion"
import { Scan, Cpu, Layers } from "lucide-react"

export function TechStack() {
  const stack = [
    { name: "Next.js 15", desc: "The foundation of our speed.", icon: Layers, color: "text-brand-action" },
    { name: "Gemini 1.5", desc: "AI core that understands intent.", icon: Cpu, color: "text-brand-secondary" },
    { name: "Prisma", desc: "Secure and real-time data.", icon: Scan, color: "text-brand-success" }
  ]

  return (
    <section className="py-24 px-4 bg-brand-primary/10 dark:bg-black/40 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-16">
        <h2 className="text-3xl font-black tracking-widest uppercase opacity-30">Powering Your Career Path</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-24">
          {stack.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center space-y-4 group"
            >
              <div className={`w-20 h-20 rounded-3xl bg-background border border-white/5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${item.color}`}>
                <item.icon size={36} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <div className="font-black text-xl">{item.name}</div>
                <div className="text-xs text-foreground/40 font-black tracking-widest uppercase leading-loose">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
