"use client"

import { CVData } from "./ModernProfessional"

export function ClassicTable({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, projects } = data

  return (
    <div className="bg-white text-black p-[0.75in] shadow-2xl min-h-[11in] w-full max-w-[8.5in] mx-auto font-serif leading-tight text-[13px] selection:bg-slate-200">
      {/* Header - Clean Centered */}
      <header className="mb-10 flex items-center justify-between gap-8 border-b-2 border-black pb-4">
        {personalInfo.profileImage && (
          <div className="w-24 h-24 aspect-square border-2 border-black overflow-hidden bg-slate-100 shrink-0">
            <img 
              src={personalInfo.profileImage} 
              alt={personalInfo.fullName} 
              className="w-full h-full object-cover grayscale"
            />
          </div>
        )}
        <div className="flex-1 text-center space-y-2">
          <h1 className="text-4xl font-bold uppercase tracking-widest">{personalInfo.fullName}</h1>
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-600 flex justify-center gap-4">
            <span>{personalInfo.location}</span>
            <span>•</span>
            <span>{personalInfo.phone}</span>
            <span>•</span>
            <span>{personalInfo.email}</span>
          </div>
          <div className="text-[10px] font-medium italic underline text-slate-400 flex justify-center gap-6">
             <span>{personalInfo.linkedin}</span>
             <span>{personalInfo.github}</span>
             <span>{personalInfo.website}</span>
          </div>
        </div>
        {personalInfo.profileImage && <div className="w-24 shrink-0" />} {/* Spacer for centering */}
      </header>

      {/* Professional Summary */}
      <section className="mb-8">
        <h3 className="text-[14px] font-black uppercase tracking-[0.2em] border-b border-black mb-3">Professional Dossier</h3>
        <p className="text-justify leading-snug text-slate-800">
          {personalInfo.summary}
        </p>
      </section>

      {/* Expertise - Structured Table */}
      <section className="mb-8">
        <h3 className="text-[14px] font-black uppercase tracking-[0.2em] border-b border-black mb-4">Core Competencies</h3>
        <div className="border border-black overflow-hidden bg-slate-50/30">
          <table className="w-full border-collapse">
            <tbody>
              {skills.map((group, idx) => (
                <tr key={idx} className="border-b border-black last:border-0">
                  <td className="w-[180px] p-2 px-4 bg-slate-100/50 font-black uppercase text-[10px] tracking-widest border-r border-black">{group.category}</td>
                  <td className="p-2 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    {group.items.join(" • ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Experience - Detailed Table-like structure */}
      <section className="mb-8">
        <h3 className="text-[14px] font-black uppercase tracking-[0.2em] border-b border-black mb-6">Professional Tenure</h3>
        <div className="space-y-8">
          {experience.map((exp) => (
            <div key={exp.id} className="space-y-3">
              <div className="flex justify-between items-baseline">
                <div className="space-y-0.5">
                  <h4 className="text-lg font-bold text-black uppercase tracking-tight">{exp.company}</h4>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{exp.role}</p>
                </div>
                <span className="text-[11px] font-bold italic border border-black/10 px-2 py-1 bg-slate-50">{exp.duration}</span>
              </div>
              <ul className="list-disc list-outside ml-5 space-y-1.5 text-slate-700">
                {exp.description.map((bullet, idx) => (
                  <li key={idx} className="text-justify leading-relaxed pl-1">{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mb-8">
        <h3 className="text-[14px] font-black uppercase tracking-[0.2em] border-b border-black mb-4">Strategic Projects</h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6">
          {projects.map((proj) => (
            <div key={proj.id} className="space-y-1">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                 <h4 className="text-[12px] font-black uppercase tracking-tight">{proj.name}</h4>
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{proj.link}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 italic">
                {proj.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section>
        <h3 className="text-[14px] font-black uppercase tracking-[0.2em] border-b border-black mb-4">Academic Credentials</h3>
        <table className="w-full">
          <tbody>
            {education.map((edu) => (
              <tr key={edu.id} className="group">
                <td className="py-2 pr-4">
                  <div className="font-bold text-[13px] uppercase tracking-tight">{edu.school}</div>
                  <div className="text-[11px] italic font-medium text-slate-500">{edu.degree}</div>
                </td>
                <td className="py-2 text-right align-top">
                   <div className="font-bold text-[11px] uppercase tracking-widest text-slate-400">{edu.duration}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
