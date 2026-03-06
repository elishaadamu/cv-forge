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

export function BoldImpact({ 
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
        fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
        fontSize: "13px",
        color: "#0f172a",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── HERO HEADER ── */}
      <div
        style={{
          background: "#0f172a",
          color: "#fff",
          padding: "40px 52px",
          display: "flex",
          alignItems: "center",
          gap: "28px",
        }}
      >
        <div style={{ position: "relative" }}>
          {personalInfo.profileImage ? (
             <div style={{ position: "relative" }}>
                <img
                  src={personalInfo.profileImage}
                  alt={personalInfo.fullName}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "16px",
                    objectFit: "cover",
                    border: "3px solid #f97316",
                    flexShrink: 0,
                  }}
                />
                {isEditable && (
                  <button
                    onClick={onImageClick}
                    style={{ position: "absolute", bottom: "-8px", right: "-8px", background: "#f97316", color: "white", borderRadius: "50%", padding: "6px", border: "2px solid #0f172a", cursor: "pointer" }}
                  >
                    <Camera size={14} />
                  </button>
                )}
             </div>
          ) : isEditable ? (
             <button
              onClick={onImageClick}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "16px",
                border: "3px dashed #f97316",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(249, 115, 22, 0.1)",
                color: "#f97316",
                cursor: "pointer"
              }}
            >
              <Camera size={24} />
            </button>
          ) : null}
        </div>
        <div style={{ flex: 1 }}>
          {isEditable ? (
             <input
              value={personalInfo.fullName}
              placeholder="YOUR NAME"
              onChange={(e) => onUpdate?.("personalInfo.fullName", e.target.value)}
              style={{
                fontSize: "38px",
                fontWeight: 900,
                lineHeight: 1.05,
                textTransform: "uppercase",
                letterSpacing: "-1px",
                marginBottom: "4px",
                width: "100%",
                background: "transparent",
                border: "1px dashed rgba(255,255,255,0.4)",
                color: "#fff",
                outline: "none",
                fontFamily: "inherit"
              }}
            />
          ) : (
            <h1
              style={{
                fontSize: "38px",
                fontWeight: 900,
                lineHeight: 1.05,
                textTransform: "uppercase",
                letterSpacing: "-1px",
                marginBottom: "4px",
              }}
            >
              {personalInfo.fullName || "Your Name"}
            </h1>
          )}
          {isEditable ? (
            <input
              value={personalInfo.jobTitle}
              placeholder="JOB TITLE"
              onChange={(e) => onUpdate?.("personalInfo.jobTitle", e.target.value)}
              style={{
                display: "inline-block",
                background: "#f97316",
                color: "#fff",
                padding: "4px 14px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                border: "none",
                outline: "none",
                fontFamily: "inherit",
                width: "auto"
              }}
            />
          ) : (
            <div
              style={{
                display: "inline-block",
                background: "#f97316",
                color: "#fff",
                padding: "4px 14px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              {personalInfo.jobTitle}
            </div>
          )}

          {/* Personal Details in Header */}
          {(hasPersonalDetails || isEditable) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "12px", fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
              {(personalInfo.dateOfBirth || isEditable) && (
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, color: "#f97316" }}>DOB:</span>
                  {isEditable ? (
                    <input
                      type="date"
                      defaultValue={personalInfo.dateOfBirth}
                      onChange={(e) => onUpdate?.("personalInfo.dateOfBirth", e.target.value)}
                      style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.3)", color: "#fff", fontSize: "11px", width: "110px", outline: "none", colorScheme: "dark" }}
                    />
                  ) : (
                    <span>{personalInfo.dateOfBirth}</span>
                  )}
                </div>
              )}
              {(personalInfo.nationality || isEditable) && (
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, color: "#f97316" }}>Nationality:</span>
                  {isEditable ? (
                    <SearchableSelect
                      value={personalInfo.nationality || "Select"}
                      options={countriesData.map(c => c.name)}
                      onSelect={(val) => onUpdate?.("personalInfo.nationality", val)}
                      width="120px"
                    />
                  ) : (
                    <span>{personalInfo.nationality}</span>
                  )}
                </div>
              )}
               {(personalInfo.gender || isEditable) && (
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, color: "#f97316" }}>Gender:</span>
                  {isEditable ? (
                    <PopSelect
                      value={personalInfo.gender || "Select"}
                      options={["Male", "Female", "Other", "Prefer not to say"]}
                      onSelect={(val) => onUpdate?.("personalInfo.gender", val)}
                      color="#fff"
                    />
                  ) : (
                    <span>{personalInfo.gender}</span>
                  )}
                </div>
              )}
              {(personalInfo.passport || isEditable) && (
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, color: "#f97316" }}>Passport:</span>
                  {isEditable ? (
                    <input
                      value={personalInfo.passport}
                      onChange={(e) => onUpdate?.("personalInfo.passport", e.target.value)}
                      placeholder="e.g. US"
                      style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.3)", color: "#fff", fontSize: "11px", width: "60px", outline: "none" }}
                    />
                  ) : (
                    <span>{personalInfo.passport}</span>
                  )}
                </div>
              )}
              {(personalInfo.workPermit || isEditable) && (
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, color: "#f97316" }}>Work Permit:</span>
                  {isEditable ? (
                    <input
                      value={personalInfo.workPermit}
                      onChange={(e) => onUpdate?.("personalInfo.workPermit", e.target.value)}
                      placeholder="e.g. EU"
                      style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.3)", color: "#fff", fontSize: "11px", width: "60px", outline: "none" }}
                    />
                  ) : (
                    <span>{personalInfo.workPermit}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── CONTACT STRIP ── */}
      <div
        style={{
          background: "#1e293b",
          padding: "10px 52px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          fontSize: "10.5px",
          color: "#94a3b8",
        }}
      >
        {isEditable ? (
           <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", width: "100%", alignItems: "center" }}>
              <input value={personalInfo.email || ""} placeholder="Email" onChange={(e) => onUpdate?.("personalInfo.email", e.target.value)} style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.2)", color: "#fff", fontSize: "10.5px", width: "140px", outline: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                <SearchableSelect
                  value={personalInfo.phoneCode || "+1"}
                  width="70px"
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
                <input value={personalInfo.phone || ""} placeholder="Phone" onChange={(e) => onUpdate?.("personalInfo.phone", e.target.value)} style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.2)", color: "#fff", fontSize: "10.5px", width: "90px", outline: "none" }} />
              </div>
              <SearchableSelect
                value={personalInfo.country || "Country"}
                options={countriesData.map(c => c.name)}
                onSelect={(val) => {
                   onUpdate?.("personalInfo.country", val)
                   onUpdate?.("personalInfo.county", "")
                }}
                width="110px"
              />
              <SearchableSelect
                value={personalInfo.county || "State"}
                options={personalInfo.country ? (countriesData.find((c: any) => c.name === personalInfo.country)?.states || []).map((s: any) => s.name) : []}
                onSelect={(val) => onUpdate?.("personalInfo.county", val)}
                width="100px"
              />
              <input value={personalInfo.location || ""} placeholder="City/Zip" onChange={(e) => onUpdate?.("personalInfo.location", e.target.value)} style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.2)", color: "#fff", fontSize: "10.5px", width: "80px", outline: "none" }} />
              
              {/* Socials */}
              <input value={personalInfo.linkedin || ""} placeholder="LinkedIn" onChange={(e) => onUpdate?.("personalInfo.linkedin", e.target.value)} style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.2)", color: "#fff", fontSize: "10.5px", width: "100px", outline: "none" }} />
              <input value={personalInfo.website || ""} placeholder="Website" onChange={(e) => onUpdate?.("personalInfo.website", e.target.value)} style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.2)", color: "#fff", fontSize: "10.5px", width: "100px", outline: "none" }} />
              <input value={personalInfo.github || ""} placeholder="GitHub" onChange={(e) => onUpdate?.("personalInfo.github", e.target.value)} style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.2)", color: "#fff", fontSize: "10.5px", width: "100px", outline: "none" }} />
              <input value={personalInfo.facebook || ""} placeholder="Facebook" onChange={(e) => onUpdate?.("personalInfo.facebook", e.target.value)} style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.2)", color: "#fff", fontSize: "10.5px", width: "100px", outline: "none" }} />
           </div>
        ) : (
          <>
            {personalInfo.phone && (
              <ContactItem icon={<Phone size={10} />} text={`${personalInfo.phoneCode || ''} ${personalInfo.phone}`} href={`tel:${personalInfo.phoneCode || ''}${personalInfo.phone}`} />
            )}
            {personalInfo.email && (
              <ContactItem icon={<Mail size={10} />} text={personalInfo.email} href={`mailto:${personalInfo.email}`} />
            )}
            {personalInfo.linkedin && (
              <ContactItem icon={<Linkedin size={10} />} text={personalInfo.linkedin} href={formatUrl(personalInfo.linkedin)} />
            )}
            {(personalInfo.location || personalInfo.county || personalInfo.country) && (
              <ContactItem icon={<MapPin size={10} />} text={[personalInfo.location, personalInfo.county, personalInfo.country].filter(Boolean).join(", ")} />
            )}
            {personalInfo.website && (
              <ContactItem icon={<Globe size={10} />} text={personalInfo.website} href={formatUrl(personalInfo.website)} />
            )}
            {personalInfo.github && (
              <ContactItem icon={<Github size={10} />} text={personalInfo.github} href={formatUrl(personalInfo.github)} />
            )}
            {personalInfo.facebook && (
              <ContactItem icon={<Facebook size={10} />} text={personalInfo.facebook} href={formatUrl(personalInfo.facebook)} />
            )}
          </>
        )}
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "32px 52px 48px", flex: 1 }}>
        {/* Summary */}
        {(personalInfo.summary || isEditable) && (
          <div style={{ marginBottom: "26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <HeavyHeading label="About Me" />
              {isEditable && (
                <button 
                  onClick={() => onRefine?.("summary")}
                  disabled={refiningId === "summary"}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#f97316" }}
                >
                  {refiningId === "summary" ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI REFINE
                </button>
              )}
            </div>
            {isEditable ? (
              <textarea
                value={personalInfo.summary}
                placeholder="About you..."
                onChange={(e) => onUpdate?.("personalInfo.summary", e.target.value)}
                style={{ width: "100%", minHeight: "80px", fontSize: "12.5px", color: "#334155", lineHeight: 1.75, background: "transparent", border: "1px dashed #cbd5e1", outline: "none", fontFamily: "inherit", resize: "vertical" }}
              />
            ) : (
              <MarkdownText
                content={personalInfo.summary || ""}
                style={{
                  fontSize: "12.5px",
                  color: "#334155",
                  lineHeight: 1.75,
                  textAlign: "justify",
                }}
              />
            )}
          </div>
        )}

        {/* Education */}
        {(education.length > 0 || isEditable) && (
          <div style={{ marginBottom: "26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <HeavyHeading label="Education" />
              {isEditable && (
                 <button onClick={() => onUpdate?.("education.add", {})} style={{ background: "none", border: "none", color: "#f97316", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                  <PlusCircle size={14} /> ADD EDUCATION
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {education.map((edu) => (
                <div key={edu.id} style={{ position: "relative" }}>
                   {isEditable && (
                    <button onClick={() => onUpdate?.("education.remove", edu.id)} style={{ position: "absolute", left: "-20px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                  )}
                  {isEditable ? (
                    <div>
                      <input value={edu.degree} placeholder="Degree" onChange={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)} style={{ fontWeight: 800, fontSize: "12px", width: "100%", background: "transparent", border: "1px dashed #cbd5e1" }} />
                      <div style={{ display: "flex", gap: "8px", margin: "4px 0" }}>
                        <input value={edu.fieldOfStudy} placeholder="Field of Study" onChange={(e) => onUpdate?.(`education.${edu.id}.fieldOfStudy`, e.target.value)} style={{ fontSize: "11px", width: "60%", background: "transparent", border: "1px dashed #cbd5e1" }} />
                        <input value={edu.grade} placeholder="Grade/GPA" onChange={(e) => onUpdate?.(`education.${edu.id}.grade`, e.target.value)} style={{ fontSize: "11px", width: "30%", background: "transparent", border: "1px dashed #cbd5e1" }} />
                      </div>
                      <input value={edu.school} placeholder="School" onChange={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)} style={{ fontSize: "11px", width: "100%", background: "transparent", border: "1px dashed #cbd5e1", marginBottom: "4px" }} />
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                         <SearchableSelect
                          value={edu.country || "Country"}
                          options={countriesData.map(c => c.name)}
                          onSelect={(val) => {
                             onUpdate?.(`education.${edu.id}.country`, val)
                             onUpdate?.(`education.${edu.id}.county`, "")
                          }}
                          width="120px"
                        />
                         <SearchableSelect
                          value={edu.county || "State"}
                          options={edu.country ? (countriesData.find((c: any) => c.name === edu.country)?.states || []).map((s: any) => s.name) : []}
                          onSelect={(val) => onUpdate?.(`education.${edu.id}.county`, val)}
                          width="100px"
                        />
                        <input value={edu.location} placeholder="City" onChange={(e) => onUpdate?.(`education.${edu.id}.location`, e.target.value)} style={{ fontSize: "11px", background: "transparent", border: "1px dashed #cbd5e1", width: "80px" }} />
                        <DurationPicker value={edu.duration} onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <p style={{ fontWeight: 800, fontSize: "12px", color: "#0f172a", marginBottom: "1px" }}>{edu.degree}</p>
                        {edu.duration && <p style={{ fontSize: "10px", color: "#f97316", fontWeight: 700 }}>{edu.duration}</p>}
                      </div>
                      {(edu.fieldOfStudy || edu.grade) && (
                        <p style={{ fontSize: "11.5px", color: "#334155", marginBottom: "1px" }}>
                          {edu.fieldOfStudy}{edu.grade && ` • Grade: ${edu.grade}`}
                        </p>
                      )}
                      <p style={{ fontSize: "11px", color: "#64748b" }}>
                        {edu.school} • {[edu.location, edu.county, edu.country].filter(Boolean).join(", ")}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {(experience.length > 0 || isEditable) && (
          <div style={{ marginBottom: "26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
               <HeavyHeading label="Experience" />
               {isEditable && (
                 <button onClick={() => onUpdate?.("experience.add", {})} style={{ background: "none", border: "none", color: "#f97316", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                  <PlusCircle size={14} /> ADD EXPERIENCE
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {experience.map((exp) => (
                <div key={exp.id} style={{ position: "relative" }}>
                   {isEditable && (
                    <button onClick={() => onUpdate?.("experience.remove", exp.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "4px",
                    }}
                  >
                    <div>
                      {isEditable ? (
                         <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", alignItems: "center" }}>
                            <input value={exp.role} placeholder="Role" onChange={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)} style={{ fontWeight: 800, fontSize: "14px", background: "transparent", border: "1px dashed #cbd5e1", outline: "none" }} />
                            <span style={{ color: "#64748b", fontSize: "12px" }}>at</span>
                            <input value={exp.company} placeholder="Company" onChange={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)} style={{ color: "#64748b", fontSize: "12px", background: "transparent", border: "1px dashed #cbd5e1", outline: "none", width: "120px" }} />
                            <SearchableSelect
                              value={exp.country || "Country"}
                              options={countriesData.map(c => c.name)}
                              onSelect={(val) => {
                                 onUpdate?.(`experience.${exp.id}.country`, val)
                                 onUpdate?.(`experience.${exp.id}.location`, "")
                              }}
                              width="100px"
                            />
                            <SearchableSelect
                                value={exp.location || "State"}
                                options={exp.country ? (countriesData.find((c: any) => c.name === exp.country)?.states || []).map((s: any) => s.name) : []}
                                onSelect={(val) => onUpdate?.(`experience.${exp.id}.location`, val)}
                                width="100px"
                              />
                         </div>
                      ) : (
                        <>
                          <span style={{ fontWeight: 800, fontSize: "14px", color: "#0f172a" }}>{exp.role}</span>
                          <span style={{ color: "#64748b", fontSize: "12px", marginLeft: "8px" }}>at {exp.company} • {[exp.location, exp.country].filter(Boolean).join(", ")}</span>
                        </>
                      )}
                    </div>
                    {isEditable ? (
                      <DurationPicker value={exp.duration} onChange={(val) => onUpdate?.(`experience.${exp.id}.duration`, val)} />
                    ) : (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#fff",
                          background: "#f97316",
                          padding: "3px 10px",
                          borderRadius: "3px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {exp.duration}
                      </span>
                    )}
                  </div>
                  {isEditable ? (
                    <div style={{ marginTop: "4px" }}>
                      {(Array.isArray(exp.description) ? exp.description : []).map((bullet, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                          <input value={bullet} onChange={(e) => {
                            const newDesc = [...exp.description]
                            newDesc[i] = e.target.value
                            onUpdate?.(`experience.${exp.id}.description`, newDesc)
                          }} style={{ flex: 1, fontSize: "12px", background: "transparent", border: "1px dashed #cbd5e1", outline: "none" }} />
                          <button onClick={() => {
                            const newDesc = exp.description.filter((_, idx) => idx !== i)
                            onUpdate?.(`experience.${exp.id}.description`, newDesc)
                          }} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                        </div>
                      ))}
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <button onClick={() => onUpdate?.(`experience.${exp.id}.description`, [...(Array.isArray(exp.description) ? exp.description : []), ""])} style={{ fontSize: "10px", fontWeight: "bold", background: "none", border: "none", cursor: "pointer", color: "#f97316" }}>+ ADD BULLET</button>
                        <button
                          onClick={() => onRefine?.("experience", exp.id)}
                          disabled={refiningId === exp.id || !exp.description}
                          style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#f97316", background: "rgba(249, 115, 22, 0.05)", border: "1px solid rgba(249, 115, 22, 0.2)", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", opacity: (refiningId === exp.id || !exp.description) ? 0.5 : 1 }}
                        >
                          {refiningId === exp.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                          AI REFINE
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ul style={{ paddingLeft: "16px", margin: 0, listStyleType: "square" }}>
                      {(Array.isArray(exp.description) ? exp.description : []).filter(Boolean).map((bullet, i) => (
                        <li key={i} style={{ fontSize: "12px", color: "#334155", lineHeight: 1.65, marginBottom: "3px" }}>
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

        {/* Skills */}
        {(skills.length > 0 || isEditable) && (
          <div style={{ marginBottom: "26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <HeavyHeading label="Skills & Expertise" />
              {isEditable && (
                 <button onClick={() => onUpdate?.("skills.add", "New Category")} style={{ background: "none", border: "none", color: "#f97316", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                  <PlusCircle size={14} /> ADD SKILL
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
              {isEditable ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
                  {skills.map((skill, i) => (
                    <div key={i} style={{ padding: "10px", border: "1px dashed #cbd5e1", borderRadius: "6px", background: "rgba(241, 245, 249, 0.5)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <input 
                          value={skill.category} 
                          onChange={(e) => onUpdate?.(`skills.${i}.category`, e.target.value)} 
                          style={{ fontWeight: 800, fontSize: "12px", color: "#0f172a", background: "transparent", border: "none", outline: "none", textTransform: "uppercase", letterSpacing: "1px", width: "100%" }} 
                          placeholder="Category Name"
                        />
                        <button onClick={() => onUpdate?.("skills.remove", i)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", marginLeft: "8px" }}><Trash2 size={14} /></button>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {(skill.items || []).map((item, idx) => (
                          <div key={idx} style={{ display: "flex", alignItems: "center", gap: "2px", background: "#fff", padding: "2px 8px", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
                            <input
                              value={item}
                              placeholder="Skill"
                              onChange={(e) => {
                                const newItems = [...skill.items]
                                newItems[idx] = e.target.value
                                onUpdate?.(`skills.${i}.items`, newItems)
                              }}
                              style={{ fontSize: "11px", background: "transparent", border: "none", outline: "none", width: "80px", color: "#334155" }}
                            />
                            <button 
                              onClick={() => {
                                const newItems = skill.items.filter((_, index) => index !== idx)
                                onUpdate?.(`skills.${i}.items`, newItems)
                              }}
                              style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", opacity: 0.6 }}
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => onUpdate?.(`skills.${i}.items`, [...(skill.items || []), ""])}
                          style={{ fontSize: "10px", fontWeight: "bold", color: "#f97316", background: "none", border: "1px dashed #f97316", borderRadius: "4px", padding: "2px 8px", cursor: "pointer" }}
                        >
                          + Add Item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                allSkills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      background: "#0f172a",
                      color: "#fff",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "5px 12px",
                      borderRadius: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        {/* Projects */}
        {(projects.length > 0 || isEditable) && (
          <div style={{ marginBottom: "26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <HeavyHeading label="Projects" />
              {isEditable && (
                 <button onClick={() => onUpdate?.("projects.add", {})} style={{ background: "none", border: "none", color: "#f97316", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                  <PlusCircle size={14} /> ADD PROJECT
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {projects.map((proj) => (
                <div key={proj.id} style={{ position: "relative" }}>
                  {isEditable && (
                    <button onClick={() => onUpdate?.("projects.remove", proj.id)} style={{ position: "absolute", left: "-20px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                  )}
                  {isEditable ? (
                    <div>
                      <input value={proj.name} placeholder="Project Name" onChange={(e) => onUpdate?.(`projects.${proj.id}.name`, e.target.value)} style={{ fontWeight: 800, fontSize: "12px", width: "100%", background: "transparent", border: "1px dashed #cbd5e1" }} />
                      <input value={proj.link} placeholder="Link" onChange={(e) => onUpdate?.(`projects.${proj.id}.link`, e.target.value)} style={{ fontSize: "9px", width: "100%", background: "transparent", border: "1px dashed #cbd5e1", color: "#f97316" }} />
                      <div style={{ marginLeft: "16px", marginTop: "4px" }}>
                        <textarea value={proj.description} placeholder="Description..." onChange={(e) => onUpdate?.(`projects.${proj.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "11px", background: "transparent", border: "1px dashed #cbd5e1", outline: "none", fontFamily: "inherit" }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontWeight: 800, fontSize: "12px", color: "#0f172a" }}>{proj.name}</span>
                        {proj.link && (
                          <a href={formatUrl(proj.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "9px", color: "#f97316", textDecoration: "none" }}>
                            {proj.link}
                          </a>
                        )}
                      </div>
                      {proj.description && (
                        <MarkdownText content={proj.description} style={{ fontSize: "11px", color: "#334155", lineHeight: 1.6, marginTop: "2px", marginLeft: "16px" }} />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Volunteering + Languages Side by Side (50/50) */}
        <div style={{ display: "flex", gap: "36px", marginTop: "26px" }}>
          {(volunteering && volunteering.length > 0 || isEditable) && (
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                 <HeavyHeading label="Volunteering" />
                 {isEditable && (
                   <button onClick={() => onUpdate?.("volunteering.add", {})} style={{ background: "none", border: "none", color: "#f97316", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                    <PlusCircle size={14} /> ADD VOLUNTEERING
                  </button>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {(volunteering || []).map((vol) => (
                  <div key={vol.id} style={{ position: "relative" }}>
                     {isEditable && (
                      <button onClick={() => onUpdate?.("volunteering.remove", vol.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <div>
                        {isEditable ? (
                           <div style={{ display: "flex", gap: "4px" }}>
                              <input value={vol.role} placeholder="Role" onChange={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)} style={{ fontWeight: 800, fontSize: "14px", background: "transparent", border: "1px dashed #cbd5e1", outline: "none" }} />
                              <span style={{ color: "#64748b", fontSize: "12px" }}>at</span>
                              <input value={vol.organization} placeholder="Organization" onChange={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)} style={{ color: "#64748b", fontSize: "12px", background: "transparent", border: "1px dashed #cbd5e1", outline: "none" }} />
                           </div>
                        ) : (
                          <>
                            <span style={{ fontWeight: 800, fontSize: "14px", color: "#0f172a" }}>{vol.role}</span>
                            <span style={{ color: "#64748b", fontSize: "12px", marginLeft: "8px" }}>at {vol.organization}</span>
                          </>
                        )}
                      </div>
                      <div style={{ marginLeft: "16px" }}>
                        {isEditable ? (
                          <DurationPicker fontSize="9px" value={vol.duration} onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} />
                        ) : (
                          <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff", background: "#f97316", padding: "3px 10px", borderRadius: "3px" }}>{vol.duration}</span>
                        )}
                      </div>
                    </div>
                    {isEditable ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                        <SearchableSelect
                          value={vol.country || "Country"}
                          options={countriesData.map(c => c.name)}
                          onSelect={(val) => onUpdate?.(`volunteering.${vol.id}.country`, val)}
                          width="100px"
                        />
                        <SearchableSelect
                          value={vol.county || "State"}
                          options={vol.country ? (countriesData.find((c: any) => c.name === vol.country)?.states || []).map((s: any) => s.name) : []}
                          onSelect={(val) => onUpdate?.(`volunteering.${vol.id}.county`, val)}
                          width="100px"
                        />
                        <input
                          value={vol.location}
                          placeholder="City"
                          onChange={(e) => onUpdate?.(`volunteering.${vol.id}.location`, e.target.value)}
                          style={{ fontSize: "11px", color: "#64748b", background: "transparent", border: "1px dashed #cbd5e1", outline: "none", padding: "2px 4px", width: "90px" }}
                        />
                      </div>
                    ) : (vol.location || vol.county || vol.country) && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px", fontSize: "11px", color: "#64748b" }}>
                        <MapPin size={10} />
                        <span>{[vol.location, vol.county, vol.country].filter(Boolean).join(", ")}</span>
                      </div>
                    )}
                    {isEditable ? (
                      <div style={{ marginLeft: "16px", marginTop: "4px" }}>
                        <textarea value={vol.description} placeholder="Description..." onChange={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "12px", background: "transparent", border: "1px dashed #cbd5e1", outline: "none", fontFamily: "inherit", resize: "vertical" }} />
                      </div>
                    ) : (
                      <MarkdownText content={vol.description} style={{ fontSize: "12px", color: "#334155", lineHeight: 1.6, marginLeft: "16px" }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(languages && languages.length > 0 || isEditable) && (
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <HeavyHeading label="Languages" />
                {isEditable && (
                   <button onClick={() => onUpdate?.("languages.add", { name: "New Language", proficiency: "Native" })} style={{ background: "none", border: "none", color: "#f97316", cursor: "pointer" }}><PlusCircle size={14} /></button>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {(languages || []).map((lang, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {isEditable && (
                        <button onClick={() => onUpdate?.("languages.remove", i)} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                      )}
                      {isEditable ? (
                        <input 
                          value={lang.name} 
                          placeholder="Language"
                          onChange={(e) => onUpdate?.(`languages.${i}.name`, e.target.value)} 
                          style={{ fontWeight: 800, background: "transparent", border: "1px dashed #cbd5e1", width: "100px", color: "#0f172a", outline: "none", padding: "1px 4px" }} 
                        />
                      ) : (
                        <span style={{ fontWeight: 800, color: "#0f172a" }}>{lang.name}</span>
                      )}
                    </div>
                    {isEditable ? (
                      <PopSelect 
                        value={lang.proficiency || "Level"}
                        options={["Native", "Fluent", "Professional", "Intermediate", "Basic"]}
                        onSelect={(val) => onUpdate?.(`languages.${i}.proficiency`, val)}
                      />
                    ) : (
                      <span style={{ color: "#64748b", fontStyle: "italic" }}>({lang.proficiency})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  )
}

function DetailRow({ label, value, onUpdate, isEditable }: { label: string, value?: string, onUpdate?: (val: string) => void, isEditable: boolean }) {
  if (!isEditable && !value) return null
  return (
    <div style={{ fontSize: "12px", display: "flex", gap: "8px" }}>
      <span style={{ fontWeight: 800, minWidth: "90px", color: "#0f172a" }}>{label}:</span>
      {isEditable ? (
        <input 
          defaultValue={value}
          onBlur={(e) => onUpdate?.(e.target.value)}
          style={{ background: "transparent", border: "1px dashed #cbd5e1", fontSize: "12px", color: "#334155", padding: "0 4px", outline: "none", width: "100%", fontFamily: "inherit" }}
        />
      ) : (
        <span style={{ color: "#334155" }}>{value}</span>
      )}
    </div>
  )
}

function HeavyHeading({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <h3
        style={{
          fontSize: "14px",
          fontWeight: 900,
          color: "#0f172a",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "4px",
        }}
      >
        {label}
      </h3>
      <div style={{ height: "3px", background: "#f97316", width: "40px", borderRadius: "2px" }} />
    </div>
  )
}

function ContactItem({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) {
  const inner = (
    <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</span>
      <span style={{ color: href ? "#93c5fd" : "#94a3b8", textDecoration: "none" }}>{text}</span>
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

function PopSelect({ value, options, onSelect, color }: { value: string; options: string[]; onSelect: (val: string) => void, color?: string }) {
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
          background: "none",
          border: "none",
          borderBottom: "1px dashed #f97316",
          fontSize: "11px",
          color: color || "#64748b",
          cursor: "pointer",
          padding: "1px 2px",
          outline: "none"
        }}
      >
        {value} <ChevronDown size={10} />
      </button>
      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: 0,
          zIndex: 1000,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          padding: "4px",
          maxHeight: "250px",
          overflowY: "auto",
          marginTop: "2px",
          minWidth: "120px"
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
                backgroundColor: value === opt ? "#fff7ed" : "transparent",
                color: value === opt ? "#f97316" : "#374151",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fff7ed")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = value === opt ? "#fff7ed" : "transparent")}
            >
              {opt} {value === opt && <Check size={10} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchableSelect({ value, options, onSelect, width }: { value: string; options: string[]; onSelect: (val: string) => void; width?: string }) {
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
    <div ref={ref} style={{ position: "relative", display: "inline-block", width: width || "110px" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "transparent",
          border: "1px dashed rgba(255,255,255,0.3)",
          color: "#fff",
          fontSize: "10.5px",
          cursor: "pointer",
          padding: "2px 6px",
          outline: "none",
          width: "100%",
          borderRadius: "4px"
        }}
      >
        <span style={{ flex: 1, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
        <ChevronDown size={10} />
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
          marginTop: "4px"
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
                outline: "none",
                color: "#1f2937"
              }}
            />
          </div>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {filtered.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onSelect(opt)
                  setIsOpen(false)
                }}
                style={{
                  padding: "6px 8px",
                  fontSize: "10px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: value === opt ? "#fff7ed" : "transparent",
                  color: value === opt ? "#f97316" : "#374151",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fff7ed")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = value === opt ? "#fff7ed" : "transparent")}
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
