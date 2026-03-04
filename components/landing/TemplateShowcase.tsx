"use client"

import { motion } from "framer-motion"
import { ChevronRight, Flame, CheckCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const templates = [
  { 
    id: "modern", 
    name: "Modern Professional", 
    category: "Best Seller", 
    img: "/modern.png", 
    color: "#5C88A3", 
    desc: "Clean, bold & ATS Optimized with structured skill grids." 
  },
  { 
    id: "classic", 
    name: "Classic Table", 
    category: "ATS Gold", 
    img: "/classic.png", 
    color: "#1e293b", 
    desc: "Highly structured table-based layout for maximum readability." 
  },
  { 
    id: "executive", 
    name: "Executive Two-Column", 
    category: "Premium", 
    img: "/executive.png", 
    color: "#0f172a", 
    desc: "High-contrast two-column layout for senior roles." 
  },
  { 
    id: "midnight", 
    name: "Midnight Elegance", 
    category: "Luxury", 
    img: "/midnight.png", 
    color: "#302b63", 
    desc: "Sophisticated serif design with a deep purple gradient header for senior professionals." 
  },
  { 
    id: "bold-impact", 
    name: "Bold Impact", 
    category: "High Impact", 
    img: "/bold.png", 
    color: "#f97316", 
    desc: "High-contrast, hard-hitting layout with dark navy and orange accents." 
  },
  { 
    id: "refined", 
    name: "Refined Classic", 
    category: "Distinguished", 
    img: "/refined.png", 
    color: "#d97706", 
    desc: "Elegant serif typography with gold accents, ideal for executive roles." 
  },
]

export function TemplateShowcase() {
  return (
    <section className="py-24 px-4 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 bg-brand-action/10 text-brand-action rounded-full border border-brand-action/20 text-xs font-black uppercase tracking-widest"
            >
              <Sparkles size={14} />
              <span>Premium Layouts</span>
            </motion.div>
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Crafted for <span className="text-brand-action">Success.</span>
            </h2>
            <p className="text-foreground/50 text-xl font-medium max-w-xl">
              Our templates are engineered to pass rigorous ATS scans while catching every recruiter's attention.
            </p>
          </div>
          <Link 
            href="/templates" 
            className="group flex items-center space-x-2 text-brand-action font-black text-lg hover:translate-x-2 transition-all"
          >
            <span>Explore All Templates</span>
            <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="group relative h-full flex flex-col bg-card-bg border border-border-custom hover:border-brand-action/40 rounded-[40px] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-brand-action/5"
            >
              {/* Visual Preview */}
              <div className="relative h-80 overflow-hidden bg-background">
                <div 
                  className="absolute inset-x-0 top-0 h-1.5 z-30"
                  style={{ backgroundColor: template.color }}
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Image 
                  src={template.img} 
                  alt={template.name}
                  fill
                  className="w-full h-full object-cover object-top opacity-90 group-hover:scale-110 transition-transform duration-1000"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={70}
                />
                <div className="absolute top-6 right-6 z-20">
                  <div className="bg-white/90 backdrop-blur-md text-brand-primary text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl flex items-center space-x-2">
                    <Flame size={12} className="text-orange-500" />
                    <span>{template.category}</span>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6 grow flex flex-col">
                <div className="space-y-3 grow">
                  <h3 className="text-2xl font-black">{template.name}</h3>
                  <p className="text-foreground/60 font-medium leading-relaxed">{template.desc}</p>
                </div>

                <div className="flex items-center space-x-6 pt-4 border-t border-border-custom">
                  <div className="flex items-center space-x-2 text-xs font-bold text-foreground/40">
                    <CheckCircle size={14} className="text-brand-success" />
                    <span>ATS Ready</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-bold text-foreground/40">
                    <CheckCircle size={14} className="text-brand-success" />
                    <span>Free Export</span>
                  </div>
                </div>

                <Link 
                  href={`/builder?template=${template.id}`}
                  className="w-full h-14 bg-brand-action text-white hover:bg-brand-action-hover transition-all rounded-2xl flex items-center justify-center font-black text-lg shadow-lg active:scale-95 space-x-2"
                >
                  <span>Use Template</span>
                  <ChevronRight size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
