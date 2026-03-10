"use client"

import { ScholarshipRegionFilters } from "@/app/scholarship-region/actions"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, ChevronDown, Check, X } from "lucide-react"
import { useState, useEffect } from "react"

interface Props {
  initialFilters: ScholarshipRegionFilters
}

const COUNTRIES = [
  "International", "Nigeria", "USA", "UK", "Canada", "Germany", "Australia",
  "South Africa", "Ghana", "Kenya", "India", "China", "Japan", "France",
  "Netherlands", "Switzerland", "Sweden"
]

export function ScholarshipRegionFiltersComponent({ initialFilters }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [countrySearch, setCountrySearch] = useState("")

  const filteredCountries = COUNTRIES.filter(c => 
    c.toLowerCase().includes(countrySearch.toLowerCase())
  )
  
  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    }
    params.set("page", "1")
    router.push(`/scholarship-region?${params.toString()}`, { scroll: false })
    setActiveDropdown(null)
  }

  const clearFilters = () => {
    router.push('/scholarship-region')
  }

  const currentCountry = searchParams.get("country")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-emerald-500" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Filters</h3>
        </div>
        {currentCountry && (
          <button 
            onClick={clearFilters}
            className="text-[9px] font-black uppercase tracking-widest text-emerald-500 underline underline-offset-4 hover:opacity-70 transition-opacity"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Country Filter */}
        <div className="space-y-2">
          <label className="text-[9px] font-bold uppercase tracking-widest text-foreground/40 pl-2">Country</label>
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'country' ? null : 'country')}
              className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border-custom rounded-2xl text-xs font-bold text-foreground transition-all shadow-sm"
            >
              <span className={currentCountry ? 'text-foreground' : 'text-foreground/40'}>
                {currentCountry || "Select Country"}
              </span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'country' ? 'rotate-180' : ''}`} />
            </button>
            
            {activeDropdown === 'country' && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-[#0F172A] border border-border-custom rounded-2xl shadow-xl overflow-hidden">
                <div className="p-2 border-b border-border-custom bg-white dark:bg-[#0F172A]">
                  <input 
                    type="text"
                    placeholder="Search countries..."
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-[#020617] border border-border-custom rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                    autoFocus
                  />
                </div>
                <div className="p-1 max-h-[280px] min-h-[100px] overflow-y-auto bg-white dark:bg-[#0F172A] scrollbar-thin scrollbar-thumb-emerald-500">
                  <button
                    onClick={() => updateFilters({ country: null })}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-emerald-500 hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    All Countries
                    {!currentCountry && <Check size={14} className="text-white" />}
                  </button>
                  {filteredCountries.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateFilters({ country: c })}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-emerald-500 hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors text-left bg-white dark:bg-[#0F172A] mt-1"
                    >
                      <span className="truncate pr-4">{c}</span>
                      {currentCountry === c && <Check size={14} className="text-white shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Tokens */}
      {currentCountry && (
        <div className="flex flex-wrap gap-2 pt-4">
          <button 
            onClick={() => updateFilters({ country: null })}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-emerald-500/20 transition-all"
          >
            {currentCountry}
            <X size={10} />
          </button>
        </div>
      )}
    </div>
  )
}
