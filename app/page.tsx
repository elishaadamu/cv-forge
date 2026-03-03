"use client"

import { Navbar } from "@/components/Navbar"
import { Star, Github, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Hero } from "@/components/landing/Hero"
import { ImpactStats } from "@/components/landing/ImpactStats"
import { RecruiterInsight } from "@/components/landing/RecruiterInsight"
import { Workflow } from "@/components/landing/Workflow"
import { Testimonials } from "@/components/landing/Testimonials"
import { DonationSection } from "@/components/landing/DonationSection"
import { FAQ } from "@/components/landing/FAQ"
import { Features } from "@/components/landing/Features"
import { TemplateShowcase } from "@/components/landing/TemplateShowcase"
import { StrategicPillars } from "@/components/landing/StrategicPillars"
import { BackToTop } from "@/components/landing/BackToTop"
import { RecentBlogs } from "@/components/landing/RecentBlogs"
import { Footer } from "@/components/Footer"

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

      <main>
        <Hero />
        
        <TemplateShowcase />

        <div id="stats">
          <ImpactStats />
        </div>

        <StrategicPillars />
        
        <Workflow />
        
        <Features />
        
        <RecentBlogs />

        <RecruiterInsight />
        
        <Testimonials />
        
        <FAQ />
        
        <DonationSection />
      </main>

      <BackToTop />

      <Footer />
    </div>
  )
}
