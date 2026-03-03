"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Heart, Star, Facebook, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="pt-32 pb-16 px-4 bg-brand-primary text-white relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center space-x-4 group" aria-label="cvmyjob home">
              <div className="relative w-14 h-14 bg-white/5 backdrop-blur-md rounded-2xl p-2 border border-white/10 transition-transform group-hover:scale-105" aria-hidden="true">
                <Image 
                  src="/logo.png" 
                  alt="" 
                  fill 
                  className="object-contain p-2"
                  sizes="56px"
                  quality={80}
                />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xs font-black uppercase tracking-[0.4em] text-brand-secondary opacity-90 leading-none">Global</span>
                <span className="text-3xl font-black tracking-tighter text-white">
                  CV<span className="bg-linear-to-r from-brand-action to-brand-secondary bg-clip-text text-transparent">MYJOB</span>
                </span>
              </div>
            </Link>
            <p className="text-white/70 text-xl font-medium max-w-sm">
              The world's most accessible premium CV crafting platform. Empowering careers since 2026.
            </p>
            <div className="flex space-x-3">
              {[
                { Icon: Github, name: "GitHub", href: "https://github.com/elishaadamu/" },
                { Icon: Linkedin, name: "LinkedIn", href: "https://www.linkedin.com/in/elisha-adamu-505552134/" },
                { Icon: Facebook, name: "Facebook", href: "https://web.facebook.com/elisha.adamu.92" },
              ].map((item, i) => (
                <Link key={i} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.name} className="w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center text-white/50 hover:text-brand-action hover:bg-white/10 hover:scale-110 transition-all duration-300">
                  <item.Icon size={20} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">Platform</h3>
            <div className="flex flex-col space-y-5">
              {[
                { name: 'Templates', href: '/templates' },
                { name: 'Cover Letter', href: '/cover-letter' },
                { name: 'ATS Checker', href: '/ats' },
                { name: 'Document Converter', href: '#tools' },
                { name: 'Dashboard', href: '/dashboard' }
              ].map(item => (
                <Link key={item.name} href={item.href} className="font-bold text-lg text-white/90 hover:text-brand-action transition-colors">{item.name}</Link>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">Legal</h3>
            <div className="flex flex-col space-y-5">
              {[
                { name: 'Terms of Service', href: '/terms-of-service' },
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Cookies Policy', href: '/cookies-policy' },
                { name: 'Support', href: '/support' }
              ].map(item => (
                <Link key={item.name} href={item.href} className="font-bold text-lg text-white/90 hover:text-brand-action transition-colors">{item.name}</Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm font-bold text-white/50 uppercase tracking-widest">© 2026 cvmyjob. All rights reserved.</p>
          <div className="flex items-center space-x-2 text-white/50">
            <span className="text-sm font-bold uppercase tracking-widest">Crafted with</span>
            <Heart size={14} className="text-brand-error animate-pulse fill-brand-error" aria-hidden="true" />
            <span className="text-sm font-bold uppercase tracking-widest">Globally</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
