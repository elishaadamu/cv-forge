import React from "react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"

export function StartupTech({ data }: { data: CVData }) {
  const { personalInfo, experience, skills, projects } = data

  return (
    <div 
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        padding: "3rem",
        margin: "0 auto",
        fontFamily: "sans-serif",
        color: "#000",
        position: "relative"
      }}
    >
      
      <header className="mb-4">
        <h1 className="text-3xl font-bold">{personalInfo.fullName}</h1>
        <p className="text-gray-600">{personalInfo.jobTitle}</p>
      </header>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-8 font-mono border-b pb-4">
        {personalInfo.email && <span>{personalInfo.email}</span>}
        {personalInfo.phone && <span>{personalInfo.phoneCode || ''} {personalInfo.phone}</span>}
        {(personalInfo.location || personalInfo.county || personalInfo.country) && (
          <span>{[personalInfo.location, personalInfo.county, personalInfo.country].filter(Boolean).join(", ")}</span>
        )}
        {personalInfo.website && <span>{personalInfo.website.replace(/^https?:\/\//, "")}</span>}
        {personalInfo.github && <span>github.com/{personalInfo.github.split('/').pop()}</span>}
        {personalInfo.linkedin && <span>linkedin.com/in/{personalInfo.linkedin.split('/').pop()}</span>}
        {personalInfo.facebook && <span>facebook.com/{personalInfo.facebook.split('/').pop()}</span>}
      </div>

      {experience.map((exp) => (
        <div key={exp.id} className="mb-6">
          <div className="flex justify-between font-semibold">
            <span>{exp.role} @ {exp.company}</span>
            <span className="text-sm text-gray-500">
              {exp.duration}
            </span>
          </div>
          <ul className="list-disc ml-5 mt-1">
            {exp.description.map((d, i) => (
              <li key={i}>
                <MarkdownText content={d} />
              </li>
            ))}
          </ul>
        </div>
      ))}

      <section className="mb-6">
        <h2 className="font-bold mb-2">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {skills.flatMap((s) => s.items).map((item, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs bg-black/5 rounded-md"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {projects.length > 0 && (
        <section>
          <h2 className="font-bold mb-2">Projects</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <p className="font-semibold">{proj.name}</p>
              <MarkdownText content={proj.description} className="text-sm" />
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
