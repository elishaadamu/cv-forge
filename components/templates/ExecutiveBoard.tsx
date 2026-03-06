import React, { useState, useEffect, useRef } from "react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"
import { PlusCircle, Trash2, Sparkles, Loader2, X, Phone, Mail, Linkedin, MapPin, Globe, Github, Facebook, ChevronDown, Check, Search, Camera } from "lucide-react"
import { DurationPicker } from "../DurationPicker"
import countriesData from "@/lib/countries-data.json"

function formatUrl(url: string) {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url
  }
  if (url.includes("@")) return `mailto:${url}`
  return `https://${url}`
}

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
        
        {/* Personal Details Row Moved Here */}
        {(hasPersonalDetails || isEditable) && (
          <div style={{ marginTop: "16px", padding: "8px", background: "rgba(0,0,0,0.02)", borderRadius: "4px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", rowGap: "8px", columnGap: "16px", fontSize: "11px" }}>
               {(personalInfo.dateOfBirth || isEditable) && (
                 <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                   <span style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "9px", letterSpacing: "1px" }}>DOB:</span>
                   {isEditable ? (
                     <input type="date" value={personalInfo.dateOfBirth} onChange={(e) => onUpdate?.("personalInfo.dateOfBirth", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px" }} />
                   ) : (
                     <span>{personalInfo.dateOfBirth}</span>
                   )}
                 </div>
               )}
                {(personalInfo.nationality || isEditable) && (
                 <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                   <span style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "9px", letterSpacing: "1px" }}>Nationality:</span>
                   {isEditable ? (
                     <SearchableSelect value={personalInfo.nationality || "Select"} options={countriesData.map(c => c.name)} onSelect={(val) => onUpdate?.("personalInfo.nationality", val)} width="100px" />
                   ) : (
                     <span>{personalInfo.nationality}</span>
                   )}
                 </div>
               )}
                {(personalInfo.gender || isEditable) && (
                 <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                   <span style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "9px", letterSpacing: "1px" }}>Gender:</span>
                   {isEditable ? (
                     <PopSelect value={personalInfo.gender || "Select"} options={["Male", "Female", "Other", "Prefer not to say"]} onSelect={(val) => onUpdate?.("personalInfo.gender", val)} />
                   ) : (
                     <span>{personalInfo.gender}</span>
                   )}
                 </div>
               )}
               {(personalInfo.passport || isEditable) && (
                 <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                   <span style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "9px", letterSpacing: "1px" }}>Passport:</span>
                   {isEditable ? (
                     <input value={personalInfo.passport} placeholder="No." onChange={(e) => onUpdate?.("personalInfo.passport", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", width: "80px" }} />
                   ) : (
                     <span>{personalInfo.passport}</span>
                   )}
                 </div>
               )}
               {(personalInfo.workPermit || isEditable) && (
                 <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                   <span style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "9px", letterSpacing: "1px" }}>Work Permit:</span>
                   {isEditable ? (
                     <input value={personalInfo.workPermit} placeholder="Yes/No" onChange={(e) => onUpdate?.("personalInfo.workPermit", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", width: "80px" }} />
                   ) : (
                     <span>{personalInfo.workPermit}</span>
                   )}
                 </div>
               )}
               {(personalInfo.placeOfBirth || isEditable) && (
                 <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                   <span style={{ fontWeight: 600, textTransform: "uppercase", fontSize: "9px", letterSpacing: "1px" }}>Birth Place:</span>
                   {isEditable ? (
                     <input value={personalInfo.placeOfBirth} placeholder="City, Country" onChange={(e) => onUpdate?.("personalInfo.placeOfBirth", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", width: "100px" }} />
                   ) : (
                     <span>{personalInfo.placeOfBirth}</span>
                   )}
                 </div>
               )}
            </div>
          </div>
        )}

        <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "16px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
          {isEditable ? (
             <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", width: "100%", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontWeight: 600 }}>Email:</span>
                  <input value={personalInfo.email || ""} placeholder="Email" onChange={(e) => onUpdate?.("personalInfo.email", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", textAlign: "center", width: "180px" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontWeight: 600 }}>Phone:</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    <PopSelect 
                      value={personalInfo.phoneCode || "+1"} 
                      options={countriesData.map(c => c.phonecode)}
                      onSelect={(val) => onUpdate?.("personalInfo.phoneCode", val)}
                    />
                    <input value={personalInfo.phone || ""} placeholder="Phone" onChange={(e) => onUpdate?.("personalInfo.phone", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", textAlign: "center", width: "120px" }} />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontWeight: 600 }}>Country:</span>
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
                      <span style={{ fontWeight: 600 }}>State:</span>
                      <SearchableSelect
                        value={personalInfo.county || "State"}
                        options={personalInfo.country ? (countriesData.find((c: any) => c.name === personalInfo.country)?.states || []).map((s: any) => s.name) : []}
                        onSelect={(val) => onUpdate?.("personalInfo.county", val)}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontWeight: 600 }}>City:</span>
                      <input value={personalInfo.location || ""} placeholder="City" onChange={(e) => onUpdate?.("personalInfo.location", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", width: "100px" }} />
                    </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontWeight: 600 }}>LinkedIn:</span>
                    <input value={personalInfo.linkedin || ""} placeholder="LinkedIn" onChange={(e) => onUpdate?.("personalInfo.linkedin", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", width: "150px", textAlign: "center" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontWeight: 600 }}>Website:</span>
                    <input value={personalInfo.website || ""} placeholder="Website" onChange={(e) => onUpdate?.("personalInfo.website", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", width: "150px", textAlign: "center" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontWeight: 600 }}>GitHub:</span>
                    <input value={personalInfo.github || ""} placeholder="GitHub" onChange={(e) => onUpdate?.("personalInfo.github", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", width: "150px", textAlign: "center" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontWeight: 600 }}>Facebook:</span>
                    <input value={personalInfo.facebook || ""} placeholder="Facebook" onChange={(e) => onUpdate?.("personalInfo.facebook", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", width: "150px", textAlign: "center" }} />
                  </div>
                </div>
             </div>
          ) : (
            <>
              {personalInfo.email && <HeaderContact icon={<Mail size={12} />} text={personalInfo.email} href={`mailto:${personalInfo.email}`} />}
              {personalInfo.phone && <HeaderContact icon={<Phone size={12} />} text={`${personalInfo.phoneCode || ''} ${personalInfo.phone}`} href={`tel:${personalInfo.phoneCode || ''}${personalInfo.phone}`} />}
              {(personalInfo.location || personalInfo.county || personalInfo.country) && (
                <HeaderContact icon={<MapPin size={12} />} text={[personalInfo.location || personalInfo.county, personalInfo.country].filter(Boolean).join(", ")} />
              )}
              {personalInfo.website && <HeaderContact icon={<Globe size={12} />} text={personalInfo.website} href={formatUrl(personalInfo.website)} />}
              {personalInfo.linkedin && <HeaderContact icon={<Linkedin size={12} />} text={personalInfo.linkedin.split('/').pop() || ""} href={formatUrl(personalInfo.linkedin)} />}
              {personalInfo.github && <HeaderContact icon={<Github size={12} />} text={personalInfo.github.split('/').pop() || ""} href={formatUrl(personalInfo.github)} />}
              {personalInfo.facebook && <HeaderContact icon={<Facebook size={12} />} text={personalInfo.facebook.split('/').pop() || ""} href={formatUrl(personalInfo.facebook)} />}
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
      {(education.length > 0 || isEditable) && (
        <section style={{ marginBottom: "32px" }}>
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
                <button onClick={() => onUpdate?.("education.remove", edu.id)} style={{ position: "absolute", left: "-28px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={14} /></button>
              )}
              {isEditable ? (
                <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                     <div style={{ display: "flex", gap: "4px", flex: 1 }}>
                       <input defaultValue={edu.degree} placeholder="Degree" onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)} style={{ fontWeight: "600", background: "transparent", border: "1px dashed #000", outline: "none", width: "40%", fontFamily: "inherit" }} />
                       <span>–</span>
                       <input defaultValue={edu.school} placeholder="School" onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)} style={{ background: "transparent", border: "1px dashed #000", outline: "none", width: "40%", fontFamily: "inherit" }} />
                     </div>
                     <DurationPicker value={edu.duration} onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} />
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input defaultValue={edu.fieldOfStudy} placeholder="Field of Study" onBlur={(e) => onUpdate?.(`education.${edu.id}.fieldOfStudy`, e.target.value)} style={{ fontSize: "14px", background: "transparent", border: "1px dashed #000", outline: "none", width: "60%", fontFamily: "inherit" }} />
                    <input defaultValue={edu.grade} placeholder="Grade" onBlur={(e) => onUpdate?.(`education.${edu.id}.grade`, e.target.value)} style={{ fontSize: "14px", background: "transparent", border: "1px dashed #000", outline: "none", width: "40%", fontFamily: "inherit" }} />
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
                      style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", width: "100px" }} 
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <p style={{ margin: "0" }}>
                    <strong style={{ fontWeight: "600" }}>{edu.degree}</strong> – {edu.school} ({edu.duration})
                  </p>
                  {edu.fieldOfStudy && (
                    <p style={{ fontSize: "14px", margin: "2px 0 0 0" }}>{edu.fieldOfStudy}{edu.grade ? ` | ${edu.grade}` : ""}</p>
                  )}
                  {(edu.location || edu.county || edu.country) && (
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0 0" }}>
                      {[edu.location, edu.county, edu.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
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
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                   <div style={{ display: "flex", gap: "4px", width: "100%" }}>
                      <input defaultValue={exp.role} placeholder="Role" onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)} style={{ fontWeight: "600", fontSize: "16px", background: "transparent", border: "1px dashed #000", outline: "none", width: "45%", fontFamily: "inherit" }} />
                      <span>–</span>
                      <input defaultValue={exp.company} placeholder="Organization" onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)} style={{ fontWeight: "600", fontSize: "16px", background: "transparent", border: "1px dashed #000", outline: "none", width: "45%", fontFamily: "inherit" }} />
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
                        style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", width: "100px" }} 
                      />
                    </div>
                    <div style={{ marginTop: "4px" }}>
                      {isEditable && (
                        <button 
                          onClick={() => onRefine?.("experience", exp.id)}
                          disabled={refiningId === exp.id || !exp.workDescription}
                          style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#000", background: "rgba(0, 0, 0, 0.05)", border: "1px solid rgba(0, 0, 0, 0.2)", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", marginBottom: "4px", opacity: (refiningId === exp.id || !exp.workDescription) ? 0.5 : 1 }}
                        >
                          {refiningId === exp.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                          AI REFINE
                        </button>
                      )}
                      <textarea 
                        defaultValue={exp.workDescription} 
                        placeholder="Role description..." 
                        onBlur={(e) => onUpdate?.(`experience.${exp.id}.workDescription`, e.target.value)} 
                        style={{ width: "100%", minHeight: "60px", background: "transparent", border: "1px dashed #000", fontSize: "14px", fontFamily: "inherit", padding: "4px" }} 
                      />
                    </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <p style={{ fontWeight: "600", fontSize: "16px", margin: "0" }}>
                    {exp.role} – {exp.company}
                  </p>
                  {(exp.location || exp.county || exp.country) && (
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0 0" }}>
                      {[exp.location, exp.county, exp.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {exp.workDescription && (
                    <MarkdownText content={exp.workDescription} style={{ fontSize: "14px", marginTop: "4px" }} />
                  )}
                </div>
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
                  <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                    <SearchableSelect
                      value={proj.country || "Country"}
                      options={countriesData.map(c => c.name)}
                      onSelect={(val) => onUpdate?.(`projects.${proj.id}.country`, val)}
                      width="100px"
                    />
                    <input 
                      defaultValue={proj.location || ""} 
                      placeholder="City/State" 
                      onBlur={(e) => onUpdate?.(`projects.${proj.id}.location`, e.target.value)} 
                      style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", width: "120px" }} 
                    />
                  </div>
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
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                    <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                      <input defaultValue={vol.role} placeholder="Role" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)} style={{ fontWeight: "600", fontSize: "16px", background: "transparent", border: "1px dashed #000", outline: "none", width: "45%", fontFamily: "inherit" }} />
                      <input defaultValue={vol.organization} placeholder="Organization" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)} style={{ fontWeight: "600", fontSize: "16px", background: "transparent", border: "1px dashed #000", outline: "none", width: "45%", fontFamily: "inherit" }} />
                    </div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
                        defaultValue={vol.location || ""} 
                        placeholder="City" 
                        onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.location`, e.target.value)} 
                        style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", width: "100px" }} 
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <p style={{ fontWeight: "600", fontSize: "16px", margin: "0" }}>{vol.role} – {vol.organization}</p>
                    {(vol.location || vol.county || vol.country) && (
                      <p style={{ fontSize: "12px", color: "#6b7280", margin: "2px 0 0 0" }}>
                        {[vol.location, vol.county, vol.country].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
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

      {(languages && languages.length > 0 || isEditable) && (
        <section style={{ marginTop: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #000", paddingBottom: "4px", marginBottom: "12px" }}>
            <h2 style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "14px", margin: 0 }}>Languages</h2>
            {isEditable && (
               <button onClick={() => onUpdate?.("languages.add", { name: "New Language", proficiency: "Native" })} style={{ background: "none", border: "none", cursor: "pointer" }}><PlusCircle size={14} /></button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
             {(languages || []).map((lang, i) => (
               <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", alignItems: "center" }}>
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
                    <PopSelect 
                      value={lang.proficiency} 
                      options={["Beginner", "Intermediate", "Advanced", "Professional", "Fluent", "Native"]} 
                      onSelect={(val) => onUpdate?.(`languages.${i}.proficiency`, val)} 
                    />
                 ) : (
                   <span>{lang.proficiency}</span>
                 )}
               </div>
             ))}
          </div>
        </section>
      )}
    </div>
  )
}
function BoardDetail({ label, value, onUpdate, isEditable, type = "text" }: { label: string, value?: string, onUpdate?: (val: string) => void, isEditable: boolean, type?: string }) {
  if (!isEditable && !value) return null
  return (
    <div style={{ fontSize: "14px", display: "flex", gap: "12px", alignItems: "center" }}>
      <span style={{ fontWeight: "600", minWidth: "120px", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px" }}>{label}:</span>
      {isEditable ? (
        <input 
          type={type}
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

function HeaderContact({ icon, text, href }: { icon: React.ReactNode, text: string, href?: string }) {
  const inner = (
    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span style={{ color: "#111" }}>{icon}</span>
      <span>{text}</span>
    </span>
  )
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>{inner}</a>
  ) : inner
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
          borderBottom: "1px dashed #000",
          color: "#4b5563",
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
          border: "1px solid #000",
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
          borderBottom: "1px dashed #000",
          color: "#4b5563",
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
          border: "1px solid #000",
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
                border: "1px solid #000",
                borderRadius: "3px",
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
                  fontSize: "11px",
                  cursor: "pointer",
                  borderRadius: "3px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
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
