"use client"

import { JobFilters } from "@/app/admin/jobs/job-actions"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, ChevronDown, Check, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface Props {
  initialFilters: JobFilters
}

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Remote"]
const COUNTRIES = ["Nigeria", "United Kingdom", "United States", "Canada", "Germany", "Remote"]

export function JobBoardFilters({ initialFilters }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  
  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set("page", "1") // Reset to page 1 on filter
    router.push(`/jobs/board?${params.toString()}`, { scroll: false })
    setActiveDropdown(null)
  }

  const clearFilters = () => {
    router.push('/jobs/board')
  }

  const currentCountry = searchParams.get("country")
  const currentType = searchParams.get("type")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-brand-action" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Filters</h3>
        </div>
        {(currentCountry || currentType) && (
          <button 
            onClick={clearFilters}
            className="text-[9px] font-black uppercase tracking-widest text-brand-action underline underline-offset-4 hover:opacity-70 transition-opacity"
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
              className="w-full flex items-center justify-between px-4 py-3 bg-foreground/5 hover:bg-foreground/10 border border-border-custom rounded-2xl text-xs font-bold text-foreground transition-all"
            >
              <span className={currentCountry ? 'text-foreground' : 'text-foreground/40'}>
                {currentCountry || "Select Country"}
              </span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'country' ? 'rotate-180' : ''}`} />
            </button>
            
            {activeDropdown === 'country' && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border border-border-custom rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200">
                <div className="p-1">
                  <button
                    onClick={() => updateFilter('country', null)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-foreground/5 text-xs font-bold text-foreground/60 transition-colors"
                  >
                    All Countries
                    {!currentCountry && <Check size={14} className="text-brand-action" />}
                  </button>
                  {COUNTRIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateFilter('country', c)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-foreground/5 text-xs font-bold text-foreground transition-colors"
                    >
                      {c}
                      {currentCountry === c && <Check size={14} className="text-brand-action" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Type Filter */}
        <div className="space-y-2">
          <label className="text-[9px] font-bold uppercase tracking-widest text-foreground/40 pl-2">Job Type</label>
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
              className="w-full flex items-center justify-between px-4 py-3 bg-foreground/5 hover:bg-foreground/10 border border-border-custom rounded-2xl text-xs font-bold text-foreground transition-all"
            >
              <span className={currentType ? 'text-foreground' : 'text-foreground/40'}>
                {currentType || "Select Type"}
              </span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'type' ? 'rotate-180' : ''}`} />
            </button>
            
            {activeDropdown === 'type' && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border border-border-custom rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200">
                <div className="p-1">
                  <button
                    onClick={() => updateFilter('type', null)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-foreground/5 text-xs font-bold text-foreground/60 transition-colors"
                  >
                    All Types
                    {!currentType && <Check size={14} className="text-brand-action" />}
                  </button>
                  {JOB_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => updateFilter('type', t)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-foreground/5 text-xs font-bold text-foreground transition-colors"
                    >
                      {t}
                      {currentType === t && <Check size={14} className="text-brand-action" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Tokens */}
      {(currentCountry || currentType) && (
        <div className="flex flex-wrap gap-2 pt-4">
          {currentCountry && (
            <button 
              onClick={() => updateFilter('country', null)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-action/10 border border-brand-action/20 text-brand-action text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand-action/20 transition-all"
            >
              {currentCountry}
              <X size={10} />
            </button>
          )}
          {currentType && (
            <button 
              onClick={() => updateFilter('type', null)}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-action/10 border border-brand-action/20 text-brand-action text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand-action/20 transition-all"
            >
              {currentType}
              <X size={10} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
