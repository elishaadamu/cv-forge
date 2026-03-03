"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, FileText, Star, ShieldCheck, Zap, CheckCircle2, ChevronDown, Target } from "lucide-react"

export function Hero() {
  return (
    <section className="relative w-full pt-35 pb-30 px-4 overflow-hidden">
      {/* Background Animation - Bound to Hero Height, Full Screen Width */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        
        {/* Left Side Morphing Shape */}
        <motion.svg
          viewBox="0 0 800 800"
          className="absolute -top-20 -left-1/4 w-[60%] lg:w-[45%] h-auto opacity-20 dark:opacity-40 blur-[100px] text-brand-action"
          animate={{
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <motion.path
            d="M400,100 L700,400 L400,700 L100,400 Z"
            fill="currentColor"
            animate={{
              d: [
                "M400,100 L700,400 L400,700 L100,400 Z",
                "M450,150 L650,450 L350,650 L150,350 Z",
                "M400,100 L700,400 L400,700 L100,400 Z"
              ]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.svg>

        {/* Right Side Morphing Shape */}
        <motion.svg
          viewBox="0 0 800 800"
          className="absolute -top-20 -right-1/4 w-[60%] lg:w-[45%] h-auto opacity-20 dark:opacity-40 blur-[100px] text-brand-secondary"
          animate={{
            rotate: [360, 270, 180, 90, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <motion.path
            d="M400,100 L700,400 L400,700 L100,400 Z"
            fill="currentColor"
            animate={{
              d: [
                "M400,100 L700,400 L400,700 L100,400 Z",
                "M350,150 L600,400 L350,650 L100,400 Z",
                "M400,100 L700,400 L400,700 L100,400 Z"
              ]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.svg>
        
        {/* Floating Polygons - Edge Biased */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute backdrop-blur-3xl rounded-[40%60%60%40%/40%40%60%60%] ${
              i % 2 === 0 ? "bg-brand-action/10" : "bg-brand-secondary/10"
            }`}
            style={{
              width: Math.random() * 400 + 200,
              height: Math.random() * 400 + 200,
              left: i % 2 === 0 ? `-5%` : `85%`,
              top: `${Math.random() * 60}%`,
            }}
            animate={{
              x: [0, i % 2 === 0 ? 50 : -50, 0],
              y: [0, -30, 30, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 0.9, 1]
            }}
            transition={{
              duration: 20 + i * 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Ambient Glows */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-brand-action/5 blur-[150px] rounded-full" />
          <div className="absolute top-1/2 -right-20 w-[600px] h-[600px] bg-brand-secondary/5 blur-[150px] rounded-full" />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
        <div className="space-y-10 text-left">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-action/10 border border-brand-action/20 rounded-2xl text-brand-action text-sm font-black uppercase tracking-widest shadow-lg shadow-brand-action/5"
          >
            <Star size={16} className="animate-pulse fill-brand-action/20" />
            <span>100% Free Forever. No Hidden Fees.</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-foreground">
            Craft Your Next <span className="bg-clip-text text-transparent bg-linear-to-r from-brand-action via-brand-action/80 to-brand-secondary block mt-4">Career Milestone.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/60 max-w-xl leading-relaxed font-medium">
            A premium, AI-powered toolkit to build, optimize, and manage professional documents without financial barriers.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pt-2">
            <Link
              href="/builder"
              className="px-10 py-5 bg-brand-action text-white rounded-[24px] font-black text-xl flex items-center justify-center space-x-3 shadow-[0_20px_50px_-10px_rgba(var(--brand-action-rgb),0.5)] hover:shadow-brand-action/40 hover:-translate-y-1.5 transition-all active:scale-95 duration-500 group min-w-[240px]"
            >
              <span>Create My CV</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
            <Link
              href="/templates"
              className="px-10 py-5 glass border border-border-custom rounded-[24px] font-black text-xl flex items-center justify-center space-x-3 hover:bg-foreground/5 transition-all duration-500 hover:-translate-y-1 min-w-[240px]"
            >
              <span>View Styles</span>
              <FileText size={24} className="text-brand-secondary" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-4">
             {[
               { icon: CheckCircle2, text: "No Watermark", color: "brand-success" },
               { icon: ShieldCheck, text: "ATS Perfect", color: "brand-secondary" },
               { icon: Zap, text: "AI Optimized", color: "brand-action" }
             ].map((feat, i) => (
               <div key={i} className="flex items-center space-x-2 group">
                 <feat.icon size={18} className={`text-${feat.color}`} />
                 <span className="text-[11px] font-black tracking-[0.2em] text-foreground/40 uppercase group-hover:text-foreground/60 transition-colors">{feat.text}</span>
               </div>
             ))}
          </div>
        </div>

        {/* Visual Right Side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 w-full aspect-square max-w-[1200px] mx-auto group">
            <div className="absolute inset-0 bg-brand-action/10 blur-[120px] rounded-full opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="relative rounded-[40px] overflow-hidden border border-border-custom shadow-2xl bg-card-bg">
              <Image 
                src="/hero.png" 
                alt="cvmyjob Platform Interface" 
                width={800} 
                height={800} 
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-1000"
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                quality={70}
              />
            </div>

            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 z-20 glass px-6 py-4 rounded-3xl border border-brand-action/20 shadow-xl flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-brand-action/10 rounded-xl flex items-center justify-center text-brand-action">
                <Target size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-action">ATS Match</span>
                <span className="text-xl font-black">94% Score</span>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-6 -right-6 z-20 glass px-6 py-4 rounded-3xl border border-brand-secondary/20 shadow-xl flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-brand-secondary/10 rounded-xl flex items-center justify-center text-brand-secondary">
                <ShieldCheck size={20} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">Security</span>
                <span className="text-xl font-black">Verified ATS</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>

  )
}
