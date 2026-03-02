"use client"

import { CheckCircle2, ShieldCheck } from "lucide-react"

export function RecruiterInsight() {
  const insights = [
    "We analyzed 1,000+ successful resumes to build our templates.",
    "Integrated Gemini AI helps you fix weak action verbs instantly.",
    "Zero-lag live preview—see changes as you type them."
  ]

  return (
    <section className="relative py-28 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <h2 className="text-4xl lg:text-5xl font-black leading-tight">Built by recruiters,<br/><span className="text-brand-secondary">powered by AI.</span></h2>
          <div className="space-y-6">
            {insights.map((text, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-brand-secondary/20 flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle2 size={14} className="text-brand-secondary" />
                </div>
                <p className="text-lg text-foreground/70 font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 w-full lg:max-w-md p-10 glass border-2 border-brand-secondary/20 rounded-[48px] shadow-2xl skew-y-3 relative">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-brand-secondary rounded-full flex items-center justify-center text-white shadow-xl">
             <ShieldCheck size={32} />
          </div>
          <p className="text-sm font-black uppercase tracking-widest text-brand-secondary mb-4">Pro Insight</p>
          <p className="text-xl font-bold italic leading-relaxed text-foreground/80">
            "Recruiters spend an average of 6 seconds per CV. If your formatting is messy or AI-unfriendly, you're rejected before you even start. Forge eliminates that risk."
          </p>
        </div>
      </div>
    </section>
  )
}
