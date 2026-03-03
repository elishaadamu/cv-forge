"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { Mail, ArrowLeft, ShieldCheck, Scale } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1] 
    } as any
  }
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background selection:bg-brand-action/30">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="mb-16">
            <Link 
              href="/" 
              className="inline-flex items-center text-muted-foreground hover:text-brand-action mb-8 transition-colors group"
            >
              <ArrowLeft className="mr-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Link>
            <div className="flex items-center space-x-4 mb-6">
              <motion.div 
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className="w-12 h-12 bg-brand-action/10 rounded-2xl flex items-center justify-center text-brand-action shadow-inner"
              >
                <Scale size={28} />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                Terms <span className="text-brand-action">of Service</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground font-medium">
              <ShieldCheck size={18} className="text-brand-secondary" />
              <span>Defining our professional relationship</span>
              <span className="mx-2 font-bold">•</span>
              <span>Last updated: March 03, 2026</span>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div variants={itemVariants} className="prose prose-premium max-w-none">
            <p className="text-xl text-foreground/80 leading-relaxed mb-8 font-medium">
              These Terms of Service govern your use of the CV My Job website and its associated services. By accessing our platform, you agree to these terms.
            </p>

            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-brand-action/5 border border-brand-action/10 rounded-3xl p-8 mb-12 shadow-xs"
            >
              <p className="m-0 text-foreground/70 italic">
                Our goal is to provide you with high-quality career tools. These terms ensure a fair and secure environment for all our users.
              </p>
            </motion.div>

            <h2 className="text-2xl font-black text-foreground mt-12 mb-6 uppercase tracking-wider">Use License</h2>
            <p className="text-foreground/80 leading-relaxed mb-6">
              Permission is granted to use CV My Job for personal, non-commercial purposes. This includes the generation and download of professional resumes and cover letters.
            </p>
            
            <h3 className="text-xl font-bold text-foreground mb-4">Account Responsibilities</h3>
            <p className="text-foreground/80 leading-relaxed mb-8">
              If you create an account on our platform, you are responsible for maintaining its security and for all activities that occur under your account. You must notify us immediately of any unauthorized uses of your account.
            </p>

            <h2 className="text-2xl font-black text-foreground mt-16 mb-6 uppercase tracking-wider">Limitations</h2>
            <p className="text-foreground/80 leading-relaxed mb-8">
              In no event shall CV My Job or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the platform.
            </p>

            <h2 className="text-2xl font-black text-foreground mt-16 mb-6 uppercase tracking-wider">Governing Law</h2>
            <p className="text-foreground/80 leading-relaxed mb-8">
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>

            <h2 className="text-2xl font-black text-foreground mt-16 mb-6 uppercase tracking-wider">Contact Us</h2>
            <div className="mt-8 flex flex-col md:flex-row items-center p-8 bg-brand-primary dark:bg-brand-action/10 text-white dark:text-foreground rounded-[2.5rem] shadow-2xl overflow-hidden relative group border dark:border-brand-action/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-action opacity-10 blur-3xl -mr-32 -mt-32 rounded-full transition-transform group-hover:scale-150 duration-1000" />
              <div className="w-16 h-16 bg-white/10 dark:bg-brand-action/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-secondary mb-6 md:mb-0 md:mr-8 shrink-0 shadow-inner">
                <Mail size={32} />
              </div>
              <div className="text-center md:text-left relative z-10">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-white/50 dark:text-brand-action mb-2">Legal questions?</p>
                <Link href="mailto:info.cvmyjob@gmail.com" className="text-2xl font-black text-white dark:text-foreground hover:text-brand-secondary dark:hover:text-brand-action transition-colors underline decoration-brand-action decoration-4 underline-offset-8">
                  info.cvmyjob@gmail.com
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}
