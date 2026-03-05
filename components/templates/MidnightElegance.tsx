// @ts-nocheck
import { Phone, Mail, Linkedin, MapPin, Globe, Github, Facebook, PlusCircle, Trash2, Sparkles, Languages as LangIcon, Heart, ChevronDown, Check, Search } from "lucide-react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"
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

export function MidnightElegance({ 
  data, 
  isEditable = false, 
  onUpdate 
}: { 
  data: CVData, 
  isEditable?: boolean, 
  onUpdate?: (field: string, value: any) => void 
}) {
  const { personalInfo, experience, education, skills, projects, languages, volunteering } = data
  const allSkills = skills.flatMap((s) => s.items)
  const hasPersonalDetails = personalInfo.dateOfBirth || personalInfo.nationality || personalInfo.gender || personalInfo.passport || personalInfo.workPermit || personalInfo.placeOfBirth

  return (
    <div
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: "13px",
        color: "#1a1a2e",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* ── HEADER BAND ── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
          color: "#fff",
          padding: "48px 56px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "32px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            contentEditable={isEditable}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdate?.("personalInfo.fullName", e.currentTarget.innerText)}
            style={{
              fontSize: "34px",
              fontWeight: 700,
              letterSpacing: "1px",
              marginBottom: "4px",
              lineHeight: 1.1,
              outline: "none",
              borderBottom: isEditable ? "1px dashed rgba(255,255,255,0.2)" : "none",
              paddingBottom: isEditable ? "4px" : "0",
            }}
          >
            {personalInfo.fullName || "Your Name"}
          </h1>
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdate?.("personalInfo.jobTitle", e.currentTarget.innerText)}
            style={{
              fontSize: "13px",
              color: "#c4b5fd",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: 400,
              outline: "none",
              borderBottom: isEditable ? "1px dashed rgba(196,181,253,0.2)" : "none",
              paddingBottom: isEditable ? "2px" : "0",
              marginTop: "8px",
            }}
          >
            {personalInfo.jobTitle || "Your Professional Title"}
          </p>
        </div>

        {personalInfo.profileImage && (
          <img
            src={personalInfo.profileImage}
            alt={personalInfo.fullName}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid rgba(196,181,253,0.4)",
              flexShrink: 0,
            }}
          />
        )}
      </div>

      {/* ── CONTACT BAR ── */}
      <div
        style={{
          background: "#f5f3ff",
          padding: "12px 56px",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "center",
          borderBottom: "1px solid #e5e2f0",
          fontSize: "11px",
          color: "#4c1d95",
        }}
      >
        {(personalInfo.phone || isEditable) && (
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Phone size={10} />
            {isEditable ? (
               <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                  <PopSelect 
                    value={personalInfo.phoneCode || "+1"} 
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
                  <span 
                    contentEditable={isEditable}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => onUpdate?.("personalInfo.phone", e.currentTarget.innerText)}
                    style={{ outline: "none", borderBottom: "1px dashed rgba(124,58,237,0.2)", minWidth: "60px" }}
                  >
                    {personalInfo.phone || "Phone"}
                  </span>
               </div>
            ) : (
              <span>{personalInfo.phoneCode} {personalInfo.phone}</span>
            )}
          </div>
        )}
        {(personalInfo.email || isEditable) && (
          <ContactChip 
            icon={<Mail size={10} />} 
            text={personalInfo.email || "Email"} 
            href={formatUrl(personalInfo.email)}
            isEditable={isEditable}
            onUpdate={(val) => onUpdate?.("personalInfo.email", val)}
          />
        )}
        {(personalInfo.country || isEditable) && (
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <MapPin size={10} />
            {isEditable ? (
              <SearchableSelect 
                value={personalInfo.country || "Country"} 
                options={countriesData.map(c => c.name)} 
                onSelect={(val) => onUpdate?.("personalInfo.country", val)} 
              />
            ) : (
              <span>{personalInfo.country}</span>
            )}
          </div>
        )}
        {(personalInfo.county || isEditable) && (
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {isEditable ? (
              <SearchableSelect 
                value={personalInfo.county || "State/Province"} 
                options={personalInfo.country ? (countriesData.find((c: any) => c.name === personalInfo.country)?.states || []).map((s: any) => s.name) : []} 
                onSelect={(val) => onUpdate?.("personalInfo.county", val)} 
              />
            ) : (
              <span>{personalInfo.county}</span>
            )}
          </div>
        )}
        {(personalInfo.location || isEditable) && (
          <ContactChip 
            icon={<MapPin size={10} />} 
            text={personalInfo.location || "City"} 
            isEditable={isEditable}
            onUpdate={(val) => onUpdate?.("personalInfo.location", val)}
          />
        )}
        {(personalInfo.linkedin || isEditable) && (
          <ContactChip 
            icon={<Linkedin size={10} />} 
            text={personalInfo.linkedin || "LinkedIn"} 
            href={formatUrl(personalInfo.linkedin)}
            isEditable={isEditable}
            onUpdate={(val) => onUpdate?.("personalInfo.linkedin", val)}
          />
        )}
        {(personalInfo.website || isEditable) && (
          <ContactChip 
            icon={<Globe size={10} />} 
            text={personalInfo.website || "Website"} 
            href={formatUrl(personalInfo.website)}
            isEditable={isEditable}
            onUpdate={(val) => onUpdate?.("personalInfo.website", val)}
          />
        )}
        {(personalInfo.github || isEditable) && (
          <ContactChip 
            icon={<Github size={10} />} 
            text={personalInfo.github || "GitHub"} 
            href={formatUrl(personalInfo.github)}
            isEditable={isEditable}
            onUpdate={(val) => onUpdate?.("personalInfo.github", val)}
          />
        )}
        {(personalInfo.facebook || isEditable) && (
          <ContactChip 
            icon={<Facebook size={10} />} 
            text={personalInfo.facebook || "Facebook"} 
            href={formatUrl(personalInfo.facebook)}
            isEditable={isEditable}
            onUpdate={(val) => onUpdate?.("personalInfo.facebook", val)}
          />
        )}
      </div>

      {/* ── MAIN BODY ── */}
      <div style={{ padding: "32px 56px 48px", flex: 1 }}>
        {/* Summary */}
        {(personalInfo.summary || isEditable) && (
          <div style={{ marginBottom: "28px", position: "relative" }}>
            <SectionTitle label="Professional Profile" />
            <div
              contentEditable={isEditable}
              suppressContentEditableWarning={true}
              onBlur={(e) => onUpdate?.("personalInfo.summary", e.currentTarget.innerText)}
              style={{
                fontSize: "12.5px",
                color: "#374151",
                lineHeight: 1.75,
                textAlign: "justify",
                borderLeft: "3px solid #7c3aed",
                paddingLeft: "16px",
                outline: "none",
                minHeight: isEditable ? "60px" : "auto",
                whiteSpace: "pre-wrap",
                backgroundColor: isEditable ? "rgba(124, 58, 237, 0.02)" : "transparent",
              }}
              placeholder="Briefly describe your professional journey..."
            >
              {personalInfo.summary}
            </div>
          </div>
        )}

        {/* Personal Details */}
        {(hasPersonalDetails || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <SectionTitle label="Personal Details" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 32px", paddingLeft: "16px", borderLeft: "2px solid #e5e2f0" }}>
              {(personalInfo.dateOfBirth || isEditable) && <DetailRow label="Date of Birth" value={personalInfo.dateOfBirth} type="date" isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.dateOfBirth", val)} />}
              {(personalInfo.placeOfBirth || isEditable) && <DetailRow label="Place of Birth" value={personalInfo.placeOfBirth} isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.placeOfBirth", val)} />}
              {(personalInfo.nationality || isEditable) && <DetailRow label="Nationality" value={personalInfo.nationality} type="country" isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.nationality", val)} />}
              {(personalInfo.gender || isEditable) && <DetailRow label="Gender" value={personalInfo.gender} type="options" options={["Male", "Female", "Other", "Prefer not to say"]} isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.gender", val)} />}
              {(personalInfo.passport || isEditable) && <DetailRow label="Passport" value={personalInfo.passport} isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.passport", val)} />}
              {(personalInfo.workPermit || isEditable) && <DetailRow label="Work Permit" value={personalInfo.workPermit} isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.workPermit", val)} />}
            </div>
          </div>
        )}

        {/* Experience */}
        {(experience.length > 0 || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <SectionTitle label="Work Experience" noMargin />
              {isEditable && (
                <button 
                  onClick={() => onUpdate?.("experience.add", {})}
                  style={{ background: "none", border: "none", color: "#7c3aed", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700 }}
                >
                  <PlusCircle size={14} /> ADD ROLE
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {experience.map((exp, idx) => (
                <div key={exp.id} style={{ paddingLeft: "16px", borderLeft: "2px solid #e5e2f0", position: "relative", group: "true" }}>
                  {isEditable && (
                    <button 
                      onClick={() => onUpdate?.("experience.remove", exp.id)}
                      style={{ position: "absolute", left: "-24px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                      title="Remove experience"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                    <span 
                      contentEditable={isEditable}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.currentTarget.innerText)}
                      style={{ fontWeight: 700, fontSize: "13.5px", color: "#1a1a2e", outline: "none", minWidth: "100px" }}
                    >
                      {exp.role || "Role Title"}
                    </span>
                    <span 
                      contentEditable={isEditable}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => onUpdate?.(`experience.${exp.id}.duration`, e.currentTarget.innerText)}
                      style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 600, whiteSpace: "nowrap", marginLeft: "12px", outline: "none" }}
                    >
                      {exp.duration || "Jan 2020 - Present"}
                    </span>
                  </div>
                  <p 
                    contentEditable={isEditable}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.currentTarget.innerText)}
                    style={{ fontSize: "12px", color: "#6d28d9", marginBottom: "2px", fontStyle: "italic", outline: "none" }}
                  >
                    {exp.company || "Company Name"}
                  </p>
                  <div style={{ marginBottom: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#6b7280", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={10} strokeWidth={isEditable ? 3 : 2} /> 
                      {isEditable ? (
                        <SearchableSelect 
                          value={exp.location || "Location"} 
                          options={countriesData.map(c => c.name)} 
                          onSelect={(val) => onUpdate?.(`experience.${exp.id}.location`, val)} 
                        />
                      ) : (
                        <span>{exp.location}</span>
                      )}
                    </span>
                  </div>
                  <ul style={{ paddingLeft: "16px", margin: 0, listStyleType: "disc" }}>
                    {exp.description.map((bullet, i) => (
                      <li key={i} style={{ fontSize: "12px", color: "#374151", lineHeight: 1.65, marginBottom: "4px", position: "relative" }}>
                        <div
                          contentEditable={isEditable}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => {
                            const newBullets = [...exp.description]
                            newBullets[i] = e.currentTarget.innerText
                            onUpdate?.(`experience.${exp.id}.description`, newBullets.filter(b => b.trim() || isEditable))
                          }}
                          style={{ outline: "none" }}
                        >
                          {bullet}
                        </div>
                        {isEditable && exp.description.length > 1 && (
                           <Trash2 
                            size={10} 
                            style={{ position: "absolute", right: "-20px", top: "4px", cursor: "pointer", color: "#9ca3af" }} 
                            onClick={() => {
                              const newBullets = exp.description.filter((_, idx) => idx !== i)
                              onUpdate?.(`experience.${exp.id}.description`, newBullets)
                            }}
                          />
                        )}
                      </li>
                    ))}
                    {isEditable && (
                      <button 
                        onClick={() => onUpdate?.(`experience.${exp.id}.description`, [...exp.description, ""])}
                        style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "10px", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <PlusCircle size={10} /> Add bullet point
                      </button>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {(education.length > 0 || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <SectionTitle label="Education & Training" noMargin />
              {isEditable && (
                <button 
                  onClick={() => onUpdate?.("education.add", {})}
                  style={{ background: "none", border: "none", color: "#7c3aed", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700 }}
                >
                  <PlusCircle size={14} /> ADD DEGREE
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {education.map((edu) => (
                <div key={edu.id} style={{ paddingLeft: "16px", borderLeft: "2px solid #e5e2f0", position: "relative" }}>
                  {isEditable && (
                    <button 
                      onClick={() => onUpdate?.("education.remove", edu.id)}
                      style={{ position: "absolute", left: "-24px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                    <span 
                      contentEditable={isEditable}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.currentTarget.innerText)}
                      style={{ fontWeight: 700, fontSize: "13px", color: "#1a1a2e", outline: "none" }}
                    >
                      {edu.degree || "Degree Name"}
                    </span>
                    <span 
                      contentEditable={isEditable}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => onUpdate?.(`education.${edu.id}.duration`, e.currentTarget.innerText)}
                      style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 600, whiteSpace: "nowrap", marginLeft: "12px", outline: "none" }}
                    >
                      {edu.duration || "Year"}
                    </span>
                  </div>
                  <p 
                    contentEditable={isEditable}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.currentTarget.innerText)}
                    style={{ fontSize: "12px", color: "#6d28d9", marginBottom: "2px", fontStyle: "italic", outline: "none" }}
                  >
                    {edu.school || "Institution Name"}
                  </p>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", color: "#6b7280", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={10} /> 
                      {isEditable ? (
                        <SearchableSelect 
                          value={edu.location || "Location"} 
                          options={countriesData.map(c => c.name)} 
                          onSelect={(val) => onUpdate?.(`education.${edu.id}.location`, val)} 
                        />
                      ) : (
                        <span>{edu.location}</span>
                      )}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ fontSize: "11px", color: "#374151" }}>
                        <span style={{ fontWeight: 600, color: "#4c1d95" }}>Field:</span>{" "}
                        <span 
                          contentEditable={isEditable}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => onUpdate?.(`education.${edu.id}.fieldOfStudy`, e.currentTarget.innerText)}
                          style={{ outline: "none" }}
                        >
                          {edu.fieldOfStudy || "Field of Study"}
                        </span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#374151" }}>
                        <span style={{ fontWeight: 600, color: "#4c1d95" }}>Grade:</span>{" "}
                        <span 
                          contentEditable={isEditable}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => onUpdate?.(`education.${edu.id}.grade`, e.currentTarget.innerText)}
                          style={{ outline: "none" }}
                        >
                          {edu.grade || "Grade"}
                        </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {(allSkills.length > 0 || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <SectionTitle label="Core Competencies" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
              {allSkills.map((skill, i) => (
                <span
                  key={i}
                  contentEditable={isEditable}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    const newSkills = [...allSkills]
                    newSkills[i] = e.currentTarget.innerText
                    onUpdate?.("skills", newSkills.filter(s => s.trim()))
                  }}
                  style={{
                    background: "#f5f3ff",
                    color: "#4c1d95",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    padding: "4px 12px",
                    borderRadius: "6px",
                    border: "1px solid #e5e2f0",
                    outline: "none",
                    position: "relative",
                  }}
                >
                  {skill}
                </span>
              ))}
              {isEditable && (
                <button
                  onClick={() => onUpdate?.("skills", [...allSkills, "New Skill"])}
                  style={{
                    background: "rgba(124, 58, 237, 0.1)",
                    color: "#7c3aed",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: "6px",
                    border: "1px dashed #7c3aed",
                    cursor: "pointer",
                  }}
                >
                  + ADD SKILL
                </button>
              )}
            </div>
          </div>
        )}

        {/* Languages */}
        {((languages && languages.length > 0) || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <SectionTitle label="Languages" noMargin />
              {isEditable && (
                <button 
                  onClick={() => onUpdate?.("languages.add", {})}
                  style={{ background: "none", border: "none", color: "#7c3aed", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700 }}
                >
                  <PlusCircle size={14} /> ADD
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "8px" }}>
              {(languages || []).map((lang, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f5f3ff",
                    border: "1px solid #e5e2f0",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: "100px",
                    position: "relative",
                  }}
                >
                  {isEditable && (
                    <button 
                      onClick={() => onUpdate?.("languages.remove", i)}
                      style={{ position: "absolute", top: "-8px", right: "-8px", background: "#ef4444", color: "white", borderRadius: "50%", border: "none", width: "16px", height: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyCenter: "center", padding: 0 }}
                    >
                      <Trash2 size={8} />
                    </button>
                  )}
                  <span 
                    contentEditable={isEditable}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.currentTarget.innerText)}
                    style={{ fontWeight: 700, fontSize: "12px", color: "#1a1a2e", outline: "none" }}
                  >
                    {lang.name || "Language"}
                  </span>
                  <div style={{ width: "100%", textAlign: "center" }}>
                    {isEditable ? (
                       <PopSelect 
                          value={lang.proficiency || "Proficiency"} 
                          options={["Beginner", "Elementary", "Intermediate", "Upper Intermediate", "Advanced", "Native/Bilingual"]}
                          onSelect={(val) => onUpdate?.(`languages.${i}.proficiency`, val)}
                       />
                    ) : (
                      <span style={{ fontSize: "10px", color: "#7c3aed", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {lang.proficiency}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {(projects.length > 0 || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <SectionTitle label="Projects" noMargin />
              {isEditable && (
                <button 
                  onClick={() => onUpdate?.("projects.add", {})}
                  style={{ background: "none", border: "none", color: "#7c3aed", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700 }}
                >
                  <PlusCircle size={14} /> ADD PROJECT
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {(projects || []).map((proj) => (
                <div key={proj.id} style={{ position: "relative" }}>
                  {isEditable && (
                    <button 
                      onClick={() => onUpdate?.("projects.remove", proj.id)}
                      style={{ position: "absolute", left: "-24px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span 
                      contentEditable={isEditable}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => onUpdate?.(`projects.${proj.id}.name`, e.currentTarget.innerText)}
                      style={{ fontWeight: 700, fontSize: "13px", color: "#1a1a2e", outline: "none" }}
                    >
                      {proj.name || "Project Name"}
                    </span>
                    <span 
                      contentEditable={isEditable}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => onUpdate?.(`projects.${proj.id}.link`, e.currentTarget.innerText)}
                      style={{ fontSize: "10px", color: "#7c3aed", textDecoration: "none", outline: "none" }}
                    >
                      {proj.link || "Project Link"}
                    </span>
                  </div>
                  <div
                    contentEditable={isEditable}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => onUpdate?.(`projects.${proj.id}.description`, e.currentTarget.innerText)}
                    style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6, marginTop: "3px", outline: "none", minHeight: isEditable ? "30px" : "auto", backgroundColor: isEditable ? "rgba(124, 58, 237, 0.02)" : "transparent" }}
                    placeholder="Describe your project..."
                  >
                    {proj.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Volunteering */}
        {((volunteering && volunteering.length > 0) || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <SectionTitle label="Volunteering" noMargin />
              {isEditable && (
                <button 
                  onClick={() => onUpdate?.("volunteering.add", {})}
                  style={{ background: "none", border: "none", color: "#7c3aed", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700 }}
                >
                  <PlusCircle size={14} /> ADD
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {(volunteering || []).map((vol) => (
                <div key={vol.id} style={{ paddingLeft: "16px", borderLeft: "2px solid #e5e2f0", position: "relative" }}>
                  {isEditable && (
                    <button 
                      onClick={() => onUpdate?.("volunteering.remove", vol.id)}
                      style={{ position: "absolute", left: "-24px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                    <span 
                      contentEditable={isEditable}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.currentTarget.innerText)}
                      style={{ fontWeight: 700, fontSize: "13px", color: "#1a1a2e", outline: "none" }}
                    >
                      {vol.role || "Volunteer Role"}
                    </span>
                    <span 
                      contentEditable={isEditable}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.duration`, e.currentTarget.innerText)}
                      style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 600, whiteSpace: "nowrap", marginLeft: "12px", outline: "none" }}
                    >
                      {vol.duration || "Duration"}
                    </span>
                  </div>
                  <p 
                    contentEditable={isEditable}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.currentTarget.innerText)}
                    style={{ fontSize: "12px", color: "#6d28d9", marginBottom: "2px", fontStyle: "italic", outline: "none" }}
                  >
                    {vol.organization || "Organization"}
                  </p>
                  <div style={{ marginBottom: "6px" }}>
                    <span 
                      contentEditable={isEditable}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.location`, e.currentTarget.innerText)}
                      style={{ fontSize: "11px", color: "#6b7280", display: "inline-flex", alignItems: "center", gap: "4px", outline: "none" }}
                    >
                      <MapPin size={10} /> {vol.location || "Location"}
                    </span>
                  </div>
                  <div
                    contentEditable={isEditable}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.currentTarget.innerText)}
                    style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6, outline: "none", backgroundColor: isEditable ? "rgba(124, 58, 237, 0.02)" : "transparent" }}
                  >
                    {vol.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SectionTitle({ label, noMargin }: { label: string; noMargin?: boolean }) {
  return (
    <div style={{ marginBottom: noMargin ? "0" : "10px" }}>
      <h3
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "#4c1d95",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          marginBottom: "4px",
        }}
      >
        {label}
      </h3>
      <div style={{ height: "2px", background: "linear-gradient(90deg, #7c3aed, transparent)", width: "100%" }} />
    </div>
  )
}

function DetailRow({ 
  label, 
  value, 
  isEditable, 
  onUpdate,
  type = "text",
  options = []
}: { 
  label: string; 
  value: string; 
  isEditable?: boolean; 
  onUpdate?: (val: string) => void;
  type?: "text" | "date" | "options" | "country";
  options?: string[];
}) {
  if (isEditable) {
    if (type === "options") {
      return (
        <div style={{ display: "flex", gap: "8px", fontSize: "12px", alignItems: "center" }}>
          <span style={{ fontWeight: 600, color: "#4c1d95", minWidth: "110px" }}>{label}:</span>
          <PopSelect value={value || "---"} options={options} onSelect={(val) => onUpdate?.(val)} />
        </div>
      )
    }
    if (type === "country") {
      return (
        <div style={{ display: "flex", gap: "8px", fontSize: "12px", alignItems: "center" }}>
          <span style={{ fontWeight: 600, color: "#4c1d95", minWidth: "110px" }}>{label}:</span>
          <SearchableSelect 
            value={value || "---"} 
            options={countriesData.map(c => c.name)} 
            onSelect={(val) => onUpdate?.(val)} 
          />
        </div>
      )
    }
    if (type === "date") {
      return (
        <div style={{ display: "flex", gap: "8px", fontSize: "12px", alignItems: "center" }}>
          <span style={{ fontWeight: 600, color: "#4c1d95", minWidth: "110px" }}>{label}:</span>
          <input 
            type="date"
            value={value || ""}
            onChange={(e) => onUpdate?.(e.target.value)}
            style={{ 
              border: "1px dashed #7c3aed", 
              background: "transparent", 
              color: "#374151", 
              fontSize: "12px",
              padding: "2px 4px",
              outline: "none"
            }}
          />
        </div>
      )
    }
  }

  return (
    <div style={{ display: "flex", gap: "8px", fontSize: "12px" }}>
      <span style={{ fontWeight: 600, color: "#4c1d95", minWidth: "110px" }}>{label}:</span>
      <span 
        contentEditable={isEditable}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdate?.(e.currentTarget.innerText)}
        style={{ color: "#374151", outline: "none", borderBottom: isEditable ? "1px dashed rgba(124,58,237,0.2)" : "none" }}
      >
        {value || (isEditable ? "---" : "")}
      </span>
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
          borderBottom: "1px dashed #7c3aed",
          color: "#374151",
          fontSize: "12px",
          cursor: "pointer",
          padding: "2px 4px",
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
          border: "1px solid #e5e2f0",
          borderRadius: "8px",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
          padding: "4px",
          maxHeight: "300px",
          overflowY: "auto",
          marginTop: "4px"
        }}>
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onSelect(opt)
                setIsOpen(false)
              }}
              style={{
                padding: "6px 12px",
                fontSize: "11px",
                cursor: "pointer",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: value === opt ? "#f5f3ff" : "transparent",
                color: value === opt ? "#7c3aed" : "#374151",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = value === opt ? "#f5f3ff" : "transparent")}
            >
              {opt} {value === opt && <Check size={10} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchableSelect({ value, options, onSelect }: { value: string; options: string[]; onSelect: (val: string) => void }) {
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
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "none",
          border: "none",
          borderBottom: "1px dashed #7c3aed",
          color: "#374151",
          fontSize: "12px",
          cursor: "pointer",
          padding: "2px 4px",
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
          border: "1px solid #e5e2f0",
          borderRadius: "8px",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
          padding: "8px",
          minWidth: "200px",
          marginTop: "4px"
        }}>
          <div style={{ position: "relative", marginBottom: "8px" }}>
            <Search size={12} style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input 
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{
                width: "100%",
                padding: "6px 8px 6px 28px",
                fontSize: "11px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                outline: "none"
              }}
            />
          </div>
          <div style={{ maxHeight: "350px", overflowY: "auto" }}>
            {filtered.map((opt) => (
              <div
                key={opt}
                onClick={() => {
                  onSelect(opt)
                  setIsOpen(false)
                }}
                style={{
                  padding: "6px 12px",
                  fontSize: "11px",
                  cursor: "pointer",
                  borderRadius: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: value === opt ? "#f5f3ff" : "transparent",
                  color: value === opt ? "#7c3aed" : "#374151",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = value === opt ? "#f5f3ff" : "transparent")}
              >
                {opt} {value === opt && <Check size={10} />}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: "8px", fontSize: "11px", color: "#9ca3af", textAlign: "center" }}>No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ContactChip({ icon, text, href, isEditable, onUpdate }: { icon: React.ReactNode; text: string; href?: string; isEditable?: boolean; onUpdate?: (val: string) => void }) {
  const inner = (
    <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</span>
      <span 
        contentEditable={isEditable}
        suppressContentEditableWarning={true}
        onBlur={(e) => onUpdate?.(e.currentTarget.innerText)}
        style={{ textDecoration: "none", color: href ? "#6d28d9" : "#4c1d95", outline: "none" }}
      >
        {text || "Update"}
      </span>
    </span>
  )

  if (isEditable) return inner

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      {inner}
    </a>
  ) : (
    inner
  )
}
