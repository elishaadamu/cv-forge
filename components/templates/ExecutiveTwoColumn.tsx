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

export function ExecutiveTwoColumn({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, projects } = data

  // Flatten skills for simple bullet list
  const allSkills = skills.flatMap((s) => s.items)

  return (
    <div
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
        fontSize: "13px",
        color: "#111",
        display: "flex",
        flexDirection: "row",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {/* ── LEFT DARK SIDEBAR ── */}
      <div
        style={{
          width: "260px",
          background: "#1b2a4a",
          color: "#fff",
          padding: "48px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          flexShrink: 0,
          boxSizing: "border-box",
        }}
      >
        {/* Photo */}
        {personalInfo.profileImage && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={personalInfo.profileImage}
              alt={personalInfo.fullName}
              style={{
                width: "120px",
                height: "140px",
                objectFit: "cover",
                border: "3px solid rgba(255,255,255,0.2)",
              }}
            />
          </div>
        )}

        {/* Name + Title */}
        <div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.1,
              textTransform: "uppercase",
              letterSpacing: "-0.5px",
              marginBottom: "6px",
            }}
          >
            {personalInfo.fullName || "Your Name"}
          </h1>
          <p
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {personalInfo.jobTitle}
          </p>
        </div>

        {/* Contact */}
        <div>
          <SidebarSection label="Contact" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            {personalInfo.phone && (
              <SidebarContact label="Phone:" value={`${personalInfo.phoneCode || ''} ${personalInfo.phone}`} href={`tel:${personalInfo.phoneCode || ''}${personalInfo.phone}`} />
            )}
            {personalInfo.email && (
              <SidebarContact label="Email:" value={personalInfo.email} href={`mailto:${personalInfo.email}`} />
            )}
            {personalInfo.linkedin && (
              <SidebarContact label="LinkedIn:" value={personalInfo.linkedin} href={formatUrl(personalInfo.linkedin)} />
            )}
            {(personalInfo.location || personalInfo.county || personalInfo.country) && (
              <SidebarContact 
                label="Location:" 
                value={[personalInfo.county, personalInfo.country, personalInfo.location].filter(Boolean).join(", ")} 
              />
            )}
            {personalInfo.website && (
              <SidebarContact label="Website:" value={personalInfo.website} href={formatUrl(personalInfo.website)} />
            )}
            {personalInfo.github && (
              <SidebarContact label="GitHub:" value={personalInfo.github} href={formatUrl(personalInfo.github)} />
            )}
            {personalInfo.facebook && (
              <SidebarContact label="Facebook:" value={personalInfo.facebook} href={formatUrl(personalInfo.facebook)} />
            )}
          </div>
        </div>

        {/* Skills */}
        {allSkills.length > 0 && (
          <div>
            <SidebarSection label="Skills" />
            <ul
              style={{
                marginTop: "10px",
                paddingLeft: "0",
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              {allSkills.map((skill, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: "12px",
                    color: "#cbd5e1",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "#60a5fa",
                      flexShrink: 0,
                    }}
                  />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── RIGHT MAIN CONTENT ── */}
      <div style={{ flex: 1, padding: "48px 32px", background: "#fff", boxSizing: "border-box" }}>
        {/* Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: "28px" }}>
            <MainHeading label="Summary" />
            <MarkdownText 
              content={personalInfo.summary}
              style={{
                fontSize: "12.5px",
                color: "#374151",
                lineHeight: 1.75,
                textAlign: "justify",
              }}
            />
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: "28px" }}>
            <MainHeading label="Experience" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "2px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "13.5px",
                        color: "#1b2a4a",
                      }}
                    >
                      {exp.company}
                      {exp.role ? ` | ${exp.role}` : ""}
                    </span>
                    <span
                      style={{
                        fontSize: "11.5px",
                        color: "#6b7280",
                        whiteSpace: "nowrap",
                        marginLeft: "12px",
                      }}
                    >
                      {exp.duration}
                    </span>
                  </div>
                  <ul
                    style={{
                      paddingLeft: "16px",
                      margin: "6px 0 0",
                      listStyleType: "disc",
                    }}
                  >
                    {exp.description.filter(Boolean).map((bullet, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: "12px",
                          color: "#374151",
                          lineHeight: 1.65,
                          marginBottom: "3px",
                        }}
                      >
                        <MarkdownText content={bullet} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: "28px" }}>
            <MainHeading label="Education" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {education.map((edu) => (
                <div key={edu.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "13px",
                        color: "#1b2a4a",
                      }}
                    >
                      {edu.degree}
                    </span>
                    <span
                      style={{
                        fontSize: "11.5px",
                        color: "#6b7280",
                        whiteSpace: "nowrap",
                        marginLeft: "12px",
                      }}
                    >
                      {edu.duration}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#6b7280" }}>
                    {edu.school}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: "28px" }}>
            <MainHeading label="Projects" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "13px",
                        color: "#1b2a4a",
                      }}
                    >
                      {proj.name}
                    </span>
                    {proj.link && (
                      <a
                        href={formatUrl(proj.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "10.5px", color: "#60a5fa", textDecoration: "none" }}
                      >
                        {proj.link}
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <MarkdownText 
                      content={proj.description}
                      style={{
                        fontSize: "12px",
                        color: "#374151",
                        lineHeight: 1.6,
                        marginTop: "3px",
                        fontStyle: "italic",
                      }}
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

function SidebarSection({ label }: { label: string }) {
  return (
    <h4
      style={{
        fontSize: "11px",
        fontWeight: 800,
        color: "#60a5fa",
        textTransform: "uppercase",
        letterSpacing: "1.5px",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
        paddingBottom: "5px",
      }}
    >
      {label}
    </h4>
  )
}

function SidebarContact({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <span
      style={{
        fontSize: "11px",
        color: href ? "#60a5fa" : "#cbd5e1",
        textDecoration: href ? "underline" : "none",
        wordBreak: "break-word",
      }}
    >
      {value}
    </span>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
      <span
        style={{
          fontSize: "9.5px",
          color: "#60a5fa",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </span>
      {href ? (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ textDecoration: "none" }}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )
}

function MainHeading({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <h3
        style={{
          fontSize: "14px",
          fontWeight: 800,
          color: "#1b2a4a",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "5px",
        }}
      >
        {label}
      </h3>
      <div
        style={{
          height: "2px",
          background: "#1b2a4a",
          width: "100%",
          opacity: 0.15,
        }}
      />
    </div>
  )
}
