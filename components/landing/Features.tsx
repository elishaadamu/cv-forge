"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Search, Target, Award, ArrowUpRight } from "lucide-react"

export function Features() {
  const features = [
    {
      title: "AI Keyword Analysis",
      desc: "Our engine scans job descriptions to extract high-impact keywords, ensuring your CV hits the mark for every application.",
      icon: Search,
      color: "text-brand-action",
      bg: "bg-brand-action/10"
    },
    {
      title: "Match Rate Scoring",
      desc: "Get a real-time compatibility score between your profile and target roles. Know exactly where you stand before you apply.",
      icon: Target,
      color: "text-brand-secondary",
      bg: "bg-brand-secondary/10"
    },
    {
      title: "Pro Template Library",
      desc: "Access a curated collection of recruiter-approved templates, engineered for maximum readability and structure.",
      icon: Award,
      color: "text-brand-success",
      bg: "bg-brand-success/10"
    }
  ]

  return (
    <section className="py-24 px-4 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-loose">
              Advanced <span className="text-brand-action">Intelligence.</span><br/>
              Professional Results.
            </h2>
            <p className="text-foreground/50 text-xl font-medium">
              We've integrated state-of-the-art AI to handle the complexity, so you can focus on your career.
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="shrink-0"
          >
            <Link href="/features" className="px-8 py-4 glass border border-white/10 rounded-2xl font-black flex items-center gap-2 hover:bg-white/5 transition-all">
              <span>View All Features</span>
              <ArrowUpRight size={20} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 glass border border-white/5 rounded-[48px] space-y-8 group hover:border-white/20 transition-all duration-500"
            >
              <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <f.icon size={28} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black">{f.title}</h3>
                <p className="text-foreground/60 leading-relaxed font-semibold">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
