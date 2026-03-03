import React from "react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"

export function ExecutiveBoard({ data }: { data: CVData }) {
  const { personalInfo, experience, education } = data

  return (
    <div 
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        padding: "3rem",
        margin: "0 auto",
        fontFamily: "serif",
        color: "#111",
        position: "relative"
      }}
    >
      
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-semibold tracking-wide">
          {personalInfo.fullName}
        </h1>
        <p className="text-lg mt-2">{personalInfo.jobTitle}</p>
        
        <div className="text-xs text-gray-500 mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phoneCode || ''} {personalInfo.phone}</span>}
          {(personalInfo.location || personalInfo.county || personalInfo.country) && (
            <span>{[personalInfo.location, personalInfo.county, personalInfo.country].filter(Boolean).join(", ")}</span>
          )}
          {personalInfo.website && <span>Portal: {personalInfo.website.replace(/^https?:\/\//, "")}</span>}
          {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin.split('/').pop()}</span>}
          {personalInfo.github && <span>GitHub: {personalInfo.github.split('/').pop()}</span>}
          {personalInfo.facebook && <span>FB: {personalInfo.facebook.split('/').pop()}</span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-8 text-center max-w-2xl mx-auto">
          <MarkdownText content={personalInfo.summary} className="text-base" />
        </section>
      )}

      <section className="mb-8">
        <h2 className="uppercase tracking-widest text-sm mb-4">
          Leadership Experience
        </h2>
        {experience.map((exp) => (
          <div key={exp.id} className="mb-6">
            <p className="font-semibold">
              {exp.role} – {exp.company}
            </p>
            <p className="text-xs text-gray-500">
              {exp.duration}
            </p>
            <ul className="list-disc ml-5 mt-2">
              {exp.description.map((d, i) => (
                <li key={i}>
                  <MarkdownText content={d} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {education.length > 0 && (
        <section>
          <h2 className="uppercase tracking-widest text-sm mb-4">
            Education
          </h2>
          {education.map((edu) => (
            <p key={edu.id}>
              {edu.degree} – {edu.school} ({edu.duration})
            </p>
          ))}
        </section>
      )}
    </div>
  )
}
