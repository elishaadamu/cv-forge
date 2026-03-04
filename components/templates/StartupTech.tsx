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
        boxSizing: "border-box",
        margin: "0 auto",
        fontFamily: "'Courier New', Courier, monospace",
        color: "#000",
        position: "relative"
      }}
    >
      
      <header style={{ marginBottom: "16px" }}>
        <h1 style={{ fontSize: "30px", fontWeight: "bold", margin: "0 0 4px 0" }}>{personalInfo.fullName}</h1>
        <p style={{ color: "#4b5563", margin: 0 }}>{personalInfo.jobTitle}</p>
      </header>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "11px", color: "#6b7280", marginBottom: "32px", paddingBottom: "16px", borderBottom: "1px solid #e5e7eb" }}>
        {personalInfo.email && <span>{personalInfo.email}</span>}
        {personalInfo.phone && <span>{personalInfo.phoneCode || ''} {personalInfo.phone}</span>}
        {(personalInfo.location || personalInfo.county || personalInfo.country) && (
          <span>{[personalInfo.county, personalInfo.country, personalInfo.location].filter(Boolean).join(", ")}</span>
        )}
        {personalInfo.website && <span>{personalInfo.website.replace(/^https?:\/\//, "")}</span>}
        {personalInfo.github && <span>github.com/{personalInfo.github.split('/').pop()}</span>}
        {personalInfo.linkedin && <span>linkedin.com/in/{personalInfo.linkedin.split('/').pop()}</span>}
        {personalInfo.facebook && <span>facebook.com/{personalInfo.facebook.split('/').pop()}</span>}
      </div>

      {experience.map((exp) => (
        <div key={exp.id} style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", marginBottom: "4px" }}>
            <span>{exp.role} @ {exp.company}</span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              {exp.duration}
            </span>
          </div>
          <ul style={{ paddingLeft: "20px", margin: 0, listStyleType: "disc" }}>
            {exp.description.map((d, i) => (
              <li key={i} style={{ marginBottom: "2px" }}>
                <MarkdownText content={d} />
              </li>
            ))}
          </ul>
        </div>
      ))}

      <section style={{ marginBottom: "24px" }}>
        <h2 style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Tech Stack</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {skills.flatMap((s) => s.items).map((item, i) => (
            <span
              key={i}
              style={{ padding: "4px 12px", fontSize: "11px", background: "rgba(0,0,0,0.05)", borderRadius: "4px" }}
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {projects.length > 0 && (
        <section>
          <h2 style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Projects</h2>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "12px" }}>
              <p style={{ fontWeight: "600", margin: "0 0 2px 0" }}>{proj.name}</p>
              <MarkdownText content={proj.description} style={{ fontSize: "13px", color: "#374151" }} />
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
