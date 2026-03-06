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
               <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", width: "100%", alignItems: "center" }}>
                  <input defaultValue={personalInfo.email || ""} placeholder="Email" onBlur={(e) => onUpdate?.("personalInfo.email", e.target.value)} style={{ background: "transparent", border: "1px dashed #0d9488", fontSize: "10.5px", width: "150px", outline: "none" }} />
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
                    <input defaultValue={personalInfo.phone || ""} placeholder="1234567890" onBlur={(e) => onUpdate?.("personalInfo.phone", e.target.value)} style={{ background: "transparent", border: "1px dashed #0d9488", fontSize: "10.5px", width: "100px", outline: "none", padding: "1px 4px" }} />
                  </div>
                  <SearchableSelect
                    value={personalInfo.country || "Country"}
                    options={countriesData.map(c => c.name)}
                    onSelect={(val) => {
                       onUpdate?.("personalInfo.country", val)
                       onUpdate?.("personalInfo.county", "")
                    }}
                    width="120px"
                  />
                  <SearchableSelect
                    value={personalInfo.county || "State"}
                    options={personalInfo.country ? (countriesData.find((c: any) => c.name === personalInfo.country)?.states || []).map((s: any) => s.name) : []}
                    onSelect={(val) => onUpdate?.("personalInfo.county", val)}
                    width="100px"
                  />
                  <input defaultValue={personalInfo.location || ""} placeholder="City/Zip" onBlur={(e) => onUpdate?.("personalInfo.location", e.target.value)} style={{ background: "transparent", border: "1px dashed #0d9488", fontSize: "10.5px", width: "80px", outline: "none" }} />
                  <input defaultValue={personalInfo.linkedin || ""} placeholder="LinkedIn" onBlur={(e) => onUpdate?.("personalInfo.linkedin", e.target.value)} style={{ background: "transparent", border: "1px dashed #0d9488", fontSize: "10.5px", width: "120px", outline: "none" }} />
                  <input defaultValue={personalInfo.website || ""} placeholder="Portfolio" onBlur={(e) => onUpdate?.("personalInfo.website", e.target.value)} style={{ background: "transparent", border: "1px dashed #0d9488", fontSize: "10.5px", width: "110px", outline: "none" }} />
                  <input defaultValue={personalInfo.github || ""} placeholder="GitHub" onBlur={(e) => onUpdate?.("personalInfo.github", e.target.value)} style={{ background: "transparent", border: "1px dashed #0d9488", fontSize: "10.5px", width: "100px", outline: "none" }} />
                  <input defaultValue={personalInfo.facebook || ""} placeholder="Facebook" onBlur={(e) => onUpdate?.("personalInfo.facebook", e.target.value)} style={{ background: "transparent", border: "1px dashed #0d9488", fontSize: "10.5px", width: "100px", outline: "none" }} />
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

          {/* Personal Details Row */}
          {(hasPersonalDetails || isEditable) && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "14px",
                marginTop: "12px",
                fontSize: "10.5px",
                color: "#6b7280",
                paddingTop: "12px",
                borderTop: "1px solid rgba(13, 148, 136, 0.1)"
              }}
            >
              {(personalInfo.dateOfBirth || isEditable) && (
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "#111827" }}>DOB:</span>
                  {isEditable ? (
                    <input 
                      type="date"
                      defaultValue={personalInfo.dateOfBirth}
                      onBlur={(e) => onUpdate?.("personalInfo.dateOfBirth", e.target.value)}
                      style={{ background: "transparent", border: "1px dashed #0d9488", fontSize: "10.5px", outline: "none", color: "#6b7280" }}
                    />
                  ) : <span>{personalInfo.dateOfBirth}</span>}
                </div>
              )}
              {(personalInfo.nationality || isEditable) && (
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "#111827" }}>Nationality:</span>
                  {isEditable ? (
                    <SearchableSelect
                      value={personalInfo.nationality || "Select"}
                      options={countriesData.map(c => c.name)}
                      onSelect={(val) => onUpdate?.("personalInfo.nationality", val)}
                      width="80px"
                    />
                  ) : <span>{personalInfo.nationality}</span>}
                </div>
              )}
              {(personalInfo.gender || isEditable) && (
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "#111827" }}>Gender:</span>
                  {isEditable ? (
                    <PopSelect
                      value={personalInfo.gender || "Select"}
                      options={["Male", "Female", "Other", "Prefer not to say"]}
                      onSelect={(val) => onUpdate?.("personalInfo.gender", val)}
                    />
                  ) : <span>{personalInfo.gender}</span>}
                </div>
              )}
              {(personalInfo.placeOfBirth || isEditable) && (
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "#111827" }}>Birth Place:</span>
                  {isEditable ? (
                    <input 
                      placeholder="City, Country"
                      defaultValue={personalInfo.placeOfBirth}
                      onBlur={(e) => onUpdate?.("personalInfo.placeOfBirth", e.target.value)}
                      style={{ background: "transparent", border: "1px dashed #0d9488", fontSize: "10.5px", outline: "none", color: "#6b7280", width: "80px" }}
                    />
                  ) : <span>{personalInfo.placeOfBirth}</span>}
                </div>
              )}
              {(personalInfo.passport || isEditable) && (
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "#111827" }}>Passport:</span>
                  {isEditable ? (
                    <input 
                      placeholder="Passport"
                      defaultValue={personalInfo.passport}
                      onBlur={(e) => onUpdate?.("personalInfo.passport", e.target.value)}
                      style={{ background: "transparent", border: "1px dashed #0d9488", fontSize: "10.5px", outline: "none", color: "#6b7280", width: "80px" }}
                    />
                  ) : <span>{personalInfo.passport}</span>}
                </div>
              )}
               {(personalInfo.workPermit || isEditable) && (
                <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "#111827" }}>Work Permit:</span>
                  {isEditable ? (
                    <input 
                      placeholder="Work Permit"
                      defaultValue={personalInfo.workPermit}
                      onBlur={(e) => onUpdate?.("personalInfo.workPermit", e.target.value)}
                      style={{ background: "transparent", border: "1px dashed #0d9488", fontSize: "10.5px", outline: "none", color: "#6b7280", width: "80px" }}
                    />
                  ) : <span>{personalInfo.workPermit}</span>}
                </div>
              )}
            </div>
          )}
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

          {/* Education */}
          {(education.length > 0 || isEditable) && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <TealHeading label="Education" />
                {isEditable && (
                  <button onClick={() => onUpdate?.("education.add", {})} style={{ background: "none", border: "none", color: "#0d9488", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "bold" }}>
                    <PlusCircle size={14} /> ADD EDUCATION
                  </button>
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
                        <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                          <input defaultValue={edu.fieldOfStudy} placeholder="Field of Study" onBlur={(e) => onUpdate?.(`education.${edu.id}.fieldOfStudy`, e.target.value)} style={{ fontSize: "11px", flex: 1, background: "transparent", border: "1px dashed #d1d5db" }} />
                          <input defaultValue={edu.grade} placeholder="Grade" onBlur={(e) => onUpdate?.(`education.${edu.id}.grade`, e.target.value)} style={{ fontSize: "11px", width: "60px", background: "transparent", border: "1px dashed #d1d5db" }} />
                        </div>
                        <input defaultValue={edu.school} placeholder="School" onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)} style={{ fontSize: "11px", width: "100%", background: "transparent", border: "1px dashed #d1d5db", marginBottom: "4px" }} />
                        <div style={{ display: "flex", gap: "4px", margin: "4px 0" }}>
                          <SearchableSelect
                            value={edu.country || "Country"}
                            options={countriesData.map(c => c.name)}
                            onSelect={(val) => onUpdate?.(`education.${edu.id}.country`, val)}
                            width="100px"
                          />
                          <SearchableSelect
                            value={edu.location || "State"}
                            options={edu.country ? (countriesData.find((c: any) => c.name === edu.country)?.states || []).map((s: any) => s.name) : []}
                            onSelect={(val) => onUpdate?.(`education.${edu.id}.location`, val)}
                            width="100px"
                          />
                        </div>
                        <DurationPicker value={edu.duration} onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} />
                      </div>
                    ) : (
                      <>
                        <p style={{ fontWeight: 700, fontSize: "12px", color: "#111827", marginBottom: "1px" }}>{edu.degree}</p>
                        {edu.fieldOfStudy && <p style={{ fontSize: "11.5px", color: "#374151" }}>{edu.fieldOfStudy} {edu.grade && <span style={{ color: "#6b7280" }}>• Grade: {edu.grade}</span>}</p>}
                        <p style={{ fontSize: "11px", color: "#6b7280" }}>{edu.school}</p>
                        {(edu.location || edu.country) && (
                          <p style={{ fontSize: "10px", color: "#6b7280" }}>
                             {[edu.location, edu.country].filter(Boolean).join(", ")}
                          </p>
                        )}
                        {edu.duration && <p style={{ fontSize: "10.5px", color: "#0d9488", fontWeight: 600 }}>{edu.duration}</p>}
                      </>
                    )}
                  </div>
                ))}
              </div>
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
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "6px", alignItems: "center" }}>
                          <input defaultValue={exp.company} placeholder="Company" onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)} style={{ fontSize: "11.5px", color: "#0d9488", fontWeight: 600, background: "transparent", border: "1px dashed #d1d5db", outline: "none", width: "120px" }} />
                          <SearchableSelect
                            value={exp.country || "Country"}
                            options={countriesData.map(c => c.name)}
                            onSelect={(val) => onUpdate?.(`experience.${exp.id}.country`, val)}
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
                        <div style={{ fontSize: "11.5px", color: "#0d9488", fontWeight: 600, marginBottom: "6px", display: "flex", gap: "6px" }}>
                          <span>{exp.company}</span>
                          {(exp.location || exp.country) && (
                            <span style={{ color: "#6b7280", fontWeight: 400 }}>
                              • {[exp.location, exp.country].filter(Boolean).join(", ")}
                            </span>
                          )}
                        </div>
                      )}
                      {isEditable ? (
                        <div style={{ marginTop: "4px" }}>
                          {(Array.isArray(exp.description) ? exp.description : []).map((bullet, i) => (
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
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <button onClick={() => onUpdate?.(`experience.${exp.id}.description`, [...(Array.isArray(exp.description) ? exp.description : []), ""])} style={{ fontSize: "10px", fontWeight: "bold", background: "none", border: "none", cursor: "pointer", color: "#0d9488" }}>+ ADD BULLET</button>
                            <button
                              onClick={() => onRefine?.("experience", exp.id)}
                              disabled={refiningId === exp.id || !exp.description}
                              style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#0d9488", background: "rgba(13, 148, 136, 0.05)", border: "1px solid rgba(13, 148, 136, 0.2)", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", opacity: (refiningId === exp.id || !exp.description) ? 0.5 : 1 }}
                            >
                              {refiningId === exp.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                              AI REFINE
                            </button>
                          </div>
                        </div>
                      ) : (
                        <ul style={{ paddingLeft: "16px", margin: 0, listStyleType: "disc" }}>
                          {(Array.isArray(exp.description) ? exp.description : []).filter(Boolean).map((bullet, i) => (
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

          {/* Core Competencies + Volunteering */}
          <div style={{ display: "flex", gap: "32px", marginBottom: "24px" }}>
            {/* Skills (Core Competencies) */}
            {(skills.length > 0 || isEditable) && (
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <TealHeading label="Core Competencies" />
                </div>
                <div style={{ 
                  display: "flex", 
                  flexWrap: "wrap", 
                  gap: "8px 12px", 
                  padding: "10px", 
                  border: "1px solid #e5e7eb",
                  minHeight: "40px",
                  alignItems: "center"
                }}>
                  {(Array.isArray(skills) ? skills.flatMap((s: any) => typeof s === 'string' ? [s] : (s.items || [])) : []).map((skill, idx, all) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      {isEditable ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "2px", background: "#f0fdfa", padding: "2px 6px", border: "1px dashed #0d9488", borderRadius: "4px" }}>
                          <input
                            defaultValue={skill}
                            placeholder="Add skill"
                            onBlur={(e) => {
                              const items = Array.isArray(skills) ? skills.flatMap((s: any) => typeof s === 'string' ? [s] : (s.items || [])) : []
                              const newSkills = [...items]
                              newSkills[idx] = e.target.value
                              onUpdate?.("skills", [{ category: "Skills", items: newSkills }])
                            }}
                            style={{ fontSize: "11px", background: "transparent", border: "none", outline: "none", width: "80px", color: "#0d9488" }}
                          />
                          <button 
                            onClick={() => {
                              const items = Array.isArray(skills) ? skills.flatMap((s: any) => typeof s === 'string' ? [s] : (s.items || [])) : []
                              const newSkills = items.filter((_, i) => i !== idx)
                              onUpdate?.("skills", [{ category: "Skills", items: newSkills }])
                            }}
                            style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", opacity: 0.6 }}
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>
                          {skill}{idx < all.length - 1 ? " •" : ""}
                        </span>
                      )}
                    </div>
                  ))}
                  {isEditable && (
                    <button 
                      onClick={() => {
                        const items = Array.isArray(skills) ? skills.flatMap((s: any) => typeof s === 'string' ? [s] : (s.items || [])) : []
                        onUpdate?.("skills", [{ category: "Skills", items: [...items, ""] }])
                      }}
                      style={{ background: "none", border: "none", color: "#0d9488", cursor: "pointer", display: "flex", alignItems: "center" }}
                    >
                      <PlusCircle size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {(volunteering && volunteering.length > 0 || isEditable) && (
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <TealHeading label="Volunteering" />
                  {isEditable && (
                     <button onClick={() => onUpdate?.("volunteering.add", {})} style={{ background: "none", border: "none", color: "#0d9488", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                      <PlusCircle size={14} /> ADD VOLUNTEERING
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {(volunteering || []).map((vol) => (
                    <div key={vol.id} style={{ display: "flex", gap: "12px", position: "relative" }}>
                       {isEditable && (
                        <button onClick={() => onUpdate?.("volunteering.remove", vol.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          {isEditable ? (
                            <input defaultValue={vol.role} placeholder="Role" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)} style={{ fontWeight: 700, fontSize: "12px", background: "transparent", border: "1px dashed #d1d5db", outline: "none", color: "#111827" }} />
                          ) : (
                            <span style={{ fontWeight: 700, fontSize: "12px", color: "#111827" }}>{vol.role}</span>
                          )}
                          {isEditable ? (
                            <DurationPicker value={vol.duration} onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} />
                          ) : (
                            <span style={{ fontSize: "10.5px", color: "#6b7280" }}>{vol.duration}</span>
                          )}
                        </div>
                        {isEditable ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "4px", alignItems: "center" }}>
                            <input defaultValue={vol.organization} placeholder="Organization" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)} style={{ fontSize: "11px", color: "#0d9488", fontWeight: 600, background: "transparent", border: "1px dashed #d1d5db", outline: "none", width: "120px" }} />
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
                              defaultValue={vol.location}
                              placeholder="City"
                              onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.location`, e.target.value)}
                              style={{ fontSize: "11px", color: "#6b7280", outline: "none", background: "transparent", border: "1px dashed #d1d5db", padding: "1px 4px", width: "80px" }}
                            />
                          </div>
                        ) : (
                          <div style={{ fontSize: "11px", color: "#0d9488", fontWeight: 600, display: "flex", gap: "6px" }}>
                            <span>{vol.organization}</span>
                            {(vol.location || vol.county || vol.country) && (
                              <span style={{ color: "#6b7280", fontWeight: 400 }}>
                                • {[vol.location, vol.county, vol.country].filter(Boolean).join(", ")}
                              </span>
                            )}
                          </div>
                        )}
                        {isEditable && (
                          <button 
                            onClick={() => onRefine?.("volunteering", vol.id)}
                            disabled={refiningId === vol.id || !vol.description}
                            style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "9px", fontWeight: "bold", color: "#0d9488", background: "rgba(13, 148, 136, 0.05)", border: "1px solid rgba(13, 148, 136, 0.2)", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", marginTop: "2px", opacity: (refiningId === vol.id || !vol.description) ? 0.5 : 1 }}
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
          </div>

          {/* Projects (Alone) */}
          {(projects.length > 0 || isEditable) && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <TealHeading label="Projects" />
                {isEditable && (
                  <button onClick={() => onUpdate?.("projects.add", {})} style={{ background: "none", border: "none", color: "#0d9488", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "bold" }}>
                    <PlusCircle size={14} /> ADD PROJECT
                  </button>
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

          {/* Languages */}
          <div style={{ display: "flex", gap: "32px", marginTop: "24px" }}>
            {(languages && languages.length > 0 || isEditable) && (
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <TealHeading label="Languages" />
                  {isEditable && (
                    <button onClick={() => onUpdate?.("languages.add", { name: "", proficiency: "" })} style={{ background: "none", border: "none", color: "#0d9488", cursor: "pointer" }}><PlusCircle size={14} /></button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {(languages || []).map((lang, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {isEditable && (
                          <button onClick={() => onUpdate?.("languages.remove", i)} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                        )}
                        {isEditable ? (
                          <input 
                            defaultValue={lang.name}
                            placeholder="Language (e.g. English)"
                            onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.target.value)}
                            style={{ 
                              background: "transparent", 
                              border: "1px dashed #0d9488", 
                              fontSize: "12px", 
                              color: "#111827", 
                              padding: "2px 6px", 
                              outline: "none",
                              width: "120px",
                              fontWeight: 700 
                            }}
                          />
                        ) : (
                          <span style={{ fontWeight: 700, color: "#111827" }}>{lang.name}</span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {isEditable ? (
                          <PopSelect 
                            value={lang.proficiency || "Level"}
                            options={["Native", "Fluent", "Professional", "Intermediate", "Basic"]}
                            onSelect={(val) => onUpdate?.(`languages.${i}.proficiency`, val)}
                          />
                        ) : (
                          <span style={{ color: "#6b7280", fontStyle: "italic" }}>({lang.proficiency})</span>
                        )}
                      </div>
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

function SearchableSelect({ value, options, onSelect, width }: { value: string; options: string[]; onSelect: (val: string) => void, width?: string }) {
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
    <div ref={ref} style={{ position: "relative", display: "inline-block", minWidth: width || "120px" }}>
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
