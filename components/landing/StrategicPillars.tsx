"use client"

import { motion } from "framer-motion"
import { 
  FileText, 
  FilePen, 
  Repeat, 
  SearchCode, 
  Zap, 
  LayoutDashboard, 
  ArrowRight 
} from "lucide-react"
import Link from "next/link"

const pillars = [
  {
    id: "01",
    title: "Smart CV Generation",
    desc: "AI-assisted builder with recruiter-approved templates and real-time improvement suggestions.",
    icon: FileText,
    href: "/builder",
    color: "brand-action"
  },
  {
    id: "02",
    title: "AI Cover Letter",
    desc: "Instantly generate personalized cover letters tailored to specific job descriptions and tones.",
    icon: FilePen,
    href: "/cover-letter",
    color: "brand-secondary"
  },
  {
    id: "03",
    title: "Document Converter",
    desc: "Seamless PDF to DOCX and image conversion with zero formatting loss or watermarks.",
    icon: Repeat,
    href: "/tools",
    color: "brand-action"
  },
  {
    id: "04",
    title: "Free ATS Checker",
    desc: "Deep analysis of your CV against job keywords to maximize your interview chances.",
    icon: SearchCode,
    href: "/ats",
    color: "brand-secondary"
  },
  {
    id: "05",
    title: "Career Toolkit",
    desc: "AI tools for LinkedIn summaries, professional bios, and bullet point optimization.",
    icon: Zap,
    href: "/tools",
    color: "brand-action"
  },
  {
    id: "06",
    title: "Career Workspace",
    desc: "A centralized dashboard to manage multiple CV versions and track job applications.",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "brand-secondary"
  }
]

export function StrategicPillars() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Our <span className="text-brand-action">Strategic</span> Ecosystem.
          </h2>
          <p className="text-foreground/50 text-xl font-medium">
            A complete suite of AI-powered tools designed to eliminate financial barriers in career growth. 100% Free. Always.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 glass border border-border-custom rounded-[32px] hover:border-brand-action/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-brand-action/5 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`w-14 h-14 rounded-2xl bg-${pillar.color}/10 flex items-center justify-center text-${pillar.color} group-hover:scale-110 transition-transform`}>
                  <pillar.icon size={28} />
                </div>
                <span className="text-4xl font-black opacity-10 group-hover:opacity-20 transition-opacity">
                  {pillar.id}
                </span>
              </div>
              
              <div className="space-y-4 grow">
                <h3 className="text-2xl font-black group-hover:text-brand-action transition-colors">{pillar.title}</h3>
                <p className="text-foreground/60 leading-relaxed font-semibold">{pillar.desc}</p>
              </div>

              <Link 
                href={pillar.href}
                className="mt-8 pt-6 border-t border-border-custom flex items-center justify-between font-black text-sm uppercase tracking-widest group/link"
              >
                <span className="text-foreground/40 group-hover/link:text-brand-action transition-colors">Explore Tool</span>
                <ArrowRight size={18} className="text-foreground/20 group-hover/link:translate-x-1 group-hover/link:text-brand-action transition-all" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
