import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"
import { Phone, Mail, Linkedin, MapPin, Globe, Github, Facebook, PlusCircle, Trash2, Sparkles, Loader2, Camera, X } from "lucide-react"
import React from "react"
import { DurationPicker } from "../DurationPicker"

function formatUrl(url: string | undefined) {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url
  }
  if (url.includes("@")) return `mailto:${url}`
  return `https://${url}`
}

export function ExecutiveTwoColumn({ 
  data,
  isEditable = false,
  onUpdate,
  onRefine,
  refiningId,
  onImageClick
}: { 
  data: CVData,
  isEditable?: boolean,
  onUpdate?: (field: string, value: any) => void,
  onRefine?: (type: string, id?: string) => void,
  refiningId?: string | null,
  onImageClick?: () => void
}) {
  const { personalInfo, experience, education, skills, projects, languages, volunteering } = data

  const hasPersonalDetails = personalInfo.dateOfBirth || personalInfo.nationality || personalInfo.gender || personalInfo.passport || personalInfo.workPermit || personalInfo.placeOfBirth

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
        {/* Photo */}
        {(personalInfo.profileImage || isEditable) && (
          <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            {personalInfo.profileImage ? (
              <div
                onClick={isEditable ? onImageClick : undefined}
                style={{
                  position: "relative",
                  width: "120px",
                  height: "140px",
                  border: "3px solid rgba(255,255,255,0.2)",
                  cursor: isEditable ? "pointer" : "default",
                  overflow: "hidden"
                }}
              >
                <img
                  src={personalInfo.profileImage}
                  alt={personalInfo.fullName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {isEditable && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "1"} onMouseLeave={(e) => e.currentTarget.style.opacity = "0"}>
                    <Camera size={24} color="white" />
                  </div>
                )}
              </div>
            ) : isEditable ? (
              <div
                onClick={onImageClick}
                style={{
                  width: "120px",
                  height: "140px",
                  borderRadius: "2px",
                  border: "2px dashed rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.05)"
                }}
              >
                <Camera size={24} color="rgba(255,255,255,0.4)" />
              </div>
            ) : null}
          </div>
        )}

        {/* Name + Title */}
        <div>
          {isEditable ? (
            <input
              defaultValue={personalInfo.fullName}
              placeholder="Your Name"
              onBlur={(e) => onUpdate?.("personalInfo.fullName", e.target.value)}
              style={{
                fontSize: "26px",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.1,
                textTransform: "uppercase",
                letterSpacing: "-0.5px",
                marginBottom: "6px",
                width: "100%",
                background: "transparent",
                border: "1px dashed rgba(255,255,255,0.3)",
                outline: "none",
                fontFamily: "inherit"
              }}
            />
          ) : (
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
          )}
          {isEditable ? (
            <input
              defaultValue={personalInfo.jobTitle}
              placeholder="Job Title"
              onBlur={(e) => onUpdate?.("personalInfo.jobTitle", e.target.value)}
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "1px",
                width: "100%",
                background: "transparent",
                border: "1px dashed rgba(255,255,255,0.3)",
                outline: "none",
                fontFamily: "inherit"
              }}
            />
          ) : (
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
          )}
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
            {(personalInfo.phone || isEditable) && (
              <SidebarContact 
                label="Phone" 
                value={`${personalInfo.phoneCode || ''} ${personalInfo.phone || ''}`} 
                href={isEditable ? undefined : `tel:${personalInfo.phoneCode || ''}${personalInfo.phone || ''}`}
                isEditable={isEditable}
                onUpdate={(val: string) => {
                  const [code, ...rest] = val.split(" ")
                  onUpdate?.("personalInfo.phoneCode", code)
                  onUpdate?.("personalInfo.phone", rest.join(""))
                }}
              />
            )}
            {(personalInfo.email || isEditable) && (
              <SidebarContact 
                label="Email" 
                value={personalInfo.email || ""} 
                href={isEditable ? undefined : `mailto:${personalInfo.email}`} 
                isEditable={isEditable}
                onUpdate={(val: string) => onUpdate?.("personalInfo.email", val)}
              />
            )}
            {(personalInfo.linkedin || isEditable) && (
              <SidebarContact 
                label="LinkedIn" 
                value={personalInfo.linkedin || ""} 
                href={isEditable ? undefined : formatUrl(personalInfo.linkedin)} 
                isEditable={isEditable}
                onUpdate={(val: string) => onUpdate?.("personalInfo.linkedin", val)}
              />
            )}
            {(personalInfo.location || personalInfo.county || personalInfo.country || isEditable) && (
              <SidebarContact 
                label="Location" 
                value={[personalInfo.county, personalInfo.country, personalInfo.location].filter(Boolean).join(", ")} 
                isEditable={isEditable}
                onUpdate={(val: string) => onUpdate?.("personalInfo.location", val)}
              />
            )}
            {(personalInfo.website || isEditable) && (
              <SidebarContact 
                label="Website" 
                value={personalInfo.website || ""} 
                href={isEditable ? undefined : formatUrl(personalInfo.website)} 
                isEditable={isEditable}
                onUpdate={(val: string) => onUpdate?.("personalInfo.website", val)}
              />
            )}
            {(personalInfo.github || isEditable) && (
              <SidebarContact 
                label="GitHub" 
                value={personalInfo.github || ""} 
                href={isEditable ? undefined : formatUrl(personalInfo.github)} 
                isEditable={isEditable}
                onUpdate={(val: string) => onUpdate?.("personalInfo.github", val)}
              />
            )}
            {(personalInfo.facebook || isEditable) && (
              <SidebarContact 
                label="Facebook" 
                value={personalInfo.facebook || ""} 
                href={isEditable ? undefined : formatUrl(personalInfo.facebook)} 
                isEditable={isEditable}
                onUpdate={(val: string) => onUpdate?.("personalInfo.facebook", val)}
              />
            )}
          </div>
        </div>

        {/* Skills */}
        {(allSkills.length > 0 || isEditable) && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <SidebarSection label="Skills" />
              {isEditable && (
                <button 
                  onClick={() => onUpdate?.("skills.add", "New Skill")}
                  style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer" }}
                >
                  <PlusCircle size={14} />
                </button>
              )}
            </div>
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
                  {isEditable && (
                    <button 
                      onClick={() => {
                         // Logic to remove skill
                      }}
                      style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <X size={10} />
                    </button>
                  )}
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "#60a5fa",
                      flexShrink: 0,
                    }}
                  />
                  {isEditable ? (
                    <input
                      defaultValue={skill}
                      onBlur={(e) => {
                        // Logic to update skill
                      }}
                      style={{ fontSize: "12px", color: "#fff", background: "transparent", border: "1px dashed rgba(255,255,255,0.3)", outline: "none", width: "100%" }}
                    />
                  ) : skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Personal Details */}
        {(hasPersonalDetails || isEditable) && (
          <div>
            <SidebarSection label="Personal Details" />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
              {(personalInfo.dateOfBirth || isEditable) && <SidebarDetail label="DOB" value={personalInfo.dateOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.dateOfBirth", val)} isEditable={isEditable} />}
              {(personalInfo.placeOfBirth || isEditable) && <SidebarDetail label="Birth Place" value={personalInfo.placeOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.placeOfBirth", val)} isEditable={isEditable} />}
              {(personalInfo.nationality || isEditable) && <SidebarDetail label="Nationality" value={personalInfo.nationality} onUpdate={(val) => onUpdate?.("personalInfo.nationality", val)} isEditable={isEditable} />}
              {(personalInfo.gender || isEditable) && <SidebarDetail label="Gender" value={personalInfo.gender} onUpdate={(val) => onUpdate?.("personalInfo.gender", val)} isEditable={isEditable} />}
              {(personalInfo.passport || isEditable) && <SidebarDetail label="Passport" value={personalInfo.passport} onUpdate={(val) => onUpdate?.("personalInfo.passport", val)} isEditable={isEditable} />}
              {(personalInfo.workPermit || isEditable) && <SidebarDetail label="Work Permit" value={personalInfo.workPermit} onUpdate={(val) => onUpdate?.("personalInfo.workPermit", val)} isEditable={isEditable} />}
            </div>
          </div>
        )}

        {/* Languages */}
        {(languages && languages.length > 0 || isEditable) && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <SidebarSection label="Languages" />
              {isEditable && (
                <button 
                  onClick={() => onUpdate?.("languages.add", { name: "New Language", proficiency: "Native" })}
                  style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer" }}
                >
                  <PlusCircle size={14} />
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
              {(languages || []).map((lang, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {isEditable && (
                      <button 
                        onClick={() => onUpdate?.("languages.remove", i)}
                        style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        <X size={12} />
                      </button>
                    )}
                    {isEditable ? (
                      <input 
                        defaultValue={lang.name}
                        onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.target.value)}
                        style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.3)", fontSize: "12px", color: "#fff", padding: "1px 4px", outline: "none", width: "80px" }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600 }}>{lang.name}</span>
                    )}
                  </div>
                  {isEditable ? (
                    <input 
                      defaultValue={lang.proficiency}
                      onBlur={(e) => onUpdate?.(`languages.${i}.proficiency`, e.target.value)}
                      style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.3)", fontSize: "11px", color: "rgba(255,255,255,0.7)", padding: "1px 4px", outline: "none", width: "70px", textAlign: "right" }}
                    />
                  ) : (
                    <span style={{ color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>{lang.proficiency}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT MAIN CONTENT ── */}
      <div style={{ flex: 1, padding: "48px 32px", background: "#fff", boxSizing: "border-box" }}>
        {/* Summary */}
        {(personalInfo.summary || isEditable) && (
          <div style={{ marginBottom: "28px", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <MainHeading label="Summary" />
              {isEditable && (
                <button 
                  onClick={() => onRefine?.("summary")}
                  disabled={refiningId === "summary"}
                  style={{ background: "none", border: "none", color: "#1b2a4a", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 700 }}
                >
                  {refiningId === "summary" ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI REFINE
                </button>
              )}
            </div>
            {isEditable ? (
              <textarea
                defaultValue={personalInfo.summary}
                placeholder="Brief professional summary..."
                onBlur={(e) => onUpdate?.("personalInfo.summary", e.target.value)}
                style={{ width: "100%", minHeight: "100px", fontSize: "12.5px", color: "#374151", lineHeight: 1.75, background: "transparent", border: "1px dashed #1b2a4a", padding: "8px", outline: "none", resize: "vertical", fontFamily: "inherit" }}
              />
            ) : (
              <MarkdownText 
                content={personalInfo.summary}
                style={{
                  fontSize: "12.5px",
                  color: "#374151",
                  lineHeight: 1.75,
                  textAlign: "justify",
                }}
              />
            )}
          </div>
        )}

        {/* Experience */}
        {(experience.length > 0 || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <MainHeading label="Experience" />
              {isEditable && (
                <button onClick={() => onUpdate?.("experience.add", {})} style={{ background: "none", border: "none", color: "#1b2a4a", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700 }}>
                  <PlusCircle size={14} /> ADD ROLE
                </button>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {experience.map((exp) => (
                <div key={exp.id} style={{ position: "relative" }}>
                  {isEditable && (
                    <button onClick={() => onUpdate?.("experience.remove", exp.id)} style={{ position: "absolute", left: "-28px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "2px",
                    }}
                  >
                    {isEditable ? (
                      <div style={{ display: "flex", gap: "4px", width: "70%" }}>
                        <input defaultValue={exp.company} placeholder="Company" onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)} style={{ fontWeight: 700, fontSize: "13.5px", color: "#1b2a4a", background: "transparent", border: "1px dashed #1b2a4a", outline: "none", width: "45%" }} />
                        <span>|</span>
                        <input defaultValue={exp.role} placeholder="Role" onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)} style={{ fontWeight: 700, fontSize: "13.5px", color: "#1b2a4a", background: "transparent", border: "1px dashed #1b2a4a", outline: "none", width: "45%" }} />
                      </div>
                    ) : (
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
                    )}
                    {isEditable ? (
                      <DurationPicker value={exp.duration} onChange={(val) => onUpdate?.(`experience.${exp.id}.duration`, val)} />
                    ) : (
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
                    )}
                  </div>
                  {isEditable ? (
                    <div style={{ marginTop: "6px" }}>
                       {exp.description.map((bullet, i) => (
                         <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                           <input defaultValue={bullet} placeholder="Achievement..." onBlur={(e) => {
                             const newDesc = [...exp.description]
                             newDesc[i] = e.target.value
                             onUpdate?.(`experience.${exp.id}.description`, newDesc)
                           }} style={{ flex: 1, fontSize: "12.px", background: "transparent", border: "1px dashed #1b2a4a", outline: "none" }} />
                           <button onClick={() => {
                             const newDesc = exp.description.filter((_, idx) => idx !== i)
                             onUpdate?.(`experience.${exp.id}.description`, newDesc)
                           }} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                         </div>
                       ))}
                       <button onClick={() => onUpdate?.(`experience.${exp.id}.description`, [...exp.description, ""])} style={{ background: "none", border: "none", color: "#1b2a4a", cursor: "pointer", fontWeight: 700, fontSize: "11px" }}>+ ADD BULLET</button>
                    </div>
                  ) : (
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
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {(education.length > 0 || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <MainHeading label="Education" />
              {isEditable && (
                <button onClick={() => onUpdate?.("education.add", {})} style={{ background: "none", border: "none", color: "#1b2a4a", cursor: "pointer" }}><PlusCircle size={14} /></button>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {education.map((edu) => (
                <div key={edu.id} style={{ position: "relative" }}>
                   {isEditable && (
                    <button onClick={() => onUpdate?.("education.remove", edu.id)} style={{ position: "absolute", right: "0", top: "0", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    {isEditable ? (
                      <input defaultValue={edu.degree} placeholder="Degree" onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)} style={{ fontWeight: 700, fontSize: "13px", color: "#1b2a4a", background: "transparent", border: "1px dashed #1b2a4a", outline: "none", width: "70%" }} />
                    ) : (
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "13px",
                          color: "#1b2a4a",
                        }}
                      >
                        {edu.degree}
                      </span>
                    )}
                    {isEditable ? (
                      <DurationPicker value={edu.duration} onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} />
                    ) : (
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
                    )}
                  </div>
                  {isEditable ? (
                    <input defaultValue={edu.school} placeholder="School" onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)} style={{ fontSize: "12px", color: "#6b7280", background: "transparent", border: "1px dashed #6b7280", outline: "none", width: "100%", marginTop: "2px" }} />
                  ) : (
                    <p style={{ fontSize: "12px", color: "#6b7280" }}>
                      {edu.school}
                    </p>
                  )}
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
        {/* Volunteering */}
        {(volunteering && volunteering.length > 0 || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <MainHeading label="Volunteering" />
              {isEditable && (
                <button 
                  onClick={() => onUpdate?.("volunteering.add", {})}
                  style={{ background: "none", border: "none", color: "#1b2a4a", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700 }}
                >
                  <PlusCircle size={14} /> ADD
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {(volunteering || []).map((vol) => (
                <div key={vol.id} style={{ position: "relative" }}>
                  {isEditable && (
                    <button 
                      onClick={() => onUpdate?.("volunteering.remove", vol.id)}
                      style={{ position: "absolute", left: "-28px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                    {isEditable ? (
                      <input 
                        defaultValue={vol.role}
                        placeholder="Role"
                        onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)}
                        style={{ fontWeight: 700, fontSize: "13.5px", color: "#1b2a4a", width: "60%", background: "transparent", border: "1px dashed #1b2a4a", outline: "none" }}
                      />
                    ) : (
                      <span style={{ fontWeight: 700, fontSize: "13.5px", color: "#1b2a4a" }}>{vol.role}</span>
                    )}
                    {isEditable ? (
                      <DurationPicker 
                        value={vol.duration} 
                        onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} 
                      />
                    ) : (
                      <span style={{ fontSize: "11.5px", color: "#6b7280" }}>{vol.duration}</span>
                    )}
                  </div>
                  {isEditable ? (
                    <input 
                      defaultValue={vol.organization}
                      placeholder="Organization"
                      onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)}
                      style={{ fontSize: "12.5px", color: "#444", fontWeight: 600, width: "80%", background: "transparent", border: "1px dashed #1b2a4a", outline: "none", marginBottom: "4px" }}
                    />
                  ) : (
                    <div style={{ fontSize: "12.5px", color: "#444", fontWeight: 600 }}>{vol.organization}</div>
                  )}
                  {isEditable ? (
                    <textarea 
                      defaultValue={vol.description}
                      placeholder="Description..."
                      onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.target.value)}
                      style={{ width: "100%", fontSize: "12px", color: "#374151", lineHeight: 1.6, background: "transparent", border: "1px dashed #1b2a4a", outline: "none", padding: "4px", resize: "vertical", fontFamily: "inherit" }}
                    />
                  ) : (
                    <MarkdownText content={vol.description} style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6 }} />
                  )}
                  {isEditable && (
                    <button 
                      onClick={() => onRefine?.("volunteering", vol.id)}
                      disabled={refiningId === vol.id || !vol.description}
                      style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 700, color: "#1b2a4a", background: "rgba(27,42,74,0.05)", border: "1px solid rgba(27,42,74,0.2)", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", marginTop: "4px", opacity: (refiningId === vol.id || !vol.description) ? 0.5 : 1 }}
                    >
                      {refiningId === vol.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                      AI REFINE
                    </button>
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

function SidebarDetail({ label, value, onUpdate, isEditable }: { label: string, value?: string, onUpdate?: (val: string) => void, isEditable: boolean }) {
  if (!isEditable && !value) return null
  return (
    <div style={{ fontSize: "12px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
      <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.7)", minWidth: "90px" }}>{label}:</span>
      {isEditable ? (
        <input 
          defaultValue={value}
          onBlur={(e) => onUpdate?.(e.target.value)}
          style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.3)", fontSize: "12px", color: "#fff", padding: "0 4px", outline: "none", width: "100%", fontFamily: "inherit" }}
        />
      ) : (
        <span style={{ color: "#fff" }}>{value}</span>
      )}
    </div>
  )
}

function SidebarContact({ label, value, href, isEditable, onUpdate }: { label: string; value: string; href?: string; isEditable?: boolean; onUpdate?: (val: string) => void }) {
  const content = isEditable ? (
    <input defaultValue={value} onBlur={(e) => onUpdate?.(e.target.value)} style={{ fontSize: "11px", color: "#fff", background: "transparent", border: "1px dashed rgba(255,255,255,0.3)", outline: "none", width: "100%", fontFamily: "inherit" }} />
  ) : (
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
      {href && !isEditable ? (
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
