"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Search, Filter, X, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AdminFilterProps {
  placeholder: string
  filterOptions: { label: string; value: string }[]
  filterKey: string
}

export function AdminFilters({ placeholder, filterOptions, filterKey }: AdminFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    if (query) {
      params.set("q", query)
    } else {
      params.delete("q")
    }
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(filterKey, value)
    } else {
      params.delete(filterKey)
    }
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
    setIsDropdownOpen(false)
  }

  const clearFilters = () => {
    setQuery("")
    const params = new URLSearchParams()
    router.push(pathname)
  }

  const activeFilterValue = searchParams.get(filterKey) || ""
  const activeFilterLabel = filterOptions.find(opt => opt.value === activeFilterValue)?.label || "All Types"

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 w-full">
      <form onSubmit={handleSearch} className="relative flex-1 w-full group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand-action transition-colors" size={18} />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder} 
          className="w-full bg-secondary/5 border border-gray-300 focus:border-brand-action/40 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
        />
      </form>
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:flex-none" ref={dropdownRef}>
            <button 
               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
               className="flex items-center justify-between gap-3 bg-secondary/5 hover:bg-secondary border border-gray-300 px-5 py-3 rounded-2xl text-sm font-black transition-all w-full md:w-64 text-foreground"
            >
                <div className="flex items-center gap-2">
                   <Filter size={14} className="text-brand-action" />
                   <span className="truncate">{activeFilterLabel}</span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''} opacity-40`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 right-0 md:left-auto md:w-64 mt-2 z-100"
                >
                  <div className="bg-white dark:bg-[#0f0f0f] border border-gray-300 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1.5 backdrop-blur-xl">
                    <button 
                       onClick={() => handleFilterChange("")}
                       className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeFilterValue === "" ? 'bg-brand-action text-white' : 'hover:bg-secondary text-foreground'}`}
                    >
                       All Types
                    </button>
                    {filterOptions.map(opt => (
                      <button 
                         key={opt.value}
                         onClick={() => handleFilterChange(opt.value)}
                         className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeFilterValue === opt.value ? 'bg-brand-action text-white' : 'hover:bg-secondary text-foreground'}`}
                      >
                         {opt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
        
        {(query || searchParams.toString()) && (
          <button 
            onClick={clearFilters}
            className="p-3.5 bg-secondary/30 hover:bg-red-500/10 rounded-2xl text-muted-foreground hover:text-red-500 transition-all active:scale-95"
            title="Clear all filters"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
