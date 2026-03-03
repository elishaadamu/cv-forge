import React from "react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"

export function CreativePortfolio({ data }: { data: CVData }) {
  const { personalInfo, experience, skills, projects } = data

  return (
    <div 
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        display: "flex",
        margin: "0 auto",
        fontFamily: "sans-serif",
        fontSize: "14px",
        color: "#333",
        position: "relative"
      }}
    >
      
      <aside className="w-1/3 bg-purple-600 text-white p-8">
        <h1 className="text-2xl font-bold">{personalInfo.fullName}</h1>
        <p className="text-sm mb-6">{personalInfo.jobTitle}</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="font-semibold uppercase text-xs opacity-60">Contact</h2>
            <div className="text-xs space-y-1.5 break-all">
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phoneCode || ''} {personalInfo.phone}</p>}
              {(personalInfo.location || personalInfo.county || personalInfo.country) && (
                <p>{[personalInfo.location, personalInfo.county, personalInfo.country].filter(Boolean).join(", ")}</p>
              )}
              {personalInfo.website && <p>{personalInfo.website}</p>}
              {personalInfo.linkedin && <p>In: {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</p>}
              {personalInfo.github && <p>Gh: {personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}</p>}
              {personalInfo.facebook && <p>Fb: {personalInfo.facebook.replace(/^https?:\/\/(www\.)?/, "")}</p>}
            </div>
          </div>

          <div>
            <h2 className="font-semibold uppercase text-xs mb-2">Skills</h2>
            {skills.map((skill, i) => (
              <div key={i} className="mb-2">
                <p className="font-medium">{skill.category}</p>
                <p className="text-xs opacity-80">
                  {skill.items.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="w-2/3 p-10">
        {personalInfo.summary && (
          <section className="mb-6">
            <h2 className="font-bold text-lg mb-2">Profile</h2>
            <MarkdownText content={personalInfo.summary} />
          </section>
        )}

        <section className="mb-6">
          <h2 className="font-bold text-lg mb-2">Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <p className="font-semibold">{exp.role}</p>
              <p className="text-xs text-gray-500">
                {exp.company} | {exp.duration}
              </p>
              <ul className="list-disc ml-5 mt-1">
                {exp.description.map((d, i) => (
                  <li key={i}>
                    <MarkdownText content={d} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {projects.length > 0 && (
          <section>
            <h2 className="font-bold text-lg mb-2">Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <p className="font-semibold">{proj.name}</p>
                <p className="text-xs text-gray-500">{proj.link}</p>
                <MarkdownText content={proj.description} />
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
