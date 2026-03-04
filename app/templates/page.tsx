"use client"

import { Navbar } from "@/components/Navbar"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, CheckCircle, ChevronRight, Sparkles, Wand2, Info } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { TemplateDetailModal } from "@/components/TemplateDetailModal"

const templates = [
  { 
    id: "modern", 
    name: "Modern Professional", 
    category: "Best Seller", 
    img: "/modern.png", 
    color: "#5C88A3", 
    desc: "Clean, bold & ATS Optimized with structured skill grids.",
    features: ["Industry-Standard ATS Layout", "Triple-Column Skill Grid", "Bold Header Typography", "Maximum Clarity Design"]
  },
  { 
    id: "classic", 
    name: "Classic Table", 
    category: "ATS Gold", 
    img: "/classic.png", 
    color: "#1e293b", 
    desc: "Highly structured table-based layout for maximum readability.",
    features: ["Rigid Table Hierarchy", "Traditional Layout Standard", "Perfect for Finance", "Ultra-High ATS Score"]
  },
  { 
    id: "executive", 
    name: "Executive Two-Column", 
    category: "Premium", 
    img: "/executive.png", 
    color: "#0f172a", 
    desc: "High-contrast two-column layout for senior roles.",
    features: ["Split-Column Profile Focus", "Leadership Action Verbs", "Seniority Highlighting", "Elegant Section Spacing"]
  },
  { 
    id: "minimal", 
    name: "Minimal ATS", 
    category: "Recruiter Choice", 
    img: "/ats.png", 
    color: "#000000", 
    desc: "Ultra-clean layout optimized for parsing accuracy.",
    features: ["Zero Decor Parsability", "Recruiter-Preferred Speed", "Clean Sans-Serif Fonts", "Standard Top-Down Flow"]
  },
  { 
    id: "creative", 
    name: "Creative Portfolio", 
    category: "Artistic", 
    img: "/creative.png", 
    color: "#9333ea", 
    desc: "Bold aesthetics for designers and creative thinkers.",
    features: ["Visual Flow Architecture", "Artistic Skill Charts", "Creative Color Accents", "Design-Focused Layout"]
  },
  { 
    id: "startup", 
    name: "Startup Tech", 
    category: "Tech ecosystem", 
    img: "/startup.png", 
    color: "#1d4ed8", 
    desc: "Fast-paced, modern design for the tech ecosystem.",
    features: ["Modern UI Aesthetics", "Tech Skill Badges", "Dynamic Summary Section", "GitHub/Social Optimized"]
  },
  { 
    id: "executive-board", 
    name: "Executive Board", 
    category: "Leadership", 
    img: "/board.png", 
    color: "#111827", 
    desc: "High-level professional design for leadership roles.",
    features: ["High-Impact Board Focus", "Strategic Achievement Layout", "Elegant Serif Titles", "Formal Sectioning"]
  },
  { 
    id: "midnight", 
    name: "Midnight Elegance", 
    category: "Luxury", 
    img: "/midnight.png", 
    color: "#302b63", 
    desc: "Sophisticated serif design with a deep purple gradient header.",
    features: ["Deep Gradient Palette", "Luxurious Typography", "Refined Accent Colors", "Editorial Layout Flow"]
  },
  { 
    id: "bold-impact", 
    name: "Bold Impact", 
    category: "High Impact", 
    img: "/bold.png", 
    color: "#f97316", 
    desc: "High-contrast, hard-hitting layout with navy and orange.",
    features: ["Confident High-Contrast", "Powerful Date Badges", "Authority Section Lines", "Bold Callouts"]
  },
  { 
    id: "corporate", 
    name: "Corporate Clean", 
    category: "Enterprise", 
    img: "/corporate.png", 
    color: "#0d9488", 
    desc: "Modern corporate design with timeline-style experience.",
    features: ["Timeline History Flow", "Enterprise Skill Tables", "Professional Teal Accents", "Corporate Hierarchy"]
  },
  { 
    id: "fresh", 
    name: "Fresh Minimal", 
    category: "Contemporary", 
    img: "/fresh.png", 
    color: "#10b981", 
    desc: "Light, airy design with green accents and white space.",
    features: ["Airy Modern Spacing", "Contemporary Pill Icons", "Soft Color Palette", "Clean Reading Experience"]
  },
  { 
    id: "refined", 
    name: "Refined Classic", 
    category: "Distinguished", 
    img: "/refined.png", 
    color: "#d97706", 
    desc: "Elegant serif typography with gold accents.",
    features: ["Golden Classic Accents", "Elegant Serif Fonts", "Ornamental Dividers", "Centered Header Balance"]
  },
]

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (template: typeof templates[0]) => {
    setSelectedTemplate(template)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <header className="text-center mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 bg-brand-action/10 text-brand-action rounded-full border border-brand-action/20 text-xs font-black uppercase tracking-widest"
          >
            <Sparkles size={14} />
            <span>Expert Curated Selection</span>
          </motion.div>
          <motion.h1 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="text-6xl font-black tracking-tighter"
          >
            Choose Your <span className="text-brand-action">Style</span>
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             className="max-w-2xl mx-auto text-foreground/50 font-medium text-lg"
          >
            Crafted by career experts to pass the most rigorous ATS scans while catching every hiring manager&apos;s attention.
          </motion.p>
        </header>

        {/* Template Showcase Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {templates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="group relative"
            >
              {/* Card Decoration */}
              <div className="absolute inset-0 bg-linear-to-br from-brand-action/5 to-transparent rounded-[48px] -rotate-1 group-hover:rotate-0 transition-transform duration-500" />
              
              <div className="relative bg-white/5 border border-border-custom hover:border-brand-action/40 rounded-[48px] overflow-hidden transition-all duration-500 p-10 flex flex-col md:flex-row gap-10 items-center">
                
                {/* Visual Preview */}
                <div 
                  className="w-full md:w-64 h-80 bg-background border border-border-custom rounded-3xl shadow-2xl relative overflow-hidden group/img transition-transform hover:scale-105 duration-500 cursor-zoom-in"
                  onClick={() => openModal(template)}
                >
                   <div 
                      className="absolute inset-x-0 top-0 h-1 z-30"
                      style={{ backgroundColor: template.color }}
                   />
                   <img 
                      src={template.img || ""} 
                      alt={template.name}
                      className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                   />
                   <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                      <div className="bg-brand-action text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center space-x-2">
                        <Info size={12} />
                        <span>View Detail</span>
                      </div>
                   </div>
                </div>

                <div className="flex-1 space-y-6 text-center md:text-left">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 justify-center md:justify-start">
                       <span className="px-3 py-1 bg-white/5 text-[10px] font-black uppercase tracking-widest rounded-lg border border-border-custom text-foreground/40">{template.category}</span>
                       <Flame size={14} className="text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">{template.name}</h2>
                    <p className="text-foreground/50 font-medium">{template.desc}</p>
                  </div>

                  <hr className="border-border-custom w-12 mx-auto md:mx-0" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-xs font-bold text-foreground/40">
                      <CheckCircle size={14} className="text-brand-success" />
                      <span>ATS-Proven</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-bold text-foreground/40">
                      <CheckCircle size={14} className="text-brand-success" />
                      <span>1-Click Edit</span>
                    </div>
                  </div>

                  <Link 
                    href={`/builder?template=${template.id}`}
                    className="w-full h-14 bg-white/5 border border-border-custom group-hover:bg-brand-action group-hover:text-white transition-all rounded-2xl flex items-center justify-center font-black text-lg shadow-sm active:scale-95 space-x-2"
                  >
                    <span>Use This Template</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Brand/Social Proof */}
        <section className="mt-40 text-center space-y-12 pb-32">
           <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/20">Trusted by applicants at</h3>
           <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-20 grayscale brightness-200">
               {["TECHGIANT", "CLOUDCO", "NEOSTACK", "MYJOBCORP", "GLOBALFIN"].map(brand => (
                 <span key={brand} className="text-3xl font-black tracking-tighter">{brand}</span>
               ))}
           </div>
        </section>

        <TemplateDetailModal 
          template={selectedTemplate}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </main>
    </div>
  )
}
