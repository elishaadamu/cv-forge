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
  ExternalLink,
  Zap
} from "lucide-react"
import { useState } from "react"

export function ShareButton({ 
  variant = "full",
  jobData 
}: { 
  variant?: "full" | "icon" | "ghost",
  jobData?: {
    title: string;
    company: string;
    salary?: string;
    url: string;
    description?: string;
    type?: 'job' | 'scholarship';
  }
}) {
  const [copied, setCopied] = useState(false)
  const [briefCopied, setBriefCopied] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  let shareUrl = '';
  if (typeof window !== 'undefined') {
    shareUrl = window.location.href.replace(window.location.origin, 'https://cvmyjob.online');
  }
  const shareTitle = typeof document !== 'undefined' ? document.title : 'Job Opportunity'

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stripHtml = (html: string) => {
    if (typeof window === 'undefined') return html;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  const copyFullBrief = async () => {
    if (!jobData) return;
    
    const plainDescription = jobData.description ? stripHtml(jobData.description) : "";
    
    const isScholarship = jobData.type === 'scholarship';

    let fullApplyUrl = jobData.url;
    let baseDirectoryUrl = '';
    
    if (typeof window !== 'undefined') {
      if (fullApplyUrl && fullApplyUrl.startsWith('/')) {
        fullApplyUrl = 'https://cvmyjob.online' + fullApplyUrl;
      }
      
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      const basePath = pathSegments.length > 0 ? `/${pathSegments[0]}` : '/jobs';
      baseDirectoryUrl = 'https://cvmyjob.online' + basePath;
    }

    const briefText = isScholarship ? `
🎓 SCHOLARSHIP OPPORTUNITY: ${jobData.title}
🏢 PROVIDER: CVMYJOB
🔗 APPLY HERE: ${fullApplyUrl}

📝 SCHOLARSHIP DETAILS:
${plainDescription.substring(0, 500)}${plainDescription.length > 500 ? "..." : ""}

Check out more scholarships at ${baseDirectoryUrl}
    `.trim() : `
🔥 JOB OPPORTUNITY: ${jobData.title}
🏢 COMPANY: ${jobData.company}
💰 SALARY: ${jobData.salary || "Not Specified"}
🔗 APPLY HERE: ${fullApplyUrl}

📝 JOB DESCRIPTION:
${plainDescription.substring(0, 500)}${plainDescription.length > 500 ? "..." : ""}

Check out more jobs at ${baseDirectoryUrl}
    `.trim();

    await navigator.clipboard.writeText(briefText)
    setBriefCopied(true)
    setTimeout(() => setBriefCopied(false), 2000)
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
          : variant === "ghost"
          ? `w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-border-custom bg-foreground/5 hover:bg-brand-action/10 text-foreground/40 hover:text-brand-action shrink-0 shadow-sm`
          : `w-[60px] h-[60px] rounded-[20px] flex items-center justify-center transition-all border shadow-lg shrink-0 ${
              showOptions ? "bg-brand-action text-white border-brand-action shadow-brand-action/20" : "bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20"
            }`
        }
      >
        <Share2 size={variant === "icon" ? 22 : 18} />
        {variant === "full" && (showOptions ? "Close Options" : "Share Opportunity")}
      </button>

      {showOptions && (
        <>
          {/* Mobile backdrop to obscure the background and close on click */}
          {(variant === "icon" || variant === "ghost") && (
            <div 
              className="fixed inset-0 z-40 bg-black/40 sm:hidden backdrop-blur-sm animate-in fade-in"
              onClick={() => setShowOptions(false)}
            />
          )}
          <div className={`grid grid-cols-2 gap-3 animate-in fade-in duration-300 z-50 ${
            variant === "icon" || variant === "ghost"
              ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:absolute sm:bottom-full sm:top-auto sm:right-0 sm:left-auto sm:translate-x-0 sm:translate-y-0 sm:mb-4 w-[360px] p-4 bg-white dark:bg-[#0F172A] border border-border-custom rounded-[24px] shadow-2xl zoom-in-95 sm:slide-in-from-bottom-2 max-w-[90vw]" 
              : "mt-4 slide-in-from-top-2"
          }`}>
          {/* Copy Full Brief Option */}
          {jobData && (
            <button 
              onClick={copyFullBrief}
              className={`flex items-center gap-3 p-3 md:p-4 rounded-2xl border transition-all col-span-2 ${
                briefCopied 
                  ? "bg-brand-success/10 text-brand-success border-brand-success/30" 
                  : "bg-brand-action/5 dark:bg-brand-action/10 text-brand-action border-brand-action/20 hover:bg-brand-action/20"
              }`}
            >
              <div className={`p-2 rounded-xl ${briefCopied ? 'bg-brand-success/10' : 'bg-brand-action/10'}`}>
                {briefCopied ? <Check size={16} /> : <Zap size={16} />}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-black uppercase tracking-widest text-left">
                  {briefCopied ? "Brief Copied!" : "Copy Full Brief"}
                </span>
                <span className="text-[8px] opacity-50 font-bold">Copy Title, Salary, Link & Info</span>
              </div>
            </button>
          )}

          {/* Copy URL Option */}
          <button 
            onClick={copyToClipboard}
            className={`flex items-center gap-3 p-3 md:p-4 rounded-2xl border transition-all col-span-2 ${
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
                className={`flex items-center gap-3 p-3 md:p-4 bg-gray-50 dark:bg-[#020617] text-slate-700 dark:text-slate-300 border border-border-custom rounded-2xl transition-all ${option.color}`}
              >
                <div className="shrink-0">{option.icon}</div>
                <span className="text-[10px] font-black uppercase tracking-widest">{option.name}</span>
              </a>
            ) : (
              <button 
                key={option.name}
                onClick={option.onClick}
                className={`flex items-center gap-3 p-3 md:p-4 bg-gray-50 dark:bg-[#020617] text-slate-700 dark:text-slate-300 border border-border-custom rounded-2xl transition-all ${option.color}`}
              >
                <div className="shrink-0">{option.icon}</div>
                <span className="text-[10px] font-black uppercase tracking-widest">{option.name}</span>
              </button>
            )
          ))}
        </div>
      </>
      )}
    </div>
  )
}
