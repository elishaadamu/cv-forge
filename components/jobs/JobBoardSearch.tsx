"use client"

import { Search, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export function JobBoardSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") || "")

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search)
      if (query !== (params.get("q") || "")) {
        if (query) {
          params.set("q", query)
        } else {
          params.delete("q")
        }
        params.set("page", "1") // Reset to page 1 on search
        router.push(`/jobs/board?${params.toString()}`, { scroll: false })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [query, router])

  return (
    <div className="relative w-full group">
      <div className="absolute inset-0 bg-brand-action/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
      <div className="relative flex items-center bg-transparent group-focus-within:border-brand-action/50 rounded-[32px] overflow-hidden transition-all">
        <div className="pl-6 pointer-events-none">
          <Search size={20} className="text-muted-foreground group-focus-within:text-brand-action transition-colors" />
        </div>
        <input 
          type="text"
          placeholder="Search for job titles, companies or skills..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full py-5 px-4 bg-transparent outline-none font-bold text-sm text-foreground placeholder:text-muted-foreground/50"
        />
        {query && (
          <button 
            onClick={() => setQuery("")}
            className="pr-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
