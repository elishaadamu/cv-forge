import { Phone, Mail, Linkedin, MapPin, Globe, Github, Facebook, PlusCircle, Trash2, Sparkles, Loader2, Camera, X } from "lucide-react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"
import { DurationPicker } from "../DurationPicker"
import React from "react"

function formatUrl(url: string) {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url
  }
  if (url.includes("@")) return `mailto:${url}`
  return `https://${url}`
}

export function FreshMinimal({ 
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
          <div style={{ position: "relative" }}>
            {personalInfo.profileImage ? (
              <div style={{ position: "relative" }}>
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
                {isEditable && (
                  <button
                    onClick={onImageClick}
                    style={{ position: "absolute", bottom: "0", right: "0", background: "#10b981", color: "white", borderRadius: "50%", padding: "4px", border: "2px solid white", cursor: "pointer" }}
                  >
                    <Camera size={12} />
                  </button>
                )}
              </div>
            ) : isEditable ? (
              <button
                onClick={onImageClick}
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  border: "2px dashed #10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(16, 185, 129, 0.05)",
                  color: "#10b981",
                  cursor: "pointer"
                }}
              >
                <Camera size={16} />
              </button>
            ) : null}
          </div>
          <div style={{ flex: 1 }}>
            {isEditable ? (
              <input
                defaultValue={personalInfo.fullName}
                placeholder="YOUR NAME"
                onBlur={(e) => onUpdate?.("personalInfo.fullName", e.target.value)}
                style={{
                  fontSize: "32px",
                  fontWeight: 300,
                  color: "#1a1a1a",
                  lineHeight: 1.15,
                  letterSpacing: "-0.5px",
                  marginBottom: "2px",
                  width: "100%",
                  background: "transparent",
                  border: "1px dashed #e5e7eb",
                  outline: "none",
                  fontFamily: "inherit"
                }}
              />
            ) : (
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
            )}
            {isEditable ? (
              <input
                defaultValue={personalInfo.jobTitle}
                placeholder="JOB TITLE"
                onBlur={(e) => onUpdate?.("personalInfo.jobTitle", e.target.value)}
                style={{
                  fontSize: "14px",
                  color: "#10b981",
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                  width: "100%",
                  background: "transparent",
                  border: "1px dashed #e5e7eb",
                  outline: "none",
                  fontFamily: "inherit"
                }}
              />
            ) : (
              <p style={{ fontSize: "14px", color: "#10b981", fontWeight: 500, letterSpacing: "0.5px" }}>
                {personalInfo.jobTitle}
              </p>
            )}
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
          {isEditable ? (
             <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", width: "100%" }}>
                <input defaultValue={personalInfo.email || ""} placeholder="Email" onBlur={(e) => onUpdate?.("personalInfo.email", e.target.value)} style={{ background: "transparent", border: "1px dashed #e5e7eb", fontSize: "10.5px", width: "150px" }} />
                <input defaultValue={personalInfo.phone || ""} placeholder="Phone" onBlur={(e) => onUpdate?.("personalInfo.phone", e.target.value)} style={{ background: "transparent", border: "1px dashed #e5e7eb", fontSize: "10.5px", width: "120px" }} />
                <input defaultValue={personalInfo.location || ""} placeholder="Location" onBlur={(e) => onUpdate?.("personalInfo.location", e.target.value)} style={{ background: "transparent", border: "1px dashed #e5e7eb", fontSize: "10.5px", width: "150px" }} />
             </div>
          ) : (
            <>
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
                <ContactLink icon={<MapPin size={10} />} text={[personalInfo.county, personalInfo.country, personalInfo.location].filter(Boolean).join(", ")} />
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
            </>
          )}
        </div>
      </div>

      {/* ── SUMMARY ── */}
      {(personalInfo.summary || isEditable) && (
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <LightHeading label="Summary" />
            {isEditable && (
              <button 
                onClick={() => onRefine?.("summary")}
                disabled={refiningId === "summary"}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#10b981" }}
              >
                {refiningId === "summary" ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI REFINE
              </button>
            )}
          </div>
          {isEditable ? (
            <textarea
              defaultValue={personalInfo.summary}
              placeholder="Your professional summary..."
              onBlur={(e) => onUpdate?.("personalInfo.summary", e.target.value)}
              style={{ width: "100%", minHeight: "80px", fontSize: "12.5px", color: "#4b5563", lineHeight: 1.8, background: "transparent", border: "1px dashed #e5e7eb", outline: "none", fontFamily: "inherit", fontWeight: 300, resize: "vertical" }}
            />
          ) : (
            <MarkdownText
              content={personalInfo.summary || ""}
              style={{ fontSize: "12.5px", color: "#4b5563", lineHeight: 1.8, fontWeight: 300 }}
            />
          )}
        </div>
      )}

      {/* ── EXPERIENCE ── */}
      {(experience.length > 0 || isEditable) && (
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <LightHeading label="Experience" />
            {isEditable && (
               <button onClick={() => onUpdate?.("experience.add", {})} style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                <PlusCircle size={14} /> ADD ROLE
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {experience.map((exp) => (
              <div key={exp.id} style={{ position: "relative" }}>
                 {isEditable && (
                  <button onClick={() => onUpdate?.("experience.remove", exp.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                  <div>
                    {isEditable ? (
                       <div style={{ display: "flex", gap: "8px" }}>
                          <input defaultValue={exp.role} placeholder="Role" onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)} style={{ fontSize: "14px", fontWeight: 500, color: "#1a1a1a", background: "transparent", border: "1px dashed #e5e7eb", outline: "none" }} />
                          <span style={{ color: "#9ca3af", fontSize: "13px", fontWeight: 300 }}>at</span>
                          <input defaultValue={exp.company} placeholder="Company" onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)} style={{ color: "#9ca3af", fontSize: "13px", background: "transparent", border: "1px dashed #e5e7eb", outline: "none", fontWeight: 300 }} />
                       </div>
                    ) : (
                      <>
                        <span style={{ fontSize: "14px", fontWeight: 500, color: "#1a1a1a" }}>{exp.role}</span>
                        <span style={{ color: "#9ca3af", fontSize: "13px", marginLeft: "10px", fontWeight: 300 }}>{exp.company}</span>
                      </>
                    )}
                  </div>
                  {isEditable ? (
                    <DurationPicker value={exp.duration} onChange={(val) => onUpdate?.(`experience.${exp.id}.duration`, val)} />
                  ) : (
                    <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 500, whiteSpace: "nowrap" }}>{exp.duration}</span>
                  )}
                </div>
                {isEditable ? (
                  <div style={{ marginTop: "4px" }}>
                    {exp.description.map((bullet, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                        <input defaultValue={bullet} onBlur={(e) => {
                          const newDesc = [...exp.description]
                          newDesc[i] = e.target.value
                          onUpdate?.(`experience.${exp.id}.description`, newDesc)
                        }} style={{ flex: 1, fontSize: "12px", background: "transparent", border: "1px dashed #e5e7eb", outline: "none" }} />
                        <button onClick={() => {
                          const newDesc = exp.description.filter((_, idx) => idx !== i)
                          onUpdate?.(`experience.${exp.id}.description`, newDesc)
                        }} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                      </div>
                    ))}
                    <button onClick={() => onUpdate?.(`experience.${exp.id}.description`, [...exp.description, ""])} style={{ fontSize: "10px", fontWeight: "bold", background: "none", border: "none", cursor: "pointer", color: "#10b981" }}>+ ADD BULLET</button>
                  </div>
                ) : (
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
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SKILLS ── */}
      {(skills.length > 0 || isEditable) && (
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <LightHeading label="Skills" />
            {isEditable && (
               <button onClick={() => onUpdate?.("skills.add", "New Category")} style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer" }}><PlusCircle size={14} /></button>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {isEditable ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                {skills.map((skill, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                     <input defaultValue={skill.category} onBlur={(e) => onUpdate?.(`skills.${i}.category`, e.target.value)} style={{ fontWeight: 500, width: "120px", background: "transparent", border: "1px dashed #e5e7eb" }} />
                     <input defaultValue={skill.items.join(", ")} onBlur={(e) => onUpdate?.(`skills.${i}.items`, e.target.value.split(",").map(s => s.trim()))} style={{ flex: 1, background: "transparent", border: "1px dashed #e5e7eb" }} />
                     <button onClick={() => onUpdate?.("skills.remove", i)} style={{ color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            ) : (
              allSkills.map((skill, i) => (
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
              ))
            )}
          </div>
        </div>
      )}

      {/* ── EDUCATION ── */}
      {(education.length > 0 || isEditable) && (
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <LightHeading label="Education" />
            {isEditable && (
               <button onClick={() => onUpdate?.("education.add", {})} style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer" }}><PlusCircle size={14} /></button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {education.map((edu) => (
              <div key={edu.id} style={{ position: "relative" }}>
                 {isEditable && (
                  <button onClick={() => onUpdate?.("education.remove", edu.id)} style={{ position: "absolute", left: "-20px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    {isEditable ? (
                       <div style={{ display: "flex", gap: "8px" }}>
                          <input defaultValue={edu.degree} placeholder="Degree" onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)} style={{ fontWeight: 500, fontSize: "12.5px", color: "#1a1a1a", background: "transparent", border: "1px dashed #e5e7eb", outline: "none" }} />
                          <span style={{ color: "#9ca3af", fontSize: "12px", fontWeight: 300 }}>at</span>
                          <input defaultValue={edu.school} placeholder="School" onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)} style={{ color: "#9ca3af", fontSize: "12px", background: "transparent", border: "1px dashed #e5e7eb", outline: "none", fontWeight: 300 }} />
                       </div>
                    ) : (
                      <>
                        <span style={{ fontWeight: 500, fontSize: "12.5px", color: "#1a1a1a" }}>{edu.degree}</span>
                        <span style={{ color: "#9ca3af", fontSize: "12px", marginLeft: "10px", fontWeight: 300 }}>{edu.school}</span>
                      </>
                    )}
                  </div>
                  {isEditable ? (
                    <DurationPicker value={edu.duration} onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} />
                  ) : (
                    edu.duration && <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 500 }}>{edu.duration}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PROJECTS ── */}
      {(projects.length > 0 || isEditable) && (
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <LightHeading label="Projects" />
            {isEditable && (
               <button onClick={() => onUpdate?.("projects.add", {})} style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer" }}><PlusCircle size={14} /></button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {projects.map((proj) => (
              <div key={proj.id} style={{ position: "relative" }}>
                 {isEditable && (
                  <button onClick={() => onUpdate?.("projects.remove", proj.id)} style={{ position: "absolute", left: "-20px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  {isEditable ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
                       <input defaultValue={proj.name} placeholder="Project Name" onBlur={(e) => onUpdate?.(`projects.${proj.id}.name`, e.target.value)} style={{ fontWeight: 500, fontSize: "13px", color: "#1a1a1a", background: "transparent", border: "1px dashed #e5e7eb", outline: "none" }} />
                       <input defaultValue={proj.link} placeholder="Link" onBlur={(e) => onUpdate?.(`projects.${proj.id}.link`, e.target.value)} style={{ fontSize: "10px", color: "#10b981", background: "transparent", border: "1px dashed #e5e7eb", outline: "none" }} />
                       <textarea defaultValue={proj.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`projects.${proj.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "11.5px", color: "#4b5563", background: "transparent", border: "1px dashed #e5e7eb", outline: "none", fontFamily: "inherit", fontWeight: 300 }} />
                    </div>
                  ) : (
                    <>
                      <span style={{ fontWeight: 500, fontSize: "13px", color: "#1a1a1a" }}>{proj.name}</span>
                      {proj.link && (
                        <a href={formatUrl(proj.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "10px", color: "#10b981", textDecoration: "none" }}>
                          {proj.link}
                        </a>
                      )}
                    </>
                  )}
                </div>
                {!isEditable && proj.description && (
                  <MarkdownText content={proj.description} style={{ fontSize: "11.5px", color: "#4b5563", lineHeight: 1.6, marginTop: "2px", fontWeight: 300 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VOLUNTEERING ── */}
      {(volunteering && volunteering.length > 0 || isEditable) && (
        <div style={{ marginBottom: "28px", marginTop: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <LightHeading label="Volunteering" />
            {isEditable && (
               <button onClick={() => onUpdate?.("volunteering.add", {})} style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                <PlusCircle size={14} /> ADD ROLE
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {(volunteering || []).map((vol) => (
              <div key={vol.id} style={{ position: "relative" }}>
                 {isEditable && (
                  <button onClick={() => onUpdate?.("volunteering.remove", vol.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                  <div>
                    {isEditable ? (
                       <div style={{ display: "flex", gap: "8px" }}>
                          <input defaultValue={vol.role} placeholder="Role" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)} style={{ fontSize: "14px", fontWeight: 500, color: "#1a1a1a", background: "transparent", border: "1px dashed #e5e7eb", outline: "none" }} />
                          <span style={{ color: "#9ca3af", fontSize: "13px", fontWeight: 300 }}>at</span>
                          <input defaultValue={vol.organization} placeholder="Organization" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)} style={{ color: "#9ca3af", fontSize: "13px", background: "transparent", border: "1px dashed #e5e7eb", outline: "none", fontWeight: 300 }} />
                       </div>
                    ) : (
                      <>
                        <span style={{ fontSize: "14px", fontWeight: 500, color: "#1a1a1a" }}>{vol.role}</span>
                        <span style={{ color: "#9ca3af", fontSize: "13px", marginLeft: "10px", fontWeight: 300 }}>{vol.organization}</span>
                      </>
                    )}
                  </div>
                  {isEditable ? (
                    <DurationPicker value={vol.duration} onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} />
                  ) : (
                    <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 500, whiteSpace: "nowrap" }}>{vol.duration}</span>
                  )}
                </div>
                {isEditable ? (
                  <textarea defaultValue={vol.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "12.5px", color: "#4b5563", background: "transparent", border: "1px dashed #e5e7eb", outline: "none", fontFamily: "inherit", fontWeight: 300, resize: "vertical" }} />
                ) : (
                  <MarkdownText content={vol.description} style={{ fontSize: "12.5px", color: "#4b5563", lineHeight: 1.6 }} />
                )}
                {isEditable && (
                    <button 
                      onClick={() => onRefine?.("volunteering", vol.id)}
                      disabled={refiningId === vol.id || !vol.description}
                      style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#10b981", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", marginTop: "4px", opacity: (refiningId === vol.id || !vol.description) ? 0.5 : 1 }}
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

      {/* ── DETAILS & LANGUAGES ── */}
      <div style={{ display: "flex", gap: "40px", marginTop: "28px", borderTop: "1px solid #f0f0f0", paddingTop: "28px" }}>
        {(hasPersonalDetails || isEditable) && (
          <div style={{ flex: 1 }}>
            <LightHeading label="Details" />
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
               {(personalInfo.dateOfBirth || isEditable) && <DetailRow label="DOB" value={personalInfo.dateOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.dateOfBirth", val)} isEditable={isEditable} />}
               {(personalInfo.placeOfBirth || isEditable) && <DetailRow label="Birth Place" value={personalInfo.placeOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.placeOfBirth", val)} isEditable={isEditable} />}
               {(personalInfo.nationality || isEditable) && <DetailRow label="Nationality" value={personalInfo.nationality} onUpdate={(val) => onUpdate?.("personalInfo.nationality", val)} isEditable={isEditable} />}
               {(personalInfo.gender || isEditable) && <DetailRow label="Gender" value={personalInfo.gender} onUpdate={(val) => onUpdate?.("personalInfo.gender", val)} isEditable={isEditable} />}
               {(personalInfo.passport || isEditable) && <DetailRow label="Passport" value={personalInfo.passport} onUpdate={(val) => onUpdate?.("personalInfo.passport", val)} isEditable={isEditable} />}
               {(personalInfo.workPermit || isEditable) && <DetailRow label="Work Permit" value={personalInfo.workPermit} onUpdate={(val) => onUpdate?.("personalInfo.workPermit", val)} isEditable={isEditable} />}
            </div>
          </div>
        )}
        {(languages && languages.length > 0 || isEditable) && (
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <LightHeading label="Languages" />
              {isEditable && (
                <button onClick={() => onUpdate?.("languages.add", { name: "New Language", proficiency: "Native" })} style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer" }}><PlusCircle size={14} /></button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {(languages || []).map((lang, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {isEditable && (
                      <button onClick={() => onUpdate?.("languages.remove", i)} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                    )}
                    {isEditable ? (
                      <input defaultValue={lang.name} onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.target.value)} style={{ fontWeight: 500, background: "transparent", border: "1px dashed #e5e7eb", width: "80px" }} />
                    ) : (
                      <span style={{ fontWeight: 500, color: "#1a1a1a" }}>{lang.name}</span>
                    )}
                  </div>
                  {isEditable ? (
                    <input defaultValue={lang.proficiency} onBlur={(e) => onUpdate?.(`languages.${i}.proficiency`, e.target.value)} style={{ background: "transparent", border: "1px dashed #e5e7eb", width: "80px", textAlign: "right", color: "#6b7280" }} />
                  ) : (
                    <span style={{ color: "#9ca3af", fontWeight: 300, fontStyle: "italic" }}>{lang.proficiency}</span>
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

function DetailRow({ label, value, onUpdate, isEditable }: { label: string, value?: string, onUpdate?: (val: string) => void, isEditable: boolean }) {
  if (!isEditable && !value) return null
  return (
    <div style={{ fontSize: "12.5px", display: "flex", gap: "8px" }}>
      <span style={{ fontWeight: 500, minWidth: "90px", color: "#1a1a1a" }}>{label}:</span>
      {isEditable ? (
        <input 
          defaultValue={value}
          onBlur={(e) => onUpdate?.(e.target.value)}
          style={{ background: "transparent", border: "1px dashed #e5e7eb", fontSize: "12.5px", color: "#4b5563", padding: "0 4px", outline: "none", width: "100%", fontFamily: "inherit" }}
        />
      ) : (
        <span style={{ color: "#4b5563", fontWeight: 300 }}>{value}</span>
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
