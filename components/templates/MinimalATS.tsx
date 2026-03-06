import React from "react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"
import { PlusCircle, Trash2, Sparkles, Loader2, X } from "lucide-react"
import { DurationPicker } from "../DurationPicker"

export function MinimalATS({ 
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
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        fontSize: "13px",
        color: "#000",
        position: "relative"
      }}
    >
      
      {/* 1. Contact Information */}
      <header style={{ textAlign: "center", marginBottom: "32px" }}>
        {isEditable ? (
          <input
            defaultValue={personalInfo.fullName}
            placeholder="FULL NAME"
            onBlur={(e) => onUpdate?.("personalInfo.fullName", e.target.value)}
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              textTransform: "uppercase",
              marginBottom: "8px",
              textAlign: "center",
              width: "100%",
              background: "transparent",
              border: "1px dashed #000",
              outline: "none",
              fontFamily: "inherit"
            }}
          />
        ) : (
          <h1 style={{ fontSize: "24px", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px" }}>
            {personalInfo.fullName}
          </h1>
        )}
        <div style={{ fontSize: "11px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
          {isEditable ? (
             <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", width: "100%" }}>
                <input defaultValue={personalInfo.location || ""} placeholder="Location" onBlur={(e) => onUpdate?.("personalInfo.location", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", textAlign: "center", width: "150px" }} />
                <input defaultValue={personalInfo.phone || ""} placeholder="Phone" onBlur={(e) => onUpdate?.("personalInfo.phone", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", textAlign: "center", width: "120px" }} />
                <input defaultValue={personalInfo.email || ""} placeholder="Email" onBlur={(e) => onUpdate?.("personalInfo.email", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", textAlign: "center", width: "180px" }} />
                <input defaultValue={personalInfo.linkedin || ""} placeholder="LinkedIn" onBlur={(e) => onUpdate?.("personalInfo.linkedin", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", textAlign: "center", width: "180px" }} />
             </div>
          ) : (
            [
              [personalInfo.county, personalInfo.country, personalInfo.location].filter(Boolean).join(", "),
              personalInfo.phone ? `${personalInfo.phoneCode || ''} ${personalInfo.phone}` : null,
              personalInfo.email,
              personalInfo.website,
              personalInfo.linkedin ? `LinkedIn: ${personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}` : null,
              personalInfo.github ? `GitHub: ${personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}` : null,
              personalInfo.facebook ? `Facebook: ${personalInfo.facebook.replace(/^https?:\/\/(www\.)?/, "")}` : null,
            ].filter(Boolean).map((item, i, arr) => (
              <React.Fragment key={i}>
                <span>{item}</span>
                {i < arr.length - 1 && <span style={{ color: "#9ca3af" }}>|</span>}
              </React.Fragment>
            ))
          )}
        </div>
      </header>

      {/* 2. Professional Summary */}
      {(personalInfo.summary || isEditable) && (
        <section style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid black", paddingBottom: "4px", marginBottom: "12px" }}>
            <h2 style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "14px", margin: 0 }}>
              Professional Summary
            </h2>
            {isEditable && (
              <button 
                onClick={() => onRefine?.("summary")}
                disabled={refiningId === "summary"}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold" }}
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
              style={{ width: "100%", minHeight: "80px", fontSize: "13px", lineHeight: "1.5", background: "transparent", border: "1px dashed #000", outline: "none", fontFamily: "inherit", resize: "vertical" }}
            />
          ) : (
            <MarkdownText content={personalInfo.summary || ""} style={{ lineHeight: "1.5" }} />
          )}
        </section>
      )}

      {/* 3. Core Skills / Technical Skills */}
      {(skills.length > 0 || isEditable) && (
        <section style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid black", paddingBottom: "4px", marginBottom: "12px" }}>
            <h2 style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "14px", margin: 0 }}>
              Core Skills
            </h2>
            {isEditable && (
              <button onClick={() => onUpdate?.("skills.add", "New Category")} style={{ background: "none", border: "none", cursor: "pointer" }}><PlusCircle size={14} /></button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {skills.map((skill, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", position: "relative" }}>
                 {isEditable && (
                  <button onClick={() => onUpdate?.("skills.remove", i)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={12} /></button>
                )}
                {isEditable ? (
                  <div style={{ display: "flex", gap: "4px", flex: 1 }}>
                    <input defaultValue={skill.category} onBlur={(e) => onUpdate?.(`skills.${i}.category`, e.target.value)} style={{ fontWeight: "bold", width: "150px", background: "transparent", border: "1px dashed #000", outline: "none" }} />
                    <span>:</span>
                    <input defaultValue={skill.items.join(", ")} onBlur={(e) => onUpdate?.(`skills.${i}.items`, e.target.value.split(",").map(s => s.trim()))} style={{ flex: 1, background: "transparent", border: "1px dashed #000", outline: "none" }} />
                  </div>
                ) : (
                  <p style={{ margin: 0 }}>
                    <strong style={{ fontWeight: "bold" }}>{skill.category}:</strong> {skill.items.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Professional Experience */}
      {(experience.length > 0 || isEditable) && (
        <section style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid black", paddingBottom: "4px", marginBottom: "12px" }}>
            <h2 style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "14px", margin: 0 }}>
              Professional Experience
            </h2>
            {isEditable && (
              <button onClick={() => onUpdate?.("experience.add", {})} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                <PlusCircle size={14} /> ADD ROLE
              </button>
            )}
          </div>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "20px", position: "relative" }}>
              {isEditable && (
                <button onClick={() => onUpdate?.("experience.remove", exp.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontWeight: "bold" }}>
                {isEditable ? (
                  <input defaultValue={exp.role} placeholder="Role" onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)} style={{ fontSize: "14px", fontWeight: "bold", background: "transparent", border: "1px dashed #000", outline: "none", width: "60%" }} />
                ) : (
                  <span style={{ fontSize: "14px" }}>{exp.role}</span>
                )}
                {isEditable ? (
                  <DurationPicker value={exp.duration} onChange={(val) => onUpdate?.(`experience.${exp.id}.duration`, val)} />
                ) : (
                  <span style={{ fontSize: "11px", fontWeight: "normal" }}>{exp.duration}</span>
                )}
              </div>
              {isEditable ? (
                <input defaultValue={exp.company} placeholder="Company" onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)} style={{ fontSize: "12px", fontStyle: "italic", marginBottom: "8px", background: "transparent", border: "1px dashed #000", outline: "none", width: "100%", marginTop: "2px" }} />
              ) : (
                <div style={{ fontSize: "12px", fontStyle: "italic", marginBottom: "8px" }}>{exp.company}</div>
              )}
              {isEditable ? (
                <div style={{ marginTop: "4px" }}>
                  {exp.description.map((bullet, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                      <input defaultValue={bullet} onBlur={(e) => {
                        const newDesc = [...exp.description]
                        newDesc[i] = e.target.value
                        onUpdate?.(`experience.${exp.id}.description`, newDesc)
                      }} style={{ flex: 1, fontSize: "12px", background: "transparent", border: "1px dashed #000", outline: "none" }} />
                      <button onClick={() => {
                        const newDesc = exp.description.filter((_, idx) => idx !== i)
                        onUpdate?.(`experience.${exp.id}.description`, newDesc)
                      }} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                    </div>
                  ))}
                  <button onClick={() => onUpdate?.(`experience.${exp.id}.description`, [...exp.description, ""])} style={{ fontSize: "11px", fontWeight: "bold", background: "none", border: "none", cursor: "pointer" }}>+ ADD BULLET</button>
                </div>
              ) : (
                <ul style={{ paddingLeft: "16px", margin: 0, listStyleType: "disc", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {exp.description.filter(Boolean).map((bullet, i) => (
                    <li key={i}>
                      <MarkdownText content={bullet} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* 7. Projects (Tech focused) */}
      {(projects && projects.length > 0 || isEditable) && (
        <section style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid black", paddingBottom: "4px", marginBottom: "12px" }}>
            <h2 style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "14px", margin: 0 }}>
              Technical Projects
            </h2>
            {isEditable && (
              <button onClick={() => onUpdate?.("projects.add", {})} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                <PlusCircle size={14} /> ADD PROJECT
              </button>
            )}
          </div>
          {projects.map((project) => (
            <div key={project.id} style={{ marginBottom: "16px", position: "relative" }}>
              {isEditable && (
                <button onClick={() => onUpdate?.("projects.remove", project.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontWeight: "bold" }}>
                {isEditable ? (
                  <input defaultValue={project.name} placeholder="Project Name" onBlur={(e) => onUpdate?.(`projects.${project.id}.name`, e.target.value)} style={{ fontSize: "14px", fontWeight: "bold", background: "transparent", border: "1px dashed #000", outline: "none", width: "60%" }} />
                ) : (
                  <span style={{ fontSize: "14px" }}>{project.name}</span>
                )}
                {isEditable ? (
                  <input defaultValue={project.link} placeholder="Link" onBlur={(e) => onUpdate?.(`projects.${project.id}.link`, e.target.value)} style={{ fontSize: "11px", fontWeight: "normal", background: "transparent", border: "1px dashed #000", outline: "none", width: "30%", textAlign: "right" }} />
                ) : (
                  project.link && <span style={{ fontSize: "11px", fontWeight: "normal" }}>{project.link.replace(/^https?:\/\/(www\.)?/, "")}</span>
                )}
              </div>
              {isEditable ? (
                <textarea defaultValue={project.description} placeholder="Description (use new lines for bullets)..." onBlur={(e) => onUpdate?.(`projects.${project.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "12px", background: "transparent", border: "1px dashed #000", outline: "none", marginTop: "4px", fontFamily: "inherit" }} />
              ) : (
                <ul style={{ paddingLeft: "16px", margin: "4px 0 0 0", listStyleType: "disc", display: "flex", flexDirection: "column", gap: "2px" }}>
                  {project.description.split('\n').filter(line => line.trim()).map((bullet, i) => (
                    <li key={i}>
                      <MarkdownText content={bullet.replace(/^[•\-\*]\s*/, "")} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* 5. Education */}
      {(education.length > 0 || isEditable) && (
        <section style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid black", paddingBottom: "4px", marginBottom: "12px" }}>
            <h2 style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "14px", margin: 0 }}>
              Education
            </h2>
            {isEditable && (
              <button onClick={() => onUpdate?.("education.add", {})} style={{ background: "none", border: "none", cursor: "pointer" }}><PlusCircle size={14} /></button>
            )}
          </div>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: "12px", position: "relative" }}>
               {isEditable && (
                <button onClick={() => onUpdate?.("education.remove", edu.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                <div style={{ display: "flex", alignItems: "baseline", flex: 1 }}>
                  {isEditable ? (
                    <input defaultValue={edu.degree} placeholder="Degree" onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)} style={{ fontWeight: "bold", background: "transparent", border: "1px dashed #000", outline: "none", width: "40%" }} />
                  ) : (
                    <span style={{ fontWeight: "bold" }}>{edu.degree}</span>
                  )}
                  <span style={{ margin: "0 8px", color: "#6b7280" }}>|</span>
                  {isEditable ? (
                    <input defaultValue={edu.school} placeholder="School" onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)} style={{ background: "transparent", border: "1px dashed #000", outline: "none", width: "40%" }} />
                  ) : (
                    <span>{edu.school}</span>
                  )}
                </div>
                {isEditable ? (
                  <DurationPicker value={edu.duration} onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} />
                ) : (
                  <span style={{ fontSize: "11px" }}>{edu.duration}</span>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Volunteering */}
      {(volunteering && volunteering.length > 0 || isEditable) && (
        <section style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "2px solid black", paddingBottom: "4px", marginBottom: "12px" }}>
            <h2 style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "14px", margin: 0 }}>
              Volunteering
            </h2>
            {isEditable && (
               <button onClick={() => onUpdate?.("volunteering.add", {})} style={{ background: "none", border: "none", color: "#000", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
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
                   <div style={{ display: "flex", alignItems: "baseline", flex: 1 }}>
                    {isEditable ? (
                       <input defaultValue={vol.role} placeholder="Role" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)} style={{ fontSize: "14px", fontWeight: "bold", background: "transparent", border: "1px dashed #000", outline: "none", width: "40%" }} />
                    ) : (
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>{vol.role}</span>
                    )}
                    <span style={{ margin: "0 8px", color: "#6b7280" }}>|</span>
                    {isEditable ? (
                      <input defaultValue={vol.organization} placeholder="Organization" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)} style={{ background: "transparent", border: "1px dashed #000", outline: "none", width: "40%" }} />
                    ) : (
                      <span>{vol.organization}</span>
                    )}
                  </div>
                  {isEditable ? (
                    <DurationPicker value={vol.duration} onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} />
                  ) : (
                    <span style={{ fontSize: "11px" }}>{vol.duration}</span>
                  )}
                </div>
                {isEditable ? (
                  <textarea defaultValue={vol.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "12px", background: "transparent", border: "1px dashed #000", outline: "none", marginTop: "4px", fontFamily: "inherit" }} />
                ) : (
                  <MarkdownText content={vol.description} style={{ fontSize: "12.5px" }} />
                )}
                {isEditable && (
                    <button 
                      onClick={() => onRefine?.("volunteering", vol.id)}
                      disabled={refiningId === vol.id || !vol.description}
                      style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#000", background: "white", border: "1px solid #000", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", marginTop: "4px", opacity: (refiningId === vol.id || !vol.description) ? 0.5 : 1 }}
                    >
                      {refiningId === vol.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                      AI REFINE
                    </button>
                  )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Details & Languages - split columns */}
      <div style={{ display: "flex", gap: "40px", marginTop: "32px", borderTop: "2px solid black", paddingTop: "12px" }}>
        {(hasPersonalDetails || isEditable) && (
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "14px", marginBottom: "12px" }}>Personal Details</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
               {(personalInfo.dateOfBirth || isEditable) && <DetailRow label="Date of Birth" value={personalInfo.dateOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.dateOfBirth", val)} isEditable={isEditable} />}
               {(personalInfo.placeOfBirth || isEditable) && <DetailRow label="Place of Birth" value={personalInfo.placeOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.placeOfBirth", val)} isEditable={isEditable} />}
               {(personalInfo.nationality || isEditable) && <DetailRow label="Nationality" value={personalInfo.nationality} onUpdate={(val) => onUpdate?.("personalInfo.nationality", val)} isEditable={isEditable} />}
               {(personalInfo.gender || isEditable) && <DetailRow label="Gender" value={personalInfo.gender} onUpdate={(val) => onUpdate?.("personalInfo.gender", val)} isEditable={isEditable} />}
               {(personalInfo.passport || isEditable) && <DetailRow label="Passport" value={personalInfo.passport} onUpdate={(val) => onUpdate?.("personalInfo.passport", val)} isEditable={isEditable} />}
               {(personalInfo.workPermit || isEditable) && <DetailRow label="Work Permit" value={personalInfo.workPermit} onUpdate={(val) => onUpdate?.("personalInfo.workPermit", val)} isEditable={isEditable} />}
            </div>
          </div>
        )}

        {(languages && languages.length > 0 || isEditable) && (
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
              <h2 style={{ fontWeight: "bold", textTransform: "uppercase", fontSize: "14px", margin: 0 }}>Languages</h2>
              {isEditable && (
                <button onClick={() => onUpdate?.("languages.add", { name: "New Language", proficiency: "Native" })} style={{ background: "none", border: "none", color: "#000", cursor: "pointer" }}><PlusCircle size={14} /></button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {(languages || []).map((lang, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {isEditable && (
                      <button onClick={() => onUpdate?.("languages.remove", i)} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                    )}
                    {isEditable ? (
                      <input defaultValue={lang.name} onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.target.value)} style={{ fontWeight: "bold", background: "transparent", border: "1px dashed #000", width: "100px" }} />
                    ) : (
                      <span style={{ fontWeight: "bold" }}>{lang.name}</span>
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

function DetailRow({ label, value, onUpdate, isEditable }: { label: string, value?: string, onUpdate?: (val: string) => void, isEditable: boolean }) {
  if (!isEditable && !value) return null
  return (
    <div style={{ fontSize: "13px", display: "flex", gap: "8px" }}>
      <span style={{ fontWeight: "bold", minWidth: "110px" }}>{label}:</span>
      {isEditable ? (
        <input 
          defaultValue={value}
          onBlur={(e) => onUpdate?.(e.target.value)}
          style={{ background: "transparent", border: "1px dashed #000", fontSize: "13px", width: "100%", outline: "none" }}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  )
}
