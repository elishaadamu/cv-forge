"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle2, Zap, ArrowRight, ShieldCheck, Download, Edit3 } from "lucide-react"
import Link from "next/link"

interface Template {
  id: string
  name: string
  category: string
  img: string
  color: string
  desc: string
  features?: string[]
}

interface TemplateDetailModalProps {
  template: Template | null
  isOpen: boolean
  onClose: () => void
}

export function TemplateDetailModal({ template, isOpen, onClose }: TemplateDetailModalProps) {
  if (!template) return null

  const defaultFeatures = [
    "ATS-Optimized structure for recruitment software",
    "Tailored for high-growth industry standards",
    "Clean, professional typography of the highest grade",
    "Instant PDF export with perfect formatting",
    "Unlimited revisions and 1-click template swapping"
  ]

  const features = template.features || defaultFeatures

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl bg-card-bg border border-white/10 rounded-[48px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[85vh] md:h-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all hover:rotate-90 group"
            >
              <X size={24} className="text-foreground/40 group-hover:text-foreground" />
            </button>

            {/* Left Side: Preview Image */}
            <div className="w-full md:w-[45%] h-64 md:h-auto overflow-hidden bg-background relative shrink-0">
               <div 
                 className="absolute inset-x-0 top-0 h-2 z-10"
                 style={{ backgroundColor: template.color }}
               />
               <img
                 src={template.img}
                 alt={template.name}
                 className="w-full h-full object-cover object-top"
               />
               <div className="absolute inset-0 bg-linear-to-t from-background to-transparent md:hidden" />
            </div>

            {/* Right Side: Details */}
            <div className="flex-1 p-8 md:p-14 overflow-y-auto custom-scrollbar flex flex-col">
               <div className="space-y-6">
                 <div className="space-y-2">
                   <div className="flex items-center space-x-3">
                     <span className="px-4 py-1.5 bg-brand-action/15 text-brand-action text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-brand-action/20">
                       {template.category}
                     </span>
                     <div className="flex items-center space-x-1 text-brand-success text-[10px] font-black uppercase tracking-widest">
                       <ShieldCheck size={14} />
                       <span>ATS Verified</span>
                     </div>
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black tracking-tight">{template.name}</h2>
                 </div>

                 <p className="text-xl text-foreground/50 font-medium leading-relaxed">
                   {template.desc}
                 </p>

                 <div className="space-y-4 pt-4">
                   <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30">Premium Capabilities</h4>
                   <div className="grid gap-4">
                     {features.map((feature, i) => (
                       <motion.div 
                         key={i}
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: 0.1 * i }}
                         className="flex items-start gap-4"
                       >
                         <div className="w-6 h-6 rounded-full bg-brand-success/15 border border-brand-success/20 flex items-center justify-center shrink-0 mt-0.5">
                           <CheckCircle2 size={14} className="text-brand-success" />
                         </div>
                         <span className="text-foreground/70 font-medium">{feature}</span>
                       </motion.div>
                     ))}
                   </div>
                 </div>
               </div>

               <div className="mt-auto pt-12 flex flex-col sm:flex-row gap-4">
                 <Link
                   href={`/builder?template=${template.id}`}
                   className="flex-1 h-16 bg-brand-action text-white hover:bg-brand-action/90 rounded-2xl flex items-center justify-center gap-3 font-black text-lg transition-all active:scale-95 shadow-lg shadow-brand-action/20"
                 >
                   <Edit3 size={20} />
                   <span>Start Building</span>
                   <ArrowRight size={20} className="ml-2" />
                 </Link>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
