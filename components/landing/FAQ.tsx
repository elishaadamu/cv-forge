"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

export function FAQ() {
  const faqs = [
    {
      q: "Is CVForge really free?",
      a: "Yes! 100%. We don't believe in charging job seekers. Our costs are covered by generous community donations."
    },
    {
      q: "Will my CV be ATS-friendly?",
      a: "Our templates are designed specifically to be readable by ATS engines. We use standard fonts and layouts that avoid the common pitfalls of image-based resumes."
    },
    {
      q: "Are there watermarks on my PDF?",
      a: "Never. Your professional career shouldn't be a billboard for us. Every export is clean and watermark-free."
    },
    {
      q: "Can I edit my CV later?",
      a: "Absolutely. Once you save as a draft, your CV is stored in your private dashboard for future edits and template switching."
    }
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 px-4 bg-background relative z-10">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black tracking-tight">Got Questions?</h2>
          <p className="text-foreground/40 font-bold uppercase tracking-widest text-sm">Find your answers here</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-white/5 py-4">
               <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-4 text-left group"
               >
                  <span className="text-xl font-black tracking-tight group-hover:text-brand-action transition-colors">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-foreground/40 transition-transform duration-300 ${openIndex === i ? "rotate-90 text-brand-action" : ""}`}>
                     {openIndex === i ? <Minus size={18}/> : <Plus size={18}/>}
                  </div>
               </button>
               <AnimatePresence>
                 {openIndex === i && (
                   <motion.div 
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: "auto", opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="overflow-hidden"
                   >
                     <p className="pb-6 text-foreground/60 leading-relaxed font-medium">
                        {faq.a}
                     </p>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
