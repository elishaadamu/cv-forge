"use client"

import { useState } from "react"
import {Zap, Check } from "lucide-react"

interface JobData {
  title: string;
  company: string;
  salary?: string;
  url: string;
  description?: string;
  type?: 'job' | 'scholarship' | 'graduate-program';
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
    
    const isScholarship = jobData.type === 'scholarship';
    const isGraduate = jobData.type === 'graduate-program';
    
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

    let briefText = "";
    if (isScholarship) {
      briefText = `
🎓 *SCHOLARSHIP:* ${jobData.title}
🏢 *PROVIDER:* ${jobData.company || 'CVMYJOB'}
🔗 *APPLY HERE:* ${fullApplyUrl}

📝 *DETAILS:*
${plainDescription.substring(0, 500)}${plainDescription.length > 500 ? "..." : ""}

🚀 Discover more verified scholarships at:
${baseDirectoryUrl}
      `.trim();
    } else if (isGraduate) {
      briefText = `
🎓 *GRADUATE PROGRAM:* ${jobData.title}
🏢 *PROVIDER:* ${jobData.company || 'CVMYJOB'}
🔗 *APPLY HERE:* ${fullApplyUrl}

📝 *DETAILS:*
${plainDescription.substring(0, 500)}${plainDescription.length > 500 ? "..." : ""}

🚀 Discover more verified programs at:
${baseDirectoryUrl}
      `.trim();
    } else {
      briefText = `
🔥 *JOB OPPORTUNITY:* ${jobData.title}
🏢 *COMPANY:* ${jobData.company}
💰 *SALARY:* ${jobData.salary || "Not Specified"}
🔗 *APPLY HERE:* ${fullApplyUrl}
    
📝 *DESCRIPTION:*
${plainDescription.substring(0, 500)}${plainDescription.length > 500 ? "..." : ""}

🔍 Search more jobs at:
${baseDirectoryUrl}
      `.trim();
    }

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
