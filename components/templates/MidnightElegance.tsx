import { Phone, Mail, Linkedin, MapPin, Globe, Github, Facebook } from "lucide-react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"

function formatUrl(url: string) {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url
  }
  if (url.includes("@")) return `mailto:${url}`
  return `https://${url}`
}

export function MidnightElegance({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, projects } = data
  const allSkills = skills.flatMap((s) => s.items)

  return (
    <div
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: "13px",
        color: "#1a1a2e",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* ── HEADER BAND ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
          color: "#fff",
          padding: "48px 56px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "32px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "34px",
              fontWeight: 700,
              letterSpacing: "1px",
              marginBottom: "4px",
              lineHeight: 1.1,
            }}
          >
            {personalInfo.fullName || "Your Name"}
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#c4b5fd",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: 400,
            }}
          >
            {personalInfo.jobTitle}
          </p>
        </div>

        {personalInfo.profileImage && (
          <img
            src={personalInfo.profileImage}
            alt={personalInfo.fullName}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid rgba(196,181,253,0.4)",
              flexShrink: 0,
            }}
          />
        )}
      </div>

      {/* ── CONTACT BAR ── */}
      <div
        style={{
          background: "#f5f3ff",
          padding: "12px 56px",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "center",
          borderBottom: "1px solid #e5e2f0",
          fontSize: "11px",
          color: "#4c1d95",
        }}
      >
        {personalInfo.phone && (
          <ContactChip icon={<Phone size={10} />} text={`${personalInfo.phoneCode || ''} ${personalInfo.phone}`} href={`tel:${personalInfo.phoneCode || ''}${personalInfo.phone}`} />
        )}
        {personalInfo.email && (
          <ContactChip icon={<Mail size={10} />} text={personalInfo.email} href={`mailto:${personalInfo.email}`} />
        )}
        {personalInfo.linkedin && (
          <ContactChip icon={<Linkedin size={10} />} text={personalInfo.linkedin} href={formatUrl(personalInfo.linkedin)} />
        )}
        {(personalInfo.location || personalInfo.county || personalInfo.country) && (
          <ContactChip icon={<MapPin size={10} />} text={[personalInfo.county, personalInfo.country, personalInfo.location].filter(Boolean).join(", ")} />
        )}
        {personalInfo.website && (
          <ContactChip icon={<Globe size={10} />} text={personalInfo.website} href={formatUrl(personalInfo.website)} />
        )}
        {personalInfo.github && (
          <ContactChip icon={<Github size={10} />} text={personalInfo.github} href={formatUrl(personalInfo.github)} />
        )}
        {personalInfo.facebook && (
          <ContactChip icon={<Facebook size={10} />} text={personalInfo.facebook} href={formatUrl(personalInfo.facebook)} />
        )}
      </div>

      {/* ── MAIN BODY ── */}
      <div style={{ padding: "32px 56px 48px", flex: 1 }}>
        {/* Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: "28px" }}>
            <SectionTitle label="Professional Profile" />
            <MarkdownText
              content={personalInfo.summary}
              style={{
                fontSize: "12.5px",
                color: "#374151",
                lineHeight: 1.75,
                textAlign: "justify",
                borderLeft: "3px solid #7c3aed",
                paddingLeft: "16px",
              }}
            />
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: "28px" }}>
            <SectionTitle label="Career Experience" />
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {experience.map((exp) => (
                <div key={exp.id} style={{ paddingLeft: "16px", borderLeft: "2px solid #e5e2f0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                    <span style={{ fontWeight: 700, fontSize: "13.5px", color: "#1a1a2e" }}>{exp.role}</span>
                    <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 600, whiteSpace: "nowrap", marginLeft: "12px" }}>{exp.duration}</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#6d28d9", marginBottom: "6px", fontStyle: "italic" }}>{exp.company}</p>
                  <ul style={{ paddingLeft: "16px", margin: 0, listStyleType: "disc" }}>
                    {exp.description.filter(Boolean).map((bullet, i) => (
                      <li key={i} style={{ fontSize: "12px", color: "#374151", lineHeight: 1.65, marginBottom: "3px" }}>
                        <MarkdownText content={bullet} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two-column: Skills + Education */}
        <div style={{ display: "flex", gap: "40px" }}>
          {/* Skills */}
          {allSkills.length > 0 && (
            <div style={{ flex: 1 }}>
              <SectionTitle label="Core Competencies" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                {allSkills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#f5f3ff",
                      color: "#4c1d95",
                      fontSize: "10.5px",
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "1px solid #e5e2f0",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ flex: 1 }}>
              <SectionTitle label="Education" />
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p style={{ fontWeight: 700, fontSize: "12px", color: "#1a1a2e", marginBottom: "1px" }}>{edu.degree}</p>
                    <p style={{ fontSize: "11px", color: "#6b7280" }}>{edu.school}</p>
                    {edu.duration && <p style={{ fontSize: "10.5px", color: "#7c3aed" }}>{edu.duration}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginTop: "28px" }}>
            <SectionTitle label="Projects" />
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700, fontSize: "13px", color: "#1a1a2e" }}>{proj.name}</span>
                    {proj.link && (
                      <a href={formatUrl(proj.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "10px", color: "#7c3aed", textDecoration: "none" }}>
                        {proj.link}
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <MarkdownText
                      content={proj.description}
                      style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6, marginTop: "3px" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionTitle({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <h3
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "#4c1d95",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          marginBottom: "4px",
        }}
      >
        {label}
      </h3>
      <div style={{ height: "2px", background: "linear-gradient(90deg, #7c3aed, transparent)", width: "100%" }} />
    </div>
  )
}

function ContactChip({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) {
  const inner = (
    <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</span>
      <span style={{ textDecoration: "none", color: href ? "#6d28d9" : "#4c1d95" }}>{text}</span>
    </span>
  )

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      {inner}
    </a>
  ) : (
    inner
  )
}
