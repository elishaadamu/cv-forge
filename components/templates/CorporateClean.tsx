import { Phone, Mail, Linkedin, MapPin, Globe, Github, Facebook, PlusCircle, Trash2, Sparkles, Loader2, Camera, X, ChevronDown, Check, Search } from "lucide-react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"
import { DurationPicker } from "../DurationPicker"
import React, { useRef, useState, useEffect } from "react"
import countriesData from "@/lib/countries-data.json"

function formatUrl(url: string) {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url
  }
  if (url.includes("@")) return `mailto:${url}`
  return `https://${url}`
}

export function CorporateClean({ 
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
            <div style={{ position: "relative" }}>
              {personalInfo.profileImage ? (
                <div style={{ position: "relative" }}>
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
                  {isEditable && (
                    <button
                      onClick={onImageClick}
                      style={{ position: "absolute", bottom: "-6px", right: "-6px", background: "#0d9488", color: "white", borderRadius: "50%", padding: "4px", border: "2px solid white", cursor: "pointer" }}
                    >
                      <Camera size={12} />
                    </button>
                  )}
                </div>
              ) : isEditable ? (
                <button
                  onClick={onImageClick}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "12px",
                    border: "2px dashed #0d9488",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(13, 148, 136, 0.05)",
                    color: "#0d9488",
                    cursor: "pointer"
                  }}
                >
                  <Camera size={20} />
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
                    fontSize: "30px",
                    fontWeight: 700,
                    color: "#111827",
                    lineHeight: 1.15,
                    letterSpacing: "-0.3px",
                    marginBottom: "4px",
                    width: "100%",
                    background: "transparent",
                    border: "1px dashed #0d9488",
                    outline: "none",
                    fontFamily: "inherit"
                  }}
                />
              ) : (
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
              )}
              {isEditable ? (
                <input
                  defaultValue={personalInfo.jobTitle}
                  placeholder="JOB TITLE"
                  onBlur={(e) => onUpdate?.("personalInfo.jobTitle", e.target.value)}
                  style={{
                    fontSize: "14px",
                    color: "#0d9488",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    width: "100%",
                    background: "transparent",
                    border: "1px dashed #0d9488",
                    outline: "none",
                    fontFamily: "inherit"
                  }}
                />
              ) : (
                <p style={{ fontSize: "14px", color: "#0d9488", fontWeight: 600, letterSpacing: "0.5px" }}>
                  {personalInfo.jobTitle}
                </p>
              )}
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
            {isEditable ? (
               <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", width: "100%" }}>
                  <input defaultValue={personalInfo.email || ""} placeholder="Email" onBlur={(e) => onUpdate?.("personalInfo.email", e.target.value)} style={{ background: "transparent", border: "1px dashed #0d9488", fontSize: "10.5px", width: "150px" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    <PopSelect
                      value={personalInfo.phoneCode || "+1"}
                      options={countriesData.map(c => {
                        const pc = c.phonecode || ""
                        const displayCode = pc.startsWith('+') ? pc : `+${pc}`
                        return `${c.name} (${displayCode})`
                      })}
                      onSelect={(val) => {
                        const match = val.match(/\((.*?)\)/)
                        if (match) {
                          const code = match[1]
                          const finalCode = code.startsWith('+') ? code : `+${code}`
                          onUpdate?.("personalInfo.phoneCode", finalCode)
                        }
                      }}
                    />
                    <input defaultValue={personalInfo.phone || ""} placeholder="Phone" onBlur={(e) => onUpdate?.("personalInfo.phone", e.target.value)} style={{ background: "transparent", border: "1px dashed #0d9488", fontSize: "10.5px", width: "100px" }} />
                  </div>
                  <SearchableSelect
                    value={personalInfo.country || "Country"}
                    options={countriesData.map(c => c.name)}
                    onSelect={(val) => onUpdate?.("personalInfo.country", val)}
                  />
                  <SearchableSelect
                    value={personalInfo.county || "State/Province"}
                    options={personalInfo.country ? (countriesData.find((c: any) => c.name === personalInfo.country)?.states || []).map((s: any) => s.name) : []}
                    onSelect={(val) => onUpdate?.("personalInfo.county", val)}
                  />
                  <input defaultValue={personalInfo.location || ""} placeholder="Postal code" onBlur={(e) => onUpdate?.("personalInfo.location", e.target.value)} style={{ background: "transparent", border: "1px dashed #0d9488", fontSize: "10.5px", width: "100px" }} />
               </div>
            ) : (
              <>
                {personalInfo.phone && (
                  <ContactPill icon={<Phone size={10} />} text={`${personalInfo.phoneCode || ''} ${personalInfo.phone}`} href={`tel:${personalInfo.phoneCode || ''}${personalInfo.phone}`} />
                )}
                {personalInfo.email && (
                  <ContactPill icon={<Mail size={10} />} text={personalInfo.email} href={`mailto:${personalInfo.email}`} />
                )}
                {personalInfo.linkedin && (
                  <ContactPill icon={<Linkedin size={10} />} text={personalInfo.linkedin} href={formatUrl(personalInfo.linkedin)} />
                )}
                {(personalInfo.country || personalInfo.county || personalInfo.location) && (
                  <ContactPill icon={<MapPin size={10} />} text={[personalInfo.county, personalInfo.country, personalInfo.location].filter(Boolean).join(", ")} />
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
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 48px 48px", flex: 1 }}>
          {/* Summary */}
          {(personalInfo.summary || isEditable) && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <TealHeading label="Professional Summary" />
                {isEditable && (
                  <button 
                    onClick={() => onRefine?.("summary")}
                    disabled={refiningId === "summary"}
                    style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#0d9488" }}
                  >
                    {refiningId === "summary" ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI REFINE
                  </button>
                )}
              </div>
              {isEditable ? (
                <textarea
                  defaultValue={personalInfo.summary}
                  placeholder="Your summary..."
                  onBlur={(e) => onUpdate?.("personalInfo.summary", e.target.value)}
                  style={{ width: "100%", minHeight: "80px", fontSize: "12.5px", color: "#374151", lineHeight: 1.7, background: "transparent", border: "1px dashed #d1d5db", outline: "none", fontFamily: "inherit", resize: "vertical" }}
                />
              ) : (
                <MarkdownText
                  content={personalInfo.summary || ""}
                  style={{ fontSize: "12.5px", color: "#374151", lineHeight: 1.7, textAlign: "justify" }}
                />
              )}
            </div>
          )}

          {/* Experience */}
          {(experience.length > 0 || isEditable) && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <TealHeading label="Work Experience" />
                {isEditable && (
                   <button onClick={() => onUpdate?.("experience.add", {})} style={{ background: "none", border: "none", color: "#0d9488", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                    <PlusCircle size={14} /> ADD ROLE
                  </button>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {experience.map((exp) => (
                  <div key={exp.id} style={{ display: "flex", gap: "16px", position: "relative" }}>
                     {isEditable && (
                      <button onClick={() => onUpdate?.("experience.remove", exp.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
                    )}
                    {/* Timeline dot + line */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "16px", flexShrink: 0, paddingTop: "4px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0d9488", flexShrink: 0 }} />
                      <div style={{ width: "2px", flex: 1, background: "#d1d5db", marginTop: "4px" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                        {isEditable ? (
                          <input defaultValue={exp.role} placeholder="Role" onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)} style={{ fontWeight: 700, fontSize: "13px", background: "transparent", border: "1px dashed #d1d5db", outline: "none", color: "#111827" }} />
                        ) : (
                          <span style={{ fontWeight: 700, fontSize: "13px", color: "#111827" }}>{exp.role}</span>
                        )}
                        {isEditable ? (
                          <DurationPicker value={exp.duration} onChange={(val) => onUpdate?.(`experience.${exp.id}.duration`, val)} />
                        ) : (
                          <span style={{ fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap", marginLeft: "12px" }}>{exp.duration}</span>
                        )}
                      </div>
                      {isEditable ? (
                        <input defaultValue={exp.company} placeholder="Company" onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)} style={{ fontSize: "11.5px", color: "#0d9488", fontWeight: 600, marginBottom: "6px", background: "transparent", border: "1px dashed #d1d5db", outline: "none", width: "100%" }} />
                      ) : (
                        <p style={{ fontSize: "11.5px", color: "#0d9488", fontWeight: 600, marginBottom: "6px" }}>{exp.company}</p>
                      )}
                      {isEditable ? (
                        <div style={{ marginTop: "4px" }}>
                          {exp.description.map((bullet, i) => (
                            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                              <input defaultValue={bullet} onBlur={(e) => {
                                const newDesc = [...exp.description]
                                newDesc[i] = e.target.value
                                onUpdate?.(`experience.${exp.id}.description`, newDesc)
                              }} style={{ flex: 1, fontSize: "12px", background: "transparent", border: "1px dashed #d1d5db", outline: "none" }} />
                              <button onClick={() => {
                                const newDesc = exp.description.filter((_, idx) => idx !== i)
                                onUpdate?.(`experience.${exp.id}.description`, newDesc)
                              }} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                            </div>
                          ))}
                          <button onClick={() => onUpdate?.(`experience.${exp.id}.description`, [...exp.description, ""])} style={{ fontSize: "10px", fontWeight: "bold", background: "none", border: "none", cursor: "pointer", color: "#0d9488" }}>+ ADD BULLET</button>
                        </div>
                      ) : (
                        <ul style={{ paddingLeft: "16px", margin: 0, listStyleType: "disc" }}>
                          {exp.description.filter(Boolean).map((bullet, i) => (
                            <li key={i} style={{ fontSize: "12px", color: "#374151", lineHeight: 1.65, marginBottom: "3px" }}>
                              <MarkdownText content={bullet} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Volunteering */}
          {(volunteering && volunteering.length > 0 || isEditable) && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <TealHeading label="Volunteering" />
                {isEditable && (
                   <button onClick={() => onUpdate?.("volunteering.add", {})} style={{ background: "none", border: "none", color: "#0d9488", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                    <PlusCircle size={14} /> ADD ROLE
                  </button>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {(volunteering || []).map((vol) => (
                  <div key={vol.id} style={{ display: "flex", gap: "16px", position: "relative" }}>
                     {isEditable && (
                      <button onClick={() => onUpdate?.("volunteering.remove", vol.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "16px", flexShrink: 0, paddingTop: "4px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", border: "2px solid #0d9488", flexShrink: 0 }} />
                      <div style={{ width: "2px", flex: 1, background: "#d1d5db", marginTop: "4px" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                        {isEditable ? (
                          <input defaultValue={vol.role} placeholder="Role" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)} style={{ fontWeight: 700, fontSize: "13px", background: "transparent", border: "1px dashed #d1d5db", outline: "none", color: "#111827" }} />
                        ) : (
                          <span style={{ fontWeight: 700, fontSize: "13px", color: "#111827" }}>{vol.role}</span>
                        )}
                        {isEditable ? (
                          <DurationPicker value={vol.duration} onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} />
                        ) : (
                          <span style={{ fontSize: "11px", color: "#6b7280" }}>{vol.duration}</span>
                        )}
                      </div>
                      {isEditable ? (
                        <input defaultValue={vol.organization} placeholder="Organization" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)} style={{ fontSize: "11.5px", color: "#0d9488", fontWeight: 600, marginBottom: "4px", background: "transparent", border: "1px dashed #d1d5db", outline: "none", width: "100%" }} />
                      ) : (
                        <p style={{ fontSize: "11.5px", color: "#0d9488", fontWeight: 600, marginBottom: "4px" }}>{vol.organization}</p>
                      )}
                      {isEditable ? (
                        <textarea defaultValue={vol.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "12px", background: "transparent", border: "1px dashed #d1d5db", outline: "none", fontFamily: "inherit", resize: "vertical" }} />
                      ) : (
                        <MarkdownText content={vol.description} style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6 }} />
                      )}
                      {isEditable && (
                        <button 
                          onClick={() => onRefine?.("volunteering", vol.id)}
                          disabled={refiningId === vol.id || !vol.description}
                          style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#0d9488", background: "rgba(13, 148, 136, 0.05)", border: "1px solid rgba(13, 148, 136, 0.2)", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", marginTop: "4px", opacity: (refiningId === vol.id || !vol.description) ? 0.5 : 1 }}
                        >
                          {refiningId === vol.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                          AI REFINE
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills as categorized grid */}
          {(skills.length > 0 || isEditable) && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <TealHeading label="Core Competencies" />
                {isEditable && (
                   <button onClick={() => onUpdate?.("skills.add", "New Category")} style={{ background: "none", border: "none", color: "#0d9488", cursor: "pointer" }}><PlusCircle size={14} /></button>
                )}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #e5e7eb" }}>
                <tbody>
                  {skills.map((group, idx) => (
                    <tr key={idx} style={{ borderBottom: idx < skills.length - 1 ? "1px solid #e5e7eb" : "none", position: "relative" }}>
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
                        {isEditable ? (
                          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                            <button onClick={() => onUpdate?.("skills.remove", idx)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={10} /></button>
                            <input defaultValue={group.category} onBlur={(e) => onUpdate?.(`skills.${idx}.category`, e.target.value)} style={{ fontWeight: 700, background: "transparent", border: "none", outline: "none", width: "100%", color: "inherit", fontSize: "inherit" }} />
                          </div>
                        ) : (
                          group.category
                        )}
                      </td>
                      <td style={{ padding: "6px 12px", fontSize: "12px", color: "#374151" }}>
                        {isEditable ? (
                          <input defaultValue={group.items.join(", ")} onBlur={(e) => onUpdate?.(`skills.${idx}.items`, e.target.value.split(",").map(s => s.trim()))} style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: "inherit" }} />
                        ) : (
                          group.items.join("  •  ")
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Education + Projects */}
          <div style={{ display: "flex", gap: "32px" }}>
            {(education.length > 0 || isEditable) && (
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <TealHeading label="Education" />
                  {isEditable && (
                    <button onClick={() => onUpdate?.("education.add", {})} style={{ background: "none", border: "none", color: "#0d9488", cursor: "pointer" }}><PlusCircle size={14} /></button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {education.map((edu) => (
                    <div key={edu.id} style={{ position: "relative" }}>
                       {isEditable && (
                        <button onClick={() => onUpdate?.("education.remove", edu.id)} style={{ position: "absolute", left: "-20px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                      )}
                      {isEditable ? (
                        <div>
                          <input defaultValue={edu.degree} placeholder="Degree" onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)} style={{ fontWeight: 700, fontSize: "12px", width: "100%", background: "transparent", border: "1px dashed #d1d5db" }} />
                          <input defaultValue={edu.school} placeholder="School" onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)} style={{ fontSize: "11px", width: "100%", background: "transparent", border: "1px dashed #d1d5db" }} />
                          <DurationPicker value={edu.duration} onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} />
                        </div>
                      ) : (
                        <>
                          <p style={{ fontWeight: 700, fontSize: "12px", color: "#111827", marginBottom: "1px" }}>{edu.degree}</p>
                          <p style={{ fontSize: "11px", color: "#6b7280" }}>{edu.school}</p>
                          {edu.duration && <p style={{ fontSize: "10.5px", color: "#0d9488", fontWeight: 600 }}>{edu.duration}</p>}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(projects.length > 0 || isEditable) && (
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <TealHeading label="Projects" />
                  {isEditable && (
                    <button onClick={() => onUpdate?.("projects.add", {})} style={{ background: "none", border: "none", color: "#0d9488", cursor: "pointer" }}><PlusCircle size={14} /></button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {projects.map((proj) => (
                    <div key={proj.id} style={{ position: "relative" }}>
                       {isEditable && (
                        <button onClick={() => onUpdate?.("projects.remove", proj.id)} style={{ position: "absolute", left: "-20px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                      )}
                      {isEditable ? (
                        <div>
                          <input defaultValue={proj.name} placeholder="Project Name" onBlur={(e) => onUpdate?.(`projects.${proj.id}.name`, e.target.value)} style={{ fontWeight: 700, fontSize: "12px", width: "100%", background: "transparent", border: "1px dashed #d1d5db" }} />
                          <input defaultValue={proj.link} placeholder="Link" onBlur={(e) => onUpdate?.(`projects.${proj.id}.link`, e.target.value)} style={{ fontSize: "9.5px", width: "100%", background: "transparent", border: "1px dashed #d1d5db", color: "#0d9488" }} />
                          <textarea defaultValue={proj.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`projects.${proj.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "11px", background: "transparent", border: "1px dashed #d1d5db", outline: "none", fontFamily: "inherit" }} />
                        </div>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Personal Details & Languages */}
          <div style={{ display: "flex", gap: "32px", marginTop: "24px" }}>
            {(hasPersonalDetails || isEditable) && (
              <div style={{ flex: 1 }}>
                <TealHeading label="Personal Details" />
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
                  <TealHeading label="Languages" />
                  {isEditable && (
                    <button onClick={() => onUpdate?.("languages.add", { name: "New Language", proficiency: "Native" })} style={{ background: "none", border: "none", color: "#0d9488", cursor: "pointer" }}><PlusCircle size={14} /></button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {(languages || []).map((lang, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {isEditable && (
                          <button onClick={() => onUpdate?.("languages.remove", i)} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                        )}
                        {isEditable ? (
                          <input defaultValue={lang.name} onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.target.value)} style={{ fontWeight: 700, background: "transparent", border: "1px dashed #d1d5db", width: "80px" }} />
                        ) : (
                          <span style={{ fontWeight: 700, color: "#111827" }}>{lang.name}</span>
                        )}
                      </div>
                      {isEditable ? (
                        <input defaultValue={lang.proficiency} onBlur={(e) => onUpdate?.(`languages.${i}.proficiency`, e.target.value)} style={{ background: "transparent", border: "1px dashed #d1d5db", width: "80px", textAlign: "right", color: "#6b7280" }} />
                      ) : (
                        <span style={{ color: "#6b7280", fontStyle: "italic" }}>{lang.proficiency}</span>
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

function DetailRow({ label, value, onUpdate, isEditable }: { label: string, value?: string, onUpdate?: (val: string) => void, isEditable: boolean }) {
  if (!isEditable && !value) return null
  return (
    <div style={{ fontSize: "12px", display: "flex", gap: "8px" }}>
      <span style={{ fontWeight: 700, minWidth: "90px", color: "#111827" }}>{label}:</span>
      {isEditable ? (
        <input 
          defaultValue={value}
          onBlur={(e) => onUpdate?.(e.target.value)}
          style={{ background: "transparent", border: "1px dashed #d1d5db", fontSize: "12px", color: "#374151", padding: "0 4px", outline: "none", width: "100%", fontFamily: "inherit" }}
        />
      ) : (
        <span style={{ color: "#374151" }}>{value}</span>
      )}
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

function PopSelect({ value, options, onSelect }: { value: string; options: string[]; onSelect: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "none",
          border: "none",
          borderBottom: "1px dashed #0d9488",
          color: "#374151",
          fontSize: "10.5px",
          cursor: "pointer",
          padding: "1px 4px",
          outline: "none"
        }}
      >
        {value} <ChevronDown size={10} />
      </button>
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          zIndex: 1000,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          padding: "4px",
          maxHeight: "250px",
          overflowY: "auto",
          marginTop: "2px",
          minWidth: "150px"
        }}>
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onSelect(opt)
                setIsOpen(false)
              }}
              style={{
                padding: "4px 8px",
                fontSize: "10px",
                cursor: "pointer",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: value === opt ? "#f0fdfa" : "transparent",
                color: value === opt ? "#0d9488" : "#374151",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0fdfa")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = value === opt ? "#f0fdfa" : "transparent")}
            >
              {opt} {value === opt && <Check size={10} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchableSelect({ value, options, onSelect }: { value: string; options: string[]; onSelect: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block", minWidth: "120px" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "none",
          border: "none",
          borderBottom: "1px dashed #0d9488",
          color: "#374151",
          fontSize: "10.5px",
          cursor: "pointer",
          padding: "1px 4px",
          outline: "none",
          width: "100%"
        }}
      >
        {value} <ChevronDown size={10} />
      </button>
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          zIndex: 1000,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          padding: "6px",
          minWidth: "180px",
          marginTop: "2px"
        }}>
          <div style={{ position: "relative", marginBottom: "6px" }}>
            <Search size={10} style={{ position: "absolute", left: "6px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                width: "100%",
                padding: "4px 6px 4px 22px",
                fontSize: "10px",
                border: "1px solid #e5e7eb",
                borderRadius: "4px",
                outline: "none"
              }}
            />
          </div>
          <div style={{ maxHeight: "280px", overflowY: "auto" }}>
            {filtered.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onSelect(opt)
                  setIsOpen(false)
                }}
                style={{
                  padding: "4px 8px",
                  fontSize: "10px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: value === opt ? "#f0fdfa" : "transparent",
                  color: value === opt ? "#0d9488" : "#374151",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0fdfa")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = value === opt ? "#f0fdfa" : "transparent")}
              >
                {opt} {value === opt && <Check size={10} />}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: "6px", fontSize: "10px", color: "#9ca3af", textAlign: "center" }}>No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
