"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Menu, X, Sun, Moon, Sparkles, User, FileText, LayoutDashboard, SearchCode, MailQuestion, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

const publicLinks = [
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "ATS Checker", href: "/ats", icon: SearchCode },
  { name: "Support", href: "/support", icon: MailQuestion },
]

const protectedLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  ...publicLinks
]

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { data: session, status } = useSession()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")
  const links = session ? protectedLinks : publicLinks

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-brand-action rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 shadow-md group-hover:shadow-brand-action/30">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">
              CV<span className="text-brand-action">Forge</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-semibold hover:text-brand-action transition-colors duration-200"
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
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-white/5 border border-border-custom px-4 py-2 rounded-2xl">
                  {session.user?.image ? (
                    <Image 
                      src={session.user.image} 
                      alt={session.user.name || "User"} 
                      width={32} 
                      height={32} 
                      className="rounded-full shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-brand-action/20 flex items-center justify-center text-brand-action font-bold">
                      {session.user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-black tracking-tight leading-none text-foreground/80 uppercase">Member</span>
                    <span className="text-sm font-bold text-foreground truncate max-w-[100px]">{session.user?.name}</span>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all outline-none shadow-sm active:scale-95 group"
                  title="Sign Out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : status === "loading" ? (
              <div className="w-32 h-10 bg-white/5 animate-pulse rounded-xl" />
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  href="/login"
                  className="text-sm font-bold hover:text-brand-action transition-colors"
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
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-brand-primary/10 transition-colors"
            >
              {isOpen ? <X className="text-brand-action" /> : <Menu />}
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
