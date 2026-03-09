"use client"

import { useState } from "react"
import {Zap, Check } from "lucide-react"

interface JobData {
  title: string;
  company: string;
  salary?: string;
  url: string;
  description?: string;
}

export function CopyBriefButton({ jobData }: { jobData: JobData }) {
  const [copied, setCopied] = useState(false)

  const stripHtml = (html: string) => {
    if (typeof window === 'undefined') return html;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }

  const copyFullBrief = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!jobData) return;
    
    const plainDescription = jobData.description ? stripHtml(jobData.description) : "";
    const shareUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname + window.location.search : '';
    
    const briefText = `
🔥 JOB OPPORTUNITY: ${jobData.title}
🏢 COMPANY: ${jobData.company}
💰 SALARY: ${jobData.salary || "Not Specified"}
🔗 APPLY HERE: ${jobData.url}

📝 JOB DESCRIPTION:
${plainDescription.substring(0, 500)}${plainDescription.length > 500 ? "..." : ""}

Check out more jobs at ${shareUrl}
    `.trim();

    await navigator.clipboard.writeText(briefText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copyFullBrief}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border shrink-0 shadow-sm group/copy ${
        copied 
          ? "bg-brand-success/10 border-brand-success text-brand-success" 
          : "bg-foreground/5 border-border-custom hover:border-brand-action/50 text-foreground/40 hover:text-brand-action hover:bg-brand-action/5"
      }`}
      title={copied ? "Copied!" : "Copy Full Brief"}
    >
      {copied ? <Check size={18} /> : <Zap size={18} className="group-hover/copy:animate-pulse" />}
    </button>
  )
}
