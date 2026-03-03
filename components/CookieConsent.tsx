"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent-v1"); // Versioning consent
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent-v1", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent-v1", "declined");
    setIsVisible(false);
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-6 right-6 z-50 md:left-auto md:right-8 md:bottom-8 md:max-w-md w-auto"
        >
          <div className="bg-white dark:bg-brand-primary backdrop-blur-2xl rounded-[32px] p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-brand-action/20 relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-action/10 blur-3xl rounded-full" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-action rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-action/20">
                    <Cookie size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-brand-primary dark:text-white">Cookie Consent</h3>
                    <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-brand-secondary underline decoration-brand-secondary/30 underline-offset-4">
                      <ShieldCheck size={12} />
                      <span>Privacy Shield Active</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X size={20} className="text-brand-text-muted" />
                </button>
              </div>

              <p className="text-sm md:text-base text-brand-primary/80 dark:text-white/70 leading-relaxed mb-8 font-medium">
                We use cookies to enhance your experience, serve personalized ads, and analyze our traffic. By clicking <span className="text-brand-action font-black">"Accept All"</span>, you consent to our use of cookies.
              </p>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleAccept}
                  className="w-full py-4 bg-brand-action text-white rounded-2xl font-black text-sm flex items-center justify-center space-x-2 hover:bg-brand-action/90 active:scale-95 transition-all shadow-xl shadow-brand-action/20 group/btn"
                >
                  <span>Accept All Cookies</span>
                  <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                </button>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleDecline}
                    className="flex-1 py-4 bg-black/5 dark:bg-white/5 text-brand-primary dark:text-white/80 rounded-2xl font-black text-sm hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all border border-black/5 dark:border-white/5"
                  >
                    Necessary Only
                  </button>
                  <Link
                    href="/cookies-policy"
                    onClick={() => setIsVisible(false)}
                    className="flex-1 py-4 border border-brand-action/30 text-brand-action rounded-2xl font-black text-sm flex items-center justify-center hover:bg-brand-action/5 active:scale-95 transition-all"
                  >
                    View Policy
                  </Link>
                </div>
              </div>
              
              <p className="mt-6 text-[10px] text-center text-brand-text-muted font-black uppercase tracking-widest opacity-60">
                Crafted for Professional Transparency
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
