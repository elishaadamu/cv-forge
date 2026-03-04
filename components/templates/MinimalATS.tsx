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
        boxSizing: "border-box",
        margin: "0 auto",
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        fontSize: "13px",
        color: "#000",
        position: "relative"
      }}
    >
      
      {/* 1. Contact Information */}
      <header style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" }}>
          {personalInfo.fullName}
        </h1>
        <div style={{ fontSize: "11px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
          {[
            [personalInfo.county, personalInfo.country, personalInfo.location].filter(Boolean).join(", "),
            personalInfo.phone ? `${personalInfo.phoneCode || ''} ${personalInfo.phone}` : null,
            personalInfo.email,
            personalInfo.website,
            personalInfo.linkedin ? `LinkedIn: ${personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}` : null,
            personalInfo.github ? `GitHub: ${personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}` : null,
            personalInfo.facebook ? `Facebook: ${personalInfo.facebook.replace(/^https?:\/\/(www\.)?/, "")}` : null,
          ].filter(Boolean).map((item, i, arr) => (
            <React.Fragment key={i}>
              <span>{item}</span>
              {i < arr.length - 1 && <span style={{ color: "#9ca3af" }}>|</span>}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* 2. Professional Summary */}
      {personalInfo.summary && (
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "14px", borderBottom: "2px solid black", paddingBottom: "4px", marginBottom: "12px" }}>
            Professional Summary
          </h2>
          <MarkdownText content={personalInfo.summary} style={{ lineHeight: "1.5" }} />
        </section>
      )}

      {/* 3. Core Skills / Technical Skills */}
      {skills.length > 0 && (
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "14px", borderBottom: "2px solid black", paddingBottom: "4px", marginBottom: "12px" }}>
            Core Skills
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {skills.map((skill, i) => (
              <p key={i} style={{ margin: 0 }}>
                <strong style={{ fontWeight: "bold" }}>{skill.category}:</strong> {skill.items.join(", ")}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* 4. Professional Experience */}
      {experience.length > 0 && (
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "14px", borderBottom: "2px solid black", paddingBottom: "4px", marginBottom: "12px" }}>
            Professional Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontWeight: "bold" }}>
                <span style={{ fontSize: "14px" }}>{exp.role}</span>
                <span style={{ fontSize: "11px", fontWeight: "normal" }}>{exp.duration}</span>
              </div>
              <div style={{ fontSize: "12px", fontStyle: "italic", marginBottom: "8px" }}>{exp.company}</div>
              <ul style={{ paddingLeft: "16px", margin: 0, listStyleType: "disc", display: "flex", flexDirection: "column", gap: "4px" }}>
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
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "14px", borderBottom: "2px solid black", paddingBottom: "4px", marginBottom: "12px" }}>
            Technical Projects
          </h2>
          {projects.map((project) => (
            <div key={project.id} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontWeight: "bold" }}>
                <span style={{ fontSize: "14px" }}>{project.name}</span>
                {project.link && <span style={{ fontSize: "11px", fontWeight: "normal" }}>{project.link.replace(/^https?:\/\/(www\.)?/, "")}</span>}
              </div>
              <ul style={{ paddingLeft: "16px", margin: "4px 0 0 0", listStyleType: "disc", display: "flex", flexDirection: "column", gap: "2px" }}>
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
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "14px", borderBottom: "2px solid black", paddingBottom: "4px", marginBottom: "12px" }}>
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
              <div>
                <span style={{ fontWeight: "bold" }}>{edu.degree}</span>
                <span style={{ margin: "0 8px", color: "#6b7280" }}>|</span>
                <span>{edu.school}</span>
              </div>
              <span style={{ fontSize: "11px" }}>{edu.duration}</span>
            </div>
          ))}
        </section>
      )}

    </div>
  )
}
