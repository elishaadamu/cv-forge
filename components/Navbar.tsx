"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Menu, X, Sun, Moon, Sparkles, User, FileText, LayoutDashboard, SearchCode, MailQuestion, LogOut, Settings, ChevronDown, FilePen, Repeat, Shield, Briefcase, Search, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

const navCategories = [
  {
    name: "Products",
    links: [
      { name: "Templates", href: "/templates", icon: FileText, desc: "Professional layouts for every industry" },
      { name: "Cover Letter", href: "/cover-letter", icon: FilePen, desc: "Personalized narratives that sell" },
      { name: "ATS Checker", href: "/ats", icon: SearchCode, desc: "Analyze your CV against algorithms" },
      { name: "Document Tools", href: "/tools", icon: Repeat, desc: "Format conversion and optimization" },
    ]
  },
  {
    name: "Job Hub",
    links: [
      { name: "Featured Jobs", href: "/jobs/board", icon: Zap, desc: "Curated picks posted by CVMyJob team" },
      { name: "Global Aggregates", href: "/jobs/search", icon: Search, desc: "Search Indeed, LinkedIn & Glassdoor" },
      { name: "Remote Jobs", href: "/jobs", icon: Briefcase, desc: "Curated work-from-anywhere roles" },
    ]
  },
  {
    name: "Resources",
    links: [
      { name: "Career Blog", href: "/blog", icon: FileText, desc: "Strategic advice from experts" },
      { name: "Support Center", href: "/support", icon: MailQuestion, desc: "Quality assistance for your journey" },
    ]
  }
]

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isBuilderFullscreen, setIsBuilderFullscreen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession()
 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  useEffect(() => {
    setMounted(true)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsBuilderFullscreen(document.body.classList.contains("builder-fullscreen"))
        }
      })
    })
    observer.observe(document.body, { attributes: true })
    setIsBuilderFullscreen(document.body.classList.contains("builder-fullscreen"))
    return () => observer.disconnect()
  }, [])
 
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")
 
  return (
    <nav 
      ref={navRef}
      className={`fixed left-0 right-0 z-200 glass-nav transition-all duration-500 ease-in-out ${
      isBuilderFullscreen 
      ? "bottom-0 top-auto shadow-[0_-4px_30px_rgba(0,0,0,0.1)] rounded-t-[32px] border-b-0 border-t" 
      : "top-0 shadow-sm border-t-0 border-b"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3 group animate-in fade-in slide-in-from-left-4 duration-1000">
            <div className="relative w-11 h-11 bg-white/5 backdrop-blur-md rounded-xl p-1.5 border border-white/10 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl">
              <Image 
                src="/logo.png" 
                alt="" 
                fill 
                className="object-contain p-2"
                priority
                sizes="48px"
                quality={80}
              />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-secondary leading-none">Global</span>
              <span className="text-2xl font-black tracking-tighter text-white">
                CV<span className="bg-linear-to-r from-brand-action to-brand-secondary bg-clip-text text-transparent">MYJOB</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              href="/features"
              className="px-4 py-2 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-500"
            >
              Features
            </Link>

            {navCategories.map((category) => (
              <div 
                key={category.name} 
                className="relative py-6"
              >
                <button 
                  onClick={() => setOpenDropdown(openDropdown === category.name ? null : category.name)}
                  className="flex items-center space-x-1.5 px-4 py-2 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-500 outline-none"
                >
                  <span>{category.name}</span>
                  <ChevronDown size={14} className={`transition-transform duration-500 opacity-40 ${openDropdown === category.name ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === category.name && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50"
                    >
                      <div className="w-80 bg-brand-primary border border-white/10 rounded-[32px] shadow-2xl overflow-hidden p-3 transition-colors duration-500">
                        <div className="grid grid-cols-1 gap-2">
                          {category.links.map((link) => (
                            <Link 
                              key={link.name} 
                              href={link.href}
                              className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-500 group/link-item"
                            >
                              <div className="w-10 h-10 rounded-xl bg-brand-action/10 flex items-center justify-center text-brand-action group-hover/link-item:bg-brand-action group-hover/link-item:text-white transition-all duration-500">
                                <link.icon size={20} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-black text-sm text-white leading-tight tracking-tight">{link.name}</span>
                                <span className="text-[10px] text-white/40 font-bold group-hover/link-item:text-white/60 transition-colors duration-500">{link.desc}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            
            {status === "authenticated" && (
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-bold text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-500"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-5">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-white/10 transition-all duration-500 outline-none"
              aria-label="Toggle Theme"
            >
              {mounted ? (
                theme === "dark" ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-white" />
              ) : (
                <div className="w-5 h-5 animate-pulse rounded-full bg-white/10" />
              )}
            </button>

            {mounted ? (
              status === "authenticated" ? (
                <div className="relative py-6">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === "user" ? null : "user")}
                    className="flex items-center space-x-3 bg-white/5 border border-white/10 pl-4 pr-5 py-2 rounded-[20px] hover:bg-white/10 transition-all duration-500 group"
                  >
                    <div className="relative">
                      {session?.user?.image ? (
                        <Image 
                          src={session.user.image} 
                          alt="" 
                          width={36} 
                          height={36} 
                          className="rounded-xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-brand-action/20 flex items-center justify-center text-brand-action font-black shadow-inner">
                          {session?.user?.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-success border-2 border-background rounded-full shadow-sm" />
                    </div>
                    <div className="flex flex-col -space-y-0.5 text-left">
                      <span className="text-[9px] font-black tracking-widest leading-none text-brand-secondary uppercase opacity-80">Member</span>
                      <span className="text-sm font-black text-white truncate max-w-[110px] tracking-tight">{session?.user?.name || "Member"}</span>
                    </div>
                    <ChevronDown size={14} className={`text-white/40 transition-transform duration-500 ${openDropdown === "user" ? "rotate-180" : ""}`} />
                  </button>
 
                  <AnimatePresence>
                    {openDropdown === "user" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute right-0 top-full pt-2 z-210"
                    >
                    <div className="w-64 bg-brand-primary border border-white/10 rounded-[24px] shadow-2xl overflow-hidden p-2 transition-colors duration-500">
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-action mb-1">Account</p>
                        <p className="text-sm font-black text-white truncate">{session?.user?.email}</p>
                      </div>
                      
                      <Link 
                        href="/dashboard/settings"
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-500 group/item"
                      >
                        <div className="w-10 h-10 rounded-lg bg-brand-action/20 flex items-center justify-center text-brand-action group-hover/item:bg-brand-action group-hover/item:text-white transition-all duration-500">
                          <Settings size={18} />
                        </div>
                        <span className="font-bold text-sm text-white">Settings</span>
                      </Link>
 
                      {session?.user?.role === "ADMIN" && (
                        <Link 
                          href="/admin/dashboard"
                          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-500 group/admin"
                        >
                          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-500 group-hover/admin:bg-indigo-500 group-hover/admin:text-white transition-all duration-500">
                            <Shield size={18} />
                          </div>
                          <span className="font-bold text-sm text-white">Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/10 transition-all duration-500 group/logout"
                      >
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500 group-hover/logout:bg-red-500 group-hover/logout:text-white transition-all duration-500">
                          <LogOut size={18} />
                        </div>
                        <span className="font-bold text-sm text-red-500">Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : status === "loading" ? (
                <div className="w-32 h-10 bg-white/5 animate-pulse rounded-xl" />
              ) : (
                <div className="flex items-center space-x-6">
                  <Link
                    href="/login"
                    className="text-sm font-bold text-white/90 hover:text-white transition-colors duration-500"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-6 py-2.5 bg-brand-action text-white rounded-xl font-bold hover:bg-brand-action/90 shadow-md active:scale-95 transition-all duration-500 flex items-center space-x-2"
                  >
                    <User size={18} />
                    <span>Get Started</span>
                  </Link>
                </div>
              )
            ) : (
              <div className="w-48 h-10 bg-white/5 animate-pulse rounded-xl" />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
             <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-500 outline-none"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-white" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-500"
              aria-label={isOpen ? "Close Menu" : "Open Menu"}
            >
              {isOpen ? <X className="text-brand-action" aria-hidden="true" /> : <Menu className="text-white" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-8 space-y-8 max-h-[80vh] overflow-y-auto">
              {/* Main Links */}
              <div className="space-y-6">
                <Link
                  href="/features"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-4 p-2 rounded-xl text-xl font-black tracking-tight hover:text-brand-action transition-all duration-500"
                >
                  <Sparkles size={22} className="text-brand-action" />
                  <span>Features</span>
                </Link>

                {navCategories.map((category) => (
                  <div key={category.name} className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 px-2">{category.name}</p>
                    <div className="grid grid-cols-1 gap-2">
                       {category.links.map((link) => (
                         <Link
                           key={link.name}
                           href={link.href}
                           onClick={() => setIsOpen(false)}
                           className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/5 active:scale-[0.98] transition-all duration-500"
                         >
                           <div className="w-10 h-10 rounded-xl bg-brand-action/10 flex items-center justify-center text-brand-action">
                             <link.icon size={20} />
                           </div>
                           <div className="flex flex-col">
                             <span className="font-black text-sm">{link.name}</span>
                             <span className="text-[10px] text-foreground/40 font-bold">{link.desc}</span>
                           </div>
                         </Link>
                       ))}
                    </div>
                  </div>
                ))}

                {status === "authenticated" && (
                   <Link
                     href="/dashboard"
                     onClick={() => setIsOpen(false)}
                     className="flex items-center space-x-4 p-4 rounded-2xl bg-brand-action/5 border border-brand-action/10 active:scale-[0.98] transition-all duration-500"
                   >
                     <div className="w-10 h-10 rounded-xl bg-brand-action/10 flex items-center justify-center text-brand-action">
                       <LayoutDashboard size={20} />
                     </div>
                     <span className="text-lg font-black tracking-tight">Dashboard</span>
                   </Link>
                )}
 
                 {status === "authenticated" && session?.user?.role === "ADMIN" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-4 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 active:scale-[0.98] transition-all duration-500"
                    >
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Shield size={20} />
                      </div>
                      <span className="text-lg font-black tracking-tight text-indigo-500">Admin Dashboard</span>
                    </Link>
                 )}
               </div>
              
              <div className="pt-8 border-t border-white/5">
                {status === "authenticated" ? (
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      signOut()
                    }}
                    className="w-full flex justify-center items-center h-16 bg-red-500/10 text-red-500 rounded-2xl font-black text-lg active:scale-95 transition-all duration-500 border border-red-500/10"
                  >
                    <LogOut size={20} className="mr-3" />
                    Sign Out
                  </button>
                ) : (
                  <div className="space-y-4">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex justify-center items-center h-16 bg-white/5 border border-white/10 text-foreground rounded-2xl font-black text-lg active:scale-95 transition-all duration-500"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex justify-center items-center h-16 bg-brand-action text-white rounded-2xl font-black text-lg shadow-[0_20px_40px_rgba(var(--brand-action-rgb),0.3)] active:scale-95 transition-all duration-500"
                    >
                      <User size={22} className="mr-3" />
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
