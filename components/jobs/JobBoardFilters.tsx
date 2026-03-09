"use client"

import { JobFilters } from "@/app/admin/jobs/job-actions"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, ChevronDown, Check, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import countriesData from "@/lib/countries-data.json"

interface Props {
  initialFilters: JobFilters
}

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Remote"]

export function JobBoardFilters({ initialFilters }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [countries, setCountries] = useState<string[]>(["Remote"])
  const [loadingCountries, setLoadingCountries] = useState(false)

  const [countrySearch, setCountrySearch] = useState("")
  const [stateSearch, setStateSearch] = useState("")
  const [activeStates, setActiveStates] = useState<string[]>([])

  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true)
      try {
        const response = await fetch('/api/countries')
        const data = await response.json()
        if (Array.isArray(data)) {
          const names = data.map((c: any) => c.name).filter((name: string) => name !== "Remote")
          const sortedNames = names.sort((a: string, b: string) => a.localeCompare(b))
          setCountries(["Remote", ...sortedNames])
        }
      } catch (error) {
        console.error('Error fetching countries:', error)
      } finally {
        setLoadingCountries(false)
      }
    }
    fetchCountries()
  }, [])

  const filteredCountries = countries.filter(c => 
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
    params.set("page", "1") // Reset to page 1 on filter
    router.push(`/jobs/board?${params.toString()}`, { scroll: false })
    setActiveDropdown(null)
  }

  const clearFilters = () => {
    router.push('/jobs/board')
  }

  const currentCountry = searchParams.get("country")
  const currentState = searchParams.get("state")
  const currentType = searchParams.get("type")

  // Update states list when country changes
  useEffect(() => {
    if (currentCountry) {
      const country = countriesData.find(c => c.name === currentCountry)
      if (country && country.states) {
        setActiveStates(country.states.map(s => s.name).sort())
      } else {
        setActiveStates([])
      }
    } else {
      setActiveStates([])
    }
  }, [currentCountry])

  const filteredStates = activeStates.filter(s => 
    s.toLowerCase().includes(stateSearch.toLowerCase())
  )

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
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-[#020617] border border-border-custom rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-brand-action text-slate-900 dark:text-slate-100"
                    autoFocus
                  />
                </div>
                <div className="p-1 max-h-[280px] min-h-[100px] overflow-y-auto bg-white dark:bg-[#0F172A] scrollbar-thin scrollbar-thumb-brand-action">
                  <button
                    onClick={() => updateFilters({ country: null, state: null })}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-brand-action hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    All Countries
                    {!currentCountry && <Check size={14} className="text-white" />}
                  </button>
                  {loadingCountries ? (
                    <div className="px-3 py-10 text-xs font-bold text-slate-500 dark:text-slate-400 text-center flex flex-col items-center gap-2 bg-white dark:bg-[#0F172A]">
                       <div className="w-5 h-5 border-2 border-brand-action border-t-transparent rounded-full animate-spin" />
                       Loading...
                    </div>
                  ) : filteredCountries.length === 0 ? (
                    <div className="px-3 py-10 text-xs font-bold text-slate-500 dark:text-slate-400 text-center bg-white dark:bg-[#0F172A]">No results for "{countrySearch}"</div>
                  ) : filteredCountries.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateFilters({ country: c, state: null })}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-brand-action hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors text-left bg-white dark:bg-[#0F172A] mt-1"
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

        {/* State Filter */}
        {activeStates.length > 0 && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <label className="text-[9px] font-bold uppercase tracking-widest text-foreground/40 pl-2">State / Province</label>
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'state' ? null : 'state')}
                className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border-custom rounded-2xl text-xs font-bold text-foreground transition-all shadow-sm"
              >
                <span className={currentState ? 'text-foreground' : 'text-foreground/40'}>
                  {currentState || "Select State"}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'state' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'state' && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-[#0F172A] border border-border-custom rounded-2xl shadow-xl overflow-hidden">
                  <div className="p-2 border-b border-border-custom bg-white dark:bg-[#0F172A]">
                    <input 
                      type="text"
                      placeholder="Search states..."
                      value={stateSearch}
                      onChange={(e) => setStateSearch(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-[#020617] border border-border-custom rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-brand-action/30 text-slate-900 dark:text-slate-100"
                      autoFocus
                    />
                  </div>
                  <div className="p-1 max-h-[280px] overflow-y-auto bg-white dark:bg-[#0F172A]">
                    <button
                      onClick={() => updateFilters({ state: null })}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-brand-action hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors bg-white dark:bg-[#0F172A]"
                    >
                      All States
                      {!currentState && <Check size={14} className="text-white" />}
                    </button>
                    {filteredStates.length === 0 ? (
                      <div className="px-3 py-10 text-xs font-bold text-slate-500 dark:text-slate-400 text-center bg-white dark:bg-[#0F172A]">No results for "{stateSearch}"</div>
                    ) : filteredStates.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateFilters({ state: s })}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-brand-action hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors text-left bg-white dark:bg-[#0F172A] mt-1"
                      >
                        <span className="truncate pr-4">{s}</span>
                        {currentState === s && <Check size={14} className="text-white shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Job Type Filter */}
        <div className="space-y-2">
          <label className="text-[9px] font-bold uppercase tracking-widest text-foreground/40 pl-2">Job Type</label>
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
              className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border-custom rounded-2xl text-xs font-bold text-foreground transition-all shadow-sm"
            >
              <span className={currentType ? 'text-foreground' : 'text-foreground/40'}>
                {currentType || "Select Type"}
              </span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === 'type' ? 'rotate-180' : ''}`} />
            </button>
            
            {activeDropdown === 'type' && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-[#0F172A] border border-border-custom rounded-2xl shadow-xl overflow-hidden">
                <div className="p-1 max-h-[280px] overflow-y-auto bg-white dark:bg-[#0F172A]">
                  <button
                    onClick={() => updateFilters({ type: null })}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-brand-action hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors bg-white dark:bg-[#0F172A]"
                  >
                    All Types
                    {!currentType && <Check size={14} className="text-white" />}
                  </button>
                  {JOB_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => updateFilters({ type: t })}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-brand-action hover:text-white text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors bg-white dark:bg-[#0F172A] mt-1"
                    >
                      {t}
                      {currentType === t && <Check size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Tokens */}
      {(currentCountry || currentState || currentType) && (
        <div className="flex flex-wrap gap-2 pt-4">
          {currentCountry && (
            <button 
              onClick={() => updateFilters({ country: null, state: null })}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-action/10 border border-brand-action/20 text-brand-action text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand-action/20 transition-all"
            >
              {currentCountry}
              <X size={10} />
            </button>
          )}
          {currentState && (
            <button 
              onClick={() => updateFilters({ state: null })}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-action/10 border border-brand-action/20 text-brand-action text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand-action/20 transition-all"
            >
              {currentState}
              <X size={10} />
            </button>
          )}
          {currentType && (
            <button 
              onClick={() => updateFilters({ type: null })}
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
