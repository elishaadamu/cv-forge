"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home, Shield } from "lucide-react"

export function Breadcrumbs() {
  const pathname = usePathname()
  const paths = pathname.split("/").filter(Boolean)

  return (
    <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-8 border border-white/10 w-fit px-3 py-1.5 rounded-xl bg-secondary/20">
      <Link href="/" className="hover:text-brand-action transition-colors flex items-center gap-1.5 opacity-60 hover:opacity-100">
        <Home size={10} />
        <span>Grid</span>
      </Link>
      
      {paths.map((path, index) => {
        let href = `/${paths.slice(0, index + 1).join("/")}`
        if (path === "admin") href = "/admin/dashboard"
        
        const isLast = index === paths.length - 1
        const label = path === "admin" ? "Authority" : path.charAt(0).toUpperCase() + path.slice(1)

        return (
          <div key={path} className="flex items-center space-x-2">
            <ChevronRight size={10} className="opacity-30" />
            {isLast ? (
              <span className="text-foreground flex items-center gap-1.5">
                {path === "dashboard" && <Shield size={10} className="text-brand-action" />}
                {label}
              </span>
            ) : (
              <Link href={href} className="hover:text-brand-action transition-colors">
                {label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}
