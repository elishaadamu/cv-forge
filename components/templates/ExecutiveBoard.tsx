import React from "react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"
import { PlusCircle, Trash2, Sparkles, Loader2, X } from "lucide-react"
import { DurationPicker } from "../DurationPicker"

export function ExecutiveBoard({ 
  data,
  isEditable = false,
  onUpdate,
  onRefine,
  refiningId
}: { 
  data: CVData,
  isEditable?: boolean,
  onUpdate?: (field: string, value: any) => void,
  onRefine?: (type: string, id?: string) => void,
  refiningId?: string | null
}) {
  const { personalInfo, experience, education, skills, projects, languages, volunteering } = data
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
        fontFamily: "'Times New Roman', Times, serif",
        color: "#111",
        position: "relative"
      }}
    >
      
      <header style={{ marginBottom: "40px", textAlign: "center" }}>
        {isEditable ? (
          <input
            defaultValue={personalInfo.fullName}
            placeholder="FULL NAME"
            onBlur={(e) => onUpdate?.("personalInfo.fullName", e.target.value)}
            style={{
              fontSize: "36px",
              fontWeight: "600",
              letterSpacing: "1px",
              margin: "0 0 8px 0",
              textAlign: "center",
              width: "100%",
              background: "transparent",
              border: "1px dashed #000",
              outline: "none",
              fontFamily: "inherit"
            }}
          />
        ) : (
          <h1 style={{ fontSize: "36px", fontWeight: "600", letterSpacing: "1px", margin: "0 0 8px 0" }}>
            {personalInfo.fullName}
          </h1>
        )}
        {isEditable ? (
          <input
            defaultValue={personalInfo.jobTitle}
            placeholder="JOB TITLE"
            onBlur={(e) => onUpdate?.("personalInfo.jobTitle", e.target.value)}
            style={{
              fontSize: "18px",
              margin: "0 0 16px 0",
              textAlign: "center",
              width: "100%",
              background: "transparent",
              border: "1px dashed #000",
              outline: "none",
              fontFamily: "inherit"
            }}
          />
        ) : (
          <p style={{ fontSize: "18px", margin: "0 0 16px 0" }}>{personalInfo.jobTitle}</p>
        )}
        
        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "16px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
          {isEditable ? (
             <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", width: "100%" }}>
                <input defaultValue={personalInfo.email || ""} placeholder="Email" onBlur={(e) => onUpdate?.("personalInfo.email", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", textAlign: "center", width: "180px" }} />
                <input defaultValue={personalInfo.phone || ""} placeholder="Phone" onBlur={(e) => onUpdate?.("personalInfo.phone", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", textAlign: "center", width: "150px" }} />
                <input defaultValue={personalInfo.location || ""} placeholder="Location" onBlur={(e) => onUpdate?.("personalInfo.location", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", textAlign: "center", width: "180px" }} />
                <input defaultValue={personalInfo.linkedin || ""} placeholder="LinkedIn" onBlur={(e) => onUpdate?.("personalInfo.linkedin", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", textAlign: "center", width: "180px" }} />
             </div>
          ) : (
            <>
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phoneCode || ''} {personalInfo.phone}</span>}
              {(personalInfo.location || personalInfo.county || personalInfo.country) && (
                <span>{[personalInfo.county, personalInfo.country, personalInfo.location].filter(Boolean).join(", ")}</span>
              )}
              {personalInfo.website && <span>Portal: {personalInfo.website.replace(/^https?:\/\//, "")}</span>}
              {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin.split('/').pop()}</span>}
              {personalInfo.github && <span>GitHub: {personalInfo.github.split('/').pop()}</span>}
              {personalInfo.facebook && <span>FB: {personalInfo.facebook.split('/').pop()}</span>}
            </>
          )}
        </div>
      </header>

      {(personalInfo.summary || isEditable) && (
        <section style={{ marginBottom: "32px", textAlign: "center", maxWidth: "85%", margin: "0 auto 32px auto", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
             {isEditable && (
                <button 
                  onClick={() => onRefine?.("summary")}
                  disabled={refiningId === "summary"}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "bold" }}
                >
                  {refiningId === "summary" ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI REFINE
                </button>
              )}
          </div>
          {isEditable ? (
            <textarea
              defaultValue={personalInfo.summary}
              placeholder="Your executive summary..."
              onBlur={(e) => onUpdate?.("personalInfo.summary", e.target.value)}
              style={{ width: "100%", minHeight: "100px", fontSize: "16px", lineHeight: "1.6", background: "transparent", border: "1px dashed #000", outline: "none", fontFamily: "inherit", textAlign: "center", resize: "vertical" }}
            />
          ) : (
            <MarkdownText content={personalInfo.summary || ""} style={{ fontSize: "16px", lineHeight: "1.6" }} />
          )}
        </section>
      )}

      <section style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #000", paddingBottom: "4px", marginBottom: "16px" }}>
          <h2 style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "14px", margin: 0 }}>
            Leadership Experience
          </h2>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              {isEditable ? (
                <div style={{ display: "flex", gap: "4px", width: "70%" }}>
                   <input defaultValue={exp.role} placeholder="Role" onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)} style={{ fontWeight: "600", fontSize: "16px", background: "transparent", border: "1px dashed #000", outline: "none", width: "45%", fontFamily: "inherit" }} />
                   <span>–</span>
                   <input defaultValue={exp.company} placeholder="Organization" onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)} style={{ fontWeight: "600", fontSize: "16px", background: "transparent", border: "1px dashed #000", outline: "none", width: "45%", fontFamily: "inherit" }} />
                </div>
              ) : (
                <p style={{ fontWeight: "600", fontSize: "16px", margin: "0 0 4px 0" }}>
                  {exp.role} – {exp.company}
                </p>
              )}
              {isEditable ? (
                <DurationPicker value={exp.duration} onChange={(val) => onUpdate?.(`experience.${exp.id}.duration`, val)} />
              ) : (
                <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{exp.duration}</p>
              )}
            </div>
            {isEditable ? (
              <div style={{ marginTop: "6px" }}>
                {exp.description.map((bullet, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                    <input defaultValue={bullet} onBlur={(e) => {
                      const newDesc = [...exp.description]
                      newDesc[i] = e.target.value
                      onUpdate?.(`experience.${exp.id}.description`, newDesc)
                    }} style={{ flex: 1, fontSize: "14px", background: "transparent", border: "1px dashed #000", outline: "none", fontFamily: "inherit" }} />
                    <button onClick={() => {
                      const newDesc = exp.description.filter((_, idx) => idx !== i)
                      onUpdate?.(`experience.${exp.id}.description`, newDesc)
                    }} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                  </div>
                ))}
                <button onClick={() => onUpdate?.(`experience.${exp.id}.description`, [...exp.description, ""])} style={{ fontSize: "11px", fontWeight: "bold", background: "none", border: "none", cursor: "pointer" }}>+ ADD BULLET</button>
              </div>
            ) : (
              <ul style={{ paddingLeft: "20px", margin: 0, listStyleType: "disc", display: "flex", flexDirection: "column", gap: "4px" }}>
                {exp.description.filter(Boolean).map((d, i) => (
                  <li key={i}>
                    <MarkdownText content={d} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      {(skills && skills.length > 0 || isEditable) && (
        <section style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #000", paddingBottom: "4px", marginBottom: "16px" }}>
            <h2 style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "14px", margin: 0 }}>Core Competencies</h2>
            {isEditable && (
               <button onClick={() => onUpdate?.("skills.add", "New Category")} style={{ background: "none", border: "none", cursor: "pointer" }}><PlusCircle size={14} /></button>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            {skills.map((group, idx) => (
              <div key={idx} style={{ position: "relative" }}>
                 {isEditable && (
                  <button onClick={() => onUpdate?.("skills.remove", idx)} style={{ position: "absolute", left: "-24px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={12} /></button>
                )}
                {isEditable ? (
                  <div>
                    <input defaultValue={group.category} onBlur={(e) => onUpdate?.(`skills.${idx}.category`, e.target.value)} style={{ fontWeight: "600", border: "1px dashed #000", background: "transparent", width: "100%", fontSize: "14px", marginBottom: "2px" }} />
                    <input defaultValue={group.items.join(", ")} onBlur={(e) => onUpdate?.(`skills.${idx}.items`, e.target.value.split(",").map(s => s.trim()))} style={{ border: "1px dashed #000", background: "transparent", width: "100%", fontSize: "13px" }} />
                  </div>
                ) : (
                  <div>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", margin: "0 0 2px 0" }}>{group.category}</h3>
                    <p style={{ fontSize: "13px", margin: 0 }}>{group.items.join(" • ")}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {(projects && projects.length > 0 || isEditable) && (
        <section style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #000", paddingBottom: "4px", marginBottom: "16px" }}>
            <h2 style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "14px", margin: 0 }}>Key Projects</h2>
            {isEditable && (
               <button onClick={() => onUpdate?.("projects.add", {})} style={{ background: "none", border: "none", cursor: "pointer" }}><PlusCircle size={14} /></button>
            )}
          </div>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "16px", position: "relative" }}>
               {isEditable && (
                <button onClick={() => onUpdate?.("projects.remove", proj.id)} style={{ position: "absolute", left: "-28px", top: "0", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
              )}
              {isEditable ? (
                <div>
                  <input defaultValue={proj.name} placeholder="Project Name" onBlur={(e) => onUpdate?.(`projects.${proj.id}.name`, e.target.value)} style={{ fontWeight: "600", fontSize: "16px", background: "transparent", border: "1px dashed #000", outline: "none", width: "100%", fontFamily: "inherit" }} />
                  <input defaultValue={proj.link} placeholder="Link" onBlur={(e) => onUpdate?.(`projects.${proj.id}.link`, e.target.value)} style={{ fontSize: "12px", background: "transparent", border: "1px dashed #000", outline: "none", width: "100%", marginTop: "2px" }} />
                  <textarea defaultValue={proj.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`projects.${proj.id}.description`, e.target.value)} style={{ width: "100%", background: "transparent", border: "1px dashed #000", fontSize: "14px", fontFamily: "inherit", marginTop: "4px" }} />
                </div>
              ) : (
                <>
                  <p style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 4px 0" }}>{proj.name} {proj.link && <span style={{ fontSize: "12px", fontWeight: "normal", color: "#6b7280" }}>– {proj.link}</span>}</p>
                  <MarkdownText content={proj.description} style={{ fontSize: "14px" }} />
                </>
              )}
            </div>
          ))}
        </section>
      )}

      {(education.length > 0 || isEditable) && (
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #000", paddingBottom: "4px", marginBottom: "16px" }}>
            <h2 style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "14px", margin: 0 }}>
              Education
            </h2>
            {isEditable && (
               <button onClick={() => onUpdate?.("education.add", {})} style={{ background: "none", border: "none", cursor: "pointer" }}><PlusCircle size={14} /></button>
            )}
          </div>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "12px", position: "relative" }}>
               {isEditable && (
                <button onClick={() => onUpdate?.("education.remove", edu.id)} style={{ position: "absolute", left: "-28px", top: "0", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
              )}
              {isEditable ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                   <div style={{ display: "flex", gap: "4px", flex: 1 }}>
                     <input defaultValue={edu.degree} placeholder="Degree" onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)} style={{ fontWeight: "600", background: "transparent", border: "1px dashed #000", outline: "none", width: "40%", fontFamily: "inherit" }} />
                     <span>–</span>
                     <input defaultValue={edu.school} placeholder="School" onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)} style={{ background: "transparent", border: "1px dashed #000", outline: "none", width: "40%", fontFamily: "inherit" }} />
                   </div>
                   <DurationPicker value={edu.duration} onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} />
                </div>
              ) : (
                <p style={{ margin: "0 0 8px 0" }}>
                  <strong style={{ fontWeight: "600" }}>{edu.degree}</strong> – {edu.school} ({edu.duration})
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {(volunteering && volunteering.length > 0 || isEditable) && (
        <section style={{ marginBottom: "32px", marginTop: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #000", paddingBottom: "4px", marginBottom: "16px" }}>
            <h2 style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "14px", margin: 0 }}>Public Service & Volunteering</h2>
            {isEditable && (
               <button onClick={() => onUpdate?.("volunteering.add", {})} style={{ background: "none", border: "none", cursor: "pointer" }}><PlusCircle size={14} /></button>
            )}
          </div>
          {(volunteering || []).map((vol) => (
            <div key={vol.id} style={{ marginBottom: "20px", position: "relative" }}>
               {isEditable && (
                <button onClick={() => onUpdate?.("volunteering.remove", vol.id)} style={{ position: "absolute", left: "-28px", top: "0", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                {isEditable ? (
                  <div style={{ display: "flex", gap: "8px", flex: 1 }}>
                    <input defaultValue={vol.role} placeholder="Role" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)} style={{ fontWeight: "600", fontSize: "16px", background: "transparent", border: "1px dashed #000", outline: "none", width: "45%", fontFamily: "inherit" }} />
                    <input defaultValue={vol.organization} placeholder="Organization" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)} style={{ fontWeight: "600", fontSize: "16px", background: "transparent", border: "1px dashed #000", outline: "none", width: "45%", fontFamily: "inherit" }} />
                  </div>
                ) : (
                  <p style={{ fontWeight: "600", fontSize: "16px", margin: "0" }}>{vol.role} – {vol.organization}</p>
                )}
                {isEditable ? (
                  <DurationPicker value={vol.duration} onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} />
                ) : (
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>{vol.duration}</p>
                )}
              </div>
              {isEditable ? (
                <textarea defaultValue={vol.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.target.value)} style={{ width: "100%", background: "transparent", border: "1px dashed #000", fontSize: "14px", fontFamily: "inherit", marginTop: "4px" }} />
              ) : (
                <MarkdownText content={vol.description} style={{ fontSize: "14px" }} />
              )}
              {isEditable && (
                  <button 
                    onClick={() => onRefine?.("volunteering", vol.id)}
                    disabled={refiningId === vol.id || !vol.description}
                    style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#000", background: "rgba(0, 0, 0, 0.05)", border: "1px solid rgba(0, 0, 0, 0.2)", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", marginTop: "4px", opacity: (refiningId === vol.id || !vol.description) ? 0.5 : 1 }}
                  >
                    {refiningId === vol.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    AI REFINE
                  </button>
                )}
            </div>
          ))}
        </section>
      )}

      <div style={{ display: "flex", gap: "40px", marginTop: "40px" }}>
        {(hasPersonalDetails || isEditable) && (
          <div style={{ flex: 1 }}>
            <div style={{ borderBottom: "1px solid #000", paddingBottom: "4px", marginBottom: "12px" }}>
              <h2 style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "14px", margin: 0 }}>Personal Details</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
               {(personalInfo.dateOfBirth || isEditable) && <BoardDetail label="DOB" value={personalInfo.dateOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.dateOfBirth", val)} isEditable={isEditable} />}
               {(personalInfo.placeOfBirth || isEditable) && <BoardDetail label="BIRTH PLACE" value={personalInfo.placeOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.placeOfBirth", val)} isEditable={isEditable} />}
               {(personalInfo.nationality || isEditable) && <BoardDetail label="NATIONALITY" value={personalInfo.nationality} onUpdate={(val) => onUpdate?.("personalInfo.nationality", val)} isEditable={isEditable} />}
               {(personalInfo.gender || isEditable) && <BoardDetail label="GENDER" value={personalInfo.gender} onUpdate={(val) => onUpdate?.("personalInfo.gender", val)} isEditable={isEditable} />}
               {(personalInfo.passport || isEditable) && <BoardDetail label="PASSPORT" value={personalInfo.passport} onUpdate={(val) => onUpdate?.("personalInfo.passport", val)} isEditable={isEditable} />}
               {(personalInfo.workPermit || isEditable) && <BoardDetail label="WORK PERMIT" value={personalInfo.workPermit} onUpdate={(val) => onUpdate?.("personalInfo.workPermit", val)} isEditable={isEditable} />}
            </div>
          </div>
        )}
        {(languages && languages.length > 0 || isEditable) && (
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #000", paddingBottom: "4px", marginBottom: "12px" }}>
              <h2 style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "14px", margin: 0 }}>Languages</h2>
              {isEditable && (
                 <button onClick={() => onUpdate?.("languages.add", { name: "New Language", proficiency: "Native" })} style={{ background: "none", border: "none", cursor: "pointer" }}><PlusCircle size={14} /></button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
               {(languages || []).map((lang, i) => (
                 <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                     {isEditable && (
                       <button onClick={() => onUpdate?.("languages.remove", i)} style={{ color: "#ef4444", background: "none", border: "none", padding: 0 }}><X size={10} /></button>
                     )}
                     {isEditable ? (
                        <input defaultValue={lang.name} onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.target.value)} style={{ fontWeight: "600", background: "transparent", border: "1px dashed #000", width: "100px" }} />
                     ) : (
                       <span style={{ fontWeight: "600" }}>{lang.name}</span>
                     )}
                   </div>
                   {isEditable ? (
                      <input defaultValue={lang.proficiency} onBlur={(e) => onUpdate?.(`languages.${i}.proficiency`, e.target.value)} style={{ background: "transparent", border: "1px dashed #000", width: "100px", textAlign: "right" }} />
                   ) : (
                     <span>{lang.proficiency}</span>
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
function BoardDetail({ label, value, onUpdate, isEditable }: { label: string, value?: string, onUpdate?: (val: string) => void, isEditable: boolean }) {
  if (!isEditable && !value) return null
  return (
    <div style={{ fontSize: "14px", display: "flex", gap: "12px" }}>
      <span style={{ fontWeight: "600", minWidth: "120px", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px" }}>{label}:</span>
      {isEditable ? (
        <input 
          defaultValue={value}
          onBlur={(e) => onUpdate?.(e.target.value)}
          style={{ background: "transparent", border: "1px dashed #000", fontSize: "14px", padding: "0 4px", outline: "none", width: "100%", fontFamily: "inherit" }}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  )
}
