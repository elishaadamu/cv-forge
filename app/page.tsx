"use client"

import { Navbar } from "@/components/Navbar"
import { Star, Github, Heart } from "lucide-react"
import Link from "next/link"
import { Hero } from "@/components/landing/Hero"
import { ImpactStats } from "@/components/landing/ImpactStats"
import { RecruiterInsight } from "@/components/landing/RecruiterInsight"
import { Workflow } from "@/components/landing/Workflow"
import { Testimonials } from "@/components/landing/Testimonials"
import { DonationSection } from "@/components/landing/DonationSection"
import { FAQ } from "@/components/landing/FAQ"
import { TechStack } from "@/components/landing/TechStack"
import { Features } from "@/components/landing/Features"
import { BackToTop } from "@/components/landing/BackToTop"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden selection:bg-brand-action/30">
      {/* Square Grid Background - Responsive Colors */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.08]" 
           style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.06] dark:opacity-[0.12]" 
           style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '200px 200px' }} 
      />
      
      <Navbar />

      <Hero />
      
      <div id="stats">
        <ImpactStats />
      </div>
      
      <Workflow />
      
      <TechStack />
      
      <Features />
      
      <RecruiterInsight />
      
      <Testimonials />
      
      <FAQ />
      
      <DonationSection />

      <BackToTop />

      {/* Footer */}
      <footer className="pt-32 pb-16 px-4 bg-background relative z-10 border-t border-border-custom">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
             <div className="lg:col-span-2 space-y-8">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-action rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Star size={24} />
                  </div>
                  <span className="text-3xl font-black tracking-tighter">CV<span className="text-brand-action">Forge</span></span>
               </div>
               <p className="text-foreground/50 text-xl font-medium max-w-sm">
                 The world's most accessible premium CV crafting platform. Empowering careers since 2026.
               </p>
               <div className="flex space-x-5">
                  {[Github, Heart, Star].map((I, i) => (
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
