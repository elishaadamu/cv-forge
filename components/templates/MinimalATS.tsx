import React, { useState, useRef, useEffect } from "react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"
import { PlusCircle, Trash2, Sparkles, Loader2, X, ChevronDown, Check, Search } from "lucide-react"
import { DurationPicker } from "../DurationPicker"
import countriesData from "@/lib/countries-data.json"

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
        {isEditable ? (
          <input
            defaultValue={personalInfo.jobTitle}
            placeholder="JOB TITLE"
            onBlur={(e) => onUpdate?.("personalInfo.jobTitle", e.target.value)}
            style={{
              fontSize: "16px",
              color: "#6b7280",
              fontWeight: "500",
              textTransform: "uppercase",
              marginBottom: "12px",
              textAlign: "center",
              width: "100%",
              background: "transparent",
              border: "1px dashed #000",
              outline: "none",
              fontFamily: "inherit",
              letterSpacing: "1px"
            }}
          />
        ) : personalInfo.jobTitle && (
          <p style={{ fontSize: "16px", color: "#6b7280", fontWeight: "500", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "1px" }}>
            {personalInfo.jobTitle}
          </p>
        )}

        {/* Personal Details in Header */}
        {(hasPersonalDetails || isEditable) && (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px", marginBottom: "16px", fontSize: "11px", color: "#4b5563" }}>
            {(personalInfo.dateOfBirth || isEditable) && (
              <DetailRow label="DOB" value={personalInfo.dateOfBirth} onUpdate={(val: string) => onUpdate?.("personalInfo.dateOfBirth", val)} isEditable={isEditable} type="date" />
            )}
            {(personalInfo.placeOfBirth || isEditable) && (
              <DetailRow label="Birth Place" value={personalInfo.placeOfBirth} onUpdate={(val: string) => onUpdate?.("personalInfo.placeOfBirth", val)} isEditable={isEditable} />
            )}
             {(personalInfo.nationality || isEditable) && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontWeight: "bold" }}>Nationality:</span>
                  {isEditable ? (
                    <SearchableSelect 
                      value={personalInfo.nationality || "Select"} 
                      options={countriesData.map(c => c.name)} 
                      onSelect={(val: string) => onUpdate?.("personalInfo.nationality", val)} 
                    />
                  ) : (
                    <span>{personalInfo.nationality}</span>
                  )}
                </div>
              )}
              {(personalInfo.gender || isEditable) && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontWeight: "bold" }}>Gender:</span>
                  {isEditable ? (
                    <SearchableSelect 
                      value={personalInfo.gender || "Select"} 
                      options={["Male", "Female", "Other", "Prefer not to say"]} 
                      onSelect={(val: string) => onUpdate?.("personalInfo.gender", val)} 
                    />
                  ) : (
                    <span>{personalInfo.gender}</span>
                  )}
                </div>
              )}
              {(personalInfo.passport || isEditable) && <DetailRow label="Passport" value={personalInfo.passport} onUpdate={(val: string) => onUpdate?.("personalInfo.passport", val)} isEditable={isEditable} />}
              {(personalInfo.workPermit || isEditable) && <DetailRow label="Work Permit" value={personalInfo.workPermit} onUpdate={(val: string) => onUpdate?.("personalInfo.workPermit", val)} isEditable={isEditable} />}
          </div>
        )}

        <div style={{ fontSize: "11px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
          {isEditable ? (
             <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", width: "100%", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "4px", alignItems: "baseline" }}>
                  <SearchableSelect 
                    value={personalInfo.country || "Country"} 
                    options={countriesData.map(c => c.name)} 
                    onSelect={(val: string) => {
                      onUpdate?.("personalInfo.country", val)
                      onUpdate?.("personalInfo.county", "")
                    }}
                  />
                  <SearchableSelect 
                    value={personalInfo.county || "State"} 
                    options={personalInfo.country ? (countriesData.find((c: any) => c.name === personalInfo.country)?.states || []).map((s: any) => s.name) : []} 
                    onSelect={(val: string) => onUpdate?.("personalInfo.county", val)} 
                  />
                  <input defaultValue={personalInfo.location || ""} placeholder="City" onBlur={(e) => onUpdate?.("personalInfo.location", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", textAlign: "center", width: "100px" }} />
                </div>
                
                <div style={{ display: "flex", gap: "4px", alignItems: "center", whiteSpace: "nowrap" }}>
                  <SearchableSelect 
                    value={personalInfo.phoneCode?.startsWith('+') ? personalInfo.phoneCode : `+${personalInfo.phoneCode || '1'}`} 
                    options={countriesData.map(c => `${c.phonecode.startsWith('+') ? '' : '+'}${c.phonecode.split(',')[0].trim()} - ${c.name}`)} 
                    onSelect={(val: string) => {
                      const code = val.split(" - ")[0];
                      onUpdate?.("personalInfo.phoneCode", code.startsWith('+') ? code : `+${code}`);
                    }}
                    width="80px"
                  />
                  <input defaultValue={personalInfo.phone || ""} placeholder="Phone" onBlur={(e) => onUpdate?.("personalInfo.phone", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", textAlign: "center", width: "100px", outline: "none" }} />
                </div>
                <input defaultValue={personalInfo.email || ""} placeholder="Email" onBlur={(e) => onUpdate?.("personalInfo.email", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", textAlign: "center", width: "180px" }} />
                <input defaultValue={personalInfo.linkedin || ""} placeholder="LinkedIn" onBlur={(e) => onUpdate?.("personalInfo.linkedin", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", textAlign: "center", width: "180px" }} />
             </div>
          ) : (
            [
              [personalInfo.location, personalInfo.county, personalInfo.country].filter(Boolean).join(", "),
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

      {/* 5. Education - Moved under Summary */}
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
                <button onClick={() => onUpdate?.("education.remove", edu.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={14} /></button>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                <div style={{ display: "flex", alignItems: "baseline", flex: 1, flexWrap: "wrap", gap: "8px" }}>
                  {isEditable ? (
                    <input defaultValue={edu.degree} placeholder="Degree" onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)} style={{ fontWeight: "bold", background: "transparent", border: "1px dashed #000", outline: "none", width: "45%", fontFamily: "inherit" }} />
                  ) : (
                    <span style={{ fontWeight: "bold" }}>{edu.degree}</span>
                  )}
                  <span style={{ color: "#6b7280" }}>|</span>
                  {isEditable ? (
                    <input defaultValue={edu.school} placeholder="School" onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)} style={{ background: "transparent", border: "1px dashed #000", outline: "none", width: "45%", fontFamily: "inherit" }} />
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
              {isEditable ? (
                 <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input defaultValue={edu.fieldOfStudy} placeholder="Field of Study" onBlur={(e) => onUpdate?.(`education.${edu.id}.fieldOfStudy`, e.target.value)} style={{ fontSize: "12px", background: "transparent", border: "1px dashed #000", outline: "none", width: "60%", fontFamily: "inherit" }} />
                      <input defaultValue={edu.grade} placeholder="Grade" onBlur={(e) => onUpdate?.(`education.${edu.id}.grade`, e.target.value)} style={{ fontSize: "12px", background: "transparent", border: "1px dashed #000", outline: "none", width: "40%", fontFamily: "inherit" }} />
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <SearchableSelect 
                        value={edu.country || "Country"} 
                        options={countriesData.map(c => c.name)} 
                        onSelect={(val: string) => {
                          onUpdate?.(`education.${edu.id}.country`, val)
                          onUpdate?.(`education.${edu.id}.county`, "")
                        }}
                      />
                      <SearchableSelect 
                        value={edu.county || "State"} 
                        options={edu.country ? (countriesData.find((c: any) => c.name === edu.country)?.states || []).map((s: any) => s.name) : []} 
                        onSelect={(val: string) => onUpdate?.(`education.${edu.id}.county`, val)} 
                      />
                      <input 
                         defaultValue={edu.location} 
                         placeholder="City" 
                         onBlur={(e) => onUpdate?.(`education.${edu.id}.location`, e.target.value)} 
                         style={{ fontSize: "11px", color: "#6b7280", background: "transparent", border: "1px dashed #000", outline: "none", width: "100px" }} 
                      />
                    </div>
                 </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                   {edu.fieldOfStudy && (
                     <p style={{ fontSize: "12px", margin: 0, fontStyle: "italic" }}>{edu.fieldOfStudy}{edu.grade ? ` | ${edu.grade}` : ""}</p>
                   )}
                   {(edu.location || edu.county || edu.country) && (
                     <p style={{ fontSize: "11px", color: "#6b7280", margin: "2px 0 0 0" }}>
                       {[edu.location, edu.county, edu.country].filter(Boolean).join(", ")}
                     </p>
                   )}
                </div>
              )}
            </div>
          ))}
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
                <button onClick={() => onUpdate?.("experience.remove", exp.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={14} /></button>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontWeight: "bold" }}>
                {isEditable ? (
                  <input defaultValue={exp.role} placeholder="Role" onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)} style={{ fontSize: "14px", fontWeight: "bold", background: "transparent", border: "1px dashed #000", outline: "none", width: "60%", fontFamily: "inherit" }} />
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
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "2px", marginBottom: "8px" }}>
                  <input defaultValue={exp.company} placeholder="Company" onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)} style={{ fontSize: "12px", fontStyle: "italic", background: "transparent", border: "1px dashed #000", outline: "none", width: "100%", fontFamily: "inherit" }} />
                   <div style={{ display: "flex", gap: "8px" }}>
                    <SearchableSelect 
                      value={exp.country || "Country"} 
                      options={countriesData.map(c => c.name)} 
                      onSelect={(val: string) => {
                        onUpdate?.(`experience.${exp.id}.country`, val)
                        onUpdate?.(`experience.${exp.id}.county`, "")
                      }}
                    />
                    <SearchableSelect 
                      value={exp.county || "State"} 
                      options={exp.country ? (countriesData.find((c: any) => c.name === exp.country)?.states || []).map((s: any) => s.name) : []} 
                      onSelect={(val: string) => onUpdate?.(`experience.${exp.id}.county`, val)} 
                    />
                    <input 
                       defaultValue={exp.location} 
                       placeholder="City" 
                       onBlur={(e) => onUpdate?.(`experience.${exp.id}.location`, e.target.value)} 
                       style={{ fontSize: "11px", color: "#6b7280", background: "transparent", border: "1px dashed #000", outline: "none", width: "100px" }} 
                    />
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: "12px", fontStyle: "italic", marginBottom: "4px" }}>
                  {exp.company}
                  {(exp.location || exp.county || exp.country) && (
                    <span style={{ fontWeight: "normal", fontStyle: "normal", color: "#6b7280" }}>
                       {" • "}{[exp.location, exp.county, exp.country].filter(Boolean).join(", ")}
                    </span>
                  )}
                </div>
              )}

              {isEditable ? (
                <div style={{ marginTop: "8px" }}>
                    <button 
                      onClick={() => onRefine?.("experience", exp.id)}
                      disabled={refiningId === exp.id || !exp.workDescription}
                      style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 700, color: "#000", background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.2)", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", marginBottom: "4px", opacity: (refiningId === exp.id || !exp.workDescription) ? 0.5 : 1 }}
                    >
                      {refiningId === exp.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                      AI REFINE
                    </button>
                  <textarea 
                    defaultValue={exp.workDescription} 
                    placeholder="Role summary..." 
                    onBlur={(e) => onUpdate?.(`experience.${exp.id}.workDescription`, e.target.value)} 
                    style={{ width: "100%", minHeight: "60px", fontSize: "12px", background: "transparent", border: "1px dashed #000", outline: "none", padding: "6px", resize: "vertical", fontFamily: "inherit" }} 
                  />
                </div>
              ) : (
                exp.workDescription && (
                  <MarkdownText content={exp.workDescription} style={{ fontSize: "12px", lineHeight: 1.6, marginTop: "6px" }} />
                )
              )}

              {isEditable ? (
                <div style={{ marginTop: "8px" }}>
                  {exp.description.map((bullet, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                      <input defaultValue={bullet} onBlur={(e) => {
                        const newDesc = [...exp.description]
                        newDesc[i] = e.target.value
                        onUpdate?.(`experience.${exp.id}.description`, newDesc)
                      }} style={{ flex: 1, fontSize: "12px", background: "transparent", border: "1px dashed #000", outline: "none", fontFamily: "inherit" }} />
                      <button onClick={() => {
                        const newDesc = exp.description.filter((_, idx) => idx !== i)
                        onUpdate?.(`experience.${exp.id}.description`, newDesc)
                      }} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><X size={12} /></button>
                    </div>
                  ))}
                  <button onClick={() => onUpdate?.(`experience.${exp.id}.description`, [...exp.description, ""])} style={{ fontSize: "11px", fontWeight: "bold", background: "none", border: "none", cursor: "pointer" }}>+ ADD BULLET</button>
                </div>
              ) : (
                <ul style={{ paddingLeft: "16px", margin: "4px 0 0 0", listStyleType: "disc", display: "flex", flexDirection: "column", gap: "2px" }}>
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
                <button onClick={() => onUpdate?.("projects.remove", project.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={14} /></button>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontWeight: "bold" }}>
                {isEditable ? (
                  <input defaultValue={project.name} placeholder="Project Name" onBlur={(e) => onUpdate?.(`projects.${project.id}.name`, e.target.value)} style={{ fontSize: "14px", fontWeight: "bold", background: "transparent", border: "1px dashed #000", outline: "none", width: "60%", fontFamily: "inherit" }} />
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
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <SearchableSelect 
                      value={project.country || "Country"} 
                      options={countriesData.map(c => c.name)} 
                      onSelect={(val: string) => {
                        onUpdate?.(`projects.${project.id}.country`, val)
                        onUpdate?.(`projects.${project.id}.county`, "")
                      }}
                    />
                    <SearchableSelect 
                      value={project.county || "State"} 
                      options={project.country ? (countriesData.find((c: any) => c.name === project.country)?.states || []).map((s: any) => s.name) : []} 
                      onSelect={(val: string) => onUpdate?.(`projects.${project.id}.county`, val)} 
                    />
                    <input 
                       defaultValue={project.location} 
                       placeholder="City" 
                       onBlur={(e) => onUpdate?.(`projects.${project.id}.location`, e.target.value)} 
                       style={{ fontSize: "11px", color: "#6b7280", background: "transparent", border: "1px dashed #000", outline: "none", width: "100px" }} 
                    />
                  </div>
                  <textarea defaultValue={project.description} placeholder="Description (use new lines for bullets)..." onBlur={(e) => onUpdate?.(`projects.${project.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "12px", background: "transparent", border: "1px dashed #000", outline: "none", fontFamily: "inherit", minHeight: "60px", padding: "4px", resize: "vertical" }} />
                </div>
              ) : (
                <>
                  {(project.location || project.county || project.country) && (
                    <p style={{ fontSize: "11px", color: "#6b7280", margin: "2px 0" }}>
                       {[project.location, project.county, project.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                  <ul style={{ paddingLeft: "16px", margin: "4px 0 0 0", listStyleType: "disc", display: "flex", flexDirection: "column", gap: "2px" }}>
                    {project.description.split('\n').filter(line => line.trim()).map((bullet, i) => (
                      <li key={i}>
                        <MarkdownText content={bullet.replace(/^[•\-\*]\s*/, "")} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
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
                  <button onClick={() => onUpdate?.("volunteering.remove", vol.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={14} /></button>
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
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <SearchableSelect 
                        value={vol.country || "Country"} 
                        options={countriesData.map(c => c.name)} 
                        onSelect={(val: string) => {
                          onUpdate?.(`volunteering.${vol.id}.country`, val)
                          onUpdate?.(`volunteering.${vol.id}.county`, "")
                        }}
                      />
                      <SearchableSelect 
                        value={vol.county || "State"} 
                        options={vol.country ? (countriesData.find((c: any) => c.name === vol.country)?.states || []).map((s: any) => s.name) : []} 
                        onSelect={(val: string) => onUpdate?.(`volunteering.${vol.id}.county`, val)} 
                      />
                      <input 
                         defaultValue={vol.location} 
                         placeholder="City" 
                         onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.location`, e.target.value)} 
                         style={{ fontSize: "11px", color: "#6b7280", background: "transparent", border: "1px dashed #000", outline: "none", width: "100px" }} 
                      />
                    </div>
                    <textarea defaultValue={vol.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "12px", background: "transparent", border: "1px dashed #000", outline: "none", marginTop: "4px", fontFamily: "inherit", minHeight: "60px", padding: "4px", resize: "vertical" }} />
                  </div>
                ) : (
                  <>
                  {(vol.location || vol.county || vol.country) && (
                    <p style={{ fontSize: "11px", color: "#6b7280", margin: "2px 0" }}>
                       {[vol.location, vol.county, vol.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                  <MarkdownText content={vol.description} style={{ fontSize: "12.5px" }} />
                  </>
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
                      <button onClick={() => onUpdate?.("languages.remove", i)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><X size={12} /></button>
                    )}
                    {isEditable ? (
                      <input defaultValue={lang.name} onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.target.value)} style={{ fontWeight: "bold", background: "transparent", border: "1px dashed #000", width: "100px", fontFamily: "inherit" }} />
                    ) : (
                      <span style={{ fontWeight: "bold" }}>{lang.name}</span>
                    )}
                  </div>
                  {isEditable ? (
                    <PopSelect 
                      value={lang.proficiency || "Select"} 
                      options={["Beginner", "Intermediate", "Advanced", "Professional", "Fluent", "Native"]} 
                      onSelect={(val: string) => onUpdate?.(`languages.${i}.proficiency`, val)} 
                    />
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

function DetailRow({ label, value, onUpdate, isEditable, type = "text" }: { label: string, value?: string, onUpdate?: (val: string) => void, isEditable: boolean, type?: string }) {
  if (!isEditable && !value) return null
  return (
    <div style={{ fontSize: "13px", display: "flex", gap: "8px", alignItems: "center" }}>
      <span style={{ fontWeight: "bold", minWidth: "110px" }}>{label}:</span>
      {isEditable ? (
        <input 
          type={type}
          defaultValue={value}
          onBlur={(e) => onUpdate?.(e.target.value)}
          style={{ background: "transparent", border: "1px dashed #000", fontSize: "13px", width: type === "date" ? "auto" : "100%", outline: "none", fontFamily: "inherit" }}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  )
}

function PopSelect({ value, options, onSelect }: { value: string; options: string[]; onSelect: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [openUp, setOpenUp] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isPlaceholder = !value || value === "Select" || value === "Country" || value === "State"

  const handleOpen = () => {
    if (!isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUp(spaceBelow < 260 && rect.top > 260)
    }
    setIsOpen(!isOpen)
  }

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
        onClick={handleOpen} 
        style={{ display: "flex", alignItems: "center", gap: "4px", padding: "2px 6px", background: "transparent", border: "1px dashed #000", fontSize: "11px", cursor: "pointer", borderRadius: "2px", fontWeight: "bold", color: isPlaceholder ? "#9ca3af" : "#000" }}
      >
        {value || "Select"} <ChevronDown size={10} />
      </button>
      {isOpen && (
        <div style={{ position: "absolute", bottom: openUp ? "100%" : "auto", top: openUp ? "auto" : "100%", left: 0, zIndex: 1000, background: "#fff", border: "1px solid #000", borderRadius: "2px", marginBottom: openUp ? "4px" : "0", marginTop: openUp ? "0" : "2px", minWidth: "120px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
          {options.filter(Boolean).map((opt) => (
            <div key={opt} onClick={() => { onSelect(opt); setIsOpen(false) }} style={{ padding: "4px 8px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", borderBottom: "1px solid #f3f4f6" }}>
              {opt} {value === opt && <Check size={10} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchableSelect({ value, options, onSelect, width = "120px" }: { value: string; options: string[]; onSelect: (val: string) => void; width?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [openUp, setOpenUp] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const isPlaceholder = !value || value === "Select" || value === "Country" || value === "State"

  const handleOpen = () => {
    if (!isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUp(spaceBelow < 260 && rect.top > 260)
    }
    setIsOpen(!isOpen)
  }

  const filtered = options.filter(opt => opt && opt.toLowerCase().includes(search.toLowerCase()))

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
        onClick={handleOpen} 
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px", padding: "2px 6px", background: "transparent", border: "1px dashed #000", fontSize: "11px", cursor: "pointer", width: width === "100%" ? "100%" : width, textAlign: "left", fontWeight: "bold", color: isPlaceholder ? "#9ca3af" : "#000" }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value || "Select"}</span>
        <ChevronDown size={10} />
      </button>
      {isOpen && (
        <div style={{ position: "absolute", bottom: openUp ? "100%" : "auto", top: openUp ? "auto" : "100%", left: 0, zIndex: 1000, background: "#fff", border: "1px solid #000", borderRadius: "2px", marginBottom: openUp ? "4px" : "0", marginTop: openUp ? "0" : "2px", width: "200px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
          <div style={{ padding: "4px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: "4px" }}>
            <Search size={10} color="#666" />
            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." style={{ border: "none", outline: "none", fontSize: "11px", width: "100%" }} onClick={(e) => e.stopPropagation()} />
          </div>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {filtered.map((opt) => (
              <div key={opt} onClick={() => { onSelect(opt); setIsOpen(false); setSearch("") }} style={{ padding: "4px 8px", cursor: "pointer", fontSize: "11px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {opt} {value === opt && <Check size={10} />}
              </div>
            ))}
            {filtered.length === 0 && <div style={{ padding: "8px", fontSize: "11px", color: "#999" }}>No results</div>}
          </div>
        </div>
      )}
    </div>
  )
}
