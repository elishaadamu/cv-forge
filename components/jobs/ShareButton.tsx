"use client"

import { 
  Share2, 
  Check, 
  Link as LinkIcon, 
  Twitter, 
  Facebook, 
  Mail, 
  MessageCircle, 
  Layout, 
  Instagram,
  ExternalLink
} from "lucide-react"
import { useState } from "react"

export function ShareButton({ variant = "full" }: { variant?: "full" | "icon" }) {
  const [copied, setCopied] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = typeof document !== 'undefined' ? document.title : 'Job Opportunity'

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <MessageCircle size={18} />,
      url: `https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`,
      color: "hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30",
    },
    {
      name: "Twitter",
      icon: <Twitter size={18} />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      color: "hover:bg-blue-400/10 hover:text-blue-400 hover:border-blue-400/30",
    },
    {
      name: "Facebook",
      icon: <Facebook size={18} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-600/30",
    },
    {
      name: "Reddit",
      icon: <Layout size={18} />,
      url: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
      color: "hover:bg-orange-500/10 hover:text-orange-500 hover:border-orange-500/30",
    },
    {
      name: "Email",
      icon: <Mail size={18} />,
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent("Check out this job opportunity: " + shareUrl)}`,
      color: "hover:bg-brand-action/10 hover:text-brand-action hover:border-brand-action/30",
    },
    {
      name: "Instagram",
      icon: <Instagram size={18} />,
      onClick: copyToClipboard, // Instagram doesn't have direct web sharing for links
      isCopy: true,
      color: "hover:bg-pink-500/10 hover:text-pink-500 hover:border-pink-500/30",
    }
  ]

  return (
    <div className="relative">
      <button 
        onClick={() => setShowOptions(!showOptions)}
        className={variant === "full" 
          ? `w-full h-16 rounded-[20px] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border shadow-lg ${
              showOptions ? "bg-brand-action text-white border-brand-action shadow-brand-action/20" : "bg-foreground/5 hover:bg-brand-action/10 text-foreground/60 hover:text-brand-action border-border-custom hover:border-brand-action/30"
            }`
          : `w-[60px] h-[60px] rounded-[20px] flex items-center justify-center transition-all border shadow-lg shrink-0 ${
              showOptions ? "bg-brand-action text-white border-brand-action shadow-brand-action/20" : "bg-foreground/5 hover:bg-brand-action/10 text-foreground/60 hover:text-brand-action border-border-custom hover:border-brand-action/30"
            }`
        }
      >
        <Share2 size={variant === "icon" ? 22 : 18} />
        {variant === "full" && (showOptions ? "Close Options" : "Share Opportunity")}
      </button>

      {showOptions && (
        <div className={`grid grid-cols-2 gap-3 animate-in fade-in duration-300 z-50 ${
          variant === "icon" 
            ? "absolute bottom-full right-0 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto mb-4 w-[360px] p-4 bg-white dark:bg-[#0F172A] border border-border-custom rounded-[24px] shadow-2xl slide-in-from-bottom-2" 
            : "mt-4 slide-in-from-top-2"
        }`}>
          {/* Copy URL Option */}
          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all col-span-2 ${
              copied 
                ? "bg-brand-success/10 text-brand-success border-brand-success/30" 
                : "bg-gray-50 dark:bg-[#020617] text-slate-700 dark:text-slate-300 border-border-custom hover:bg-brand-action/10 hover:text-brand-action hover:border-brand-action/30"
            }`}
          >
            <div className={`p-2 rounded-xl ${copied ? 'bg-brand-success/10' : 'bg-gray-200 dark:bg-white/10'}`}>
              {copied ? <Check size={16} /> : <LinkIcon size={16} />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">
              {copied ? "Link Copied!" : "Copy Job URL"}
            </span>
          </button>

          {/* Social Options */}
          {shareOptions.map((option) => (
            option.url ? (
              <a 
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 p-4 bg-gray-50 dark:bg-[#020617] text-slate-700 dark:text-slate-300 border border-border-custom rounded-2xl transition-all ${option.color}`}
              >
                <div className="shrink-0">{option.icon}</div>
                <span className="text-[10px] font-black uppercase tracking-widest">{option.name}</span>
              </a>
            ) : (
              <button 
                key={option.name}
                onClick={option.onClick}
                className={`flex items-center gap-3 p-4 bg-gray-50 dark:bg-[#020617] text-slate-700 dark:text-slate-300 border border-border-custom rounded-2xl transition-all ${option.color}`}
              >
                <div className="shrink-0">{option.icon}</div>
                <span className="text-[10px] font-black uppercase tracking-widest">{option.name}</span>
              </button>
            )
          ))}
        </div>
      )}
    </div>
  )
}
