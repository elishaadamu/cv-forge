"use client"

import { CVData } from "./ModernProfessional"
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react"

export function ExecutiveTwoColumn({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, projects } = data

  return (
    <div className="bg-[#f8fafc] min-h-[1123px] w-full max-w-[850px] mx-auto shadow-2xl flex font-sans overflow-hidden">
      {/* Sidebar - Dark & Structured */}
      <aside className="w-[300px] bg-[#0f172a] text-white p-12 flex flex-col gap-12 sticky top-0 h-full">
        <div>
          {personalInfo.profileImage && (
            <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-slate-700 mb-8 grayscale hover:grayscale-0 transition-all duration-700">
               <img 
                 src={personalInfo.profileImage} 
                 alt={personalInfo.fullName} 
                 className="w-full h-full object-cover"
               />
            </div>
          )}
          <div className="h-1 w-16 bg-brand-action mb-6" />
          <h1 className="text-4xl font-black tracking-tighter leading-[0.9] mb-4 uppercase wrap-break-word">
            {personalInfo.fullName.split(' ')[0]} <br/>
            <span className="text-slate-400">{personalInfo.fullName.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-brand-action font-black text-xs uppercase tracking-[0.2em]">{personalInfo.jobTitle}</p>
        </div>

        <div className="space-y-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 border-b border-slate-800 pb-3">Contact</h3>
          <ul className="space-y-5 text-[11px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
            <li className="flex items-start gap-4">
              <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">
                <Mail size={12} className="text-brand-action" />
              </div>
              <span className="pt-1 break-all">{personalInfo.email}</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">
                <Phone size={12} className="text-brand-action" />
              </div>
              <span className="pt-1">{personalInfo.phone}</span>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">
                <MapPin size={12} className="text-brand-action" />
              </div>
              <span className="pt-1">{personalInfo.location}</span>
            </li>
            <li className="flex items-start gap-4 underline decoration-brand-action/30">
              <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0">
                <Globe size={12} className="text-brand-action" />
              </div>
              <span className="pt-1">{personalInfo.website}</span>
            </li>
          </ul>
        </div>

        <div className="space-y-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 border-b border-slate-800 pb-3">Skills</h3>
          <div className="space-y-6">
            {skills.map((group, idx) => (
              <div key={idx} className="space-y-3">
                <p className="text-[9px] font-black text-brand-action uppercase tracking-[0.2em]">{group.category}</p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item, i) => (
                    <span key={i} className="text-[10px] text-slate-400 font-bold bg-slate-800/50 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-10">
          <div className="p-4 bg-brand-action/5 border border-brand-action/10 rounded-2xl flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-brand-action flex items-center justify-center font-black text-white text-xl">V</div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Verified</p>
                <p className="text-[9px] font-bold text-slate-500">Forge ID: #CVF-2026</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content - Clean & Elegant */}
      <main className="flex-1 bg-white p-16 flex flex-col gap-14">
        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-6">Executive Summary</h3>
          <p className="text-[15px] font-medium text-slate-600 leading-[1.8] text-justify">
             {personalInfo.summary}
          </p>
        </section>

        <section className="space-y-10">
          <h3 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-2">Professional Experience</h3>
          <div className="space-y-12">
             {experience.map((exp) => (
               <div key={exp.id} className="relative pl-8 border-l-2 border-slate-50 group">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-200 group-hover:bg-brand-action transition-colors" />
                  <div className="flex justify-between items-baseline mb-4">
                    <div>
                      <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{exp.role}</h4>
                      <p className="text-sm font-black text-slate-400 uppercase tracking-widest">{exp.company}</p>
                    </div>
                    <span className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                      {exp.duration}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {exp.description.map((bullet, idx) => (
                      <li key={idx} className="text-[14px] font-medium text-slate-500 flex items-start gap-4 leading-relaxed">
                        <span className="text-brand-action font-black">/</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
               </div>
             ))}
          </div>
        </section>

        <section className="space-y-8">
          <h3 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-2">Technical Projects</h3>
          <div className="grid grid-cols-1 gap-8">
             {projects.map(project => (
               <div key={project.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-brand-action/20 transition-all cursor-default">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{project.name}</h4>
                    <span className="text-[10px] font-bold text-brand-action tracking-widest">{project.link}</span>
                  </div>
                  <p className="text-[13px] font-medium text-slate-500 leading-relaxed italic">"{project.description}"</p>
               </div>
             ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black uppercase tracking-[0.5em] text-slate-200 mb-6">Academic Background</h3>
          <div className="grid grid-cols-2 gap-10">
             {education.map(edu => (
               <div key={edu.id} className="space-y-1">
                  <h4 className="text-[13px] font-black text-slate-800 uppercase tracking-tight">{edu.degree}</h4>
                  <p className="text-[11px] font-bold text-slate-400 uppercase">{edu.school}</p>
                  <p className="text-[10px] font-black text-brand-action uppercase pt-1">{edu.duration}</p>
               </div>
             ))}
          </div>
        </section>
      </main>
    </div>
  )
}
