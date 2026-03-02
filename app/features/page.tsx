"use client"

import { Navbar } from "@/components/Navbar"
import { motion } from "framer-motion"
import { 
  Search, Target, Award, Zap, ShieldCheck, 
  Eye, FileText, Download, Cpu, Sparkles,
  BarChart3, Globe, Layers, CheckCircle2,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { BackToTop } from "@/components/landing/BackToTop"

const allFeatures = [
  {
    category: "AI & Intelligence",
    features: [
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
        title: "Smart Content Suggestions",
        desc: "Struggling with descriptions? Our AI suggests professional bullet points based on your job title and industry.",
        icon: Sparkles,
        color: "text-brand-success",
        bg: "bg-brand-success/10"
      }
    ]
  },
  {
    category: "Design & Output",
    features: [
      {
        title: "Pro Template Library",
        desc: "Access a curated collection of recruiter-approved templates, engineered for maximum readability and structure.",
        icon: Award,
        color: "text-brand-action",
        bg: "bg-brand-action/10"
      },
      {
        title: "High-Resolution PDF",
        desc: "Export your CV in crisp, high-quality PDF format. Optimized for both digital reading and physical printing.",
        icon: Download,
        color: "text-brand-secondary",
        bg: "bg-brand-secondary/10"
      },
      {
        title: "Real-time Preview",
        desc: "See your changes instantly as you type. No more guessing how your final document will look.",
        icon: Eye,
        color: "text-brand-success",
        bg: "bg-brand-success/10"
      }
    ]
  },
  {
    category: "Security & Integrity",
    features: [
      {
        title: "Zero Watermarks",
        desc: "We believe your career shouldn't have our logo on it. Every CV is 100% clean and professional.",
        icon: FileText,
        color: "text-brand-action",
        bg: "bg-brand-action/10"
      },
      {
        title: "ATS-Ready Logic",
        desc: "Our templates are built with standard parsing technology in mind, ensuring bots can read your profile flawlessly.",
        icon: Cpu,
        color: "text-brand-secondary",
        bg: "bg-brand-secondary/10"
      },
      {
        title: "Safe & Private",
        desc: "Your data is encrypted and never sold. We prioritize your privacy throughout your job search journey.",
        icon: ShieldCheck,
        color: "text-brand-success",
        bg: "bg-brand-success/10"
      }
    ]
  }
]

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-brand-action/30">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.08]" 
           style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      
      <Navbar />

      <main className="pt-44 pb-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto space-y-32">
          
          {/* Hero Section */}
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-action/10 rounded-full text-brand-action text-sm font-bold uppercase tracking-widest"
            >
              <Zap size={14} className="fill-brand-action" />
              <span>Full Capabilities</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-7xl font-black tracking-tight leading-[1.1]"
            >
              Everything you need to <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-action to-brand-secondary">Land Your Dream Job.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-foreground/50 font-medium leading-relaxed"
            >
              CVForge combines industrial-grade parsing technology with modern design aesthetics to give you a terminal-level advantage in the job market.
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="space-y-32">
            {allFeatures.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-16">
                <div className="flex items-center space-x-4">
                  <div className="h-px flex-1 bg-border-custom" />
                  <h2 className="text-sm font-black uppercase tracking-[0.3em] text-foreground/30 whitespace-nowrap">
                    {group.category}
                  </h2>
                  <div className="h-px flex-1 bg-border-custom" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {group.features.map((f, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-10 glass border border-border-custom rounded-[48px] space-y-8 group hover:border-brand-action/30 transition-all duration-500"
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
            ))}
          </div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 md:p-20 bg-brand-action rounded-[64px] text-white overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 blur-[100px] rounded-full group-hover:bg-white/20 transition-colors" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.2]">
                  Ready to upgrade <br/> your career?
                </h2>
                <p className="text-white/70 text-xl font-medium max-w-md leading-relaxed">
                  Join thousands of applicants who have landed jobs at top tech companies using CVForge.
                </p>
              </div>
              <Link 
                href="/builder"
                className="px-12 py-6 bg-white text-brand-action rounded-3xl font-black text-2xl flex items-center gap-4 hover:scale-105 transition-all shadow-xl"
              >
                <span>Build My CV</span>
                <ArrowRight size={24} />
              </Link>
            </div>
          </motion.div>

        </div>
      </main>

      <BackToTop />
      
      {/* Reuse Footer style from Home if needed, or keeping it clean for now */}
    </div>
  )
}
