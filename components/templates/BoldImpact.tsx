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

export function BoldImpact({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, projects } = data
  const allSkills = skills.flatMap((s) => s.items)

  return (
    <div
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
        fontSize: "13px",
        color: "#0f172a",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── HERO HEADER ── */}
      <div
        style={{
          background: "#0f172a",
          color: "#fff",
          padding: "40px 52px",
          display: "flex",
          alignItems: "center",
          gap: "28px",
        }}
      >
        {personalInfo.profileImage && (
          <img
            src={personalInfo.profileImage}
            alt={personalInfo.fullName}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "16px",
              objectFit: "cover",
              border: "3px solid #f97316",
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: "38px",
              fontWeight: 900,
              lineHeight: 1.05,
              textTransform: "uppercase",
              letterSpacing: "-1px",
              marginBottom: "4px",
            }}
          >
            {personalInfo.fullName || "Your Name"}
          </h1>
          <div
            style={{
              display: "inline-block",
              background: "#f97316",
              color: "#fff",
              padding: "4px 14px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            {personalInfo.jobTitle}
          </div>
        </div>
      </div>

      {/* ── CONTACT STRIP ── */}
      <div
        style={{
          background: "#1e293b",
          padding: "10px 52px",
          display: "flex",
          flexWrap: "wrap",
          gap: "18px",
          alignItems: "center",
          fontSize: "10.5px",
          color: "#94a3b8",
        }}
      >
        {personalInfo.phone && (
          <ContactItem icon={<Phone size={10} />} text={`${personalInfo.phoneCode || ''} ${personalInfo.phone}`} href={`tel:${personalInfo.phoneCode || ''}${personalInfo.phone}`} />
        )}
        {personalInfo.email && (
          <ContactItem icon={<Mail size={10} />} text={personalInfo.email} href={`mailto:${personalInfo.email}`} />
        )}
        {personalInfo.linkedin && (
          <ContactItem icon={<Linkedin size={10} />} text={personalInfo.linkedin} href={formatUrl(personalInfo.linkedin)} />
        )}
        {(personalInfo.location || personalInfo.county || personalInfo.country) && (
          <ContactItem icon={<MapPin size={10} />} text={[personalInfo.location, personalInfo.county, personalInfo.country].filter(Boolean).join(", ")} />
        )}
        {personalInfo.website && (
          <ContactItem icon={<Globe size={10} />} text={personalInfo.website} href={formatUrl(personalInfo.website)} />
        )}
        {personalInfo.github && (
          <ContactItem icon={<Github size={10} />} text={personalInfo.github} href={formatUrl(personalInfo.github)} />
        )}
        {personalInfo.facebook && (
          <ContactItem icon={<Facebook size={10} />} text={personalInfo.facebook} href={formatUrl(personalInfo.facebook)} />
        )}
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "32px 52px 48px", flex: 1 }}>
        {/* Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: "26px" }}>
            <HeavyHeading label="About Me" />
            <MarkdownText
              content={personalInfo.summary}
              style={{
                fontSize: "12.5px",
                color: "#334155",
                lineHeight: 1.75,
                textAlign: "justify",
              }}
            />
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: "26px" }}>
            <HeavyHeading label="Experience" />
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 800, fontSize: "14px", color: "#0f172a" }}>{exp.role}</span>
                      <span style={{ color: "#64748b", fontSize: "12px", marginLeft: "8px" }}>at {exp.company}</span>
                    </div>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#fff",
                        background: "#f97316",
                        padding: "3px 10px",
                        borderRadius: "3px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {exp.duration}
                    </span>
                  </div>
                  <ul style={{ paddingLeft: "16px", margin: 0, listStyleType: "square" }}>
                    {exp.description.filter(Boolean).map((bullet, i) => (
                      <li key={i} style={{ fontSize: "12px", color: "#334155", lineHeight: 1.65, marginBottom: "3px" }}>
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
        {allSkills.length > 0 && (
          <div style={{ marginBottom: "26px" }}>
            <HeavyHeading label="Skills & Expertise" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
              {allSkills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    background: "#0f172a",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "5px 12px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education + Projects side by side */}
        <div style={{ display: "flex", gap: "36px" }}>
          {education.length > 0 && (
            <div style={{ flex: 1 }}>
              <HeavyHeading label="Education" />
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p style={{ fontWeight: 800, fontSize: "12px", color: "#0f172a", marginBottom: "1px" }}>{edu.degree}</p>
                    <p style={{ fontSize: "11px", color: "#64748b" }}>{edu.school}</p>
                    {edu.duration && <p style={{ fontSize: "10px", color: "#f97316", fontWeight: 700 }}>{edu.duration}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div style={{ flex: 1 }}>
              <HeavyHeading label="Projects" />
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontWeight: 800, fontSize: "12px", color: "#0f172a" }}>{proj.name}</span>
                      {proj.link && (
                        <a href={formatUrl(proj.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "9px", color: "#f97316", textDecoration: "none" }}>
                          {proj.link}
                        </a>
                      )}
                    </div>
                    {proj.description && (
                      <MarkdownText content={proj.description} style={{ fontSize: "11px", color: "#334155", lineHeight: 1.6, marginTop: "2px" }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function HeavyHeading({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <h3
        style={{
          fontSize: "14px",
          fontWeight: 900,
          color: "#0f172a",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "4px",
        }}
      >
        {label}
      </h3>
      <div style={{ height: "3px", background: "#f97316", width: "40px", borderRadius: "2px" }} />
    </div>
  )
}

function ContactItem({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) {
  const inner = (
    <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</span>
      <span style={{ color: href ? "#93c5fd" : "#94a3b8", textDecoration: "none" }}>{text}</span>
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
