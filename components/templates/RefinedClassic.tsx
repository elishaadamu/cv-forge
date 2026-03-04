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

export function RefinedClassic({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, projects } = data

  return (
    <div
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "'Garamond', 'Georgia', 'Times New Roman', serif",
        fontSize: "13px",
        color: "#1c1917",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── TOP GOLD LINE ── */}
      <div style={{ height: "4px", background: "linear-gradient(90deg, #b45309, #d97706, #f59e0b, #d97706, #b45309)" }} />

      {/* ── HEADER ── */}
      <div
        style={{
          padding: "40px 56px 28px",
          textAlign: "center",
          borderBottom: "1px solid #e7e5e4",
        }}
      >
        {personalInfo.profileImage && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <img
              src={personalInfo.profileImage}
              alt={personalInfo.fullName}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #d97706",
              }}
            />
          </div>
        )}
        <h1
          style={{
            fontSize: "30px",
            fontWeight: 400,
            color: "#1c1917",
            lineHeight: 1.2,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}
        >
          {personalInfo.fullName || "Your Name"}
        </h1>
        <p style={{ fontSize: "13px", color: "#b45309", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 400, marginBottom: "16px" }}>
          {personalInfo.jobTitle}
        </p>

        {/* Contact */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
            fontSize: "10.5px",
            color: "#57534e",
          }}
        >
          {personalInfo.phone && (
            <GoldContact icon={<Phone size={10} />} text={`${personalInfo.phoneCode || ''} ${personalInfo.phone}`} href={`tel:${personalInfo.phoneCode || ''}${personalInfo.phone}`} />
          )}
          {personalInfo.email && (
            <GoldContact icon={<Mail size={10} />} text={personalInfo.email} href={`mailto:${personalInfo.email}`} />
          )}
          {personalInfo.linkedin && (
            <GoldContact icon={<Linkedin size={10} />} text={personalInfo.linkedin} href={formatUrl(personalInfo.linkedin)} />
          )}
          {(personalInfo.location || personalInfo.county || personalInfo.country) && (
            <GoldContact icon={<MapPin size={10} />} text={[personalInfo.county, personalInfo.country, personalInfo.location].filter(Boolean).join(", ")} />
          )}
          {personalInfo.website && (
            <GoldContact icon={<Globe size={10} />} text={personalInfo.website} href={formatUrl(personalInfo.website)} />
          )}
          {personalInfo.github && (
            <GoldContact icon={<Github size={10} />} text={personalInfo.github} href={formatUrl(personalInfo.github)} />
          )}
          {personalInfo.facebook && (
            <GoldContact icon={<Facebook size={10} />} text={personalInfo.facebook} href={formatUrl(personalInfo.facebook)} />
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "28px 56px 48px", flex: 1 }}>
        {/* Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: "24px" }}>
            <ClassicSectionHead label="Executive Summary" />
            <MarkdownText
              content={personalInfo.summary}
              style={{
                fontSize: "13px",
                color: "#44403c",
                lineHeight: 1.75,
                textAlign: "justify",
                fontStyle: "italic",
              }}
            />
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <ClassicSectionHead label="Professional Experience" />
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: "13.5px", color: "#1c1917" }}>{exp.role}</span>
                      <span style={{ fontSize: "12px", color: "#b45309", marginLeft: "8px" }}>— {exp.company}</span>
                    </div>
                    <span style={{ fontSize: "11px", fontStyle: "italic", color: "#78716c", whiteSpace: "nowrap" }}>{exp.duration}</span>
                  </div>
                  <ul style={{ paddingLeft: "18px", margin: "6px 0 0", listStyleType: "disc" }}>
                    {exp.description.filter(Boolean).map((bullet, i) => (
                      <li key={i} style={{ fontSize: "12px", color: "#44403c", lineHeight: 1.65, marginBottom: "3px" }}>
                        <MarkdownText content={bullet} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <ClassicSectionHead label="Areas of Expertise" />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {skills.map((group, i) => (
                <p key={i} style={{ fontSize: "12px", color: "#44403c", margin: 0 }}>
                  <span style={{ fontWeight: 700, color: "#b45309" }}>{group.category}: </span>
                  {group.items.join("  ·  ")}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <ClassicSectionHead label="Education" />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {education.map((edu) => (
                <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: "12.5px", color: "#1c1917" }}>{edu.degree}</span>
                    <span style={{ fontSize: "12px", color: "#78716c", marginLeft: "8px" }}>— {edu.school}</span>
                  </div>
                  {edu.duration && <span style={{ fontSize: "11px", fontStyle: "italic", color: "#78716c" }}>{edu.duration}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <ClassicSectionHead label="Notable Projects" />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontWeight: 700, fontSize: "13px", color: "#1c1917" }}>{proj.name}</span>
                    {proj.link && (
                      <a href={formatUrl(proj.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "10px", color: "#b45309", textDecoration: "none", fontStyle: "italic" }}>
                        {proj.link}
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <MarkdownText content={proj.description} style={{ fontSize: "12px", color: "#44403c", lineHeight: 1.6, marginTop: "3px" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM GOLD LINE ── */}
      <div style={{ height: "4px", background: "linear-gradient(90deg, #b45309, #d97706, #f59e0b, #d97706, #b45309)" }} />
    </div>
  )
}

function ClassicSectionHead({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <h3
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#1c1917",
          textTransform: "uppercase",
          letterSpacing: "3px",
          textAlign: "center",
          marginBottom: "6px",
        }}
      >
        {label}
      </h3>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ flex: 1, height: "1px", background: "#d6d3d1" }} />
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d97706" }} />
        <div style={{ flex: 1, height: "1px", background: "#d6d3d1" }} />
      </div>
    </div>
  )
}

function GoldContact({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) {
  const inner = (
    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <span style={{ display: "flex", alignItems: "center", color: "#b45309", flexShrink: 0 }}>{icon}</span>
      <span style={{ color: href ? "#b45309" : "#57534e", textDecoration: "none" }}>{text}</span>
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
