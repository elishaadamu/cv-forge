import React from "react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"
import { PlusCircle, Trash2, Sparkles, Loader2, X } from "lucide-react"
import { DurationPicker } from "../DurationPicker"

export function CreativePortfolio({ 
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
  const { personalInfo, experience, skills, projects, education, languages, volunteering } = data
  const hasPersonalDetails = personalInfo.dateOfBirth || personalInfo.nationality || personalInfo.gender || personalInfo.passport || personalInfo.workPermit || personalInfo.placeOfBirth

  return (
    <div 
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        display: "flex",
        boxSizing: "border-box",
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        fontSize: "14px",
        color: "#333",
        position: "relative"
      }}
    >
      
      <aside style={{ width: "33.333333%", background: "#9333ea", color: "#fff", padding: "40px", boxSizing: "border-box" }}>
        <div style={{ position: "relative", marginBottom: "20px" }}>
          {personalInfo.profileImage ? (
             <div style={{ position: "relative", width: "80px", height: "80px" }}>
                <img
                  src={personalInfo.profileImage}
                  alt={personalInfo.fullName}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid rgba(255,255,255,0.3)",
                    flexShrink: 0,
                  }}
                />
                {isEditable && (
                  <button
                    onClick={onImageClick}
                    style={{ position: "absolute", bottom: "0", right: "0", background: "#fff", color: "#9333ea", borderRadius: "50%", padding: "4px", border: "none", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                  >
                    <PlusCircle size={14} />
                  </button>
                )}
             </div>
          ) : isEditable ? (
             <button
              onClick={onImageClick}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "2px dashed rgba(255,255,255,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              <PlusCircle size={20} />
            </button>
          ) : null}
        </div>
        {isEditable ? (
          <input
            defaultValue={personalInfo.fullName}
            placeholder="FULL NAME"
            onBlur={(e) => onUpdate?.("personalInfo.fullName", e.target.value)}
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: "0 0 4px 0",
              width: "100%",
              background: "transparent",
              border: "1px dashed rgba(255,255,255,0.4)",
              color: "#fff",
              outline: "none",
              fontFamily: "inherit"
            }}
          />
        ) : (
          <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 4px 0" }}>{personalInfo.fullName}</h1>
        )}
        {isEditable ? (
          <input
            defaultValue={personalInfo.jobTitle}
            placeholder="JOB TITLE"
            onBlur={(e) => onUpdate?.("personalInfo.jobTitle", e.target.value)}
            style={{
              fontSize: "14px",
              marginBottom: "24px",
              opacity: 0.9,
              width: "100%",
              background: "transparent",
              border: "1px dashed rgba(255,255,255,0.4)",
              color: "#fff",
              outline: "none",
              fontFamily: "inherit"
            }}
          />
        ) : (
          <p style={{ fontSize: "14px", marginBottom: "24px", opacity: 0.9 }}>{personalInfo.jobTitle}</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h2 style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase", opacity: 0.6, marginBottom: "8px", letterSpacing: "1px" }}>Contact</h2>
            <div style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px", wordBreak: "break-all" }}>
              {isEditable ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <input defaultValue={personalInfo.email || ""} placeholder="Email" onBlur={(e) => onUpdate?.("personalInfo.email", e.target.value)} style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.4)", color: "#fff", fontSize: "12px", outline: "none" }} />
                  <input defaultValue={personalInfo.phone || ""} placeholder="Phone" onBlur={(e) => onUpdate?.("personalInfo.phone", e.target.value)} style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.4)", color: "#fff", fontSize: "12px", outline: "none" }} />
                  <input defaultValue={personalInfo.location || ""} placeholder="Location" onBlur={(e) => onUpdate?.("personalInfo.location", e.target.value)} style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.4)", color: "#fff", fontSize: "12px", outline: "none" }} />
                  <input defaultValue={personalInfo.website || ""} placeholder="Website" onBlur={(e) => onUpdate?.("personalInfo.website", e.target.value)} style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.4)", color: "#fff", fontSize: "12px", outline: "none" }} />
                </div>
              ) : (
                <>
                  {personalInfo.email && <p style={{ margin: 0 }}>{personalInfo.email}</p>}
                  {personalInfo.phone && <p style={{ margin: 0 }}>{personalInfo.phoneCode || ''} {personalInfo.phone}</p>}
                  {(personalInfo.location || personalInfo.county || personalInfo.country) && (
                    <p style={{ margin: 0 }}>{[personalInfo.county, personalInfo.country, personalInfo.location].filter(Boolean).join(", ")}</p>
                  )}
                  {personalInfo.website && <p style={{ margin: 0 }}>{personalInfo.website}</p>}
                  {personalInfo.linkedin && <p style={{ margin: 0 }}>LinkedIn: {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</p>}
                  {personalInfo.github && <p style={{ margin: 0 }}>GitHub: {personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}</p>}
                  {personalInfo.facebook && <p style={{ margin: 0 }}>Facebook: {personalInfo.facebook.replace(/^https?:\/\/(www\.)?/, "")}</p>}
                </>
              )}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
              <h2 style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Skills</h2>
              {isEditable && (
                 <button onClick={() => onUpdate?.("skills.add", "New Category")} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}><PlusCircle size={14} /></button>
              )}
            </div>
            {skills.map((skill, i) => (
              <div key={i} style={{ marginBottom: "12px", position: "relative" }}>
                 {isEditable && (
                  <button onClick={() => onUpdate?.("skills.remove", i)} style={{ position: "absolute", left: "-24px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={12} /></button>
                )}
                {isEditable ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <input defaultValue={skill.category} onBlur={(e) => onUpdate?.(`skills.${i}.category`, e.target.value)} style={{ fontWeight: "500", background: "transparent", border: "1px dashed rgba(255,255,255,0.4)", color: "#fff", outline: "none", fontSize: "14px" }} />
                    <input defaultValue={skill.items.join(", ")} onBlur={(e) => onUpdate?.(`skills.${i}.items`, e.target.value.split(",").map(s => s.trim()))} style={{ fontSize: "12px", background: "transparent", border: "1px dashed rgba(255,255,255,0.4)", color: "#fff", outline: "none", opacity: 0.8 }} />
                  </div>
                ) : (
                  <>
                    <p style={{ fontWeight: "500", margin: "0 0 2px 0" }}>{skill.category}</p>
                    <p style={{ fontSize: "12px", opacity: 0.8, margin: 0 }}>{skill.items.join(", ")}</p>
                  </>
                )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "32px" }}>
            {(hasPersonalDetails || isEditable) && (
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Details</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                   {(personalInfo.dateOfBirth || isEditable) && <SidebarDetail label="DOB" value={personalInfo.dateOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.dateOfBirth", val)} isEditable={isEditable} />}
                   {(personalInfo.placeOfBirth || isEditable) && <SidebarDetail label="Place" value={personalInfo.placeOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.placeOfBirth", val)} isEditable={isEditable} />}
                   {(personalInfo.nationality || isEditable) && <SidebarDetail label="Nationality" value={personalInfo.nationality} onUpdate={(val) => onUpdate?.("personalInfo.nationality", val)} isEditable={isEditable} />}
                   {(personalInfo.gender || isEditable) && <SidebarDetail label="Gender" value={personalInfo.gender} onUpdate={(val) => onUpdate?.("personalInfo.gender", val)} isEditable={isEditable} />}
                   {(personalInfo.passport || isEditable) && <SidebarDetail label="Passport" value={personalInfo.passport} onUpdate={(val) => onUpdate?.("personalInfo.passport", val)} isEditable={isEditable} />}
                   {(personalInfo.workPermit || isEditable) && <SidebarDetail label="Permit" value={personalInfo.workPermit} onUpdate={(val) => onUpdate?.("personalInfo.workPermit", val)} isEditable={isEditable} />}
                </div>
              </div>
            )}

            {(languages && languages.length > 0 || isEditable) && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
                  <h2 style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Languages</h2>
                  {isEditable && (
                     <button onClick={() => onUpdate?.("languages.add", { name: "New Language", proficiency: "Native" })} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}><PlusCircle size={14} /></button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {(languages || []).map((lang, i) => (
                    <div key={i} style={{ fontSize: "12px", display: "flex", justifyContent: "space-between", position: "relative" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {isEditable && (
                          <button onClick={() => onUpdate?.("languages.remove", i)} style={{ color: "#ef4444", background: "none", border: "none", padding: 0 }}><X size={10} /></button>
                        )}
                        {isEditable ? (
                          <input defaultValue={lang.name} onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.target.value)} style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.4)", color: "#fff", outline: "none", width: "70px" }} />
                        ) : (
                          <span style={{ fontWeight: "500" }}>{lang.name}</span>
                        )}
                      </div>
                      {isEditable ? (
                        <input defaultValue={lang.proficiency} onBlur={(e) => onUpdate?.(`languages.${i}.proficiency`, e.target.value)} style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.4)", color: "#fff", outline: "none", width: "60px", textAlign: "right", opacity: 0.8 }} />
                      ) : (
                        <span style={{ opacity: 0.8 }}>{lang.proficiency}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main style={{ width: "66.666667%", padding: "40px", boxSizing: "border-box" }}>
        {(personalInfo.summary || isEditable) && (
          <section style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #eee", paddingBottom: "8px", marginBottom: "12px" }}>
              <h2 style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>Profile</h2>
              {isEditable && (
                <button 
                  onClick={() => onRefine?.("summary")}
                  disabled={refiningId === "summary"}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#9333ea" }}
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
                style={{ width: "100%", minHeight: "100px", fontSize: "14px", lineHeight: "1.6", background: "transparent", border: "1px dashed #eee", outline: "none", fontFamily: "inherit", resize: "vertical" }}
              />
            ) : (
              <MarkdownText content={personalInfo.summary || ""} style={{ lineHeight: "1.6" }} />
            )}
          </section>
        )}

        {(experience.length > 0 || isEditable) && (
          <section style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #eee", paddingBottom: "8px", marginBottom: "12px" }}>
              <h2 style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>Experience</h2>
              {isEditable && (
                 <button onClick={() => onUpdate?.("experience.add", {})} style={{ background: "none", border: "none", color: "#9333ea", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                  <PlusCircle size={14} /> ADD ROLE
                </button>
              )}
            </div>
            {experience.map((exp) => (
              <div key={exp.id} style={{ marginBottom: "20px", position: "relative" }}>
                 {isEditable && (
                  <button onClick={() => onUpdate?.("experience.remove", exp.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  {isEditable ? (
                    <input defaultValue={exp.role} placeholder="Role" onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)} style={{ fontWeight: "600", fontSize: "15px", background: "transparent", border: "1px dashed #eee", outline: "none", width: "60%" }} />
                  ) : (
                    <p style={{ fontWeight: "600", fontSize: "15px", margin: "0 0 2px 0" }}>{exp.role}</p>
                  )}
                  {isEditable ? (
                    <DurationPicker value={exp.duration} onChange={(val) => onUpdate?.(`experience.${exp.id}.duration`, val)} />
                  ) : (
                    <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>{exp.duration}</p>
                  )}
                </div>
                {isEditable ? (
                   <input defaultValue={exp.company} placeholder="Company" onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)} style={{ fontSize: "12px", color: "#666", marginBottom: "8px", background: "transparent", border: "1px dashed #eee", outline: "none", width: "100%", marginTop: "2px" }} />
                ) : (
                  <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>{exp.company}</p>
                )}
                {isEditable ? (
                  <div style={{ marginTop: "4px" }}>
                    {exp.description.map((bullet, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                        <input defaultValue={bullet} onBlur={(e) => {
                          const newDesc = [...exp.description]
                          newDesc[i] = e.target.value
                          onUpdate?.(`experience.${exp.id}.description`, newDesc)
                        }} style={{ flex: 1, fontSize: "14px", background: "transparent", border: "1px dashed #eee", outline: "none" }} />
                        <button onClick={() => {
                          const newDesc = exp.description.filter((_, idx) => idx !== i)
                          onUpdate?.(`experience.${exp.id}.description`, newDesc)
                        }} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                      </div>
                    ))}
                    <button onClick={() => onUpdate?.(`experience.${exp.id}.description`, [...exp.description, ""])} style={{ fontSize: "11px", fontWeight: "bold", background: "none", border: "none", cursor: "pointer", color: "#9333ea" }}>+ ADD BULLET</button>
                  </div>
                ) : (
                  <ul style={{ paddingLeft: "20px", margin: 0, listStyleType: "disc" }}>
                    {exp.description.filter(Boolean).map((d, i) => (
                      <li key={i} style={{ marginBottom: "4px" }}>
                        <MarkdownText content={d} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {(projects.length > 0 || isEditable) && (
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #eee", paddingBottom: "8px", marginBottom: "12px" }}>
              <h2 style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>Projects</h2>
              {isEditable && (
                 <button onClick={() => onUpdate?.("projects.add", {})} style={{ background: "none", border: "none", color: "#9333ea", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                  <PlusCircle size={14} /> ADD PROJECT
                </button>
              )}
            </div>
            {projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: "16px", position: "relative" }}>
                 {isEditable && (
                  <button onClick={() => onUpdate?.("projects.remove", proj.id)} style={{ position: "absolute", left: "-28px", top: "0", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
                )}
                {isEditable ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <input defaultValue={proj.name} placeholder="Project Name" onBlur={(e) => onUpdate?.(`projects.${proj.id}.name`, e.target.value)} style={{ fontWeight: "600", background: "transparent", border: "1px dashed #eee", outline: "none", fontSize: "15px" }} />
                    <input defaultValue={proj.link} placeholder="Link" onBlur={(e) => onUpdate?.(`projects.${proj.id}.link`, e.target.value)} style={{ fontSize: "12px", color: "#666", background: "transparent", border: "1px dashed #eee", outline: "none" }} />
                    <textarea defaultValue={proj.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`projects.${proj.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "13px", lineHeight: "1.5", background: "transparent", border: "1px dashed #eee", outline: "none", fontFamily: "inherit" }} />
                  </div>
                ) : (
                  <>
                    <p style={{ fontWeight: "600", margin: "0 0 2px 0" }}>{proj.name}</p>
                    <p style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>{proj.link}</p>
                    <MarkdownText content={proj.description} style={{ fontSize: "13px", lineHeight: "1.5" }} />
                  </>
                )}
              </div>
            ))}
          </section>
        )}

        {(education && education.length > 0 || isEditable) && (
          <section style={{ marginBottom: "32px", marginTop: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #eee", paddingBottom: "8px", marginBottom: "12px" }}>
              <h2 style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>Education</h2>
              {isEditable && (
                 <button onClick={() => onUpdate?.("education.add", {})} style={{ background: "none", border: "none", color: "#9333ea", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                  <PlusCircle size={14} /> ADD
                </button>
              )}
            </div>
            {education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: "16px", position: "relative" }}>
                 {isEditable && (
                  <button onClick={() => onUpdate?.("education.remove", edu.id)} style={{ position: "absolute", left: "-28px", top: "0", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  {isEditable ? (
                    <input defaultValue={edu.degree} placeholder="Degree" onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)} style={{ fontWeight: "600", fontSize: "15px", background: "transparent", border: "1px dashed #eee", outline: "none", width: "60%" }} />
                  ) : (
                    <p style={{ fontWeight: "600", fontSize: "15px", margin: "0 0 2px 0" }}>{edu.degree}</p>
                  )}
                  {isEditable ? (
                    <DurationPicker value={edu.duration} onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} />
                  ) : (
                    <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>{edu.duration}</p>
                  )}
                </div>
                {isEditable ? (
                   <input defaultValue={edu.school} placeholder="School" onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)} style={{ fontSize: "12px", color: "#666", background: "transparent", border: "1px dashed #eee", outline: "none", width: "100%", marginTop: "2px" }} />
                ) : (
                  <p style={{ fontSize: "12px", color: "#666" }}>{edu.school}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {(volunteering && volunteering.length > 0 || isEditable) && (
          <section style={{ marginTop: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #eee", paddingBottom: "8px", marginBottom: "12px" }}>
              <h2 style={{ fontWeight: "bold", fontSize: "18px", margin: 0 }}>Volunteering</h2>
              {isEditable && (
                 <button onClick={() => onUpdate?.("volunteering.add", {})} style={{ background: "none", border: "none", color: "#9333ea", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                  <PlusCircle size={14} /> ADD ROLE
                </button>
              )}
            </div>
            {(volunteering || []).map((vol) => (
              <div key={vol.id} style={{ marginBottom: "20px", position: "relative" }}>
                 {isEditable && (
                  <button onClick={() => onUpdate?.("volunteering.remove", vol.id)} style={{ position: "absolute", left: "-28px", top: "0", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  {isEditable ? (
                    <input defaultValue={vol.role} placeholder="Role" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)} style={{ fontWeight: "600", fontSize: "15px", background: "transparent", border: "1px dashed #eee", outline: "none", width: "60%" }} />
                  ) : (
                    <p style={{ fontWeight: "600", fontSize: "15px", margin: "0 0 2px 0" }}>{vol.role}</p>
                  )}
                  {isEditable ? (
                    <DurationPicker value={vol.duration} onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} />
                  ) : (
                    <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>{vol.duration}</p>
                  )}
                </div>
                {isEditable ? (
                   <input defaultValue={vol.organization} placeholder="Organization" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)} style={{ fontSize: "12px", color: "#666", background: "transparent", border: "1px dashed #eee", outline: "none", width: "100%", marginTop: "2px" }} />
                ) : (
                  <p style={{ fontSize: "12px", color: "#666" }}>{vol.organization}</p>
                )}
                {isEditable ? (
                  <textarea defaultValue={vol.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "14px", lineHeight: "1.6", background: "transparent", border: "1px dashed #eee", outline: "none", fontFamily: "inherit", resize: "vertical" }} />
                ) : (
                  <MarkdownText content={vol.description} style={{ fontSize: "14px", lineHeight: "1.6" }} />
                )}
                {isEditable && (
                  <button 
                    onClick={() => onRefine?.("volunteering", vol.id)}
                    disabled={refiningId === vol.id || !vol.description}
                    style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#9333ea", background: "rgba(147, 51, 234, 0.05)", border: "1px solid rgba(147, 51, 234, 0.2)", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", marginTop: "4px", opacity: (refiningId === vol.id || !vol.description) ? 0.5 : 1 }}
                  >
                    {refiningId === vol.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    AI REFINE
                  </button>
                )}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
function SidebarDetail({ label, value, onUpdate, isEditable }: { label: string, value?: string, onUpdate?: (val: string) => void, isEditable: boolean }) {
  if (!isEditable && !value) return null
  return (
    <div style={{ fontSize: "12px", display: "flex", gap: "4px" }}>
      <span style={{ fontWeight: "700", minWidth: "50px", opacity: 0.8 }}>{label}:</span>
      {isEditable ? (
        <input 
          defaultValue={value}
          onBlur={(e) => onUpdate?.(e.target.value)}
          style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.4)", fontSize: "12px", color: "#fff", padding: "0 4px", outline: "none", width: "100%", fontFamily: "inherit" }}
        />
      ) : (
        <span style={{ color: "#fff" }}>{value}</span>
      )}
    </div>
  )
}
