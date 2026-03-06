import React from "react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"
import { PlusCircle, Trash2, X, Sparkles, Loader2 } from "lucide-react"
import { DurationPicker } from "../DurationPicker"

export function StartupTech({ 
  data,
  isEditable = false,
  onUpdate
}: { 
  data: CVData,
  isEditable?: boolean,
  onUpdate?: (field: string, value: any) => void
}) {
  const { personalInfo, experience, skills, projects, education, volunteering, languages } = data
  const hasPersonalDetails = personalInfo.dateOfBirth || personalInfo.nationality || personalInfo.gender || personalInfo.passport || personalInfo.workPermit || personalInfo.placeOfBirth

  return (
    <div 
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        padding: "3rem",
        boxSizing: "border-box",
        margin: "0 auto",
        fontFamily: "'Courier New', Courier, monospace",
        color: "#000",
        position: "relative"
      }}
    >
      
      <header style={{ marginBottom: "16px" }}>
        {isEditable ? (
          <input
            defaultValue={personalInfo.fullName}
            placeholder="FULL NAME"
            onBlur={(e) => onUpdate?.("personalInfo.fullName", e.target.value)}
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              margin: "0 0 4px 0",
              width: "100%",
              background: "transparent",
              border: "1px dashed #000",
              outline: "none",
              fontFamily: "inherit"
            }}
          />
        ) : (
          <h1 style={{ fontSize: "30px", fontWeight: "bold", margin: "0 0 4px 0" }}>{personalInfo.fullName}</h1>
        )}
        {isEditable ? (
          <input
            defaultValue={personalInfo.jobTitle}
            placeholder="JOB TITLE"
            onBlur={(e) => onUpdate?.("personalInfo.jobTitle", e.target.value)}
            style={{
              color: "#4b5563",
              margin: 0,
              width: "100%",
              background: "transparent",
              border: "1px dashed #000",
              outline: "none",
              fontFamily: "inherit"
            }}
          />
        ) : (
          <p style={{ color: "#4b5563", margin: 0 }}>{personalInfo.jobTitle}</p>
        )}
      </header>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "11px", color: "#6b7280", marginBottom: "32px", paddingBottom: "16px", borderBottom: "1px solid #e5e7eb" }}>
        {isEditable ? (
           <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", width: "100%" }}>
              <input defaultValue={personalInfo.email || ""} placeholder="Email" onBlur={(e) => onUpdate?.("personalInfo.email", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", width: "150px" }} />
              <input defaultValue={personalInfo.phone || ""} placeholder="Phone" onBlur={(e) => onUpdate?.("personalInfo.phone", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", width: "120px" }} />
              <input defaultValue={personalInfo.location || ""} placeholder="Location" onBlur={(e) => onUpdate?.("personalInfo.location", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", width: "150px" }} />
              <input defaultValue={personalInfo.website || ""} placeholder="Website" onBlur={(e) => onUpdate?.("personalInfo.website", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", width: "150px" }} />
           </div>
        ) : (
          <>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phoneCode || ''} {personalInfo.phone}</span>}
            {(personalInfo.location || personalInfo.county || personalInfo.country) && (
              <span>{[personalInfo.county, personalInfo.country, personalInfo.location].filter(Boolean).join(", ")}</span>
            )}
            {personalInfo.website && <span>{personalInfo.website.replace(/^https?:\/\//, "")}</span>}
            {personalInfo.github && <span>github.com/{personalInfo.github.split('/').pop()}</span>}
            {personalInfo.linkedin && <span>linkedin.com/in/{personalInfo.linkedin.split('/').pop()}</span>}
            {personalInfo.facebook && <span>facebook.com/{personalInfo.facebook.split('/').pop()}</span>}
          </>
        )}
      </div>

      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
          <h2 style={{ fontWeight: "bold", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Experience</h2>
          {isEditable && (
             <button onClick={() => onUpdate?.("experience.add", {})} style={{ background: "none", border: "none", color: "#000", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
              <PlusCircle size={14} /> ADD ROLE
            </button>
          )}
        </div>
        {experience.map((exp) => (
          <div key={exp.id} style={{ marginBottom: "24px", position: "relative" }}>
             {isEditable && (
              <button onClick={() => onUpdate?.("experience.remove", exp.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", marginBottom: "4px" }}>
              {isEditable ? (
                <div style={{ display: "flex", gap: "4px", width: "70%" }}>
                   <input defaultValue={exp.role} placeholder="Role" onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)} style={{ fontWeight: "600", background: "transparent", border: "1px dashed #000", outline: "none", width: "45%" }} />
                   <span>@</span>
                   <input defaultValue={exp.company} placeholder="Company" onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)} style={{ fontWeight: "600", background: "transparent", border: "1px dashed #000", outline: "none", width: "45%" }} />
                </div>
              ) : (
                <span>{exp.role} @ {exp.company}</span>
              )}
              {isEditable ? (
                <DurationPicker value={exp.duration} onChange={(val) => onUpdate?.(`experience.${exp.id}.duration`, val)} />
              ) : (
                <span style={{ fontSize: "12px", color: "#6b7280" }}>
                  {exp.duration}
                </span>
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
                    }} style={{ flex: 1, fontSize: "13px", background: "transparent", border: "1px dashed #000", outline: "none", fontFamily: "inherit" }} />
                    <button onClick={() => {
                      const newDesc = exp.description.filter((_, idx) => idx !== i)
                      onUpdate?.(`experience.${exp.id}.description`, newDesc)
                    }} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                  </div>
                ))}
                <button onClick={() => onUpdate?.(`experience.${exp.id}.description`, [...exp.description, ""])} style={{ fontSize: "11px", fontWeight: "bold", background: "none", border: "none", cursor: "pointer" }}>+ ADD BULLET</button>
              </div>
            ) : (
              <ul style={{ paddingLeft: "20px", margin: 0, listStyleType: "disc" }}>
                {exp.description.filter(Boolean).map((d, i) => (
                  <li key={i} style={{ marginBottom: "2px" }}>
                    <MarkdownText content={d} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <section style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
          <h2 style={{ fontWeight: "bold", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Tech Stack</h2>
          {isEditable && (
             <button onClick={() => onUpdate?.("skills.add", "New Category")} style={{ background: "none", border: "none", color: "#000", cursor: "pointer" }}><PlusCircle size={14} /></button>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {isEditable ? (
             <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                {skills.map((skill, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                    <input defaultValue={skill.category} onBlur={(e) => onUpdate?.(`skills.${i}.category`, e.target.value)} style={{ fontWeight: "bold", width: "120px", background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "11px" }} />
                    <input defaultValue={skill.items.join(", ")} onBlur={(e) => onUpdate?.(`skills.${i}.items`, e.target.value.split(",").map(s => s.trim()))} style={{ flex: 1, background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "11px" }} />
                    <button onClick={() => onUpdate?.("skills.remove", i)} style={{ color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                  </div>
                ))}
             </div>
          ) : (
            skills.flatMap((s) => s.items).map((item, i) => (
              <span
                key={i}
                style={{ padding: "4px 12px", fontSize: "11px", background: "rgba(0,0,0,0.05)", borderRadius: "4px" }}
              >
                {item}
              </span>
            ))
          )}
        </div>
      </section>

      { (projects.length > 0 || isEditable) && (
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
            <h2 style={{ fontWeight: "bold", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Projects</h2>
            {isEditable && (
                <button onClick={() => onUpdate?.("projects.add", {})} style={{ background: "none", border: "none", color: "#000", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                <PlusCircle size={14} /> ADD PROJECT
              </button>
            )}
          </div>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "12px", position: "relative" }}>
               {isEditable && (
                <button onClick={() => onUpdate?.("projects.remove", proj.id)} style={{ position: "absolute", left: "-28px", top: "0", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
              )}
              {isEditable ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                   <input defaultValue={proj.name} placeholder="Project Name" onBlur={(e) => onUpdate?.(`projects.${proj.id}.name`, e.target.value)} style={{ fontWeight: "600", background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "14px" }} />
                   <textarea defaultValue={proj.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`projects.${proj.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "13px", color: "#374151", background: "transparent", border: "1px dashed #000", outline: "none", fontFamily: "inherit" }} />
                </div>
              ) : (
                <>
                  <p style={{ fontWeight: "600", margin: "0 0 2px 0" }}>{proj.name}</p>
                  <MarkdownText content={proj.description} style={{ fontSize: "13px", color: "#374151" }} />
                </>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {(education && education.length > 0 || isEditable) && (
        <section style={{ marginTop: "32px", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
            <h2 style={{ fontWeight: "bold", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Education</h2>
            {isEditable && (
              <button onClick={() => onUpdate?.("education.add", {})} style={{ background: "none", border: "none", color: "#000", cursor: "pointer" }}><PlusCircle size={14} /></button>
            )}
          </div>
          {(education || []).map((edu) => (
            <div key={edu.id} style={{ marginBottom: "12px", position: "relative" }}>
               {isEditable && (
                <button onClick={() => onUpdate?.("education.remove", edu.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", flex: 1 }}>
                  {isEditable ? (
                    <input defaultValue={edu.degree} placeholder="Degree" onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)} style={{ fontWeight: "600", background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "14px" }} />
                  ) : (
                    <span style={{ fontWeight: "600" }}>{edu.degree}</span>
                  )}
                  <span style={{ color: "#9ca3af" }}>–</span>
                  {isEditable ? (
                    <input defaultValue={edu.school} placeholder="School" onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)} style={{ background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "14px" }} />
                  ) : (
                    <span>{edu.school}</span>
                  )}
                </div>
                {isEditable ? (
                  <DurationPicker value={edu.duration} onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} />
                ) : (
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>{edu.duration}</span>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Volunteering */}
      {(volunteering && volunteering.length > 0 || isEditable) && (
        <section style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
            <h2 style={{ fontWeight: "bold", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Volunteering</h2>
            {isEditable && (
               <button onClick={() => onUpdate?.("volunteering.add", {})} style={{ background: "none", border: "none", color: "#000", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                <PlusCircle size={14} /> ADD ROLE
              </button>
            )}
          </div>
          {(volunteering || []).map((vol) => (
            <div key={vol.id} style={{ marginBottom: "20px", position: "relative" }}>
               {isEditable && (
                <button onClick={() => onUpdate?.("volunteering.remove", vol.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", flex: 1 }}>
                  {isEditable ? (
                    <input defaultValue={vol.role} placeholder="Role" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)} style={{ fontWeight: "600", background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "14px" }} />
                  ) : (
                    <span style={{ fontWeight: "600" }}>{vol.role}</span>
                  )}
                  <span style={{ color: "#9ca3af" }}>at</span>
                  {isEditable ? (
                    <input defaultValue={vol.organization} placeholder="Organization" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)} style={{ background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "14px" }} />
                  ) : (
                    <span style={{ color: "#4b5563" }}>{vol.organization}</span>
                  )}
                </div>
                {isEditable ? (
                  <DurationPicker value={vol.duration} onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} />
                ) : (
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>{vol.duration}</span>
                )}
              </div>
              {isEditable ? (
                <textarea defaultValue={vol.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "13px", color: "#374151", background: "transparent", border: "1px dashed #000", outline: "none", fontFamily: "inherit" }} />
              ) : (
                <MarkdownText content={vol.description} style={{ fontSize: "13px", color: "#374151" }} />
              )}
              {isEditable && (
                  <button 
                    onClick={() => onUpdate?.("volunteering.refine", vol.id)} // Using onUpdate here as in original code logic or similar
                    style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#000", background: "white", border: "1px solid #000", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", marginTop: "4px" }}
                  >
                    <Sparkles size={10} /> AI REFINE
                  </button>
                )}
            </div>
          ))}
        </section>
      )}

      {/* Details & Languages */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginTop: "32px", borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
        {(hasPersonalDetails || isEditable) && (
          <div>
            <h2 style={{ fontWeight: "bold", fontSize: "14px", textTransform: "uppercase", marginBottom: "12px" }}>Details</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
               {(personalInfo.dateOfBirth || isEditable) && <DetailRow label="DOB" value={personalInfo.dateOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.dateOfBirth", val)} isEditable={isEditable} />}
               {(personalInfo.placeOfBirth || isEditable) && <DetailRow label="PLACE" value={personalInfo.placeOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.placeOfBirth", val)} isEditable={isEditable} />}
               {(personalInfo.nationality || isEditable) && <DetailRow label="NAT" value={personalInfo.nationality} onUpdate={(val) => onUpdate?.("personalInfo.nationality", val)} isEditable={isEditable} />}
               {(personalInfo.gender || isEditable) && <DetailRow label="GEN" value={personalInfo.gender} onUpdate={(val) => onUpdate?.("personalInfo.gender", val)} isEditable={isEditable} />}
               {(personalInfo.passport || isEditable) && <DetailRow label="PASS" value={personalInfo.passport} onUpdate={(val) => onUpdate?.("personalInfo.passport", val)} isEditable={isEditable} />}
               {(personalInfo.workPermit || isEditable) && <DetailRow label="PERMIT" value={personalInfo.workPermit} onUpdate={(val) => onUpdate?.("personalInfo.workPermit", val)} isEditable={isEditable} />}
            </div>
          </div>
        )}

        {(languages && languages.length > 0 || isEditable) && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
              <h2 style={{ fontWeight: "bold", fontSize: "14px", textTransform: "uppercase", margin: 0 }}>Languages</h2>
              {isEditable && (
                <button onClick={() => onUpdate?.("languages.add", { name: "New Language", proficiency: "Native" })} style={{ background: "none", border: "none", color: "#000", cursor: "pointer" }}><PlusCircle size={14} /></button>
              )}
            </div>
            {(languages || []).map((lang, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                   {isEditable && (
                    <button onClick={() => onUpdate?.("languages.remove", i)} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                  )}
                  {isEditable ? (
                    <input defaultValue={lang.name} onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.target.value)} style={{ fontWeight: "bold", background: "transparent", border: "1px dashed #000", width: "80px" }} />
                  ) : (
                    <span style={{ fontWeight: "bold" }}>{lang.name}</span>
                  )}
                </div>
                {isEditable ? (
                  <input defaultValue={lang.proficiency} onBlur={(e) => onUpdate?.(`languages.${i}.proficiency`, e.target.value)} style={{ background: "transparent", border: "1px dashed #000", width: "80px", textAlign: "right" }} />
                ) : (
                  <span>{lang.proficiency}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function DetailRow({ label, value, onUpdate, isEditable }: { label: string, value?: string, onUpdate?: (val: string) => void, isEditable: boolean }) {
  if (!isEditable && !value) return null
  return (
    <div style={{ fontSize: "11px", display: "flex", gap: "8px" }}>
      <span style={{ fontWeight: "bold", minWidth: "60px" }}>{label}:</span>
      {isEditable ? (
        <input 
          defaultValue={value}
          onBlur={(e) => onUpdate?.(e.target.value)}
          style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", width: "100%", outline: "none" }}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  )
}
