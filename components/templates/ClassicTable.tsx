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

export function ClassicTable({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, projects } = data

  // Flatten skills for the competencies table
  const allSkillItems = skills.flatMap((s) => s.items)

  return (
    <div
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "'Times New Roman', 'Georgia', serif",
        fontSize: "13px",
        color: "#000",
        padding: "56px 64px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          borderBottom: "2.5px solid #000",
          borderTop: "2.5px solid #000",
          padding: "12px 0",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 700,
            letterSpacing: "1px",
            marginBottom: "4px",
            fontFamily: "'Times New Roman', serif",
          }}
        >
          {personalInfo.fullName || "Your Name"}
        </h1>
        {personalInfo.jobTitle && (
          <p
            style={{
              fontSize: "13px",
              fontStyle: "italic",
              color: "#333",
              marginBottom: "6px",
            }}
          >
            {personalInfo.jobTitle}
          </p>
        )}
        <div
          style={{
            fontSize: "11.5px",
            color: "#333",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
            marginTop: "10px",
            alignItems: "center"
          }}
        >
          {personalInfo.phone && (
            <ContactItem icon={<Phone size={11} />} text={`${personalInfo.phoneCode || ''} ${personalInfo.phone}`} href={`tel:${personalInfo.phoneCode || ''}${personalInfo.phone}`} />
          )}
          {personalInfo.email && (
            <ContactItem icon={<Mail size={11} />} text={personalInfo.email} href={`mailto:${personalInfo.email}`} />
          )}
          {personalInfo.linkedin && (
            <ContactItem icon={<Linkedin size={11} />} text={personalInfo.linkedin} href={formatUrl(personalInfo.linkedin)} />
          )}
          {(personalInfo.location || personalInfo.county || personalInfo.country) && (
            <ContactItem 
              icon={<MapPin size={11} />} 
              text={[personalInfo.location, personalInfo.county, personalInfo.country].filter(Boolean).join(", ")} 
            />
          )}
          {personalInfo.website && (
            <ContactItem icon={<Globe size={11} />} text={personalInfo.website} href={formatUrl(personalInfo.website)} />
          )}
          {personalInfo.github && (
            <ContactItem icon={<Github size={11} />} text={personalInfo.github} href={formatUrl(personalInfo.github)} />
          )}
          {personalInfo.facebook && (
            <ContactItem icon={<Facebook size={11} />} text={personalInfo.facebook} href={formatUrl(personalInfo.facebook)} />
          )}
        </div>
      </div>

      {/* ── EDUCATION ── */}
      {education.length > 0 && (
        <Section label="Education">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {education.map((edu) => (
                <tr key={edu.id}>
                  <td
                    style={{
                      paddingBottom: "6px",
                      verticalAlign: "top",
                      width: "55%",
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: "13px" }}>
                      {edu.degree}
                    </span>
                  </td>
                  <td
                    style={{
                      paddingBottom: "6px",
                      verticalAlign: "top",
                      width: "30%",
                    }}
                  >
                    {edu.school}
                  </td>
                  <td
                    style={{
                      paddingBottom: "6px",
                      verticalAlign: "top",
                      textAlign: "right",
                      width: "15%",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {edu.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {/* ── PROFESSIONAL SUMMARY ── */}
      {personalInfo.summary && (
        <Section label="Professional Summary">
          <MarkdownText 
            content={personalInfo.summary}
            style={{
              fontSize: "13px",
              lineHeight: 1.7,
              color: "#111",
              textAlign: "justify",
            }}
          />
        </Section>
      )}

      {/* ── CORE COMPETENCIES ── */}
      {allSkillItems.length > 0 && (
        <Section label="Core Competencies">
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #999",
            }}
          >
            <tbody>
              {skills.map((group, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom:
                      idx < skills.length - 1 ? "1px solid #bbb" : "none",
                  }}
                >
                  <td
                    style={{
                      padding: "5px 10px",
                      fontWeight: 700,
                      fontSize: "12px",
                      verticalAlign: "top",
                      width: "25%",
                      background: "#f5f5f5",
                      borderRight: "1px solid #bbb",
                    }}
                  >
                    {group.category}
                  </td>
                  <td style={{ padding: "5px 10px", fontSize: "12px" }}>
                    {group.items.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {/* ── WORK EXPERIENCE ── */}
      {experience.length > 0 && (
        <Section label="Professional Experience">
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {experience.map((exp) => (
              <div key={exp.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "13.5px" }}>
                    {exp.company}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontStyle: "italic",
                      color: "#444",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {exp.duration}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "12.5px",
                    fontStyle: "italic",
                    color: "#555",
                    marginBottom: "6px",
                  }}
                >
                  {exp.role}
                </p>
                <ul
                  style={{
                    paddingLeft: "20px",
                    margin: 0,
                    listStyleType: "disc",
                  }}
                >
                  {exp.description.filter(Boolean).map((bullet, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: "12.5px",
                        lineHeight: 1.65,
                        marginBottom: "3px",
                        color: "#111",
                        textAlign: "justify",
                      }}
                    >
                      <MarkdownText content={bullet} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── PROJECTS ── */}
      {projects.length > 0 && (
        <Section label="Projects">
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {projects.map((proj) => (
              <div key={proj.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: "13px" }}>
                    {proj.name}
                  </span>
                  {proj.link && (
                    <a
                      href={formatUrl(proj.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "11px",
                        color: "#1a3a5c",
                        fontStyle: "italic",
                        textDecoration: "none"
                      }}
                    >
                      {proj.link}
                    </a>
                  )}
                </div>
                {proj.description && (
                  <MarkdownText 
                    content={proj.description}
                    style={{
                      fontSize: "12.5px",
                      color: "#333",
                      lineHeight: 1.6,
                      marginTop: "3px",
                      fontStyle: "italic",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h3
        style={{
          fontSize: "13.5px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          borderBottom: "1.5px solid #000",
          paddingBottom: "3px",
          marginBottom: "10px",
          fontFamily: "'Times New Roman', serif",
        }}
      >
        {label}
      </h3>
      {children}
    </div>
  )
}

function ContactItem({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) {
  const content = (
    <span style={{ color: href ? "#1a3a5c" : "#333", textDecoration: "none" }}>
      {text}
    </span>
  )

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <span style={{ display: "flex", alignItems: "center", color: "#666" }}>{icon}</span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )
}
