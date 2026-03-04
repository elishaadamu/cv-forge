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
        boxSizing: "border-box",
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        fontSize: "14px",
        color: "#333",
        position: "relative"
      }}
    >
      
      <aside style={{ width: "33.333333%", background: "#9333ea", color: "#fff", padding: "40px", boxSizing: "border-box" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 4px 0" }}>{personalInfo.fullName}</h1>
        <p style={{ fontSize: "14px", marginBottom: "24px", opacity: 0.9 }}>{personalInfo.jobTitle}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h2 style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", opacity: 0.6, marginBottom: "8px", letterSpacing: "1px" }}>Contact</h2>
            <div style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px", wordBreak: "break-all" }}>
              {personalInfo.email && <p style={{ margin: 0 }}>{personalInfo.email}</p>}
              {personalInfo.phone && <p style={{ margin: 0 }}>{personalInfo.phoneCode || ''} {personalInfo.phone}</p>}
              {(personalInfo.location || personalInfo.county || personalInfo.country) && (
                <p style={{ margin: 0 }}>{[personalInfo.county, personalInfo.country, personalInfo.location].filter(Boolean).join(", ")}</p>
              )}
              {personalInfo.website && <p style={{ margin: 0 }}>{personalInfo.website}</p>}
              {personalInfo.linkedin && <p style={{ margin: 0 }}>LinkedIn: {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</p>}
              {personalInfo.github && <p style={{ margin: 0 }}>GitHub: {personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}</p>}
              {personalInfo.facebook && <p style={{ margin: 0 }}>Facebook: {personalInfo.facebook.replace(/^https?:\/\/(www\.)?/, "")}</p>}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>Skills</h2>
            {skills.map((skill, i) => (
              <div key={i} style={{ marginBottom: "12px" }}>
                <p style={{ fontWeight: "500", margin: "0 0 2px 0" }}>{skill.category}</p>
                <p style={{ fontSize: "12px", opacity: 0.8, margin: 0 }}>
                  {skill.items.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main style={{ width: "66.666667%", padding: "40px", boxSizing: "border-box" }}>
        {personalInfo.summary && (
          <section style={{ marginBottom: "32px" }}>
            <h2 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "12px", borderBottom: "1px solid #eee", paddingBottom: "8px" }}>Profile</h2>
            <MarkdownText content={personalInfo.summary} style={{ lineHeight: "1.6" }} />
          </section>
        )}

        <section style={{ marginBottom: "32px" }}>
          <h2 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "12px", borderBottom: "1px solid #eee", paddingBottom: "8px" }}>Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "20px" }}>
              <p style={{ fontWeight: "600", fontSize: "15px", margin: "0 0 2px 0" }}>{exp.role}</p>
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                {exp.company} | {exp.duration}
              </p>
              <ul style={{ paddingLeft: "20px", margin: 0, listStyleType: "disc" }}>
                {exp.description.map((d, i) => (
                  <li key={i} style={{ marginBottom: "4px" }}>
                    <MarkdownText content={d} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {projects.length > 0 && (
          <section>
            <h2 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "12px", borderBottom: "1px solid #eee", paddingBottom: "8px" }}>Projects</h2>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: "16px" }}>
                <p style={{ fontWeight: "600", margin: "0 0 2px 0" }}>{proj.name}</p>
                <p style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>{proj.link}</p>
                <MarkdownText content={proj.description} style={{ fontSize: "13px", lineHeight: "1.5" }} />
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
