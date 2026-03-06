import { Phone, Mail, Linkedin, MapPin, Globe, Github, Facebook, PlusCircle, Trash2, Sparkles, Loader2, Camera, X, ChevronDown, Check, Search, Hash } from "lucide-react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"
import { DurationPicker } from "../DurationPicker"
import React, { useState, useEffect, useRef } from "react"
import countriesData from "@/lib/countries-data.json"

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

            {/* Personal Details Row */}
            {(hasPersonalDetails || isEditable) && (
              <div style={{ marginTop: "12px" }}>
                <div style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
                  Personal Information
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", rowGap: "8px", columnGap: "12px" }}>
                  {(personalInfo.dateOfBirth || isEditable) && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                      <span style={{ color: "#6b7280", fontWeight: 600 }}>Date of Birth:</span>
                      {isEditable ? (
                        <input 
                          type="date"
                          defaultValue={personalInfo.dateOfBirth}
                          onBlur={(e) => onUpdate?.("personalInfo.dateOfBirth", e.target.value)}
                          style={{ color: "#4b5563", background: "transparent", border: "1px dashed #e5e7eb", padding: "1px 4px", outline: "none", fontSize: "11px" }}
                        />
                      ) : (
                        <span style={{ color: "#4b5563" }}>{personalInfo.dateOfBirth}</span>
                      )}
                    </div>
                  )}
                  {(personalInfo.gender || isEditable) && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                      <span style={{ color: "#6b7280", fontWeight: 600 }}>Gender:</span>
                      {isEditable ? (
                        <PopSelect 
                          value={personalInfo.gender || "Select"}
                          options={["Male", "Female", "Other", "Prefer not to say"]}
                          onSelect={(val) => onUpdate?.("personalInfo.gender", val)}
                        />
                      ) : (
                        <span style={{ color: "#4b5563" }}>{personalInfo.gender}</span>
                      )}
                    </div>
                  )}
                   {(personalInfo.nationality || isEditable) && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                      <span style={{ color: "#6b7280", fontWeight: 600 }}>Nationality:</span>
                      {isEditable ? (
                        <SearchableSelect 
                          value={personalInfo.nationality || "Select"}
                          options={countriesData.map(c => c.name)}
                          onSelect={(val) => onUpdate?.("personalInfo.nationality", val)}
                        />
                      ) : (
                        <span style={{ color: "#4b5563" }}>{personalInfo.nationality}</span>
                      )}
                    </div>
                  )}
                  {(personalInfo.placeOfBirth || isEditable) && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                      <span style={{ color: "#6b7280", fontWeight: 600 }}>Place of Birth:</span>
                      {isEditable ? (
                        <input 
                          defaultValue={personalInfo.placeOfBirth}
                          placeholder="City, Country"
                          onBlur={(e) => onUpdate?.("personalInfo.placeOfBirth", e.target.value)}
                          style={{ color: "#4b5563", background: "transparent", border: "1px dashed #e5e7eb", padding: "1px 4px", outline: "none", fontSize: "11px" }}
                        />
                      ) : (
                        <span style={{ color: "#4b5563" }}>{personalInfo.placeOfBirth}</span>
                      )}
                    </div>
                  )}
                  {(personalInfo.passport || isEditable) && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                      <span style={{ color: "#6b7280", fontWeight: 600 }}>Passport:</span>
                      {isEditable ? (
                        <input 
                          defaultValue={personalInfo.passport}
                          placeholder="No."
                          onBlur={(e) => onUpdate?.("personalInfo.passport", e.target.value)}
                          style={{ color: "#4b5563", background: "transparent", border: "1px dashed #e5e7eb", padding: "1px 4px", outline: "none", fontSize: "11px", width: "80px" }}
                        />
                      ) : (
                        <span style={{ color: "#4b5563" }}>{personalInfo.passport}</span>
                      )}
                    </div>
                  )}
                  {(personalInfo.workPermit || isEditable) && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                      <span style={{ color: "#6b7280", fontWeight: 600 }}>Work Permit:</span>
                      {isEditable ? (
                        <input 
                          defaultValue={personalInfo.workPermit}
                          placeholder="Visa Type"
                          onBlur={(e) => onUpdate?.("personalInfo.workPermit", e.target.value)}
                          style={{ color: "#4b5563", background: "transparent", border: "1px dashed #e5e7eb", padding: "1px 4px", outline: "none", fontSize: "11px", width: "100px" }}
                        />
                      ) : (
                        <span style={{ color: "#4b5563" }}>{personalInfo.workPermit}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div
          style={{
            paddingTop: "12px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <div style={{ fontSize: "9px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
            Contact Information
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              rowGap: "8px",
              columnGap: "16px",
              fontSize: "10.5px",
              color: "#6b7280",
            }}
          >
            {isEditable ? (
               <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", width: "100%", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ color: "#6b7280", fontWeight: 600 }}>Email:</span>
                    <input defaultValue={personalInfo.email || ""} placeholder="Email" onBlur={(e) => onUpdate?.("personalInfo.email", e.target.value)} style={{ background: "transparent", border: "1px dashed #e5e7eb", fontSize: "10.5px", width: "150px" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ color: "#6b7280", fontWeight: 600 }}>Phone:</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                      <PopSelect 
                        value={personalInfo.phoneCode || "+1"} 
                        options={countriesData.map(c => c.phonecode)}
                        onSelect={(val) => onUpdate?.("personalInfo.phoneCode", val)}
                      />
                      <input defaultValue={personalInfo.phone || ""} placeholder="Phone" onBlur={(e) => onUpdate?.("personalInfo.phone", e.target.value)} style={{ background: "transparent", border: "1px dashed #e5e7eb", fontSize: "10.5px", width: "100px" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#6b7280", fontWeight: 600 }}>Country:</span>
                      <SearchableSelect
                        value={personalInfo.country || "Country"}
                        options={countriesData.map(c => c.name)}
                        onSelect={(val) => {
                          onUpdate?.("personalInfo.country", val)
                          onUpdate?.("personalInfo.county", "")
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#6b7280", fontWeight: 600 }}>State:</span>
                      <SearchableSelect
                        value={personalInfo.county || "State"}
                        options={personalInfo.country ? (countriesData.find((c: any) => c.name === personalInfo.country)?.states || []).map((s: any) => s.name) : []}
                        onSelect={(val) => onUpdate?.("personalInfo.county", val)}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#6b7280", fontWeight: 600 }}>City:</span>
                      <input defaultValue={personalInfo.location || ""} placeholder="City" onBlur={(e) => onUpdate?.("personalInfo.location", e.target.value)} style={{ background: "transparent", border: "1px dashed #e5e7eb", fontSize: "10.5px", width: "80px" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#6b7280", fontWeight: 600 }}>LinkedIn:</span>
                      <input defaultValue={personalInfo.linkedin || ""} placeholder="LinkedIn" onBlur={(e) => onUpdate?.("personalInfo.linkedin", e.target.value)} style={{ background: "transparent", border: "1px dashed #e5e7eb", fontSize: "10.5px", width: "120px" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#6b7280", fontWeight: 600 }}>Website:</span>
                      <input defaultValue={personalInfo.website || ""} placeholder="Website" onBlur={(e) => onUpdate?.("personalInfo.website", e.target.value)} style={{ background: "transparent", border: "1px dashed #e5e7eb", fontSize: "10.5px", width: "120px" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#6b7280", fontWeight: 600 }}>GitHub:</span>
                      <input defaultValue={personalInfo.github || ""} placeholder="GitHub" onBlur={(e) => onUpdate?.("personalInfo.github", e.target.value)} style={{ background: "transparent", border: "1px dashed #e5e7eb", fontSize: "10.5px", width: "120px" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#6b7280", fontWeight: 600 }}>Facebook:</span>
                      <input defaultValue={personalInfo.facebook || ""} placeholder="Facebook" onBlur={(e) => onUpdate?.("personalInfo.facebook", e.target.value)} style={{ background: "transparent", border: "1px dashed #e5e7eb", fontSize: "10.5px", width: "120px" }} />
                    </div>
                  </div>
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
                <PlusCircle size={14} /> ADD EXPERIENCE
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
                       <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input defaultValue={exp.role} placeholder="Role" onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)} style={{ fontSize: "14px", fontWeight: 500, color: "#1a1a1a", background: "transparent", border: "1px dashed #e5e7eb", outline: "none" }} />
                            <span style={{ color: "#9ca3af", fontSize: "13px", fontWeight: 300 }}>at</span>
                            <input defaultValue={exp.company} placeholder="Company" onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)} style={{ color: "#9ca3af", fontSize: "13px", background: "transparent", border: "1px dashed #e5e7eb", outline: "none", fontWeight: 300 }} />
                          </div>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <SearchableSelect
                              value={exp.country || "Country"}
                              options={countriesData.map(c => c.name)}
                              onSelect={(val) => {
                                onUpdate?.(`experience.${exp.id}.country`, val)
                                onUpdate?.(`experience.${exp.id}.county`, "")
                              }}
                              width="100px"
                            />
                            <SearchableSelect
                              value={exp.county || "State"}
                              options={exp.country ? (countriesData.find((c: any) => c.name === exp.country)?.states || []).map((s: any) => s.name) : []}
                              onSelect={(val) => onUpdate?.(`experience.${exp.id}.county`, val)}
                              width="100px"
                            />
                            <input 
                              defaultValue={exp.location || ""} 
                              placeholder="City" 
                              onBlur={(e) => onUpdate?.(`experience.${exp.id}.location`, e.target.value)} 
                              style={{ background: "transparent", border: "1px dashed #e5e7eb", fontSize: "11px", width: "80px", color: "#6b7280" }} 
                            />
                          </div>
                       </div>
                    ) : (
                      <>
                        <span style={{ fontSize: "14px", fontWeight: 500, color: "#1a1a1a" }}>{exp.role}</span>
                        <span style={{ color: "#9ca3af", fontSize: "13px", marginLeft: "10px", fontWeight: 300 }}>{exp.company}</span>
                        {(exp.location || exp.county || exp.country) && (
                          <span style={{ color: "#9ca3af", fontSize: "11px", marginLeft: "8px", fontWeight: 300 }}>
                            • {[exp.location, exp.county, exp.country].filter(Boolean).join(", ")}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {isEditable ? (
                    <DurationPicker value={exp.duration} onChange={(val) => onUpdate?.(`experience.${exp.id}.duration`, val)} />
                  ) : (
                    <span style={{ fontSize: "11px", color: "#10b981", fontWeight: 500, whiteSpace: "nowrap" }}>{exp.duration}</span>
                  )}
                </div>
                {(exp.workDescription || isEditable) && (
                  <div style={{ marginBottom: "8px" }}>
                    {isEditable && (
                      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "4px" }}>
                        <button 
                          onClick={() => onRefine?.("experience", exp.id)}
                          disabled={refiningId === exp.id}
                          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#10b981" }}
                        >
                          {refiningId === exp.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI REFINE
                        </button>
                      </div>
                    )}
                    {isEditable ? (
                      <textarea
                        defaultValue={exp.workDescription}
                        placeholder="Role summary..."
                        onBlur={(e) => onUpdate?.(`experience.${exp.id}.workDescription`, e.target.value)}
                        style={{ width: "100%", fontSize: "12px", color: "#4b5563", lineHeight: 1.6, background: "transparent", border: "1px dashed #e5e7eb", outline: "none", fontFamily: "inherit", fontWeight: 300, resize: "vertical", minHeight: "40px" }}
                      />
                    ) : (
                      <MarkdownText
                        content={exp.workDescription || ""}
                        style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.6, fontWeight: 300 }}
                      />
                    )}
                  </div>
                )}
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
               <button onClick={() => onUpdate?.("skills.add", "New Category")} style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                <PlusCircle size={14} /> ADD SKILL
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {isEditable ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                  {skills.map((skill, i) => (
                    <div key={i} style={{ padding: "8px", border: "1px dashed #e5e7eb", borderRadius: "6px" }}>
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <input defaultValue={skill.category} onBlur={(e) => onUpdate?.(`skills.${i}.category`, e.target.value)} style={{ fontWeight: 500, fontSize: "12px", background: "transparent", border: "none", outline: "none", color: "#1a1a1a" }} placeholder="Skill Category" />
                          <button onClick={() => onUpdate?.("skills.remove", i)} style={{ color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                       </div>
                       <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {(skill.items || []).map((item, idx) => (
                             <div key={idx} style={{ display: "flex", alignItems: "center", gap: "2px", background: "#f9fafb", padding: "1px 6px", border: "1px solid #e5e7eb", borderRadius: "4px" }}>
                                <input
                                  defaultValue={item}
                                  placeholder="Skill"
                                  onBlur={(e) => {
                                    const newItems = [...skill.items]
                                    newItems[idx] = e.target.value
                                    onUpdate?.(`skills.${i}.items`, newItems)
                                  }}
                                  style={{ fontSize: "11px", background: "transparent", border: "none", outline: "none", width: "70px" }}
                                />
                                <button 
                                  onClick={() => {
                                    const newItems = skill.items.filter((_, index) => index !== idx)
                                    onUpdate?.(`skills.${i}.items`, newItems)
                                  }}
                                  style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
                                >
                                  <X size={10} />
                                </button>
                             </div>
                          ))}
                          <button 
                            onClick={() => onUpdate?.(`skills.${i}.items`, [...(skill.items || []), ""])}
                            style={{ fontSize: "10px", color: "#10b981", background: "none", border: "1px dashed #10b981", borderRadius: "4px", padding: "1px 6px", cursor: "pointer" }}
                          >
                            + Add
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
               <button onClick={() => onUpdate?.("education.add", {})} style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    {isEditable ? (
                       <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input defaultValue={edu.degree} placeholder="Degree" onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)} style={{ fontWeight: 500, fontSize: "12.5px", color: "#1a1a1a", background: "transparent", border: "1px dashed #e5e7eb", outline: "none" }} />
                            <span style={{ color: "#9ca3af", fontSize: "12px", fontWeight: 300 }}>at</span>
                            <input defaultValue={edu.school} placeholder="School" onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)} style={{ color: "#9ca3af", fontSize: "12px", background: "transparent", border: "1px dashed #e5e7eb", outline: "none", fontWeight: 300 }} />
                          </div>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input defaultValue={edu.fieldOfStudy} placeholder="Field of Study" onBlur={(e) => onUpdate?.(`education.${edu.id}.fieldOfStudy`, e.target.value)} style={{ fontSize: "11px", color: "#6b7280", background: "transparent", border: "1px dashed #e5e7eb", outline: "none", width: "150px" }} />
                            <input defaultValue={edu.grade} placeholder="Grade/GPA" onBlur={(e) => onUpdate?.(`education.${edu.id}.grade`, e.target.value)} style={{ fontSize: "11px", color: "#6b7280", background: "transparent", border: "1px dashed #e5e7eb", outline: "none", width: "80px" }} />
                          </div>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <SearchableSelect
                              value={edu.country || "Country"}
                              options={countriesData.map(c => c.name)}
                              onSelect={(val) => {
                                onUpdate?.(`education.${edu.id}.country`, val)
                                onUpdate?.(`education.${edu.id}.county`, "")
                              }}
                              width="100px"
                            />
                            <SearchableSelect
                              value={edu.county || "State"}
                              options={edu.country ? (countriesData.find((c: any) => c.name === edu.country)?.states || []).map((s: any) => s.name) : []}
                              onSelect={(val) => onUpdate?.(`education.${edu.id}.county`, val)}
                              width="100px"
                            />
                            <input 
                              defaultValue={edu.location || ""} 
                              placeholder="City" 
                              onBlur={(e) => onUpdate?.(`education.${edu.id}.location`, e.target.value)} 
                              style={{ background: "transparent", border: "1px dashed #e5e7eb", fontSize: "11px", width: "80px", color: "#6b7280" }} 
                            />
                          </div>
                       </div>
                    ) : (
                      <>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                          <span style={{ fontWeight: 500, fontSize: "12.5px", color: "#1a1a1a" }}>{edu.degree}</span>
                          <span style={{ color: "#9ca3af", fontSize: "12px", fontWeight: 300 }}>{edu.school}</span>
                        </div>
                        <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
                          {[edu.fieldOfStudy, edu.grade].filter(Boolean).join(" • ")}
                        </div>
                        {(edu.location || edu.county || edu.country) && (
                          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "1px", fontWeight: 300 }}>
                            {[edu.location, edu.county, edu.country].filter(Boolean).join(", ")}
                          </div>
                        )}
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
               <button onClick={() => onUpdate?.("projects.add", {})} style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                <PlusCircle size={14} /> ADD PROJECT
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {projects.map((proj) => (
              <div key={proj.id} style={{ position: "relative" }}>
                 {isEditable && (
                  <button onClick={() => onUpdate?.("projects.remove", proj.id)} style={{ position: "absolute", left: "-20px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                   <div>
                    {isEditable ? (
                       <div style={{ display: "flex", gap: "8px" }}>
                          <input defaultValue={proj.name} placeholder="Project Name" onBlur={(e) => onUpdate?.(`projects.${proj.id}.name`, e.target.value)} style={{ fontWeight: 500, fontSize: "13px", color: "#1a1a1a", background: "transparent", border: "1px dashed #e5e7eb", outline: "none" }} />
                          <input defaultValue={proj.link} placeholder="Link" onBlur={(e) => onUpdate?.(`projects.${proj.id}.link`, e.target.value)} style={{ color: "#10b981", fontSize: "10px", background: "transparent", border: "1px dashed #e5e7eb", outline: "none" }} />
                       </div>
                    ) : (
                      <>
                        <span style={{ fontWeight: 500, fontSize: "13px", color: "#1a1a1a" }}>{proj.name}</span>
                        {proj.link && (
                          <a href={formatUrl(proj.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "10px", color: "#10b981", textDecoration: "none", marginLeft: "10px" }}>
                            {proj.link}
                          </a>
                        )}
                      </>
                    )}
                   </div>
                </div>
                {!isEditable && proj.description && (
                  <div style={{ marginLeft: "16px", marginTop: "2px" }}>
                    <MarkdownText content={proj.description} style={{ fontSize: "11.5px", color: "#4b5563", lineHeight: 1.6, fontWeight: 300 }} />
                  </div>
                )}
                {isEditable && (
                  <div style={{ marginLeft: "16px", marginTop: "4px" }}>
                    <textarea defaultValue={proj.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`projects.${proj.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "11.5px", color: "#4b5563", background: "transparent", border: "1px dashed #e5e7eb", outline: "none", fontFamily: "inherit", fontWeight: 300, minHeight: "60px", resize: "vertical" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VOLUNTEERING & LANGUAGES ── */}
      <div style={{ display: "flex", gap: "40px", marginTop: "28px", borderTop: "1px solid #f0f0f0", paddingTop: "28px" }}>
        {/* Volunteering & Languages shared flex 50/50 */}
        <div style={{ flex: 1 }}>
          {(volunteering && volunteering.length > 0 || isEditable) && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <LightHeading label="Volunteering" />
                {isEditable && (
                  <button onClick={() => onUpdate?.("volunteering.add", {})} style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                    <PlusCircle size={14} /> ADD VOLUNTEERING
                  </button>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {(volunteering || []).map((vol) => (
                  <div key={vol.id} style={{ position: "relative" }}>
                    {isEditable && (
                      <button onClick={() => onUpdate?.("volunteering.remove", vol.id)} style={{ position: "absolute", left: "-20px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                       <span style={{ fontSize: "13px", fontWeight: 500, color: "#1a1a1a" }}>{isEditable ? <input defaultValue={vol.role} placeholder="Role" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)} style={{ background: "transparent", border: "1px dashed #e5e7eb", width: "100px" }} /> : vol.role}</span>
                       {isEditable ? <DurationPicker fontSize="9px" value={vol.duration} onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} /> : <span style={{ fontSize: "10px", color: "#10b981" }}>{vol.duration}</span>}
                    </div>
                    {isEditable ? (
                       <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "4px 0" }}>
                          <input defaultValue={vol.organization} placeholder="Organization" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)} style={{ fontSize: "11px", background: "transparent", border: "1px dashed #e5e7eb", color: "#10b981", fontWeight: 500 }} />
                          <SearchableSelect
                            value={vol.country || "Country"}
                            options={countriesData.map(c => c.name)}
                            onSelect={(val) => {
                              onUpdate?.(`volunteering.${vol.id}.country`, val)
                              onUpdate?.(`volunteering.${vol.id}.county`, "")
                            }}
                            width="90px"
                          />
                          <SearchableSelect
                            value={vol.county || "State"}
                            options={vol.country ? (countriesData.find((c: any) => c.name === vol.country)?.states || []).map((s: any) => s.name) : []}
                            onSelect={(val) => onUpdate?.(`volunteering.${vol.id}.county`, val)}
                            width="90px"
                          />
                          <input 
                            defaultValue={vol.location || ""} 
                            placeholder="City" 
                            onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.location`, e.target.value)} 
                            style={{ background: "transparent", border: "1px dashed #e5e7eb", fontSize: "11px", width: "80px", color: "#6b7280" }} 
                          />
                       </div>
                    ) : (
                      <div style={{ fontSize: "11.5px", color: "#10b981", fontWeight: 500, marginBottom: "2px" }}>
                        {vol.organization}
                        {(vol.location || vol.county || vol.country) && (
                          <span style={{ color: "#9ca3af", fontWeight: 300, fontSize: "10.5px", marginLeft: "6px" }}>
                             • {[vol.location, vol.county, vol.country].filter(Boolean).join(", ")}
                          </span>
                        )}
                      </div>
                    )}
                    {isEditable ? (
                      <div style={{ marginLeft: "16px" }}>
                        <textarea defaultValue={vol.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "12px", background: "transparent", border: "1px dashed #e5e7eb", outline: "none", fontFamily: "inherit", fontWeight: 300, minHeight: "40px", resize: "vertical" }} />
                      </div>
                    ) : (
                      <div style={{ marginLeft: "16px" }}>
                        <MarkdownText content={vol.description} style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.5, fontWeight: 300 }} />
                      </div>
                    )}
                     {isEditable && (
                        <button 
                          onClick={() => onRefine?.("volunteering", vol.id)}
                          disabled={refiningId === vol.id || !vol.description}
                          style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "9px", fontWeight: "bold", color: "#10b981", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", marginTop: "4px", opacity: (refiningId === vol.id || !vol.description) ? 0.5 : 1 }}
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

        <div style={{ flex: 1 }}>
          {(languages && languages.length > 0 || isEditable) && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <LightHeading label="Languages" />
                {isEditable && (
                  <button onClick={() => onUpdate?.("languages.add", { name: "New Language", proficiency: "Native" })} style={{ background: "none", border: "none", color: "#10b981", cursor: "pointer" }}><PlusCircle size={14} /></button>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
                       <PopSelect 
                        value={lang.proficiency || "Level"}
                        options={["Native", "Fluent", "Professional", "Intermediate", "Basic"]}
                        onSelect={(val) => onUpdate?.(`languages.${i}.proficiency`, val)}
                      />
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
          borderBottom: "1px dashed #10b981",
          color: "#4b5563",
          fontSize: "11px",
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
                backgroundColor: value === opt ? "#ecfdf5" : "transparent",
                color: value === opt ? "#10b981" : "#374151",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = value === opt ? "#ecfdf5" : "transparent")}
            >
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
    <div ref={ref} style={{ position: "relative", display: "inline-block", minWidth: width }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "none",
          border: "none",
          borderBottom: "1px dashed #10b981",
          color: "#4b5563",
          fontSize: "11px",
          cursor: "pointer",
          padding: "1px 4px",
          outline: "none",
          width: "100%"
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
        <ChevronDown size={10} style={{ flexShrink: 0 }} />
      </button>
      {isOpen && (
        <div style={{
          position: "absolute",
          bottom: "100%",
          left: 0,
          zIndex: 1000,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          padding: "6px",
          minWidth: "180px",
          marginBottom: "4px"
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
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {filtered.slice(0, 50).map((opt) => (
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
                  backgroundColor: value === opt ? "#ecfdf5" : "transparent",
                  color: value === opt ? "#10b981" : "#374151",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = value === opt ? "#ecfdf5" : "transparent")}
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
