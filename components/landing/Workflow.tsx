"use client"

import { motion } from "framer-motion"
import { Layout, PenTool, Download } from "lucide-react"

export function Workflow() {
  const steps = [
    {
      title: "Select Template",
      desc: "Choose from our field-tested, ATS-optimized layouts designed by recruitment experts.",
      icon: Layout,
      color: "text-brand-action"
    },
    {
      title: "Input Data",
      desc: "Fill in your details. Use our AI assistant to refine your experience and summary points.",
      icon: PenTool,
      color: "text-brand-secondary"
    },
    {
      title: "Create & Export",
      desc: "Download your high-fidelity, watermark-free PDF instantly. Ready for any application.",
      icon: Download,
      color: "text-brand-success"
    }
  ]

  return (
    <section className="py-24 px-4 bg-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-black tracking-tight">Three Steps to Success.</h2>
          <p className="text-foreground/50 font-medium">Simplified, efficient, and professional.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
          
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center space-y-6"
            >
              <div className={`w-20 h-20 rounded-full bg-background border-4 border-white/5 flex items-center justify-center shadow-2xl ${step.color}`}>
                <step.icon size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">{step.title}</h3>
                <p className="text-foreground/60 leading-relaxed max-w-xs mx-auto text-sm font-semibold">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
