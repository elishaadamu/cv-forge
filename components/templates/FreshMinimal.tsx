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

export function FreshMinimal({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, projects } = data
  const allSkills = skills.flatMap((s) => s.items)

  return (
    <div
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        fontSize: "13px",
        color: "#1a1a1a",
        padding: "52px 56px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* ── HEADER ── */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "16px" }}>
          {personalInfo.profileImage && (
            <img
              src={personalInfo.profileImage}
              alt={personalInfo.fullName}
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />
          )}
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 300,
                color: "#1a1a1a",
                lineHeight: 1.15,
                letterSpacing: "-0.5px",
                marginBottom: "2px",
              }}
            >
              {personalInfo.fullName || "Your Name"}
            </h1>
            <p style={{ fontSize: "14px", color: "#10b981", fontWeight: 500, letterSpacing: "0.5px" }}>
              {personalInfo.jobTitle}
            </p>
          </div>
        </div>

        {/* Contact */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            fontSize: "10.5px",
            color: "#6b7280",
            paddingTop: "12px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          {personalInfo.phone && (
            <ContactLink icon={<Phone size={10} />} text={`${personalInfo.phoneCode || ''} ${personalInfo.phone}`} href={`tel:${personalInfo.phoneCode || ''}${personalInfo.phone}`} />
          )}
          {personalInfo.email && (
            <ContactLink icon={<Mail size={10} />} text={personalInfo.email} href={`mailto:${personalInfo.email}`} />
          )}
          {personalInfo.linkedin && (
            <ContactLink icon={<Linkedin size={10} />} text={personalInfo.linkedin} href={formatUrl(personalInfo.linkedin)} />
          )}
          {(personalInfo.location || personalInfo.county || personalInfo.country) && (
            <ContactLink icon={<MapPin size={10} />} text={[personalInfo.location, personalInfo.county, personalInfo.country].filter(Boolean).join(", ")} />
          )}
          {personalInfo.website && (
            <ContactLink icon={<Globe size={10} />} text={personalInfo.website} href={formatUrl(personalInfo.website)} />
          )}
          {personalInfo.github && (
            <ContactLink icon={<Github size={10} />} text={personalInfo.github} href={formatUrl(personalInfo.github)} />
          )}
          {personalInfo.facebook && (
            <ContactLink icon={<Facebook size={10} />} text={personalInfo.facebook} href={formatUrl(personalInfo.facebook)} />
          )}
        </div>
      </div>

      {/* ── SUMMARY ── */}
      {personalInfo.summary && (
        <div style={{ marginBottom: "28px" }}>
          <LightHeading label="Summary" />
          <MarkdownText
            content={personalInfo.summary}
            style={{ fontSize: "12.5px", color: "#4b5563", lineHeight: 1.8, fontWeight: 300 }}
          />
        </div>
      )}

      {/* ── EXPERIENCE ── */}
      {experience.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <LightHeading label="Experience" />
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {experience.map((exp) => (
              <div key={exp.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                  <div>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "#1a1a1a" }}>{exp.role}</span>
                    <span style={{ color: "#9ca3af", fontSize: "13px", marginLeft: "10px", fontWeight: 300 }}>{exp.company}</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 500, whiteSpace: "nowrap" }}>{exp.duration}</span>
                </div>
                <ul style={{ paddingLeft: "16px", margin: 0, listStyleType: "none" }}>
                  {exp.description.filter(Boolean).map((bullet, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: "12px",
                        color: "#4b5563",
                        lineHeight: 1.65,
                        marginBottom: "3px",
                        fontWeight: 300,
                        paddingLeft: "12px",
                        position: "relative",
                      }}
                    >
                      <span style={{ position: "absolute", left: 0, color: "#10b981", fontWeight: 500 }}>–</span>
                      <MarkdownText content={bullet} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SKILLS ── */}
      {allSkills.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <LightHeading label="Skills" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {allSkills.map((skill, i) => (
              <span
                key={i}
                style={{
                  fontSize: "10.5px",
                  fontWeight: 400,
                  color: "#1a1a1a",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  border: "1px solid #e5e7eb",
                  background: "#fafafa",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── EDUCATION ── */}
      {education.length > 0 && (
        <div style={{ marginBottom: "28px" }}>
          <LightHeading label="Education" />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {education.map((edu) => (
              <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div>
                  <span style={{ fontWeight: 500, fontSize: "12.5px", color: "#1a1a1a" }}>{edu.degree}</span>
                  <span style={{ color: "#9ca3af", fontSize: "12px", marginLeft: "10px", fontWeight: 300 }}>{edu.school}</span>
                </div>
                {edu.duration && <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 500 }}>{edu.duration}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PROJECTS ── */}
      {projects.length > 0 && (
        <div>
          <LightHeading label="Projects" />
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {projects.map((proj) => (
              <div key={proj.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 500, fontSize: "13px", color: "#1a1a1a" }}>{proj.name}</span>
                  {proj.link && (
                    <a href={formatUrl(proj.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "10px", color: "#10b981", textDecoration: "none" }}>
                      {proj.link}
                    </a>
                  )}
                </div>
                {proj.description && (
                  <MarkdownText content={proj.description} style={{ fontSize: "11.5px", color: "#4b5563", lineHeight: 1.6, marginTop: "2px", fontWeight: 300 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function LightHeading({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <h3
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#10b981",
          textTransform: "uppercase",
          letterSpacing: "3px",
          marginBottom: "6px",
        }}
      >
        {label}
      </h3>
      <div style={{ height: "1px", background: "#f0f0f0", width: "100%" }} />
    </div>
  )
}

function ContactLink({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) {
  const inner = (
    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <span style={{ display: "flex", alignItems: "center", color: "#10b981", flexShrink: 0 }}>{icon}</span>
      <span style={{ color: href ? "#10b981" : "#6b7280", textDecoration: "none" }}>{text}</span>
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
