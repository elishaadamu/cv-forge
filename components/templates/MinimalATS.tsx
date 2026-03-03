import React from "react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"

export function MinimalATS({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, projects } = data

  return (
    <div 
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        padding: "3rem",
        margin: "0 auto",
        fontFamily: "sans-serif",
        fontSize: "13px",
        color: "#000",
        position: "relative"
      }}
    >
      
      {/* 1. Contact Information */}
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold uppercase mb-2">{personalInfo.fullName}</h1>
        <div className="text-xs flex flex-wrap justify-center gap-x-2 gap-y-1">
          {[
            [personalInfo.location, personalInfo.county, personalInfo.country].filter(Boolean).join(", "),
            personalInfo.phone ? `${personalInfo.phoneCode || ''} ${personalInfo.phone}` : null,
            personalInfo.email,
            personalInfo.website,
            personalInfo.linkedin ? `LinkedIn: ${personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}` : null,
            personalInfo.github ? `GitHub: ${personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}` : null,
            personalInfo.facebook ? `Facebook: ${personalInfo.facebook.replace(/^https?:\/\/(www\.)?/, "")}` : null,
          ].filter(Boolean).map((item, i, arr) => (
            <React.Fragment key={i}>
              <span>{item}</span>
              {i < arr.length - 1 && <span className="text-gray-400">|</span>}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* 2. Professional Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h2 className="font-bold uppercase text-sm border-b-2 border-black pb-1 mb-3">
            Professional Summary
          </h2>
          <MarkdownText content={personalInfo.summary} className="leading-normal" />
        </section>
      )}

      {/* 3. Core Skills / Technical Skills */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="font-bold uppercase text-sm border-b-2 border-black pb-1 mb-3">
            Core Skills
          </h2>
          {skills.map((skill, i) => (
            <p key={i} className="mb-1">
              <strong>{skill.category}:</strong> {skill.items.join(", ")}
            </p>
          ))}
        </section>
      )}

      {/* 4. Professional Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="font-bold uppercase text-sm border-b-2 border-black pb-1 mb-3">
            Professional Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-5 last:mb-0">
              <div className="flex justify-between items-baseline font-bold">
                <span className="text-sm">{exp.role}</span>
                <span className="text-xs font-normal">{exp.duration}</span>
              </div>
              <div className="text-xs italic mb-2">{exp.company}</div>
              <ul className="list-disc ml-5 space-y-1">
                {exp.description.map((bullet, i) => (
                  <li key={i}>
                    <MarkdownText content={bullet} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* 7. Projects (Tech focused) */}
      {projects && projects.length > 0 && (
        <section className="mb-8">
          <h2 className="font-bold uppercase text-sm border-b-2 border-black pb-1 mb-3">
            Technical Projects
          </h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-4 last:mb-0">
              <div className="flex justify-between items-baseline font-bold">
                <span className="text-sm">{project.name}</span>
                {project.link && <span className="text-xs font-normal">{project.link.replace(/^https?:\/\/(www\.)?/, "")}</span>}
              </div>
              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                {project.description.split('\n').filter(line => line.trim()).map((bullet, i) => (
                  <li key={i}>
                    <MarkdownText content={bullet.replace(/^[•\-\*]\s*/, "")} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* 5. Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="font-bold uppercase text-sm border-b-2 border-black pb-1 mb-3">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-baseline mb-2">
              <div>
                <span className="font-bold">{edu.degree}</span>
                <span className="mx-2">|</span>
                <span>{edu.school}</span>
              </div>
              <span className="text-xs">{edu.duration}</span>
            </div>
          ))}
        </section>
      )}

    </div>
  )
}
