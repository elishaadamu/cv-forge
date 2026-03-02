"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Menu, X, Sun, Moon, Sparkles, User, FileText, LayoutDashboard, SearchCode, MailQuestion, LogOut, Settings, ChevronDown, FilePen, Repeat } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

const publicLinks = [
  { name: "Features", href: "/features", icon: Sparkles },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Cover Letter", href: "/cover-letter", icon: FilePen },
  { name: "ATS Checker", href: "/ats", icon: SearchCode },
  { name: "Tools", href: "/tools", icon: Repeat },
  { name: "Support", href: "/support", icon: MailQuestion },
]

const protectedLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ...publicLinks,
]

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isBuilderFullscreen, setIsBuilderFullscreen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession()
 
  useEffect(() => {
    setMounted(true)
    
    // Check for builder-fullscreen class on body
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
 
  if (!mounted) return null
 
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")
  const links = session ? protectedLinks : publicLinks
 
  return (
    <nav className={`fixed left-0 right-0 z-[200] glass-nav transition-all duration-500 ease-in-out ${
      isBuilderFullscreen 
      ? "bottom-0 top-auto shadow-[0_-4px_30px_rgba(0,0,0,0.1)] rounded-t-[32px] border-b-0 border-t" 
      : "top-0 shadow-sm border-t-0 border-b"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3 group animate-in fade-in slide-in-from-left-4 duration-1000">
            <div className="relative w-11 h-11 bg-white/5 backdrop-blur-md rounded-xl p-1.5 border border-white/10 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-2xl">
              <Image 
                src="/logo.png" 
                alt="cvmyjob Logo" 
                fill 
                className="object-contain p-2"
                priority
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
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-white/90 hover:text-white transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-5">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all outline-none"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
            </button>

            {status === "authenticated" ? (
              <div className="relative group/dropdown">
                <button
                  className="flex items-center space-x-3 bg-white/5 border border-border-custom pl-4 pr-5 py-2 rounded-[20px] hover:bg-white/10 transition-all group"
                >
                  <div className="relative">
                    {session.user?.image ? (
                      <Image 
                        src={session.user.image} 
                        alt={session.user.name || "User"} 
                        width={36} 
                        height={36} 
                        className="rounded-xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-brand-action/20 flex items-center justify-center text-brand-action font-black shadow-inner">
                        {session.user?.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-success border-2 border-background rounded-full shadow-sm" />
                  </div>
                  <div className="flex flex-col -space-y-0.5 text-left">
                    <span className="text-[9px] font-black tracking-widest leading-none text-brand-secondary uppercase opacity-80">Member</span>
                    <span className="text-sm font-black text-white truncate max-w-[110px] tracking-tight">{session.user?.name || "Member"}</span>
                  </div>
                  <ChevronDown size={14} className="text-white/40 group-hover/dropdown:rotate-180 transition-transform duration-300" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full pt-4 opacity-0 translate-y-2 pointer-events-none group-hover/dropdown:opacity-100 group-hover/dropdown:translate-y-0 group-hover/dropdown:pointer-events-auto transition-all duration-300 z-210">
                  <div className="w-64 glass bg-white/98 dark:bg-transparent border border-border-custom rounded-[24px] shadow-2xl overflow-hidden p-2">
                    <div className="px-4 py-3 border-b border-border-custom mb-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-action mb-1">Account</p>
                      <p className="text-sm font-black text-foreground truncate">{session.user?.email}</p>
                    </div>
                    
                    <Link 
                      href="/dashboard/settings"
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group/item"
                    >
                      <div className="w-10 h-10 rounded-lg bg-brand-action/20 flex items-center justify-center text-brand-action group-hover/item:bg-brand-action group-hover/item:text-white transition-all">
                        <Settings size={18} />
                      </div>
                      <span className="font-bold text-sm">Settings</span>
                    </Link>

                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-500/10 transition-all group/logout"
                    >
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500 group-hover/logout:bg-red-500 group-hover/logout:text-white transition-all">
                        <LogOut size={18} />
                      </div>
                      <span className="font-bold text-sm text-red-500">Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : status === "loading" ? (
              <div className="w-32 h-10 bg-white/5 animate-pulse rounded-xl" />
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  href="/login"
                  className="text-sm font-bold text-white/90 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 bg-brand-action text-white rounded-xl font-bold hover:bg-brand-action/90 transition-all shadow-md active:scale-95 flex items-center space-x-2"
                >
                  <User size={18} />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
             <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all outline-none"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-white" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="text-brand-action" /> : <Menu className="text-white" />}
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
            className="md:hidden bg-background border-t border-border-custom overflow-hidden"
          >
            <div className="px-4 py-8 space-y-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-brand-primary/5 transition-colors"
                >
                  <link.icon className="w-5 h-5 text-brand-action" />
                  <span className="text-lg font-medium">{link.name}</span>
                </Link>
              ))}
              
              <div className="pt-6 border-t border-border-custom">
                {status === "authenticated" ? (
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      signOut()
                    }}
                    className="w-full flex justify-center items-center h-14 bg-red-500/10 text-red-500 rounded-2xl font-bold text-lg active:scale-95"
                  >
                    <LogOut size={20} className="mr-2" />
                    Sign Out
                  </button>
                ) : (
                  <div className="space-y-4">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex justify-center items-center h-14 bg-white/5 border border-border-custom text-foreground rounded-2xl font-bold text-lg active:scale-95"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex justify-center items-center h-14 bg-brand-action text-white rounded-2xl font-bold text-lg shadow-lg active:scale-95"
                    >
                      <User size={20} className="mr-2" />
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
