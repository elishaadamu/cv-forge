import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"
import { Phone, Mail, Linkedin, MapPin, Globe, Github, Facebook, PlusCircle, Trash2, Sparkles, Loader2, Camera, X, ChevronDown, Check, Search } from "lucide-react"
import React, { useState, useEffect, useRef } from "react"
import { DurationPicker } from "../DurationPicker"
import countriesData from "@/lib/countries-data.json"

function formatUrl(url: string | undefined) {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url
  }
  if (url.includes("@")) return `mailto:${url}`
  return `https://${url}`
}

export function ExecutiveTwoColumn({ 
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

  // Flatten skills for simple bullet list
  const allSkills = skills.flatMap((s) => s.items)

  return (
    <div
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
        fontSize: "13px",
        color: "#111",
        display: "flex",
        flexDirection: "row",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {/* ── LEFT DARK SIDEBAR ── */}
      <div
        style={{
          width: "260px",
          background: "#1b2a4a",
          color: "#fff",
          padding: "48px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          flexShrink: 0,
          boxSizing: "border-box",
        }}
      >
        {/* Photo */}
        {/* Photo */}
        {(personalInfo.profileImage || isEditable) && (
          <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            {personalInfo.profileImage ? (
              <div
                onClick={isEditable ? onImageClick : undefined}
                style={{
                  position: "relative",
                  width: "120px",
                  height: "140px",
                  border: "3px solid rgba(255,255,255,0.2)",
                  cursor: isEditable ? "pointer" : "default",
                  overflow: "hidden"
                }}
              >
                <img
                  src={personalInfo.profileImage}
                  alt={personalInfo.fullName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {isEditable && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "1"} onMouseLeave={(e) => e.currentTarget.style.opacity = "0"}>
                    <Camera size={24} color="white" />
                  </div>
                )}
              </div>
            ) : isEditable ? (
              <div
                onClick={onImageClick}
                style={{
                  width: "120px",
                  height: "140px",
                  borderRadius: "2px",
                  border: "2px dashed rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.05)"
                }}
              >
                <Camera size={24} color="rgba(255,255,255,0.4)" />
              </div>
            ) : null}
          </div>
        )}

        {/* Name + Title */}
        <div>
          {isEditable ? (
            <input
              defaultValue={personalInfo.fullName}
              placeholder="Your Name"
              onBlur={(e) => onUpdate?.("personalInfo.fullName", e.target.value)}
              style={{
                fontSize: "26px",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.1,
                textTransform: "uppercase",
                letterSpacing: "-0.5px",
                marginBottom: "6px",
                width: "100%",
                background: "transparent",
                border: "1px dashed rgba(255,255,255,0.3)",
                outline: "none",
                fontFamily: "inherit"
              }}
            />
          ) : (
            <h1
              style={{
                fontSize: "26px",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.1,
                textTransform: "uppercase",
                letterSpacing: "-0.5px",
                marginBottom: "6px",
              }}
            >
              {personalInfo.fullName || "Your Name"}
            </h1>
          )}
          {isEditable ? (
            <input
              defaultValue={personalInfo.jobTitle}
              placeholder="Job Title"
              onBlur={(e) => onUpdate?.("personalInfo.jobTitle", e.target.value)}
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "1px",
                width: "100%",
                background: "transparent",
                border: "1px dashed rgba(255,255,255,0.3)",
                outline: "none",
                fontFamily: "inherit"
              }}
            />
          ) : (
            <p
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {personalInfo.jobTitle}
            </p>
          )}
        </div>

        {/* Personal Details */}
        {(hasPersonalDetails || isEditable) && (
          <div>
            <SidebarSection label="Personal Details" />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
              {(personalInfo.dateOfBirth || isEditable) && (
                <SidebarDetail 
                  label="DOB" 
                  value={personalInfo.dateOfBirth} 
                  onUpdate={(val) => onUpdate?.("personalInfo.dateOfBirth", val)} 
                  isEditable={isEditable}
                  type="date"
                />
              )}
              {(personalInfo.placeOfBirth || isEditable) && <SidebarDetail label="Birth Place" value={personalInfo.placeOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.placeOfBirth", val)} isEditable={isEditable} />}
              {(personalInfo.nationality || isEditable) && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", fontSize: "12px" }}>
                  <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.7)", minWidth: "90px" }}>Nationality:</span>
                  {isEditable ? (
                    <SearchableSelect 
                      value={personalInfo.nationality || "Select"} 
                      options={countriesData.map(c => c.name)} 
                      onSelect={(val) => onUpdate?.("personalInfo.nationality", val)} 
                      isDark 
                    />
                  ) : (
                    <span style={{ color: "#fff" }}>{personalInfo.nationality}</span>
                  )}
                </div>
              )}
              {(personalInfo.gender || isEditable) && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", fontSize: "12px" }}>
                  <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.7)", minWidth: "90px" }}>Gender:</span>
                  {isEditable ? (
                    <PopSelect 
                      value={personalInfo.gender || "Select"} 
                      options={["Male", "Female", "Other", "Prefer not to say"]} 
                      onSelect={(val) => onUpdate?.("personalInfo.gender", val)} 
                    />
                  ) : (
                    <span style={{ color: "#fff" }}>{personalInfo.gender}</span>
                  )}
                </div>
              )}
              {(personalInfo.passport || isEditable) && <SidebarDetail label="Passport" value={personalInfo.passport} onUpdate={(val) => onUpdate?.("personalInfo.passport", val)} isEditable={isEditable} />}
              {(personalInfo.workPermit || isEditable) && <SidebarDetail label="Work Permit" value={personalInfo.workPermit} onUpdate={(val) => onUpdate?.("personalInfo.workPermit", val)} isEditable={isEditable} />}
            </div>
          </div>
        )}

        {/* Contact */}
        <div>
          <SidebarSection label="Contact" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            {(personalInfo.phone || isEditable) && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                <span style={{ fontSize: "9.5px", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Phone</span>
                <div style={{ display: "flex", gap: "4px" }}>
                  {isEditable ? (
                    <>
                      <PopSelect 
                        value={personalInfo.phoneCode || "+00"} 
                        options={["+1", "+44", "+234", "+91", "+61", "+81", "+49", "+33"]} 
                        onSelect={(val) => onUpdate?.("personalInfo.phoneCode", val)} 
                      />
                      <input 
                        defaultValue={personalInfo.phone} 
                        onBlur={(e) => onUpdate?.("personalInfo.phone", e.target.value)} 
                        style={{ fontSize: "11px", color: "#fff", background: "transparent", border: "1px dashed rgba(255,255,255,0.3)", outline: "none", width: "100%" }} 
                      />
                    </>
                  ) : (
                    <span style={{ fontSize: "11px", color: "#cbd5e1" }}>{personalInfo.phoneCode} {personalInfo.phone}</span>
                  )}
                </div>
              </div>
            )}
            {(personalInfo.email || isEditable) && (
              <SidebarContact 
                label="Email" 
                value={personalInfo.email || ""} 
                href={isEditable ? undefined : `mailto:${personalInfo.email}`} 
                isEditable={isEditable}
                onUpdate={(val) => onUpdate?.("personalInfo.email", val)}
              />
            )}
            {(personalInfo.linkedin || isEditable) && (
              <SidebarContact 
                label="LinkedIn" 
                value={personalInfo.linkedin?.split('/').pop() || ""} 
                href={isEditable ? undefined : formatUrl(personalInfo.linkedin)} 
                isEditable={isEditable}
                onUpdate={(val) => onUpdate?.("personalInfo.linkedin", val)}
              />
            )}
            {(personalInfo.location || personalInfo.county || personalInfo.country || isEditable) && (
               <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontSize: "9.5px", color: "#60a5fa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Location</span>
                  {isEditable ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                       <SearchableSelect 
                         value={personalInfo.country || "Country"} 
                         options={countriesData.map(c => c.name)} 
                         onSelect={(val) => {
                           onUpdate?.("personalInfo.country", val)
                           onUpdate?.("personalInfo.county", "")
                         }} 
                         isDark 
                       />
                       <SearchableSelect 
                         value={personalInfo.county || "State"} 
                         options={personalInfo.country ? (countriesData.find((c: any) => c.name === personalInfo.country)?.states || []).map((s: any) => s.name) : []} 
                         onSelect={(val) => onUpdate?.("personalInfo.county", val)} 
                         isDark 
                       />
                       <input 
                         defaultValue={personalInfo.location} 
                         placeholder="City" 
                         onBlur={(e) => onUpdate?.("personalInfo.location", e.target.value)} 
                         style={{ fontSize: "11px", color: "#fff", background: "transparent", border: "1px dashed rgba(255,255,255,0.3)", outline: "none", width: "100%" }} 
                       />
                    </div>
                  ) : (
                    <span style={{ fontSize: "11px", color: "#cbd5e1" }}>
                      {[personalInfo.location, personalInfo.county, personalInfo.country].filter(Boolean).join(", ")}
                    </span>
                  )}
               </div>
            )}
            {(personalInfo.website || isEditable) && (
              <SidebarContact 
                label="Website" 
                value={personalInfo.website?.replace(/^https?:\/\//, '') || ""} 
                href={isEditable ? undefined : formatUrl(personalInfo.website)} 
                isEditable={isEditable}
                onUpdate={(val) => onUpdate?.("personalInfo.website", val)}
              />
            )}
            {(personalInfo.github || isEditable) && (
              <SidebarContact 
                label="GitHub" 
                value={personalInfo.github?.split('/').pop() || ""} 
                href={isEditable ? undefined : formatUrl(personalInfo.github)} 
                isEditable={isEditable}
                onUpdate={(val) => onUpdate?.("personalInfo.github", val)}
              />
            )}
            {(personalInfo.facebook || isEditable) && (
              <SidebarContact 
                label="Facebook" 
                value={personalInfo.facebook?.split('/').pop() || ""} 
                href={isEditable ? undefined : formatUrl(personalInfo.facebook)} 
                isEditable={isEditable}
                onUpdate={(val) => onUpdate?.("personalInfo.facebook", val)}
              />
            )}
          </div>
        </div>

        {/* Skills */}
        {(allSkills.length > 0 || isEditable) && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <SidebarSection label="Skills" />
              {isEditable && (
                <button 
                  onClick={() => onUpdate?.("skills.add", "New Skill")}
                  style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer" }}
                >
                  <PlusCircle size={14} />
                </button>
              )}
            </div>
            <ul
              style={{
                marginTop: "10px",
                paddingLeft: "0",
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              {allSkills.map((skill, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: "12px",
                    color: "#cbd5e1",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {isEditable && (
                    <button 
                      onClick={() => {
                         // Logic to remove skill
                      }}
                      style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <X size={10} />
                    </button>
                  )}
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "#60a5fa",
                      flexShrink: 0,
                    }}
                  />
                  {isEditable ? (
                    <input
                      defaultValue={skill}
                      onBlur={(e) => {
                        // Logic to update skill
                      }}
                      style={{ fontSize: "12px", color: "#fff", background: "transparent", border: "1px dashed rgba(255,255,255,0.3)", outline: "none", width: "100%" }}
                    />
                  ) : skill}
                </li>
              ))}
            </ul>
          </div>
        )}


        {/* Languages */}
        {(languages && languages.length > 0 || isEditable) && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <SidebarSection label="Languages" />
              {isEditable && (
                <button 
                  onClick={() => onUpdate?.("languages.add", { name: "New Language", proficiency: "Native" })}
                  style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer" }}
                >
                  <PlusCircle size={14} />
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
              {(languages || []).map((lang, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {isEditable && (
                      <button 
                        onClick={() => onUpdate?.("languages.remove", i)}
                        style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        <X size={12} />
                      </button>
                    )}
                    {isEditable ? (
                      <input 
                        defaultValue={lang.name}
                        onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.target.value)}
                        style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.3)", fontSize: "12px", color: "#fff", padding: "1px 4px", outline: "none", width: "80px" }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600 }}>{lang.name}</span>
                    )}
                  </div>
                  {isEditable ? (
                    <PopSelect 
                      value={lang.proficiency} 
                      options={["Beginner", "Intermediate", "Advanced", "Professional", "Fluent", "Native"]} 
                      onSelect={(val) => onUpdate?.(`languages.${i}.proficiency`, val)} 
                    />
                  ) : (
                    <span style={{ color: "rgba(255,255,255,0.7)", fontStyle: "italic" }}>{lang.proficiency}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT MAIN CONTENT ── */}
      <div style={{ flex: 1, padding: "48px 32px", background: "#fff", boxSizing: "border-box" }}>
        {/* Summary */}
        {(personalInfo.summary || isEditable) && (
          <div style={{ marginBottom: "28px", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <MainHeading label="Summary" />
              {isEditable && (
                <button 
                  onClick={() => onRefine?.("summary")}
                  disabled={refiningId === "summary"}
                  style={{ background: "none", border: "none", color: "#1b2a4a", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 700 }}
                >
                  {refiningId === "summary" ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI REFINE
                </button>
              )}
            </div>
            {isEditable ? (
              <textarea
                defaultValue={personalInfo.summary}
                placeholder="Brief professional summary..."
                onBlur={(e) => onUpdate?.("personalInfo.summary", e.target.value)}
                style={{ width: "100%", minHeight: "100px", fontSize: "12.5px", color: "#374151", lineHeight: 1.75, background: "transparent", border: "1px dashed #1b2a4a", padding: "8px", outline: "none", resize: "vertical", fontFamily: "inherit" }}
              />
            ) : (
              <MarkdownText 
                content={personalInfo.summary}
                style={{
                  fontSize: "12.5px",
                  color: "#374151",
                  lineHeight: 1.75,
                  textAlign: "justify",
                }}
              />
            )}
          </div>
        )}

        {/* Education */}
        {(education.length > 0 || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <MainHeading label="Education" />
              {isEditable && (
                <button onClick={() => onUpdate?.("education.add", {})} style={{ background: "none", border: "none", color: "#1b2a4a", cursor: "pointer" }}><PlusCircle size={14} /></button>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {education.map((edu) => (
                <div key={edu.id} style={{ position: "relative" }}>
                   {isEditable && (
                    <button onClick={() => onUpdate?.("education.remove", edu.id)} style={{ position: "absolute", left: "-28px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={12} /></button>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    {isEditable ? (
                      <input defaultValue={edu.degree} placeholder="Degree" onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)} style={{ fontWeight: 700, fontSize: "13px", color: "#1b2a4a", background: "transparent", border: "1px dashed #1b2a4a", outline: "none", width: "70%" }} />
                    ) : (
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "13px",
                          color: "#1b2a4a",
                        }}
                      >
                        {edu.degree}
                      </span>
                    )}
                    {isEditable ? (
                      <DurationPicker value={edu.duration} onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} />
                    ) : (
                      <span
                        style={{
                          fontSize: "11.5px",
                          color: "#6b7280",
                          whiteSpace: "nowrap",
                          marginLeft: "12px",
                        }}
                      >
                        {edu.duration}
                      </span>
                    )}
                  </div>
                  {isEditable ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
                      <input defaultValue={edu.school} placeholder="School" onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)} style={{ fontSize: "12px", color: "#6b7280", background: "transparent", border: "1px dashed #6b7280", outline: "none", width: "100%" }} />
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input defaultValue={edu.fieldOfStudy} placeholder="Field of Study" onBlur={(e) => onUpdate?.(`education.${edu.id}.fieldOfStudy`, e.target.value)} style={{ fontSize: "12px", background: "transparent", border: "1px dashed #6b7280", outline: "none", width: "60%", fontFamily: "inherit" }} />
                        <input defaultValue={edu.grade} placeholder="Grade" onBlur={(e) => onUpdate?.(`education.${edu.id}.grade`, e.target.value)} style={{ fontSize: "12px", background: "transparent", border: "1px dashed #6b7280", outline: "none", width: "40%", fontFamily: "inherit" }} />
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <SearchableSelect 
                          value={edu.country || "Country"} 
                          options={countriesData.map(c => c.name)} 
                          onSelect={(val) => {
                            onUpdate?.(`education.${edu.id}.country`, val)
                            onUpdate?.(`education.${edu.id}.county`, "")
                          }}
                        />
                        <SearchableSelect 
                          value={edu.county || "State"} 
                          options={edu.country ? (countriesData.find((c: any) => c.name === edu.country)?.states || []).map((s: any) => s.name) : []} 
                          onSelect={(val) => onUpdate?.(`education.${edu.id}.county`, val)} 
                        />
                        <input 
                           defaultValue={edu.location} 
                           placeholder="City" 
                           onBlur={(e) => onUpdate?.(`education.${edu.id}.location`, e.target.value)} 
                           style={{ fontSize: "12px", color: "#6b7280", background: "transparent", border: "1px dashed #6b7280", outline: "none", width: "100px" }} 
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>
                        {edu.school}
                      </p>
                      {edu.fieldOfStudy && (
                        <p style={{ fontSize: "12px", margin: "2px 0 0 0" }}>{edu.fieldOfStudy}{edu.grade ? ` | ${edu.grade}` : ""}</p>
                      )}
                      {(edu.location || edu.county || edu.country) && (
                        <p style={{ fontSize: "11px", color: "#9ca3af", margin: "2px 0 0 0" }}>
                          {[edu.location, edu.county, edu.country].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {(experience.length > 0 || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <MainHeading label="Experience" />
              {isEditable && (
                <button onClick={() => onUpdate?.("experience.add", {})} style={{ background: "none", border: "none", color: "#1b2a4a", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700 }}>
                  <PlusCircle size={14} /> ADD ROLE
                </button>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {experience.map((exp) => (
                <div key={exp.id} style={{ position: "relative" }}>
                  {isEditable && (
                    <button onClick={() => onUpdate?.("experience.remove", exp.id)} style={{ position: "absolute", left: "-28px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "2px",
                    }}
                  >
                    {isEditable ? (
                      <div style={{ display: "flex", gap: "4px", width: "70%" }}>
                        <input defaultValue={exp.company} placeholder="Company" onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)} style={{ fontWeight: 700, fontSize: "13.5px", color: "#1b2a4a", background: "transparent", border: "1px dashed #1b2a4a", outline: "none", width: "45%" }} />
                        <span>|</span>
                        <input defaultValue={exp.role} placeholder="Role" onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)} style={{ fontWeight: 700, fontSize: "13.5px", color: "#1b2a4a", background: "transparent", border: "1px dashed #1b2a4a", outline: "none", width: "45%" }} />
                      </div>
                    ) : (
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "13.5px",
                          color: "#1b2a4a",
                        }}
                      >
                        {exp.company}
                        {exp.role ? ` | ${exp.role}` : ""}
                      </span>
                    )}
                    {isEditable ? (
                      <DurationPicker value={exp.duration} onChange={(val) => onUpdate?.(`experience.${exp.id}.duration`, val)} />
                    ) : (
                      <span
                        style={{
                          fontSize: "11.5px",
                          color: "#6b7280",
                          whiteSpace: "nowrap",
                          marginLeft: "12px",
                        }}
                      >
                        {exp.duration}
                      </span>
                    )}
                  </div>

                  {isEditable ? (
                    <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                      <SearchableSelect 
                        value={exp.country || "Country"} 
                        options={countriesData.map(c => c.name)} 
                        onSelect={(val) => {
                          onUpdate?.(`experience.${exp.id}.country`, val)
                          onUpdate?.(`experience.${exp.id}.county`, "")
                        }}
                      />
                      <SearchableSelect 
                        value={exp.county || "State"} 
                        options={exp.country ? (countriesData.find((c: any) => c.name === exp.country)?.states || []).map((s: any) => s.name) : []} 
                        onSelect={(val) => onUpdate?.(`experience.${exp.id}.county`, val)} 
                      />
                      <input 
                         defaultValue={exp.location} 
                         placeholder="City" 
                         onBlur={(e) => onUpdate?.(`experience.${exp.id}.location`, e.target.value)} 
                         style={{ fontSize: "11px", color: "#6b7280", background: "transparent", border: "1px dashed #6b7280", outline: "none", width: "100px" }} 
                      />
                    </div>
                  ) : (
                    (exp.location || exp.county || exp.country) && (
                      <p style={{ fontSize: "11px", color: "#9ca3af", margin: "2px 0 4px 0" }}>
                        {[exp.location, exp.county, exp.country].filter(Boolean).join(", ")}
                      </p>
                    )
                  )}

                  {isEditable ? (
                    <div style={{ marginTop: "8px" }}>
                        <button 
                          onClick={() => onRefine?.("experience", exp.id)}
                          disabled={refiningId === exp.id || !exp.workDescription}
                          style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 700, color: "#1b2a4a", background: "rgba(27,42,74,0.05)", border: "1px solid rgba(27,42,74,0.2)", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", marginBottom: "4px", opacity: (refiningId === exp.id || !exp.workDescription) ? 0.5 : 1 }}
                        >
                          {refiningId === exp.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                          AI REFINE
                        </button>
                      <textarea 
                        defaultValue={exp.workDescription} 
                        placeholder="Role summary..." 
                        onBlur={(e) => onUpdate?.(`experience.${exp.id}.workDescription`, e.target.value)} 
                        style={{ width: "100%", minHeight: "60px", fontSize: "12px", color: "#374151", lineHeight: 1.6, background: "transparent", border: "1px dashed #1b2a4a", outline: "none", padding: "6px", resize: "vertical", fontFamily: "inherit" }} 
                      />
                    </div>
                  ) : (
                    exp.workDescription && (
                      <MarkdownText content={exp.workDescription} style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6, marginTop: "6px" }} />
                    )
                  )}

                  {isEditable ? (
                    <div style={{ marginTop: "6px" }}>
                       {exp.description.map((bullet, i) => (
                         <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                           <input defaultValue={bullet} placeholder="Achievement..." onBlur={(e) => {
                             const newDesc = [...exp.description]
                             newDesc[i] = e.target.value
                             onUpdate?.(`experience.${exp.id}.description`, newDesc)
                           }} style={{ flex: 1, fontSize: "12px", background: "transparent", border: "1px dashed #1b2a4a", outline: "none" }} />
                           <button onClick={() => {
                             const newDesc = exp.description.filter((_, idx) => idx !== i)
                             onUpdate?.(`experience.${exp.id}.description`, newDesc)
                           }} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                         </div>
                       ))}
                       <button onClick={() => onUpdate?.(`experience.${exp.id}.description`, [...exp.description, ""])} style={{ background: "none", border: "none", color: "#1b2a4a", cursor: "pointer", fontWeight: 700, fontSize: "11px" }}>+ ADD BULLET</button>
                    </div>
                  ) : (
                    <ul
                      style={{
                        paddingLeft: "16px",
                        margin: "6px 0 0",
                        listStyleType: "disc",
                      }}
                    >
                      {exp.description.filter(Boolean).map((bullet, i) => (
                        <li
                          key={i}
                          style={{
                            fontSize: "12px",
                            color: "#374151",
                            lineHeight: 1.65,
                            marginBottom: "3px",
                          }}
                        >
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

        {/* Projects */}
        {(projects.length > 0 || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <MainHeading label="Projects" />
              {isEditable && (
                <button onClick={() => onUpdate?.("projects.add", {})} style={{ background: "none", border: "none", color: "#1b2a4a", cursor: "pointer" }}><PlusCircle size={14} /></button>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {projects.map((proj) => (
                <div key={proj.id} style={{ position: "relative" }}>
                   {isEditable && (
                    <button onClick={() => onUpdate?.("projects.remove", proj.id)} style={{ position: "absolute", left: "-28px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={12} /></button>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    {isEditable ? (
                      <input defaultValue={proj.name} placeholder="Project Name" onBlur={(e) => onUpdate?.(`projects.${proj.id}.name`, e.target.value)} style={{ fontWeight: 700, fontSize: "13px", color: "#1b2a4a", background: "transparent", border: "1px dashed #1b2a4a", outline: "none", width: "70%" }} />
                    ) : (
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "13px",
                          color: "#1b2a4a",
                        }}
                      >
                        {proj.name}
                      </span>
                    )}
                    {isEditable ? (
                      <input defaultValue={proj.link} placeholder="Link" onBlur={(e) => onUpdate?.(`projects.${proj.id}.link`, e.target.value)} style={{ fontSize: "10.5px", background: "transparent", border: "1px dashed #6b7280", outline: "none", width: "40%", textAlign: "right" }} />
                    ) : (
                      proj.link && (
                        <a
                          href={formatUrl(proj.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "10.5px", color: "#60a5fa", textDecoration: "none" }}
                        >
                          {proj.link}
                        </a>
                      )
                    )}
                  </div>
                  {isEditable ? (
                    <textarea 
                      defaultValue={proj.description} 
                      placeholder="Project description..." 
                      onBlur={(e) => onUpdate?.(`projects.${proj.id}.description`, e.target.value)} 
                      style={{ width: "100%", fontSize: "12px", color: "#374151", lineHeight: 1.6, background: "transparent", border: "1px dashed #1b2a4a", outline: "none", padding: "4px", resize: "vertical", marginTop: "4px" }} 
                    />
                  ) : (
                    proj.description && (
                      <MarkdownText 
                        content={proj.description}
                        style={{
                          fontSize: "12px",
                          color: "#374151",
                          lineHeight: 1.6,
                          marginTop: "3px",
                          fontStyle: "italic",
                        }}
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Volunteering */}
        {(volunteering && volunteering.length > 0 || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <MainHeading label="Volunteering" />
              {isEditable && (
                <button 
                  onClick={() => onUpdate?.("volunteering.add", {})}
                  style={{ background: "none", border: "none", color: "#1b2a4a", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700 }}
                >
                  <PlusCircle size={14} /> ADD
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {(volunteering || []).map((vol) => (
                <div key={vol.id} style={{ position: "relative" }}>
                  {isEditable && (
                    <button 
                      onClick={() => onUpdate?.("volunteering.remove", vol.id)}
                      style={{ position: "absolute", left: "-28px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                    {isEditable ? (
                      <input 
                        defaultValue={vol.role}
                        placeholder="Role"
                        onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)}
                        style={{ fontWeight: 700, fontSize: "13.5px", color: "#1b2a4a", width: "60%", background: "transparent", border: "1px dashed #1b2a4a", outline: "none" }}
                      />
                    ) : (
                      <span style={{ fontWeight: 700, fontSize: "13.5px", color: "#1b2a4a" }}>{vol.role}</span>
                    )}
                    {isEditable ? (
                      <DurationPicker 
                        value={vol.duration} 
                        onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} 
                      />
                    ) : (
                      <span style={{ fontSize: "11.5px", color: "#6b7280" }}>{vol.duration}</span>
                    )}
                  </div>
                  {isEditable ? (
                    <input 
                      defaultValue={vol.organization}
                      placeholder="Organization"
                      onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)}
                      style={{ fontSize: "12.5px", color: "#444", fontWeight: 600, width: "80%", background: "transparent", border: "1px dashed #1b2a4a", outline: "none", marginBottom: "4px" }}
                    />
                  ) : (
                    <div style={{ fontSize: "12.5px", color: "#444", fontWeight: 600 }}>{vol.organization}</div>
                  )}
                  {isEditable ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
                       <div style={{ display: "flex", gap: "8px" }}>
                          <SearchableSelect 
                            value={vol.country || "Country"} 
                            options={countriesData.map(c => c.name)} 
                            onSelect={(val) => {
                              onUpdate?.(`volunteering.${vol.id}.country`, val)
                              onUpdate?.(`volunteering.${vol.id}.county`, "")
                            }} 
                          />
                          <SearchableSelect 
                            value={vol.county || "State"} 
                            options={vol.country ? (countriesData.find((c: any) => c.name === vol.country)?.states || []).map((s: any) => s.name) : []} 
                            onSelect={(val) => onUpdate?.(`volunteering.${vol.id}.county`, val)} 
                          />
                          <input 
                            defaultValue={vol.location} 
                            placeholder="City" 
                            onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.location`, e.target.value)} 
                            style={{ fontSize: "12px", color: "#374151", background: "transparent", border: "1px dashed #1b2a4a", outline: "none", width: "100px" }} 
                          />
                       </div>
                       <textarea 
                        defaultValue={vol.description}
                        placeholder="Description..."
                        onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.target.value)}
                        style={{ width: "100%", fontSize: "12px", color: "#374151", lineHeight: 1.6, background: "transparent", border: "1px dashed #1b2a4a", outline: "none", padding: "4px", resize: "vertical", fontFamily: "inherit" }}
                      />
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                       {(vol.location || vol.county || vol.country) && (
                        <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 4px 0" }}>
                          {[vol.location, vol.county, vol.country].filter(Boolean).join(", ")}
                        </p>
                      )}
                      <MarkdownText content={vol.description} style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6 }} />
                    </div>
                  )}
                  {isEditable && (
                    <button 
                      onClick={() => onRefine?.("volunteering", vol.id)}
                      disabled={refiningId === vol.id || !vol.description}
                      style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 700, color: "#1b2a4a", background: "rgba(27,42,74,0.05)", border: "1px solid rgba(27,42,74,0.2)", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", marginTop: "4px", opacity: (refiningId === vol.id || !vol.description) ? 0.5 : 1 }}
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
    </div>
  )
}

function SidebarSection({ label }: { label: string }) {
  return (
    <h4
      style={{
        fontSize: "11px",
        fontWeight: 800,
        color: "#60a5fa",
        textTransform: "uppercase",
        letterSpacing: "1.5px",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
        paddingBottom: "5px",
      }}
    >
      {label}
    </h4>
  )
}

function SidebarDetail({ label, value, onUpdate, isEditable, type = "text" }: { label: string, value?: string, onUpdate?: (val: string) => void, isEditable: boolean, type?: string }) {
  if (!isEditable && !value) return null
  return (
    <div style={{ fontSize: "12px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
      <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.7)", minWidth: "90px" }}>{label}:</span>
      {isEditable ? (
        <input 
          type={type}
          defaultValue={value}
          onBlur={(e) => onUpdate?.(e.target.value)}
          style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.3)", fontSize: "12px", color: "#fff", padding: "0 4px", outline: "none", width: type === "date" ? "auto" : "100%", fontFamily: "inherit" }}
        />
      ) : (
        <span style={{ color: "#fff" }}>{value}</span>
      )}
    </div>
  )
}

function SidebarContact({ label, value, href, isEditable, onUpdate }: { label: string; value: string; href?: string; isEditable?: boolean; onUpdate?: (val: string) => void }) {
  const content = isEditable ? (
    <input defaultValue={value} onBlur={(e) => onUpdate?.(e.target.value)} style={{ fontSize: "11px", color: "#fff", background: "transparent", border: "1px dashed rgba(255,255,255,0.3)", outline: "none", width: "100%", fontFamily: "inherit" }} />
  ) : (
    <span
      style={{
        fontSize: "11px",
        color: href ? "#60a5fa" : "#cbd5e1",
        textDecoration: href ? "underline" : "none",
        wordBreak: "break-word",
      }}
    >
      {value}
    </span>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
      <span
        style={{
          fontSize: "9.5px",
          color: "#60a5fa",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </span>
      {href && !isEditable ? (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ textDecoration: "none" }}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )
}

function MainHeading({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <h3
        style={{
          fontSize: "14px",
          fontWeight: 800,
          color: "#1b2a4a",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "5px",
        }}
      >
        {label}
      </h3>
      <div
        style={{
          height: "2px",
          background: "#1b2a4a",
          width: "100%",
          opacity: 0.15,
        }}
      />
    </div>
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
          borderBottom: "1px dashed rgba(255,255,255,0.3)",
          color: "#fff",
          fontSize: "12px",
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
          border: "1px solid #1b2a4a",
          borderRadius: "4px",
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
                fontSize: "11px",
                cursor: "pointer",
                borderRadius: "3px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#1b2a4a",
                backgroundColor: value === opt ? "#f3f4f6" : "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = value === opt ? "#f3f4f6" : "transparent")}
            >
              {opt} {value === opt && <Check size={10} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchableSelect({ value, options, onSelect, width = "120px", isDark = false }: { value: string; options: string[]; onSelect: (val: string) => void; width?: string, isDark?: boolean }) {
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
          borderBottom: isDark ? "1px dashed rgba(255,255,255,0.3)" : "1px dashed #1b2a4a",
          color: isDark ? "#fff" : "#1b2a4a",
          fontSize: "12px",
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
          top: "100%",
          left: 0,
          zIndex: 1000,
          background: "#fff",
          border: "1px solid #1b2a4a",
          borderRadius: "4px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          padding: "6px",
          minWidth: "180px",
          marginTop: "4px"
        }}>
          <div style={{ position: "relative", marginBottom: "6px" }}>
            <Search size={10} style={{ position: "absolute", left: "6px", top: "50%", transform: "translateY(-50%)", color: "#6b7280" }} />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                width: "100%",
                padding: "4px 6px 4px 22px",
                fontSize: "11px",
                border: "1px solid #1b2a4a",
                borderRadius: "3px",
                outline: "none",
                color: "#1b2a4a"
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
                  fontSize: "11px",
                  cursor: "pointer",
                  borderRadius: "3px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#1b2a4a",
                  backgroundColor: value === opt ? "#f3f4f6" : "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = value === opt ? "#f3f4f6" : "transparent")}
              >
                {opt} {value === opt && <Check size={10} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
