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
        boxSizing: "border-box",
        margin: "0 auto",
        fontFamily: "'Times New Roman', Times, serif",
        color: "#111",
        position: "relative"
      }}
    >
      
      <header style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "600", letterSpacing: "1px", margin: "0 0 8px 0" }}>
          {personalInfo.fullName}
        </h1>
        <p style={{ fontSize: "18px", margin: "0 0 16px 0" }}>{personalInfo.jobTitle}</p>
        
        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "16px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phoneCode || ''} {personalInfo.phone}</span>}
          {(personalInfo.location || personalInfo.county || personalInfo.country) && (
            <span>{[personalInfo.county, personalInfo.country, personalInfo.location].filter(Boolean).join(", ")}</span>
          )}
          {personalInfo.website && <span>Portal: {personalInfo.website.replace(/^https?:\/\//, "")}</span>}
          {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin.split('/').pop()}</span>}
          {personalInfo.github && <span>GitHub: {personalInfo.github.split('/').pop()}</span>}
          {personalInfo.facebook && <span>FB: {personalInfo.facebook.split('/').pop()}</span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section style={{ marginBottom: "32px", textAlign: "center", maxWidth: "85%", margin: "0 auto 32px auto" }}>
          <MarkdownText content={personalInfo.summary} style={{ fontSize: "16px", lineHeight: "1.6" }} />
        </section>
      )}

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "14px", borderBottom: "1px solid #000", paddingBottom: "4px", marginBottom: "16px" }}>
          Leadership Experience
        </h2>
        {experience.map((exp) => (
          <div key={exp.id} style={{ marginBottom: "24px" }}>
            <p style={{ fontWeight: "600", fontSize: "16px", margin: "0 0 4px 0" }}>
              {exp.role} – {exp.company}
            </p>
            <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
              {exp.duration}
            </p>
            <ul style={{ paddingLeft: "20px", margin: 0, listStyleType: "disc", display: "flex", flexDirection: "column", gap: "4px" }}>
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
          <h2 style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "14px", borderBottom: "1px solid #000", paddingBottom: "4px", marginBottom: "16px" }}>
            Education
          </h2>
          {education.map((edu) => (
            <p key={edu.id} style={{ margin: "0 0 8px 0" }}>
              <strong style={{ fontWeight: "600" }}>{edu.degree}</strong> – {edu.school} ({edu.duration})
            </p>
          ))}
        </section>
      )}
    </div>
  )
}
