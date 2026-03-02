"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, ArrowLeft, Search, FileQuestion, Sparkles } from "lucide-react"
import { Navbar } from "@/components/Navbar"

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-brand-action/30">
      {/* Background Decor - Similar to Home/Hero for consistency */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.08]" 
           style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      
      {/* Animated Blobs */}
      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-brand-action/5 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-brand-secondary/5 blur-[150px] rounded-full animate-pulse" />

      <Navbar />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-xl w-full space-y-12">
          
          {/* 404 Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="relative inline-block"
          >
            <div className="text-[12rem] md:text-[15rem] font-black tracking-tighter leading-none opacity-5 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  y: [0, -10, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 md:w-48 md:h-48 bg-brand-action rounded-[40px] flex items-center justify-center text-white shadow-2xl shadow-brand-action/40 transform -rotate-12"
              >
                <FileQuestion size={80} className="md:size-32" />
              </motion.div>
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-black tracking-tight"
            >
              Page <span className="text-brand-action">Not Found.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-foreground/50 font-medium leading-relaxed"
            >
              The page you are looking for doesn't exist or has been moved. Use the buttons below to find your way back.
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-brand-action text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-brand-action/20 hover:-translate-y-1 active:scale-95 transition-all"
            >
              <Home size={20} />
              <span>Back to Home</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-8 py-4 glass border border-border-custom rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-white/5 transition-all"
            >
              <ArrowLeft size={20} />
              <span>Go Back</span>
            </button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-12 grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {[
              { label: "Features", href: "/features" },
              { label: "Templates", href: "/templates" },
              { label: "Builder", href: "/builder" }
            ].map((link) => (
              <Link 
                key={link.label}
                href={link.href}
                className="px-4 py-3 rounded-xl border border-border-custom/50 text-sm font-bold opacity-40 hover:opacity-100 hover:border-brand-action/30 hover:text-brand-action transition-all"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Decorative footer element */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">
        <Sparkles size={12} />
        <span>cvmyjob platform</span>
      </div>
    </div>
  )
}
