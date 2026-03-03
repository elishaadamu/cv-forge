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

export function CorporateClean({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, projects } = data

  return (
    <div
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "'Calibri', 'Segoe UI', sans-serif",
        fontSize: "13px",
        color: "#1f2937",
        position: "relative",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* ── LEFT SIDEBAR (teal) ── */}
      <div
        style={{
          width: "80px",
          background: "#0d9488",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "48px",
          flexShrink: 0,
        }}
      >
        {/* Decorative dots */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.25)",
              marginBottom: "20px",
            }}
          />
        ))}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div
          style={{
            padding: "44px 48px 32px",
            borderBottom: "3px solid #0d9488",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {personalInfo.profileImage && (
              <img
                src={personalInfo.profileImage}
                alt={personalInfo.fullName}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "12px",
                  objectFit: "cover",
                  border: "2px solid #0d9488",
                  flexShrink: 0,
                }}
              />
            )}
            <div>
              <h1
                style={{
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "#111827",
                  lineHeight: 1.15,
                  letterSpacing: "-0.3px",
                  marginBottom: "4px",
                }}
              >
                {personalInfo.fullName || "Your Name"}
              </h1>
              <p style={{ fontSize: "14px", color: "#0d9488", fontWeight: 600, letterSpacing: "0.5px" }}>
                {personalInfo.jobTitle}
              </p>
            </div>
          </div>

          {/* Contact Row */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "14px",
              marginTop: "16px",
              fontSize: "10.5px",
              color: "#6b7280",
            }}
          >
            {personalInfo.phone && (
              <ContactPill icon={<Phone size={10} />} text={`${personalInfo.phoneCode || ''} ${personalInfo.phone}`} href={`tel:${personalInfo.phoneCode || ''}${personalInfo.phone}`} />
            )}
            {personalInfo.email && (
              <ContactPill icon={<Mail size={10} />} text={personalInfo.email} href={`mailto:${personalInfo.email}`} />
            )}
            {personalInfo.linkedin && (
              <ContactPill icon={<Linkedin size={10} />} text={personalInfo.linkedin} href={formatUrl(personalInfo.linkedin)} />
            )}
            {(personalInfo.location || personalInfo.county || personalInfo.country) && (
              <ContactPill icon={<MapPin size={10} />} text={[personalInfo.location, personalInfo.county, personalInfo.country].filter(Boolean).join(", ")} />
            )}
            {personalInfo.website && (
              <ContactPill icon={<Globe size={10} />} text={personalInfo.website} href={formatUrl(personalInfo.website)} />
            )}
            {personalInfo.github && (
              <ContactPill icon={<Github size={10} />} text={personalInfo.github} href={formatUrl(personalInfo.github)} />
            )}
            {personalInfo.facebook && (
              <ContactPill icon={<Facebook size={10} />} text={personalInfo.facebook} href={formatUrl(personalInfo.facebook)} />
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 48px 48px", flex: 1 }}>
          {/* Summary */}
          {personalInfo.summary && (
            <div style={{ marginBottom: "24px" }}>
              <TealHeading label="Professional Summary" />
              <MarkdownText
                content={personalInfo.summary}
                style={{ fontSize: "12.5px", color: "#374151", lineHeight: 1.7, textAlign: "justify" }}
              />
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <TealHeading label="Work Experience" />
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {experience.map((exp) => (
                  <div key={exp.id} style={{ display: "flex", gap: "16px" }}>
                    {/* Timeline dot + line */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "16px", flexShrink: 0, paddingTop: "4px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0d9488", flexShrink: 0 }} />
                      <div style={{ width: "2px", flex: 1, background: "#d1d5db", marginTop: "4px" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                        <span style={{ fontWeight: 700, fontSize: "13px", color: "#111827" }}>{exp.role}</span>
                        <span style={{ fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap", marginLeft: "12px" }}>{exp.duration}</span>
                      </div>
                      <p style={{ fontSize: "11.5px", color: "#0d9488", fontWeight: 600, marginBottom: "6px" }}>{exp.company}</p>
                      <ul style={{ paddingLeft: "16px", margin: 0, listStyleType: "disc" }}>
                        {exp.description.filter(Boolean).map((bullet, i) => (
                          <li key={i} style={{ fontSize: "12px", color: "#374151", lineHeight: 1.65, marginBottom: "3px" }}>
                            <MarkdownText content={bullet} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills as categorized grid */}
          {skills.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <TealHeading label="Core Competencies" />
              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e5e7eb" }}>
                <tbody>
                  {skills.map((group, idx) => (
                    <tr key={idx} style={{ borderBottom: idx < skills.length - 1 ? "1px solid #e5e7eb" : "none" }}>
                      <td
                        style={{
                          padding: "6px 12px",
                          fontWeight: 700,
                          fontSize: "11px",
                          verticalAlign: "top",
                          width: "28%",
                          background: "#f0fdfa",
                          borderRight: "1px solid #e5e7eb",
                          color: "#0d9488",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {group.category}
                      </td>
                      <td style={{ padding: "6px 12px", fontSize: "12px", color: "#374151" }}>
                        {group.items.join("  •  ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Education + Projects */}
          <div style={{ display: "flex", gap: "32px" }}>
            {education.length > 0 && (
              <div style={{ flex: 1 }}>
                <TealHeading label="Education" />
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <p style={{ fontWeight: 700, fontSize: "12px", color: "#111827", marginBottom: "1px" }}>{edu.degree}</p>
                      <p style={{ fontSize: "11px", color: "#6b7280" }}>{edu.school}</p>
                      {edu.duration && <p style={{ fontSize: "10.5px", color: "#0d9488", fontWeight: 600 }}>{edu.duration}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects.length > 0 && (
              <div style={{ flex: 1 }}>
                <TealHeading label="Projects" />
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontWeight: 700, fontSize: "12px", color: "#111827" }}>{proj.name}</span>
                        {proj.link && (
                          <a href={formatUrl(proj.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "9.5px", color: "#0d9488", textDecoration: "none" }}>
                            {proj.link}
                          </a>
                        )}
                      </div>
                      {proj.description && (
                        <MarkdownText content={proj.description} style={{ fontSize: "11px", color: "#374151", lineHeight: 1.6, marginTop: "2px" }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function TealHeading({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <h3
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#0d9488",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          marginBottom: "4px",
        }}
      >
        {label}
      </h3>
      <div style={{ height: "1.5px", background: "#e5e7eb", width: "100%" }} />
    </div>
  )
}

function ContactPill({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) {
  const inner = (
    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <span style={{ display: "flex", alignItems: "center", color: "#0d9488", flexShrink: 0 }}>{icon}</span>
      <span style={{ color: href ? "#0d9488" : "#6b7280", textDecoration: "none" }}>{text}</span>
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
