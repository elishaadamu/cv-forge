"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, Globe, Zap } from "lucide-react"

export function JobNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Remote Jobs",
      href: "/jobs",
      icon: <Globe size={16} />,
      active: pathname === "/jobs"
    },
    {
      name: "Curated Board",
      href: "/jobs/board",
      icon: <Briefcase size={16} />,
      active: pathname === "/jobs/board"
    },
    {
      name: "Global Search",
      href: "/jobs/search",
      icon: <Zap size={16} />,
      active: pathname === "/jobs/search"
    }
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${
            item.active
              ? "bg-brand-action text-white border-brand-action shadow-lg shadow-brand-action/20 scale-105"
              : "bg-card-bg border-border-custom text-foreground/40 hover:bg-foreground/5 hover:text-foreground"
          }`}
        >
          {item.icon}
          {item.name}
        </Link>
      ))}
    </div>
  )
}
