import { Phone, Mail, Linkedin, MapPin, Globe, Github, Facebook, PlusCircle, Trash2, Sparkles, Loader2, Camera, X, ChevronDown, Check, Search } from "lucide-react"
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

export function RefinedClassic({ 
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
        fontFamily: "'Garamond', 'Georgia', 'Times New Roman', serif",
        fontSize: "13px",
        color: "#1c1917",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── TOP GOLD LINE ── */}
      <div style={{ height: "4px", background: "linear-gradient(90deg, #b45309, #d97706, #f59e0b, #d97706, #b45309)" }} />

      {/* ── HEADER ── */}
      <div
        style={{
          padding: "40px 56px 28px",
          textAlign: "center",
          borderBottom: "1px solid #e7e5e4",
        }}
      >
        <div style={{ position: "relative", display: "flex", justifyContent: "center", marginBottom: "12px" }}>
          {personalInfo.profileImage ? (
            <div style={{ position: "relative" }}>
              <img
                src={personalInfo.profileImage}
                alt={personalInfo.fullName}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #d97706",
                }}
              />
              {isEditable && (
                <button
                  onClick={onImageClick}
                  style={{ position: "absolute", bottom: "0", right: "0", background: "#d97706", color: "white", borderRadius: "50%", padding: "4px", border: "2px solid white", cursor: "pointer" }}
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
                borderRadius: "50%",
                border: "2px dashed #d97706",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(217, 119, 6, 0.05)",
                color: "#d97706",
                cursor: "pointer"
              }}
            >
              <Camera size={20} />
            </button>
          ) : null}
        </div>
        {isEditable ? (
          <input
            value={personalInfo.fullName}
            placeholder="YOUR NAME"
            onChange={(e) => onUpdate?.("personalInfo.fullName", e.target.value)}
            style={{
              fontSize: "30px",
              fontWeight: 400,
              color: "#1c1917",
              lineHeight: 1.2,
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "4px",
              width: "100%",
              background: "transparent",
              border: "1px dashed #d6d3d1",
              outline: "none",
              fontFamily: "inherit",
              textAlign: "center"
            }}
          />
        ) : (
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 400,
              color: "#1c1917",
              lineHeight: 1.2,
              letterSpacing: "2px",
              textTransform: "uppercase",
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
              fontSize: "13px",
              color: "#b45309",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 400,
              marginBottom: "8px",
              width: "100%",
              background: "transparent",
              border: "1px dashed #d6d3d1",
              outline: "none",
              fontFamily: "inherit",
              textAlign: "center"
            }}
          />
        ) : (
          <p style={{ fontSize: "13px", color: "#b45309", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 400, marginBottom: "8px" }}>
            {personalInfo.jobTitle}
          </p>
        )}

        {/* Personal Details Row */}
        {(hasPersonalDetails || isEditable) && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "#b45309", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", opacity: 0.8 }}>
               Personal Information
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", rowGap: "8px", columnGap: "12px" }}>
              {(personalInfo.dateOfBirth || isEditable) && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                  <span style={{ color: "#78716c", fontWeight: 600 }}>Date of Birth:</span>
                  {isEditable ? (
                    <input 
                      type="date"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => onUpdate?.("personalInfo.dateOfBirth", e.target.value)}
                      style={{ color: "#57534e", background: "transparent", border: "1px dashed #d6d3d1", padding: "1px 4px", outline: "none", fontSize: "11px" }}
                    />
                  ) : (
                    <span style={{ color: "#57534e" }}>{personalInfo.dateOfBirth}</span>
                  )}
                </div>
              )}
              {(personalInfo.gender || isEditable) && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                  <span style={{ color: "#78716c", fontWeight: 600 }}>Gender:</span>
                  {isEditable ? (
                    <PopSelect 
                      value={personalInfo.gender || "Select"}
                      options={["Male", "Female", "Other", "Prefer not to say"]}
                      onSelect={(val) => onUpdate?.("personalInfo.gender", val)}
                    />
                  ) : (
                    <span style={{ color: "#57534e" }}>{personalInfo.gender}</span>
                  )}
                </div>
              )}
               {(personalInfo.nationality || isEditable) && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                  <span style={{ color: "#78716c", fontWeight: 600 }}>Nationality:</span>
                  {isEditable ? (
                    <SearchableSelect 
                      value={personalInfo.nationality || "Select"}
                      options={countriesData.map(c => c.name)}
                      onSelect={(val) => onUpdate?.("personalInfo.nationality", val)}
                    />
                  ) : (
                    <span style={{ color: "#57534e" }}>{personalInfo.nationality}</span>
                  )}
                </div>
              )}
              {(personalInfo.placeOfBirth || isEditable) && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                  <span style={{ color: "#78716c", fontWeight: 600 }}>Place of Birth:</span>
                  {isEditable ? (
                    <input 
                      value={personalInfo.placeOfBirth}
                      placeholder="City, Country"
                      onChange={(e) => onUpdate?.("personalInfo.placeOfBirth", e.target.value)}
                      style={{ color: "#57534e", background: "transparent", border: "1px dashed #d6d3d1", padding: "1px 4px", outline: "none", fontSize: "11px" }}
                    />
                  ) : (
                    <span style={{ color: "#57534e" }}>{personalInfo.placeOfBirth}</span>
                  )}
                </div>
              )}
              {(personalInfo.passport || isEditable) && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                  <span style={{ color: "#78716c", fontWeight: 600 }}>Passport:</span>
                  {isEditable ? (
                    <input 
                      value={personalInfo.passport}
                      placeholder="No."
                      onChange={(e) => onUpdate?.("personalInfo.passport", e.target.value)}
                      style={{ color: "#57534e", background: "transparent", border: "1px dashed #d6d3d1", padding: "1px 4px", outline: "none", fontSize: "11px", width: "80px" }}
                    />
                  ) : (
                    <span style={{ color: "#57534e" }}>{personalInfo.passport}</span>
                  )}
                </div>
              )}
              {(personalInfo.workPermit || isEditable) && (
                <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                  <span style={{ color: "#78716c", fontWeight: 600 }}>Work Permit:</span>
                  {isEditable ? (
                    <input 
                      value={personalInfo.workPermit}
                      placeholder="Visa Type"
                      onChange={(e) => onUpdate?.("personalInfo.workPermit", e.target.value)}
                      style={{ color: "#57534e", background: "transparent", border: "1px dashed #d6d3d1", padding: "1px 4px", outline: "none", fontSize: "11px", width: "100px" }}
                    />
                  ) : (
                    <span style={{ color: "#57534e" }}>{personalInfo.workPermit}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div style={{ marginTop: "16px" }}>
          <div style={{ fontSize: "9px", fontWeight: 700, color: "#b45309", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", opacity: 0.8, textAlign: "center" }}>
            Contact Information
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              rowGap: "8px",
              columnGap: "16px",
              fontSize: "10.5px",
              color: "#57534e",
            }}
          >
            {isEditable ? (
               <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", width: "100%", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ color: "#78716c", fontWeight: 600 }}>Email:</span>
                    <input value={personalInfo.email || ""} placeholder="Email" onChange={(e) => onUpdate?.("personalInfo.email", e.target.value)} style={{ background: "transparent", border: "1px dashed #d6d3d1", fontSize: "10.5px", width: "150px", textAlign: "center" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ color: "#78716c", fontWeight: 600 }}>Phone:</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                      <PopSelect 
                        value={personalInfo.phoneCode || "+1"} 
                        options={countriesData.map(c => c.phonecode)}
                        onSelect={(val) => onUpdate?.("personalInfo.phoneCode", val)}
                      />
                      <input value={personalInfo.phone || ""} placeholder="Phone" onChange={(e) => onUpdate?.("personalInfo.phone", e.target.value)} style={{ background: "transparent", border: "1px dashed #d6d3d1", fontSize: "10.5px", width: "100px" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#78716c", fontWeight: 600 }}>Country:</span>
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
                      <span style={{ color: "#78716c", fontWeight: 600 }}>State:</span>
                      <SearchableSelect
                        value={personalInfo.county || "State"}
                        options={personalInfo.country ? (countriesData.find((c: any) => c.name === personalInfo.country)?.states || []).map((s: any) => s.name) : []}
                        onSelect={(val) => onUpdate?.("personalInfo.county", val)}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#78716c", fontWeight: 600 }}>City:</span>
                      <input value={personalInfo.location || ""} placeholder="City" onChange={(e) => onUpdate?.("personalInfo.location", e.target.value)} style={{ background: "transparent", border: "1px dashed #d6d3d1", fontSize: "10.5px", width: "80px" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#78716c", fontWeight: 600 }}>LinkedIn:</span>
                      <input value={personalInfo.linkedin || ""} placeholder="LinkedIn" onChange={(e) => onUpdate?.("personalInfo.linkedin", e.target.value)} style={{ background: "transparent", border: "1px dashed #d6d3d1", fontSize: "10.5px", width: "120px", textAlign: "center" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#78716c", fontWeight: 600 }}>Website:</span>
                      <input value={personalInfo.website || ""} placeholder="Website" onChange={(e) => onUpdate?.("personalInfo.website", e.target.value)} style={{ background: "transparent", border: "1px dashed #d6d3d1", fontSize: "10.5px", width: "120px", textAlign: "center" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#78716c", fontWeight: 600 }}>GitHub:</span>
                      <input value={personalInfo.github || ""} placeholder="GitHub" onChange={(e) => onUpdate?.("personalInfo.github", e.target.value)} style={{ background: "transparent", border: "1px dashed #d6d3d1", fontSize: "10.5px", width: "120px", textAlign: "center" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ color: "#78716c", fontWeight: 600 }}>Facebook:</span>
                      <input value={personalInfo.facebook || ""} placeholder="Facebook" onChange={(e) => onUpdate?.("personalInfo.facebook", e.target.value)} style={{ background: "transparent", border: "1px dashed #d6d3d1", fontSize: "10.5px", width: "120px", textAlign: "center" }} />
                    </div>
                  </div>
               </div>
            ) : (
              <>
                {personalInfo.phone && (
                  <GoldContact icon={<Phone size={10} />} text={`${personalInfo.phoneCode || ''} ${personalInfo.phone}`} href={`tel:${personalInfo.phoneCode || ''}${personalInfo.phone}`} />
                )}
                {personalInfo.email && (
                  <GoldContact icon={<Mail size={10} />} text={personalInfo.email} href={`mailto:${personalInfo.email}`} />
                )}
                {personalInfo.linkedin && (
                  <GoldContact icon={<Linkedin size={10} />} text={personalInfo.linkedin} href={formatUrl(personalInfo.linkedin)} />
                )}
                {(personalInfo.location || personalInfo.county || personalInfo.country) && (
                  <GoldContact icon={<MapPin size={10} />} text={[personalInfo.location || personalInfo.county, personalInfo.country].filter(Boolean).join(", ")} />
                )}
                {personalInfo.website && (
                  <GoldContact icon={<Globe size={10} />} text={personalInfo.website} href={formatUrl(personalInfo.website)} />
                )}
                {personalInfo.github && (
                  <GoldContact icon={<Github size={10} />} text={personalInfo.github} href={formatUrl(personalInfo.github)} />
                )}
                {personalInfo.facebook && (
                  <GoldContact icon={<Facebook size={10} />} text={personalInfo.facebook} href={formatUrl(personalInfo.facebook)} />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "28px 56px 48px", flex: 1 }}>
        {/* Summary */}
        {(personalInfo.summary || isEditable) && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <ClassicSectionHead label="Executive Summary" />
              {isEditable && (
                <button 
                  onClick={() => onRefine?.("summary")}
                  disabled={refiningId === "summary"}
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#b45309" }}
                >
                  {refiningId === "summary" ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI REFINE
                </button>
              )}
            </div>
            {isEditable ? (
              <textarea
                value={personalInfo.summary}
                placeholder="Professional summary..."
                onChange={(e) => onUpdate?.("personalInfo.summary", e.target.value)}
                style={{ width: "100%", minHeight: "80px", fontSize: "13px", color: "#44403c", lineHeight: 1.75, background: "transparent", border: "1px dashed #d6d3d1", outline: "none", fontFamily: "inherit", resize: "vertical", fontStyle: "italic" }}
              />
            ) : (
              <MarkdownText
                content={personalInfo.summary || ""}
                style={{
                  fontSize: "13px",
                  color: "#44403c",
                  lineHeight: 1.75,
                  textAlign: "justify",
                  fontStyle: "italic",
                }}
              />
            )}
          </div>
        )}

        {/* Experience */}
        {(experience.length > 0 || isEditable) && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <ClassicSectionHead label="Professional Experience" />
              {isEditable && (
                 <button onClick={() => onUpdate?.("experience.add", {})} style={{ background: "none", border: "none", color: "#b45309", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                  <PlusCircle size={14} /> ADD ROLE
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {experience.map((exp) => (
                <div key={exp.id} style={{ position: "relative" }}>
                   {isEditable && (
                    <button onClick={() => onUpdate?.("experience.remove", exp.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                    <div>
                      {isEditable ? (
                         <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                           <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                              <input value={exp.role} placeholder="Role" onChange={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)} style={{ fontWeight: 700, fontSize: "13.5px", background: "transparent", border: "1px dashed #d6d3d1", outline: "none" }} />
                              <span style={{ fontSize: "12px", color: "#b45309" }}>—</span>
                              <input value={exp.company} placeholder="Company" onChange={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)} style={{ color: "#b45309", fontSize: "12px", background: "transparent", border: "1px dashed #d6d3d1", outline: "none" }} />
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
                                value={exp.location || ""} 
                                placeholder="City" 
                                onChange={(e) => onUpdate?.(`experience.${exp.id}.location`, e.target.value)} 
                                style={{ background: "transparent", border: "1px dashed #d6d3d1", fontSize: "11px", width: "80px", color: "#78716c" }} 
                              />
                            </div>
                         </div>
                      ) : (
                        <>
                          <span style={{ fontWeight: 700, fontSize: "13.5px", color: "#1c1917" }}>{exp.role}</span>
                          <span style={{ fontSize: "12px", color: "#b45309", marginLeft: "8px" }}>— {exp.company}</span>
                          {(exp.location || exp.county || exp.country) && (
                            <span style={{ color: "#78716c", fontSize: "11px", marginLeft: "8px", fontStyle: "italic" }}>
                              • {[exp.location, exp.county, exp.country].filter(Boolean).join(", ")}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {isEditable ? (
                      <DurationPicker value={exp.duration} onChange={(val) => onUpdate?.(`experience.${exp.id}.duration`, val)} />
                    ) : (
                      <span style={{ fontSize: "11px", fontStyle: "italic", color: "#78716c", whiteSpace: "nowrap" }}>{exp.duration}</span>
                    )}
                  </div>

                  {(exp.workDescription || isEditable) && (
                    <div style={{ marginTop: "4px", marginBottom: "8px" }}>
                      {isEditable && (
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "4px" }}>
                          <button 
                            onClick={() => onRefine?.("experience", exp.id)}
                            disabled={refiningId === exp.id}
                            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#b45309" }}
                          >
                            {refiningId === exp.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI REFINE
                          </button>
                        </div>
                      )}
                      {isEditable ? (
                        <textarea
                          value={exp.workDescription}
                          placeholder="Role summary..."
                          onChange={(e) => onUpdate?.(`experience.${exp.id}.workDescription`, e.target.value)}
                          style={{ width: "100%", fontSize: "12.5px", color: "#44403c", lineHeight: 1.6, background: "transparent", border: "1px dashed #d6d3d1", outline: "none", fontFamily: "inherit", fontStyle: "italic", resize: "vertical", minHeight: "40px" }}
                        />
                      ) : (
                        <MarkdownText
                          content={exp.workDescription || ""}
                          style={{ fontSize: "12.5px", color: "#44403c", lineHeight: 1.6, fontStyle: "italic" }}
                        />
                      )}
                    </div>
                  )}

                  {isEditable ? (
                    <div style={{ marginTop: "4px" }}>
                      {exp.description.map((bullet, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                          <input value={bullet} onChange={(e) => {
                            const newDesc = [...exp.description]
                            newDesc[i] = e.target.value
                            onUpdate?.(`experience.${exp.id}.description`, newDesc)
                          }} style={{ flex: 1, fontSize: "12px", background: "transparent", border: "1px dashed #d6d3d1", outline: "none" }} />
                          <button onClick={() => {
                            const newDesc = exp.description.filter((_, idx) => idx !== i)
                            onUpdate?.(`experience.${exp.id}.description`, newDesc)
                          }} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                        </div>
                      ))}
                      <button onClick={() => onUpdate?.(`experience.${exp.id}.description`, [...exp.description, ""])} style={{ fontSize: "10px", fontWeight: "bold", background: "none", border: "none", cursor: "pointer", color: "#b45309" }}>+ ADD BULLET</button>
                    </div>
                  ) : (
                    <ul style={{ paddingLeft: "18px", margin: "6px 0 0", listStyleType: "disc" }}>
                      {exp.description.filter(Boolean).map((bullet, i) => (
                        <li key={i} style={{ fontSize: "12px", color: "#44403c", lineHeight: 1.65, marginBottom: "3px" }}>
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
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <ClassicSectionHead label="Areas of Expertise" />
              {isEditable && (
                 <button onClick={() => onUpdate?.("skills.add", "New Category")} style={{ background: "none", border: "none", color: "#b45309", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                  <PlusCircle size={14} /> ADD SKILL
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {isEditable ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                    {skills.map((skill, i) => (
                      <div key={i} style={{ padding: "8px", border: "1px dashed #d6d3d1", borderRadius: "6px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                            <input value={skill.category} onChange={(e) => onUpdate?.(`skills.${i}.category`, e.target.value)} style={{ fontWeight: 700, fontSize: "12px", background: "transparent", border: "none", outline: "none", color: "#b45309" }} placeholder="Skill Category" />
                            <button onClick={() => onUpdate?.("skills.remove", i)} style={{ color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {(skill.items || []).map((item, idx) => (
                              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "2px", background: "#fef3c7", padding: "1px 6px", border: "1px solid #d6d3d1", borderRadius: "4px" }}>
                                  <input
                                    value={item}
                                    placeholder="Skill"
                                    onChange={(e) => {
                                      const newItems = [...skill.items]
                                      newItems[idx] = e.target.value
                                      onUpdate?.(`skills.${i}.items`, newItems)
                                    }}
                                    style={{ fontSize: "11px", background: "transparent", border: "none", outline: "none", width: "70px", color: "#44403c" }}
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
                              style={{ fontSize: "10px", color: "#b45309", background: "none", border: "1px dashed #b45309", borderRadius: "4px", padding: "1px 6px", cursor: "pointer" }}
                            >
                              + Add
                            </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                    {skills.map((group, i) => (
                      <p key={i} style={{ fontSize: "12px", color: "#44403c", margin: 0 }}>
                        <span style={{ fontWeight: 700, color: "#b45309" }}>{group.category}: </span>
                        {group.items.join("  ·  ")}
                      </p>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Education */}
        {(education.length > 0 || isEditable) && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <ClassicSectionHead label="Education" />
              {isEditable && (
                 <button onClick={() => onUpdate?.("education.add", {})} style={{ background: "none", border: "none", color: "#b45309", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                            <input value={edu.degree} placeholder="Degree" onChange={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)} style={{ fontWeight: 700, fontSize: "12.5px", background: "transparent", border: "1px dashed #d6d3d1" }} />
                            <span style={{ fontSize: "12px", color: "#78716c" }}>—</span>
                            <input value={edu.school} placeholder="School" onChange={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)} style={{ fontSize: "12px", color: "#78716c", background: "transparent", border: "1px dashed #d6d3d1" }} />
                          </div>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input value={edu.fieldOfStudy} placeholder="Field of Study" onChange={(e) => onUpdate?.(`education.${edu.id}.fieldOfStudy`, e.target.value)} style={{ fontSize: "11.5px", color: "#78716c", background: "transparent", border: "1px dashed #d6d3d1", outline: "none", width: "150px" }} />
                            <input value={edu.grade} placeholder="Grade/GPA" onChange={(e) => onUpdate?.(`education.${edu.id}.grade`, e.target.value)} style={{ fontSize: "11.5px", color: "#78716c", background: "transparent", border: "1px dashed #d6d3d1", outline: "none", width: "80px" }} />
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
                              value={edu.location || ""} 
                              placeholder="City" 
                              onChange={(e) => onUpdate?.(`education.${edu.id}.location`, e.target.value)} 
                              style={{ background: "transparent", border: "1px dashed #d6d3d1", fontSize: "11px", width: "80px", color: "#78716c" }} 
                            />
                          </div>
                        </div>
                      </div>
                      <DurationPicker value={edu.duration} onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} />
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                          <span style={{ fontWeight: 700, fontSize: "12.5px", color: "#1c1917" }}>{edu.degree}</span>
                          <span style={{ fontSize: "12px", color: "#78716c" }}>— {edu.school}</span>
                        </div>
                        <div style={{ fontSize: "11.5px", color: "#78716c", marginTop: "2px", fontStyle: "italic" }}>
                          {[edu.fieldOfStudy, edu.grade].filter(Boolean).join(" • ")}
                        </div>
                        {(edu.location || edu.county || edu.country) && (
                          <div style={{ fontSize: "11px", color: "#b45309", marginTop: "1px", fontStyle: "italic" }}>
                            {[edu.location, edu.county, edu.country].filter(Boolean).join(", ")}
                          </div>
                        )}
                        {edu.duration && <div style={{ fontSize: "11px", fontStyle: "italic", color: "#78716c", marginTop: "2px" }}>{edu.duration}</div>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {(projects.length > 0 || isEditable) && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
               <ClassicSectionHead label="Notable Projects" />
               {isEditable && (
                 <button onClick={() => onUpdate?.("projects.add", {})} style={{ background: "none", border: "none", color: "#b45309", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
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
                    {isEditable ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
                         <input value={proj.name} placeholder="Project Name" onChange={(e) => onUpdate?.(`projects.${proj.id}.name`, e.target.value)} style={{ fontWeight: 700, fontSize: "13px", color: "#1c1917", background: "transparent", border: "1px dashed #d6d3d1" }} />
                         <input value={proj.link} placeholder="Link" onChange={(e) => onUpdate?.(`projects.${proj.id}.link`, e.target.value)} style={{ fontSize: "10px", color: "#b45309", background: "transparent", border: "1px dashed #d6d3d1", fontStyle: "italic" }} />
                         <textarea value={proj.description} placeholder="Description..." onChange={(e) => onUpdate?.(`projects.${proj.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "12px", color: "#44403c", background: "transparent", border: "1px dashed #d6d3d1", outline: "none", fontFamily: "inherit" }} />
                      </div>
                    ) : (
                      <>
                        <span style={{ fontWeight: 700, fontSize: "13px", color: "#1c1917" }}>{proj.name}</span>
                        {proj.link && (
                          <a href={formatUrl(proj.link)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "10px", color: "#b45309", textDecoration: "none", fontStyle: "italic" }}>
                            {proj.link}
                          </a>
                        )}
                      </>
                    )}
                  </div>
                  {!isEditable && proj.description && (
                    <MarkdownText content={proj.description} style={{ fontSize: "12px", color: "#44403c", lineHeight: 1.6, marginTop: "3px" }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── VOLUNTEERING & LANGUAGES ── */}
        <div style={{ display: "flex", gap: "56px", marginTop: "24px", borderTop: "1px solid #e7e5e4", paddingTop: "24px" }}>
          {(volunteering && volunteering.length > 0 || isEditable) && (
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <ClassicSectionHead label="Volunteering" />
                {isEditable && (
                  <button onClick={() => onUpdate?.("volunteering.add", {})} style={{ background: "none", border: "none", color: "#b45309", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                    <PlusCircle size={14} /> ADD
                  </button>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {(volunteering || []).map((vol) => (
                  <div key={vol.id} style={{ position: "relative" }}>
                    {isEditable && (
                      <button onClick={() => onUpdate?.("volunteering.remove", vol.id)} style={{ position: "absolute", left: "-24px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                    )}
                    <div style={{ marginBottom: "2px" }}>
                      {isEditable ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <input value={vol.role} placeholder="Role" onChange={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)} style={{ fontSize: "13px", fontWeight: 700, color: "#1c1917", background: "transparent", border: "1px dashed #d6d3d1", width: "100%" }} />
                          <input value={vol.organization} placeholder="Organization" onChange={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)} style={{ color: "#b45309", fontSize: "12px", background: "transparent", border: "1px dashed #d6d3d1", width: "100%" }} />
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <SearchableSelect
                              value={vol.country || "Country"}
                              options={countriesData.map(c => c.name)}
                              onSelect={(val) => {
                                onUpdate?.(`volunteering.${vol.id}.country`, val)
                                onUpdate?.(`volunteering.${vol.id}.county`, "")
                              }}
                              width="100px"
                            />
                            <SearchableSelect
                              value={vol.county || "State"}
                              options={vol.country ? (countriesData.find((c: any) => c.name === vol.country)?.states || []).map((s: any) => s.name) : []}
                              onSelect={(val) => onUpdate?.(`volunteering.${vol.id}.county`, val)}
                              width="100px"
                            />
                            <input 
                              value={vol.location || ""} 
                              placeholder="City" 
                              onChange={(e) => onUpdate?.(`volunteering.${vol.id}.location`, e.target.value)} 
                              style={{ background: "transparent", border: "1px dashed #d6d3d1", fontSize: "11px", width: "80px", color: "#78716c" }} 
                            />
                          </div>
                          <DurationPicker value={vol.duration} onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} />
                        </div>
                      ) : (
                        <>
                          <div style={{ fontWeight: 700, fontSize: "13px", color: "#1c1917" }}>{vol.role}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                              <span style={{ color: "#b45309" }}>{vol.organization}</span>
                              {(vol.location || vol.county || vol.country) && (
                                <span style={{ color: "#78716c", fontSize: "10.5px", fontStyle: "italic" }}>
                                  {[vol.location, vol.county, vol.country].filter(Boolean).join(", ")}
                                </span>
                              )}
                            </div>
                            <span style={{ color: "#78716c", fontStyle: "italic" }}>{vol.duration}</span>
                          </div>
                        </>
                      )}
                    </div>
                    {isEditable ? (
                      <textarea value={vol.description} placeholder="Description..." onChange={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "12px", color: "#44403c", background: "transparent", border: "1px dashed #d6d3d1", outline: "none", fontFamily: "inherit", resize: "vertical" }} />
                    ) : (
                      <MarkdownText content={vol.description} style={{ fontSize: "11.5px", color: "#44403c", lineHeight: 1.5 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(languages && languages.length > 0 || isEditable) && (
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <ClassicSectionHead label="Languages" />
                {isEditable && (
                  <button onClick={() => onUpdate?.("languages.add", { name: "New Language", proficiency: "Native" })} style={{ background: "none", border: "none", color: "#b45309", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                    <PlusCircle size={14} /> ADD
                  </button>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {(languages || []).map((lang, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {isEditable && (
                        <button onClick={() => onUpdate?.("languages.remove", i)} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={10} /></button>
                      )}
                      {isEditable ? (
                        <input defaultValue={lang.name} onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.target.value)} style={{ fontWeight: 700, background: "transparent", border: "1px dashed #d6d3d1", width: "90px" }} />
                      ) : (
                        <span style={{ fontWeight: 700, color: "#1c1917" }}>{lang.name}</span>
                      )}
                    </div>
                    {isEditable ? (
                      <PopSelect 
                        value={lang.proficiency || "Level"}
                        options={["Native", "Fluent", "Professional", "Intermediate", "Basic"]}
                        onSelect={(val) => onUpdate?.(`languages.${i}.proficiency`, val)}
                      />
                    ) : (
                      <span style={{ color: "#78716c", fontStyle: "italic" }}>{lang.proficiency}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM GOLD LINE ── */}
      <div style={{ height: "4px", background: "linear-gradient(90deg, #b45309, #d97706, #f59e0b, #d97706, #b45309)" }} />
    </div>
  )
}

function DetailRow({ label, value, onUpdate, isEditable }: { label: string, value?: string, onUpdate?: (val: string) => void, isEditable: boolean }) {
  if (!isEditable && !value) return null
  return (
    <div style={{ fontSize: "12.5px", display: "flex", gap: "8px" }}>
      <span style={{ fontWeight: 700, minWidth: "100px", color: "#1c1917" }}>{label}:</span>
      {isEditable ? (
        <input 
          defaultValue={value}
          onBlur={(e) => onUpdate?.(e.target.value)}
          style={{ background: "transparent", border: "1px dashed #d6d3d1", fontSize: "12px", color: "#44403c", padding: "0 4px", outline: "none", width: "100%", fontFamily: "inherit" }}
        />
      ) : (
        <span style={{ color: "#44403c" }}>{value}</span>
      )}
    </div>
  )
}

function ClassicSectionHead({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: "10px", width: "100%" }}>
      <h3
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#1c1917",
          textTransform: "uppercase",
          letterSpacing: "3px",
          textAlign: "center",
          marginBottom: "6px",
        }}
      >
        {label}
      </h3>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ flex: 1, height: "1px", background: "#d6d3d1" }} />
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#d97706" }} />
        <div style={{ flex: 1, height: "1px", background: "#d6d3d1" }} />
      </div>
    </div>
  )
}

function GoldContact({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) {
  const inner = (
    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <span style={{ display: "flex", alignItems: "center", color: "#b45309", flexShrink: 0 }}>{icon}</span>
      <span style={{ color: href ? "#b45309" : "#57534e", textDecoration: "none" }}>{text}</span>
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
          borderBottom: "1px dashed #b45309",
          color: "#57534e",
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
          border: "1px solid #d6d3d1",
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
                backgroundColor: value === opt ? "#fef3c7" : "transparent",
                color: value === opt ? "#b45309" : "#374151",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fffbeb")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = value === opt ? "#fef3c7" : "transparent")}
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
          borderBottom: "1px dashed #b45309",
          color: "#57534e",
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
          top: "100%",
          left: 0,
          zIndex: 1000,
          background: "#fff",
          border: "1px solid #d6d3d1",
          borderRadius: "6px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          padding: "6px",
          minWidth: "180px",
          marginTop: "4px"
        }}>
          <div style={{ position: "relative", marginBottom: "6px" }}>
            <Search size={10} style={{ position: "absolute", left: "6px", top: "50%", transform: "translateY(-50%)", color: "#78716c" }} />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                width: "100%",
                padding: "4px 6px 4px 22px",
                fontSize: "10px",
                border: "1px solid #d6d3d1",
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
                  backgroundColor: value === opt ? "#fef3c7" : "transparent",
                  color: value === opt ? "#b45309" : "#374151",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fffbeb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = value === opt ? "#fef3c7" : "transparent")}
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
