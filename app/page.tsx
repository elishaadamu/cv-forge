"use client"

import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Sparkles, FileText, CheckCircle2, ShieldCheck, Heart, ArrowRight, Github, Zap, Award, Globe, HeartHandshake } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-brand-action/30">
      <Navbar />

      {/* Hero Section */}
      <main className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 space-y-10"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-action/10 border border-brand-action/20 rounded-2xl text-brand-action text-sm font-black uppercase tracking-widest shadow-lg shadow-brand-action/5"
            >
              <Sparkles size={16} className="animate-pulse" />
              <span>100% Free Forever. No Hidden Fees.</span>
            </motion.div>
            
            <h1 className="text-6xl lg:text-[5.5rem] font-black tracking-tight leading-none text-foreground">
              Build Your Future <span className="text-brand-action block mt-2">No Watermark.</span>
            </h1>
            
            <p className="text-xl text-foreground/60 max-w-xl leading-relaxed font-medium">
              CVForge is a premium, donation-supported platform designed to help you secure your dream role with ATS-optimized templates and real-time editing.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-6">
              <Link
                href="/builder"
                className="px-12 py-5 bg-brand-action text-white rounded-[24px] font-black text-xl flex items-center justify-center space-x-3 shadow-2xl shadow-brand-action/40 hover:shadow-brand-action/60 hover:-translate-y-1.5 transition-all active:scale-95 duration-500 group"
              >
                <span>Forge My CV</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform duration-500" />
              </Link>
              <Link
                href="/templates"
                className="px-12 py-5 glass border border-border-custom rounded-[24px] font-black text-xl flex items-center justify-center space-x-3 hover:bg-white/10 dark:hover:bg-brand-primary/20 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex items-center space-x-2">
                  <span>Templates</span>
                  <FileText size={22} className="text-brand-secondary" />
                </div>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-10 gap-y-6 pt-6">
              <div className="flex items-center space-x-2.5 group">
                <div className="w-6 h-6 rounded-full bg-brand-success/20 flex items-center justify-center">
                   <CheckCircle2 size={14} className="text-brand-success" />
                </div>
                <span className="text-[12px] font-black tracking-[0.15em] text-foreground/50 uppercase group-hover:text-brand-success transition-colors">No Watermark</span>
              </div>
              <div className="flex items-center space-x-2.5 group">
                 <div className="w-6 h-6 rounded-full bg-brand-secondary/20 flex items-center justify-center">
                   <ShieldCheck size={14} className="text-brand-secondary" />
                </div>
                <span className="text-[12px] font-black tracking-[0.15em] text-foreground/50 uppercase group-hover:text-brand-secondary transition-colors">ATS Friendly</span>
              </div>
               <div className="flex items-center space-x-2.5 group">
                 <div className="w-6 h-6 rounded-full bg-brand-action/20 flex items-center justify-center">
                   <Zap size={14} className="text-brand-action" />
                </div>
                <span className="text-[12px] font-black tracking-[0.15em] text-foreground/50 uppercase group-hover:text-brand-action transition-colors">Real-time Preview</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero / Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="flex-1 relative group w-full lg:w-auto perspective-1000"
          >
            <div className="absolute -inset-10 bg-linear-to-tr from-brand-action/20 via-brand-secondary/20 to-brand-primary/20 opacity-40 blur-[100px] rounded-full group-hover:opacity-60 transition-opacity duration-1000" />
            <div className="relative glass border-[6px] border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-[40px] overflow-hidden aspect-4/3 group-hover:scale-[1.02] transition-transform duration-700">
               <Image 
                src="/cv_hero.png" 
                alt="CVForge Interface Preview" 
                fill
                className="object-cover transition-transform duration-1000"
                priority
               />
               <div className="absolute inset-0 bg-linear-to-t from-brand-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            
            {/* Dynamic Badge */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 p-8 glass rounded-[32px] shadow-2xl border-l-[6px] border-brand-action max-w-[260px] hidden sm:block"
            >
              <div className="flex space-x-1 mb-3">
                {[1,2,3,4,5].map(i => <Sparkles key={i} size={14} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="font-black text-lg tracking-tight leading-tight">"Secured top tier interviews within a week."</p>
              <p className="text-xs font-bold text-foreground/40 mt-3 uppercase tracking-widest">— Software Engineer @ Dublin</p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Feature Grid */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-[2.75rem] font-black tracking-tight leading-none">Designed for Impact.</h2>
            <p className="text-foreground/50 text-xl font-medium">We've simplified the entire recruitment process into three powerful features.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             {[
               {
                 title: "Recruiter-Tested",
                 desc: "Templates engineered to pass through modern applicant tracking systems without errors.",
                 icon: Award,
                 color: "bg-brand-secondary/15 text-brand-secondary",
                 border: "border-brand-secondary/20"
               },
               {
                 title: "Precision Editing",
                 desc: "Craft every bullet point with clarity. Add custom sections and manage layouts effortlessly.",
                 icon: Globe,
                 color: "bg-brand-action/15 text-brand-action",
                 border: "border-brand-action/20"
               },
               {
                 title: "Instant Export",
                 desc: "Download high-resolution PDFs optimized for both print and digital submissions.",
                 icon: Zap,
                 color: "bg-brand-success/15 text-brand-success",
                 border: "border-brand-success/20"
               }
             ].map((feature, i) => (
                <motion.div 
                  whileHover={{ y: -10 }}
                  key={i} 
                  className={`group relative p-12 bg-card-bg border ${feature.border} rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-brand-primary/5 transition-all duration-500`}
                >
                   <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
                     <feature.icon size={32} />
                   </div>
                   <h3 className="text-3xl font-black mb-6">{feature.title}</h3>
                   <p className="text-foreground/60 leading-relaxed font-semibold text-lg">{feature.desc}</p>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Donation/Support Section */}
      <section className="py-32 px-4 bg-brand-primary/5 dark:bg-black/20">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-[56px] p-12 lg:p-24 text-center relative overflow-hidden flex flex-col items-center border-2 border-brand-action/30"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-action opacity-5 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full" />
            
            <div className="w-24 h-24 rounded-full bg-brand-action/10 flex items-center justify-center mb-10 text-brand-action">
              <HeartHandshake size={48} className="animate-pulse" />
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-[1.1]">Support Our Mission.</h2>
            <p className="text-xl lg:text-2xl text-foreground/70 max-w-2xl font-medium leading-relaxed mb-12">
              CVForge is 100% free and community-driven. Your donations help us maintain servers and keep premium tools accessible to everyone.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
               <button className="px-12 py-5 bg-brand-action text-white rounded-[24px] font-black text-xl flex items-center space-x-3 shadow-xl hover:shadow-brand-action/40 hover:-translate-y-1 transition-all">
                  <span>Support via Paystack</span>
               </button>
               <button className="px-12 py-5 bg-white/10 dark:bg-white/5 border border-border-custom rounded-[24px] font-black text-xl flex items-center space-x-3 hover:bg-white/20 transition-all">
                  <span>Flutterwave</span>
               </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-32 pb-16 px-4 bg-background relative z-10 border-t border-border-custom">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
             <div className="lg:col-span-2 space-y-8">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-action rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Sparkles size={24} />
                  </div>
                  <span className="text-3xl font-black tracking-tighter">CV<span className="text-brand-action">Forge</span></span>
               </div>
               <p className="text-foreground/50 text-xl font-medium max-w-sm">
                 The world's most accessible premium CV crafting platform. Empowering careers since 2026.
               </p>
               <div className="flex space-x-5">
                  {[Github, Heart, Sparkles].map((I, i) => (
                    <Link key={i} href="#" className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-foreground/40 hover:text-brand-action hover:scale-110 transition-all duration-300">
                      <I size={22} />
                    </Link>
                  ))}
               </div>
             </div>

             <div className="space-y-8">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/30">Platform</h4>
                <div className="flex flex-col space-y-5">
                   {['Templates', 'Dashboard', 'ATS Checker', 'Pricing (Free)'].map(item => (
                     <Link key={item} href="#" className="font-bold text-lg hover:text-brand-action transition-colors">{item}</Link>
                   ))}
                </div>
             </div>

             <div className="space-y-8">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/30">Company</h4>
                <div className="flex flex-col space-y-5">
                   {['Our Vision', 'Privacy Policy', 'Terms of Service', 'Support'].map(item => (
                     <Link key={item} href="#" className="font-bold text-lg hover:text-brand-action transition-colors">{item}</Link>
                   ))}
                </div>
             </div>
          </div>
          
          <div className="pt-16 border-t border-border-custom flex flex-col md:flex-row justify-between items-center gap-8">
             <p className="text-sm font-bold text-foreground/30 uppercase tracking-widest">© 2026 CVForge Project. All rights reserved.</p>
             <div className="flex items-center space-x-2 text-foreground/30">
                <span className="text-sm font-bold uppercase tracking-widest">Crafted with</span>
                <Heart size={14} className="text-brand-error animate-pulse fill-brand-error" />
                <span className="text-sm font-bold uppercase tracking-widest">Globally</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
