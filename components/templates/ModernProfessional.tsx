"use client"

import { Mail, Phone, Globe, MapPin, Linkedin, Github } from "lucide-react"

export interface CVData {
  personalInfo: {
    fullName: string
    jobTitle: string
    email: string
    phone: string
    location: string
    website: string
    linkedin: string
    github: string
    summary: string
    profileImage?: string
  }
  experience: Array<{
    id: string
    role: string
    company: string
    duration: string
    description: string[]
  }>
  education: Array<{
    id: string
    degree: string
    school: string
    duration: string
  }>
  skills: Array<{
    category: string
    items: string[]
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    link: string
  }>
  templateId?: string
}

export function ModernProfessional({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, projects } = data

  return (
    <div className="bg-white text-slate-800 p-16 shadow-2xl min-h-[1123px] w-full max-w-[850px] mx-auto font-sans leading-relaxed selection:bg-brand-action/20">
      {/* Header with Accent */}
      <header className="relative mb-12 flex justify-between items-start">
        <div className="flex gap-8 items-start">
          {personalInfo.profileImage && (
            <div className="w-32 h-32 aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50 transition-all duration-500">
              <img 
                src={personalInfo.profileImage} 
                alt={personalInfo.fullName} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="space-y-2">
            <h1 className="text-6xl font-black tracking-tighter uppercase text-slate-900 leading-none">
              {personalInfo.fullName.split(' ')[0]} <br/>
              <span className="text-brand-action">{personalInfo.fullName.split(' ').slice(1).join(' ')}</span>
            </h1>
            <h2 className="text-xl font-bold text-slate-400 uppercase tracking-[0.3em]">{personalInfo.jobTitle || "Job Title"}</h2>
          </div>
        </div>

        <div className="text-right space-y-2 pt-2">
          <div className="flex items-center justify-end gap-3 text-xs font-black uppercase tracking-widest text-slate-600">
            <span>{personalInfo.email}</span>
            <Mail size={14} className="text-brand-action" />
          </div>
          <div className="flex items-center justify-end gap-3 text-xs font-black uppercase tracking-widest text-slate-600">
            <span>{personalInfo.phone}</span>
            <Phone size={14} className="text-brand-action" />
          </div>
          <div className="flex items-center justify-end gap-3 text-xs font-black uppercase tracking-widest text-slate-600">
            <span>{personalInfo.location}</span>
            <MapPin size={14} className="text-brand-action" />
          </div>
          <div className="flex items-center justify-end gap-3 text-xs font-black uppercase tracking-widest text-slate-400">
            <span className="border-b border-slate-200">{personalInfo.website}</span>
            <Globe size={14} />
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <section className="mb-14">
        <div className="flex items-center gap-6 mb-6">
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300">Profile</h3>
          <div className="h-[2px] flex-1 bg-slate-100" />
        </div>
        <p className="text-[15px] font-medium text-slate-600 leading-relaxed text-left max-w-3xl">
          {personalInfo.summary || "Add your narrative here..."}
        </p>
      </section>

      {/* Experience Section */}
      <section className="mb-14">
        <div className="flex items-center gap-6 mb-8">
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300">Experience</h3>
          <div className="h-[2px] flex-1 bg-slate-100" />
        </div>
        
        <div className="space-y-10">
          {experience.map((exp) => (
            <div key={exp.id} className="grid grid-cols-[180px_1fr] gap-10">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 pt-1.5 border-r border-slate-100 pr-8 text-right h-fit leading-loose">
                {exp.duration}
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-1">{exp.role}</h4>
                  <p className="text-sm font-black text-brand-action uppercase tracking-widest flex items-center gap-2">
                    <span className="w-4 h-[2px] bg-brand-action/20" />
                    {exp.company}
                  </p>
                </div>
                <ul className="space-y-3">
                  {exp.description.map((bullet, idx) => (
                    <li key={idx} className="text-[14px] font-medium text-slate-500 flex items-start gap-4 leading-snug">
                      <span className="w-1.5 h-1.5 bg-slate-200 rounded-full mt-2 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-16">
        {/* Expertise Column */}
        <section>
          <div className="flex items-center gap-6 mb-6">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300">Expertise</h3>
            <div className="h-[2px] flex-1 bg-slate-100" />
          </div>
          <div className="space-y-6">
            {skills.map((skill, i) => (
              <div key={i} className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{skill.category}</p>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item, j) => (
                    <span key={j} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects / Education Column */}
        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-6 mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300">Projects</h3>
              <div className="h-[2px] flex-1 bg-slate-100" />
            </div>
            <div className="space-y-6">
              {projects.map((proj) => (
                <div key={proj.id} className="group">
                  <h4 className="text-sm font-black uppercase text-slate-900 group-hover:text-brand-action transition-colors">{proj.name}</h4>
                  <p className="text-[12px] font-medium text-slate-500 leading-relaxed mb-1">{proj.description}</p>
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{proj.link}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-6 mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300">Education</h3>
              <div className="h-[2px] flex-1 bg-slate-100" />
            </div>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="text-[10px] font-black tracking-widest text-slate-300 uppercase mb-1">{edu.duration}</p>
                  <h4 className="text-[13px] font-black text-slate-900 uppercase leading-tight">{edu.degree}</h4>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{edu.school}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
