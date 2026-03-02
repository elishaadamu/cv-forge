"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, FileText, Star, ShieldCheck, Zap, CheckCircle2, ChevronDown } from "lucide-react"

export function Hero() {
  return (
    <section className="relative w-full py-20 px-4 overflow-hidden">
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
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-10 flex flex-col items-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-action/10 border border-brand-action/20 rounded-2xl text-brand-action text-sm font-black uppercase tracking-widest shadow-lg shadow-brand-action/5"
          >
            <Star size={16} className="animate-pulse fill-brand-action/20" />
            <span>100% Free Forever. No Hidden Fees.</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.9] text-foreground">
            Unlock Your <span className="bg-clip-text text-transparent bg-linear-to-r from-brand-action via-brand-action/80 to-brand-secondary block mt-4 drop-shadow-[0_0_40px_rgba(var(--brand-action-rgb),0.3)]">Career Potential.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/60 max-w-3xl leading-relaxed font-medium px-4">
            Craft high-performance, ATS-ready CVs in minutes. cvmyjob is a professional, AI-powered platform built for job seekers who value precision and premium design.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pt-6 w-full justify-center">
            <Link
              href="/builder"
              className="px-12 py-6 bg-brand-action text-white rounded-[24px] font-black text-2xl flex items-center justify-center space-x-4 shadow-[0_20px_50px_-10px_rgba(var(--brand-action-rgb),0.5)] hover:shadow-[0_25px_60px_-5px_rgba(var(--brand-action-rgb),0.6)] hover:-translate-y-2 transition-all active:scale-95 duration-500 group min-w-[300px]"
            >
              <span>Build My CV</span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
            <Link
              href="/templates"
              className="px-12 py-6 glass border border-border-custom rounded-[24px] font-black text-2xl flex items-center justify-center space-x-4 hover:bg-foreground/5 transition-all duration-500 hover:-translate-y-1 min-w-[300px]"
            >
              <span>View Templates</span>
              <FileText size={28} className="text-brand-secondary" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-12">
            <div className="flex items-center space-x-3 group">
              <div className="w-8 h-8 rounded-xl bg-brand-success/20 flex items-center justify-center">
                 <CheckCircle2 size={18} className="text-brand-success" />
              </div>
              <span className="text-[13px] font-black tracking-[0.2em] text-foreground/50 uppercase group-hover:text-brand-success transition-colors">No Watermark</span>
            </div>
            <div className="flex items-center space-x-3 group">
               <div className="w-8 h-8 rounded-xl bg-brand-secondary/20 flex items-center justify-center">
                 <ShieldCheck size={18} className="text-brand-secondary" />
              </div>
              <span className="text-[13px] font-black tracking-[0.2em] text-foreground/50 uppercase group-hover:text-brand-secondary transition-colors">ATS Friendly</span>
            </div>
             <div className="flex items-center space-x-3 group">
               <div className="w-8 h-8 rounded-xl bg-brand-action/20 flex items-center justify-center">
                 <Zap size={18} className="text-brand-action" />
              </div>
              <span className="text-[13px] font-black tracking-[0.2em] text-foreground/50 uppercase group-hover:text-brand-action transition-colors">Real-time Preview</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="mt-24 flex justify-center">
        <motion.button
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="w-14 h-14 glass border border-border-custom rounded-2xl flex items-center justify-center group transition-all active:scale-95 hover:bg-foreground/5"
          onClick={() => {
            const statsSection = document.getElementById('stats')
            statsSection?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <ChevronDown size={28} className="text-brand-action group-hover:translate-y-2 transition-transform duration-300" />
        </motion.button>
      </div>
    </section>
  )
}
