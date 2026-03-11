"use client"

import { useState } from "react"
import { RefreshCw, Play, CheckCircle2, AlertCircle, Loader2, Sparkles, GraduationCap, Share2 } from "lucide-react"
import { runScholarshipScraperAction, runScholarshipRegionScraperAction, runSocialBroadcastAction } from "./actions"

export function ScraperControls() {
  const [loading, setLoading] = useState<string | null>(null)
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [isSocialLoading, setIsSocialLoading] = useState(false)

  const handleRunScraper = async (type: 'graduate' | 'global') => {
    setLoading(type)
    setStatus(null)
    try {
      const res: any = type === 'graduate' 
        ? await runScholarshipScraperAction() 
        : await runScholarshipRegionScraperAction()
      
      if (res.success) {
        setStatus({ type: 'success', message: `${type === 'graduate' ? 'Graduate Programs' : 'Global Scholarships'} updated successfully!` })
      } else {
        setStatus({ type: 'error', message: res.error || "Failed to update" })
      }
    } catch (err) {
      setStatus({ type: 'error', message: "An unexpected error occurred" })
    } finally {
      setLoading(null)
    }
  }

  const handleRunSocial = async () => {
    setIsSocialLoading(true)
    setStatus(null)
    try {
      const res: any = await runSocialBroadcastAction()
      if (res.success) {
        setStatus({ type: 'success', message: res.message || "Social broadcast initiated successfully!" })
      } else {
        setStatus({ type: 'error', message: res.error || "Failed to initiate social broadcast" })
      }
    } catch (err) {
      setStatus({ type: 'error', message: "An unexpected error occurred during social broadcast" })
    } finally {
      setIsSocialLoading(false)
    }
  }

  return (
    <div className="bg-card glass rounded-[32px] p-8 shadow-2xl border border-white/5 space-y-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <RefreshCw size={120} className="rotate-12" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-action">
            <Sparkles size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Data Pipeline</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Scraper <span className="text-brand-action">Command Center</span></h2>
          <p className="text-muted-foreground text-xs font-bold leading-relaxed max-w-md">
            Trigger deep-web crawlers to refresh opportunities and broadcast updates to your social community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Graduate Programs Scraper */}
          <button
            onClick={() => handleRunScraper('graduate')}
            disabled={loading !== null || isSocialLoading}
            className="group/btn relative flex flex-col items-start p-6 bg-secondary/30 hover:bg-brand-action/10 border border-white/5 hover:border-brand-action/30 rounded-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-action/10 flex items-center justify-center text-brand-action group-hover/btn:scale-110 transition-transform">
                <GraduationCap size={20} />
              </div>
              {loading === 'graduate' ? (
                <Loader2 size={16} className="animate-spin text-brand-action" />
              ) : (
                <Play size={14} className="text-brand-action opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              )}
            </div>
            <div className="text-left space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Nexus: SmartyAcad</span>
              <p className="text-sm font-black text-foreground">Update Programs</p>
            </div>
          </button>

          {/* Global Scholarships Scraper */}
          <button
            onClick={() => handleRunScraper('global')}
            disabled={loading !== null || isSocialLoading}
            className="group/btn relative flex flex-col items-start p-6 bg-secondary/30 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 rounded-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover/btn:scale-110 transition-transform">
                <RefreshCw size={20} />
              </div>
              {loading === 'global' ? (
                <Loader2 size={16} className="animate-spin text-emerald-500" />
              ) : (
                <Play size={14} className="text-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              )}
            </div>
            <div className="text-left space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Nexus: ScholarshipRegion</span>
              <p className="text-sm font-black text-foreground">Update Global</p>
            </div>
          </button>

          {/* Social Social Broadcast */}
          <button
            onClick={handleRunSocial}
            disabled={loading !== null || isSocialLoading}
            className="group/btn relative flex flex-col items-start p-6 bg-secondary/30 hover:bg-orange-500/10 border border-white/5 hover:border-orange-500/30 rounded-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover/btn:scale-110 transition-transform">
                <Share2 size={20} />
              </div>
              {isSocialLoading ? (
                <Loader2 size={16} className="animate-spin text-orange-500" />
              ) : (
                <Play size={14} className="text-orange-500 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              )}
            </div>
            <div className="text-left space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Social Sync</span>
              <p className="text-sm font-black text-foreground">Broadcast latest</p>
            </div>
          </button>
        </div>

        {status && (
          <div className={`flex items-center gap-3 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 ${
            status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <p className="text-xs font-black uppercase tracking-widest">{status.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}
