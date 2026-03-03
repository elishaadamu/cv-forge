import { Phone, Mail, Linkedin, MapPin, Globe, Github, Facebook } from "lucide-react"
import { MarkdownText } from "../MarkdownText"

export interface CVData {
  personalInfo: {
    fullName: string
    jobTitle: string
    email: string
    phoneCode?: string
    phone: string
    country?: string
    county?: string
    location: string
    website: string
    linkedin: string
    github: string
    facebook?: string
    summary: string
    profileImage?: string
  }
  experience: Array<{
    id: string
    role: string
    company: string
    duration: string
    description: string[]
  }>
  education: Array<{
    id: string
    degree: string
    school: string
    duration: string
  }>
  skills: Array<{
    category: string
    items: string[]
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    link: string
  }>
  templateId?: string
}

function formatUrl(url: string) {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url
  }
  if (url.includes("@")) return `mailto:${url}`
  return `https://${url}`
}

export function ModernProfessional({ data }: { data: CVData }) {
  const { personalInfo, experience, education, skills, projects } = data

  // Flatten all skills into a simple list for sidebar display
  const allSkills = skills.flatMap((s) => s.items)

  return (
    <div
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
        fontSize: "13px",
        color: "#222",
        display: "flex",
        flexDirection: "row",
        position: "relative",
      }}
    >
      {/* ── LEFT MAIN COLUMN ── */}
      <div style={{ flex: 1, padding: "48px 36px 48px 48px" }}>
        {/* Name + Title */}
        <div style={{ marginBottom: "28px" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: 900,
              color: "#1a3a5c",
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
              fontSize: "13px",
              color: "#6b7280",
              fontStyle: "italic",
              letterSpacing: "0.5px",
            }}
          >
            CURRICULUM VITAE
          </p>
        </div>

        {/* Section: Professional Summary */}
        {personalInfo.summary && (
          <div style={{ marginBottom: "28px" }}>
            <SectionHeading label="Professional Summary" />
            <MarkdownText 
              content={personalInfo.summary}
              style={{
                fontSize: "12.5px",
                color: "#374151",
                lineHeight: 1.7,
              }}
            />
          </div>
        )}

        {/* Section: Work Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: "28px" }}>
            <SectionHeading label="Work Experience" />
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
                        fontSize: "13px",
                        color: "#1a3a5c",
                      }}
                    >
                      {exp.company}
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
                  <p
                    style={{
                      fontSize: "11.5px",
                      color: "#6b7280",
                      fontStyle: "italic",
                      marginBottom: "6px",
                    }}
                  >
                    {exp.role}
                  </p>
                  <ul style={{ paddingLeft: "16px", margin: 0 }}>
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

        {/* Section: Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: "28px" }}>
            <SectionHeading label="Projects" />
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
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
                        color: "#1a3a5c",
                      }}
                    >
                      {proj.name}
                    </span>
                    {proj.link && (
                      <a 
                        href={formatUrl(proj.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "10px", color: "#3b82c4", textDecoration: "none" }}
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
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <div
        style={{
          width: "240px",
          background: "#f0f4f8",
          padding: "48px 24px 48px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          flexShrink: 0,
        }}
      >
        {/* Profile photo */}
        {personalInfo.profileImage && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={personalInfo.profileImage}
              alt={personalInfo.fullName}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #fff",
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
              }}
            />
          </div>
        )}

        {/* Name + Title in sidebar */}
        <div>
          <p
            style={{
              fontWeight: 800,
              fontSize: "12px",
              color: "#1a3a5c",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "2px",
            }}
          >
            {personalInfo.fullName}
          </p>
          <p style={{ fontSize: "11px", color: "#6b7280" }}>
            {personalInfo.jobTitle}
          </p>
        </div>

        {/* Contact */}
        <div>
          <SidebarHeading label="Contact" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "7px",
              marginTop: "8px",
            }}
          >
            {personalInfo.phone && (
              <ContactRow icon={<Phone size={12} />} text={`${personalInfo.phoneCode || ''} ${personalInfo.phone}`} href={`tel:${personalInfo.phoneCode || ''}${personalInfo.phone}`} />
            )}
            {personalInfo.email && (
              <ContactRow icon={<Mail size={12} />} text={personalInfo.email} href={`mailto:${personalInfo.email}`} />
            )}
            {personalInfo.linkedin && (
              <ContactRow icon={<Linkedin size={12} />} text={personalInfo.linkedin} href={formatUrl(personalInfo.linkedin)} />
            )}
            {(personalInfo.location || personalInfo.county || personalInfo.country) && (
              <ContactRow 
                icon={<MapPin size={12} />} 
                text={[personalInfo.location, personalInfo.county, personalInfo.country].filter(Boolean).join(", ")} 
              />
            )}
            {personalInfo.website && (
              <ContactRow icon={<Globe size={12} />} text={personalInfo.website} href={formatUrl(personalInfo.website)} />
            )}
            {personalInfo.github && (
              <ContactRow icon={<Github size={12} />} text={personalInfo.github} href={formatUrl(personalInfo.github)} />
            )}
            {personalInfo.facebook && (
              <ContactRow icon={<Facebook size={12} />} text={personalInfo.facebook} href={formatUrl(personalInfo.facebook)} />
            )}
          </div>
        </div>

        {/* Skills */}
        {allSkills.length > 0 && (
          <div>
            <SidebarHeading label="Skills" />
            <ul style={{ marginTop: "8px", paddingLeft: "0", listStyle: "none" }}>
              {allSkills.map((skill, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: "11.5px",
                    color: "#374151",
                    padding: "3px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#3b82c4",
                      flexShrink: 0,
                      display: "inline-block",
                    }}
                  />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <SidebarHeading label="Education" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginTop: "8px",
              }}
            >
              {education.map((edu) => (
                <div key={edu.id}>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "11.5px",
                      color: "#1a3a5c",
                      marginBottom: "1px",
                    }}
                  >
                    {edu.degree}
                  </p>
                  <p style={{ fontSize: "11px", color: "#6b7280" }}>
                    {edu.school}
                  </p>
                  {edu.duration && (
                    <p style={{ fontSize: "10.5px", color: "#9ca3af" }}>
                      {edu.duration}
                    </p>
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

function SectionHeading({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <h3
        style={{
          fontSize: "13px",
          fontWeight: 800,
          color: "#3b82c4",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "4px",
        }}
      >
        {label}
      </h3>
      <div
        style={{ height: "2px", background: "#3b82c4", width: "100%" }}
      />
    </div>
  )
}

function SidebarHeading({ label }: { label: string }) {
  return (
    <h4
      style={{
        fontSize: "12px",
        fontWeight: 800,
        color: "#1a3a5c",
        textTransform: "uppercase",
        letterSpacing: "0.8px",
        borderBottom: "1.5px solid #cbd5e1",
        paddingBottom: "4px",
      }}
    >
      {label}
    </h4>
  )
}

function ContactRow({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) {
  const content = (
    <span
      style={{
        fontSize: "11px",
        color: href ? "#3b82c4" : "#374151",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        textDecoration: "none",
      }}
    >
      {text}
    </span>
  )

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
      <span style={{ fontSize: "11px", flexShrink: 0, width: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
        {icon}
      </span>
      {href ? (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ textDecoration: "none", overflow: "hidden", display: "flex" }}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )
}
