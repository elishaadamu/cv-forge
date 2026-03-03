"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

export function FAQ() {
  const faqs = [
    {
      q: "Is cvmyjob really free?",
      a: "Yes! 100%. We provide a completely free platform that empowers job seekers without financial barriers. No hidden paywalls, no locked essential features."
    },
    {
       q: "What tools are included?",
       a: "Everything is included: AI-assisted CV builder, Cover Letter generator, multi-format document converter (PDF to DOCX), ATS score checker, and a LinkedIn summary generator."
    },
    {
      q: "Will my CV be ATS-friendly?",
      a: "Our templates are engineered specifically to be readable by ATS engines. We focus on standard structures that ensure your CV hits the mark for every application."
    },
    {
      q: "Are there watermarks or limits?",
      a: "Never. Every export is clean, watermark-free, and professional. We offer unlimited exports for yours CVs and documents because career growth should be accessible to everyone."
    },
    {
      q: "How can it be free?",
      a: "Our mission is to empower job seekers globally. We sustain the platform through optional donations and future affiliate partnerships with career services, keeping the core tools free for everyone."
    }
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 px-4 bg-background relative z-10">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black tracking-tight">Got Questions?</h2>
          <p className="text-foreground/70 font-bold uppercase tracking-widest text-sm underline decoration-brand-action decoration-2 underline-offset-8">Find your answers here</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-white/5 py-4">
               <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-4 text-left group"
                  aria-expanded={openIndex === i}
                  aria-controls={`faq-answer-${i}`}
               >
                  <span id={`faq-question-${i}`} className="text-xl font-black tracking-tight group-hover:text-brand-action transition-colors">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-foreground/60 transition-transform duration-300 ${openIndex === i ? "rotate-90 text-brand-action" : ""}`}>
                     {openIndex === i ? <Minus size={18} aria-hidden="true"/> : <Plus size={18} aria-hidden="true"/>}
                  </div>
               </button>
               <AnimatePresence>
                 {openIndex === i && (
                   <motion.div 
                     id={`faq-answer-${i}`}
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: "auto", opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="overflow-hidden"
                     role="region"
                     aria-labelledby={`faq-question-${i}`}
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
