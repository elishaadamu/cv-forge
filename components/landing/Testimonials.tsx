"use client"

import { Star } from "lucide-react"

export function Testimonials() {
  const reviews = [
    {
      name: "Damilola A.",
      role: "Frontend Developer",
      text: "cvmyjob is a game changer for job hunters. The ATS audit feature showed exactly why my previous resume was being ignored.",
      rating: 5
    },
    {
      name: "Tega O.",
      role: "Project Manager",
      text: "No watermark and 100% free? I thought there was a catch. But no, the templates are professional and the tool is super fast.",
      rating: 5
    },
    {
      name: "Gift E.",
      role: "UI/UX Designer",
      text: "The real-time preview makes editing so much easier. I can see exactly how my design decisions look as I type.",
      rating: 5
    }
  ]

  return (
    <section className="py-24 px-4 bg-brand-primary/5 dark:bg-black/20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-[2.75rem] font-black tracking-tight leading-none">Loved by the community.</h2>
          <p className="text-foreground/50 text-xl font-medium max-w-2xl mx-auto">See what our users are saying about cvmyjob's premium experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {reviews.map((review, i) => (
              <div key={i} className="p-8 glass border border-white/5 rounded-[40px] space-y-6 shadow-sm hover:shadow-2xl hover:shadow-brand-action/5 transition-all duration-500">
                <div className="flex space-x-1">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} size={16} className="text-brand-action fill-brand-action" />
                  ))}
                </div>
                <p className="text-lg text-foreground/80 leading-relaxed font-semibold italic">"{review.text}"</p>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                   <span className="font-black text-sm tracking-tight">{review.name}</span>
                   <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest leading-none">{review.role}</span>
                </div>
              </div>
           ))}
        </div>
      </div>
    </section>
  )
}
