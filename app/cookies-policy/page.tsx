"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { Mail, ArrowLeft, ShieldCheck, Cookie } from "lucide-react";
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

export default function CookiesPolicy() {
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
              className="inline-flex items-center text-brand-text-secondary hover:text-brand-action mb-8 transition-colors group"
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
                <Cookie size={28} />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                Cookies <span className="text-brand-action">Policy</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground font-medium">
              <ShieldCheck size={18} className="text-brand-secondary" />
              <span>Protecting your digital footprint</span>
              <span className="mx-2 font-bold">•</span>
              <span>Last updated: March 03, 2026</span>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div variants={itemVariants} className="prose prose-premium max-w-none">
            <p className="text-xl text-foreground/80 leading-relaxed mb-8 font-medium">
              This Cookies Policy explains what Cookies are and how We use them. You should read this policy so You can understand what type of cookies We use, or the information We collect using Cookies and how that information is used.
            </p>

            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-brand-action/5 border border-brand-action/10 rounded-3xl p-8 mb-12 shadow-xs"
            >
              <p className="m-0 text-foreground/70 italic">
                Cookies do not typically contain any information that personally identifies a user, but personal information that We store about You may be linked to the information stored in and obtained from Cookies. For further information on how We use, store and keep your personal data secure, see our Privacy Policy.
              </p>
            </motion.div>

            <p className="text-foreground/90">We do not store sensitive personal information, such as mailing addresses, account passwords, etc. in the Cookies We use.</p>

            <h2 className="text-2xl font-black text-foreground mt-12 mb-6 uppercase tracking-wider">Interpretation and Definitions</h2>
            
            <h3 className="text-xl font-bold text-foreground mb-4">Interpretation</h3>
            <p className="text-foreground/80">The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

            <h3 className="text-xl font-bold text-foreground mb-4">Definitions</h3>
            <p className="text-foreground/80">For the purposes of this Cookies Policy:</p>
            <ul className="space-y-4">
              <li className="text-foreground/80">
                <strong className="text-foreground">Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Cookies Policy) refers to <span className="text-brand-action font-black font-brand">CV My Job</span>.
              </li>
              <li className="text-foreground/80">
                <strong className="text-foreground">Cookies</strong> means small files that are placed on Your computer, mobile device or any other device by a website, containing details of your browsing history on that website among its many uses.
              </li>
              <li className="text-foreground/80">
                <strong className="text-foreground">Website</strong> refers to CV My Job, accessible from <Link href="http://cvmyjob.online" className="text-brand-action hover:underline font-bold">http://cvmyjob.online</Link>.
              </li>
              <li className="text-foreground/80">
                <strong className="text-foreground">You</strong> means the individual accessing or using the Website, or a company, or any legal entity on behalf of which such individual is accessing or using the Website, as applicable.
              </li>
            </ul>

            <h2 className="text-2xl font-black text-foreground mt-16 mb-6 uppercase tracking-wider">The use of the Cookies</h2>
            
            <h3 className="text-xl font-bold text-foreground mb-4">Type of Cookies We Use</h3>
            <p className="text-foreground/80">Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close your web browser.</p>
            <p className="text-foreground/80">Where required by law, We will request your consent before using Cookies that are not strictly necessary. Strictly necessary Cookies are used to provide the Website and cannot be switched off in our systems.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl border border-border-custom bg-card-bg shadow-xs transition-shadow hover:shadow-xl group"
              >
                <div className="flex items-center space-x-3 mb-4 text-brand-action">
                  <span className="font-black uppercase tracking-widest text-xs py-1 px-3 bg-brand-action/10 rounded-full">Essential</span>
                </div>
                <h4 className="text-xl font-black text-foreground mb-2">Necessary / Essential Cookies</h4>
                <p className="text-muted-foreground text-[10px] font-black mb-4 uppercase tracking-[0.2em] opacity-70">Type: Session • Admin: Us</p>
                <p className="text-foreground/70 m-0 leading-relaxed">These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts.</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl border border-border-custom bg-card-bg shadow-xs transition-shadow hover:shadow-xl group"
              >
                <div className="flex items-center space-x-3 mb-4 text-brand-secondary">
                  <span className="font-black uppercase tracking-widest text-xs py-1 px-3 bg-brand-secondary/10 rounded-full">Performance</span>
                </div>
                <h4 className="text-xl font-black text-foreground mb-2">Tracking and Performance Cookies</h4>
                <p className="text-muted-foreground text-[10px] font-black mb-4 uppercase tracking-[0.2em] opacity-70">Type: Persistent • Admin: Google Analytics</p>
                <p className="text-foreground/70 m-0 leading-relaxed">We use <strong className="text-foreground">Google Analytics</strong> to track information about traffic to the Website and how users use the Website. The information gathered may indirectly identify you as a visitor.</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl border border-border-custom bg-card-bg shadow-xs transition-shadow hover:shadow-xl group"
              >
                <div className="flex items-center space-x-3 mb-4 text-brand-warning">
                  <span className="font-black uppercase tracking-widest text-xs py-1 px-3 bg-brand-warning/10 rounded-full">Subscriptions</span>
                </div>
                <h4 className="text-xl font-black text-foreground mb-2">Subscription & Payment Cookies</h4>
                <p className="text-muted-foreground text-[10px] font-black mb-4 uppercase tracking-[0.2em] opacity-70">Type: Persistent • Admin: Us / Payment Providers</p>
                <p className="text-foreground/70 m-0 leading-relaxed">These Cookies allow Us to remember your subscription status and manage recurring services. They are also used by our payment processors to ensure secure transactions and prevent fraud.</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl border border-border-custom bg-card-bg shadow-xs transition-shadow hover:shadow-xl group"
              >
                <div className="flex items-center space-x-3 mb-4 text-brand-action">
                  <span className="font-black uppercase tracking-widest text-xs py-1 px-3 bg-brand-action/10 rounded-full">Preferences</span>
                </div>
                <h4 className="text-xl font-black text-foreground mb-2">Functionality Cookies</h4>
                <p className="text-muted-foreground text-[10px] font-black mb-4 uppercase tracking-[0.2em] opacity-70">Type: Persistent • Admin: Us</p>
                <p className="text-foreground/70 m-0 leading-relaxed">These Cookies allow Us to remember choices You make when You use the Website, such as remembering your login details or language preference for a more personal experience.</p>
              </motion.div>
            </div>

            <h2 className="text-2xl font-black text-foreground mt-16 mb-6 uppercase tracking-wider">Your Choices Regarding Cookies</h2>
            <p className="text-foreground/80">If You'd like to delete Cookies or instruct your web browser to delete or refuse Cookies, please visit the help pages of your web browser:</p>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none pl-0 mt-8">
              {[
                { name: 'Google Chrome', url: 'https://support.google.com/accounts/answer/32050' },
                { name: 'Microsoft Edge', url: 'https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' },
                { name: 'Mozilla Firefox', url: 'https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored' },
                { name: 'Apple Safari', url: 'https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac' }
              ].map((browser) => (
                <li key={browser.name}>
                  <Link 
                    href={browser.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-4 bg-brand-primary/5 dark:bg-white/5 border border-border-custom rounded-2xl hover:bg-brand-action hover:text-white transition-all duration-300 group shadow-xs"
                  >
                    <span className="font-bold text-foreground group-hover:text-white">{browser.name}</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      <ArrowLeft className="rotate-180 w-4 h-4" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-black text-foreground mt-16 mb-6 uppercase tracking-wider">Contact Us</h2>
            <div className="mt-8 flex flex-col md:flex-row items-center p-8 bg-brand-primary dark:bg-brand-action/10 text-white dark:text-foreground rounded-[2.5rem] shadow-2xl overflow-hidden relative group border dark:border-brand-action/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-action opacity-10 blur-3xl -mr-32 -mt-32 rounded-full transition-transform group-hover:scale-150 duration-1000" />
              <div className="w-16 h-16 bg-white/10 dark:bg-brand-action/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-brand-secondary mb-6 md:mb-0 md:mr-8 shrink-0 shadow-inner">
                <Mail size={32} />
              </div>
              <div className="text-center md:text-left relative z-10">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-white/50 dark:text-brand-action mb-2">Need further clarification?</p>
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
