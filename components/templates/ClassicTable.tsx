import { Phone, Mail, Linkedin, MapPin, Globe, Github, Facebook, PlusCircle, Trash2, Sparkles, Loader2, X, ChevronDown, Check, Search } from "lucide-react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"
import React, { useRef, useState, useEffect } from "react"
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

export function ClassicTable({ 
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

  // Flatten skills for the competencies table
  const allSkillItems = skills.flatMap((s) => s.items)

  return (
    <div
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "'Times New Roman', 'Georgia', serif",
        fontSize: "13px",
        color: "#000",
        padding: "56px 64px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          borderBottom: "2.5px solid #000",
          borderTop: "2.5px solid #000",
          padding: "12px 0",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        {isEditable ? (
          <input
            defaultValue={personalInfo.fullName}
            placeholder="Your Name"
            onBlur={(e) => onUpdate?.("personalInfo.fullName", e.target.value)}
            style={{
              fontSize: "26px",
              fontWeight: 700,
              letterSpacing: "1px",
              marginBottom: "4px",
              fontFamily: "'Times New Roman', serif",
              textAlign: "center",
              width: "100%",
              background: "transparent",
              border: "1px dashed #000",
              outline: "none"
            }}
          />
        ) : (
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 700,
              letterSpacing: "1px",
              marginBottom: "4px",
              fontFamily: "'Times New Roman', serif",
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
              fontSize: "13px",
              fontStyle: "italic",
              color: "#333",
              marginBottom: "6px",
              textAlign: "center",
              width: "100%",
              background: "transparent",
              border: "1px dashed #333",
              outline: "none"
            }}
          />
        ) : personalInfo.jobTitle && (
          <p
            style={{
              fontSize: "13px",
              fontStyle: "italic",
              color: "#333",
              marginBottom: "6px",
            }}
          >
            {personalInfo.jobTitle}
          </p>
        )}
        {(hasPersonalDetails || isEditable) && (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, 1fr)", 
            gap: "8px 20px",
            marginTop: "12px",
            padding: "8px 0",
            borderTop: "1px solid #eee",
            fontSize: "11px",
            textAlign: "left"
          }}>
            {(personalInfo.dateOfBirth || isEditable) && (
              <div style={{ display: "flex", gap: "4px" }}>
                <span style={{ fontWeight: 700 }}>DOB:</span>
                {isEditable ? (
                  <input 
                    type="date"
                    defaultValue={personalInfo.dateOfBirth}
                    onChange={(e) => onUpdate?.("personalInfo.dateOfBirth", e.target.value)}
                    style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", outline: "none", width: "100%" }}
                  />
                ) : <span>{personalInfo.dateOfBirth}</span>}
              </div>
            )}
            {(personalInfo.nationality || isEditable) && (
              <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                <span style={{ fontWeight: 700 }}>Nationality:</span>
                {isEditable ? (
                  <SearchableSelect
                    value={personalInfo.nationality || "Select"}
                    options={countriesData.map(c => c.name)}
                    onSelect={(val) => onUpdate?.("personalInfo.nationality", val)}
                  />
                ) : <span>{personalInfo.nationality}</span>}
              </div>
            )}
            {(personalInfo.gender || isEditable) && (
              <div style={{ display: "flex", gap: "4px" }}>
                <span style={{ fontWeight: 700 }}>Gender:</span>
                {isEditable ? (
                  <select 
                    value={personalInfo.gender}
                    onChange={(e) => onUpdate?.("personalInfo.gender", e.target.value)}
                    style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", outline: "none", width: "100%" }}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : <span>{personalInfo.gender}</span>}
              </div>
            )}
            {(personalInfo.placeOfBirth || isEditable) && (
              <div style={{ display: "flex", gap: "4px" }}>
                <span style={{ fontWeight: 700 }}>Place of Birth:</span>
                {isEditable ? (
                  <input 
                    defaultValue={personalInfo.placeOfBirth}
                    onBlur={(e) => onUpdate?.("personalInfo.placeOfBirth", e.target.value)}
                    placeholder="Place of Birth"
                    style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", outline: "none", width: "100%" }}
                  />
                ) : <span>{personalInfo.placeOfBirth}</span>}
              </div>
            )}
            {(personalInfo.passport || isEditable) && (
              <div style={{ display: "flex", gap: "4px" }}>
                <span style={{ fontWeight: 700 }}>Passport:</span>
                {isEditable ? (
                  <input 
                    defaultValue={personalInfo.passport}
                    placeholder="Passport"
                    onBlur={(e) => onUpdate?.("personalInfo.passport", e.target.value)}
                    style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", outline: "none", width: "100%" }}
                  />
                ) : <span>{personalInfo.passport}</span>}
              </div>
            )}
            {(personalInfo.workPermit || isEditable) && (
              <div style={{ display: "flex", gap: "4px" }}>
                <span style={{ fontWeight: 700 }}>Permit:</span>
                {isEditable ? (
                  <input 
                    placeholder="Permit"
                    defaultValue={personalInfo.workPermit}
                    onBlur={(e) => onUpdate?.("personalInfo.workPermit", e.target.value)}
                    style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", outline: "none", width: "100%" }}
                  />
                ) : <span>{personalInfo.workPermit}</span>}
              </div>
            )}
          </div>
        )}
        <div
          style={{
            fontSize: "11.5px",
            color: "#333",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
            marginTop: "10px",
            alignItems: "center",
            borderTop: "1px solid #eee",
            paddingTop: "8px"
          }}
        >
          {(personalInfo.phone || isEditable) && (
            <ContactItem
              icon={<Phone size={11} />}
              text={`${personalInfo.phoneCode || ''} ${personalInfo.phone}`}
              href={isEditable ? undefined : `tel:${personalInfo.phoneCode || ''}${personalInfo.phone}`}
              isEditable={isEditable}
              onUpdate={(val) => {
                const [code, ...rest] = val.split(" ")
                onUpdate?.("personalInfo.phoneCode", code)
                onUpdate?.("personalInfo.phone", rest.join(""))
              }}
              renderEditable={() => (
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
                  <input
                    defaultValue={personalInfo.phone}
                    placeholder="Phone Number"
                    onBlur={(e) => onUpdate?.("personalInfo.phone", e.target.value)}
                    style={{ fontSize: "11.5px", color: "#000", background: "transparent", border: "1px dashed #000", outline: "none", padding: "1px 4px", width: "100px" }}
                  />
                </div>
              )}
            />
          )}
          {(personalInfo.email || isEditable) && (
            <ContactItem icon={<Mail size={11} />} text={personalInfo.email} placeholder="email@example.com" href={isEditable ? undefined : `mailto:${personalInfo.email}`} isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.email", val)} />
          )}
          {(personalInfo.linkedin || isEditable) && (
            <ContactItem icon={<Linkedin size={11} />} text={personalInfo.linkedin} placeholder="linkedin.com/in/username" href={isEditable ? undefined : formatUrl(personalInfo.linkedin)} isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.linkedin", val)} />
          )}
          {(personalInfo.country || personalInfo.county || personalInfo.location || isEditable) && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ display: "flex", alignItems: "center", color: "#666" }}><MapPin size={11} /></span>
              {isEditable ? (
                <div style={{ display: "flex", gap: "4px" }}>
                  <SearchableSelect
                    value={personalInfo.country || "Country"}
                    options={countriesData.map(c => c.name)}
                    onSelect={(val) => {
                       onUpdate?.("personalInfo.country", val)
                       onUpdate?.("personalInfo.county", "")
                    }}
                  />
                  <SearchableSelect
                    value={personalInfo.county || "State"}
                    options={personalInfo.country ? (countriesData.find((c: any) => c.name === personalInfo.country)?.states || []).map((s: any) => s.name) : []}
                    onSelect={(val) => onUpdate?.("personalInfo.county", val)}
                  />
                  <input
                    defaultValue={personalInfo.location || ""}
                    placeholder="Postal Code"
                    onBlur={(e) => onUpdate?.("personalInfo.location", e.target.value)}
                    style={{ fontSize: "11.5px", color: "#000", background: "transparent", border: "1px dashed #000", outline: "none", padding: "1px 4px", width: "80px" }}
                  />
                </div>
              ) : (
                <span style={{ fontSize: "11.5px", color: "#333" }}>
                  {[personalInfo.location, personalInfo.county, personalInfo.country].filter(Boolean).join(", ")}
                </span>
              )}
            </div>
          )}
          {(personalInfo.website || isEditable) && (
            <ContactItem icon={<Globe size={11} />} text={personalInfo.website || ""} placeholder="portfolio.com" href={isEditable ? undefined : formatUrl(personalInfo.website)} isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.website", val)} />
          )}
          {(personalInfo.github || isEditable) && (
            <ContactItem icon={<Github size={11} />} text={personalInfo.github || ""} placeholder="github.com/username" href={isEditable ? undefined : formatUrl(personalInfo.github)} isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.github", val)} />
          )}
          {(personalInfo.facebook || isEditable) && (
            <ContactItem icon={<Facebook size={11} />} text={personalInfo.facebook || ""} placeholder="facebook.com/username" href={isEditable ? undefined : formatUrl(personalInfo.facebook)} isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.facebook", val)} />
          )}
        </div>
      </div>

      {/* ── PROFESSIONAL SUMMARY ── */}
      {(personalInfo.summary || isEditable) && (
        <Section 
          label="Professional Summary" 
          isEditable={isEditable}
          onRefine={() => onRefine?.("summary")}
          refining={refiningId === "summary"}
        >
          {isEditable ? (
            <textarea
              defaultValue={personalInfo.summary}
              placeholder="Summary..."
              onBlur={(e) => onUpdate?.("personalInfo.summary", e.target.value)}
              style={{
                width: "100%",
                minHeight: "100px",
                fontSize: "13px",
                lineHeight: 1.7,
                color: "#111",
                background: "transparent",
                border: "1px dashed #000",
                outline: "none",
                fontFamily: "inherit",
                resize: "vertical"
              }}
            />
          ) : (
            <MarkdownText 
              content={personalInfo.summary}
              style={{
                fontSize: "13px",
                lineHeight: 1.7,
                color: "#111",
                textAlign: "justify",
              }}
            />
          )}
        </Section>
      )}

      {/* ── EDUCATION ── */}
      {(education.length > 0 || isEditable) && (
        <Section 
          label="Education" 
          isEditable={isEditable} 
          onAdd={() => onUpdate?.("education.add", {})}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {education.map((edu) => (
                <tr key={edu.id} style={{ position: "relative" }}>
                  <td
                    style={{
                      paddingBottom: "12px",
                      verticalAlign: "top",
                      width: "60%",
                    }}
                  >
                    {isEditable && (
                      <button 
                        onClick={() => onUpdate?.("education.remove", edu.id)}
                        style={{ position: "absolute", left: "-24px", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                    {isEditable ? (
                      <div style={{ width: "95%" }}>
                        <input
                          defaultValue={edu.degree}
                          placeholder="Degree"
                          onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)}
                          style={{ fontWeight: 700, fontSize: "13px", width: "100%", background: "transparent", border: "1px dashed #000", outline: "none", marginBottom: "2px" }}
                        />
                         <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                          <input
                            defaultValue={edu.fieldOfStudy}
                            placeholder="Field of Study"
                            onBlur={(e) => onUpdate?.(`education.${edu.id}.fieldOfStudy`, e.target.value)}
                            style={{ fontSize: "12px", width: "50%", background: "transparent", border: "1px dashed #000", outline: "none" }}
                          />
                          <input
                            defaultValue={edu.grade}
                            placeholder="Grade/GPA"
                            onBlur={(e) => onUpdate?.(`education.${edu.id}.grade`, e.target.value)}
                            style={{ fontSize: "11px", width: "30%", background: "transparent", border: "1px dashed #000", outline: "none", color: "#666" }}
                          />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
                          <MapPin size={10} color="#666" />
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
                            placeholder="City/Zip"
                            onBlur={(e) => onUpdate?.(`education.${edu.id}.location`, e.target.value)}
                            style={{ fontSize: "11px", width: "80px", background: "transparent", border: "1px dashed #000", outline: "none", color: "#666" }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "13px" }}>
                          {edu.degree}
                        </div>
                        {(edu.fieldOfStudy || edu.grade) && (
                          <div style={{ fontSize: "12px", color: "#333", marginBottom: "2px" }}>
                            {edu.fieldOfStudy}{edu.grade && ` • Grade: ${edu.grade}`}
                          </div>
                        )}
                        {edu.location || edu.county || edu.country ? (
                          <div style={{ fontSize: "11px", color: "#666", display: "flex", alignItems: "center", gap: "4px", marginTop: "1px" }}>
                            <MapPin size={10} /> {[edu.location, edu.county, edu.country].filter(Boolean).join(", ")}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </td>
                  <td
                    style={{
                      paddingBottom: "12px",
                      verticalAlign: "top",
                      width: "25%",
                    }}
                  >
                    {isEditable ? (
                      <input
                        defaultValue={edu.school}
                        placeholder="School"
                        onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)}
                        style={{ fontSize: "12px", width: "95%", background: "transparent", border: "1px dashed #000", outline: "none" }}
                      />
                    ) : (
                      edu.school
                    )}
                  </td>
                  <td
                    style={{
                      paddingBottom: "12px",
                      verticalAlign: "top",
                      textAlign: "right",
                      width: "15%",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isEditable ? (
                      <DurationPicker 
                        value={edu.duration} 
                        onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} 
                      />
                    ) : (
                      edu.duration
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}


      {/* ── CORE COMPETENCIES ── */}
      {(allSkillItems.length > 0 || isEditable) && (
        <Section 
          label="Core Competencies" 
          isEditable={isEditable}
          onAdd={() => onUpdate?.("skills", [...allSkillItems, ""])}
        >
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "8px 16px", 
            padding: "10px", 
            border: "1px solid #999",
            minHeight: "40px",
            alignItems: "center"
          }}>
            {allSkillItems.map((skill, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {isEditable ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "2px", background: "#f9f9f9", padding: "2px 6px", border: "1px dashed #ccc", borderRadius: "4px" }}>
                    <input
                      defaultValue={skill}
                      placeholder="Add skill"
                      onBlur={(e) => {
                        const newSkills = [...allSkillItems]
                        newSkills[idx] = e.target.value
                        onUpdate?.("skills", newSkills)
                      }}
                      style={{ fontSize: "11px", background: "transparent", border: "none", outline: "none", width: "80px" }}
                    />
                    <button 
                      onClick={() => onUpdate?.("skills", allSkillItems.filter((_, i) => i !== idx))}
                      style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", opacity: 0.6 }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: "12px", fontWeight: 500 }}>
                    {skill}{idx < allSkillItems.length - 1 ? " •" : ""}
                  </span>
                )}
              </div>
            ))}
            {isEditable && allSkillItems.length === 0 && (
              <span 
                onClick={() => onUpdate?.("skills", [""])}
                style={{ fontSize: "12px", color: "#999", fontStyle: "italic", cursor: "pointer", textDecoration: "underline dashed" }}
              >
                Click here to add your first skill...
              </span>
            )}
          </div>
        </Section>
      )}

      {/* ── WORK EXPERIENCE ── */}
      {(experience.length > 0 || isEditable) && (
        <Section 
          label="Professional Experience" 
          isEditable={isEditable}
          onAdd={() => onUpdate?.("experience.add", {})}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {experience.map((exp) => (
              <div key={exp.id} style={{ position: "relative" }}>
                {isEditable && (
                  <button 
                    onClick={() => onUpdate?.("experience.remove", exp.id)}
                    style={{ position: "absolute", left: "-24px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  {isEditable ? (
                    <input
                      defaultValue={exp.company}
                      placeholder="Company"
                      onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)}
                      style={{ fontWeight: 700, fontSize: "13.5px", width: "60%", background: "transparent", border: "1px dashed #000", outline: "none" }}
                    />
                  ) : (
                    <span style={{ fontWeight: 700, fontSize: "13.5px" }}>
                      {exp.company}
                    </span>
                  )}
                  {isEditable ? (
                    <DurationPicker 
                      value={exp.duration} 
                      onChange={(val) => onUpdate?.(`experience.${exp.id}.duration`, val)} 
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: "12px",
                        fontStyle: "italic",
                        color: "#444",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {exp.duration}
                    </span>
                  )}
                </div>
                {isEditable ? (
                  <div style={{ marginBottom: "6px" }}>
                    <input
                      defaultValue={exp.role}
                      placeholder="Role"
                      onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)}
                      style={{ fontSize: "12.5px", fontStyle: "italic", color: "#555", width: "100%", background: "transparent", border: "1px dashed #000", outline: "none", marginBottom: "2px" }}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap" }}>
                      <MapPin size={11} color="#666" />
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
                        style={{ fontSize: "11.5px", fontStyle: "italic", color: "#666", width: "80px", background: "transparent", border: "1px dashed #000", outline: "none" }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: "6px" }}>
                    <p style={{ fontSize: "12.5px", fontStyle: "italic", color: "#555", margin: 0 }}>
                      {exp.role}
                    </p>
                    {exp.location || exp.county || exp.country ? (
                      <p style={{ fontSize: "12px", fontStyle: "italic", color: "#666", display: "flex", alignItems: "center", gap: "4px", margin: 0 }}>
                        <MapPin size={11} /> {[exp.location, exp.county, exp.country].filter(Boolean).join(", ")}
                      </p>
                    ) : null}
                  </div>
                )}
                {isEditable ? (
                  <div style={{ marginTop: "4px" }}>
                    {exp.description.map((bullet, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                         <input
                          defaultValue={bullet}
                          placeholder="Achievement..."
                          onBlur={(e) => {
                            const newDesc = [...exp.description]
                            newDesc[i] = e.target.value
                            onUpdate?.(`experience.${exp.id}.description`, newDesc)
                          }}
                          style={{ flex: 1, fontSize: "12px", background: "transparent", border: "1px dashed #000", outline: "none" }}
                        />
                        <button 
                          onClick={() => {
                            const newDesc = exp.description.filter((_, idx) => idx !== i)
                            onUpdate?.(`experience.${exp.id}.description`, newDesc)
                          }}
                          style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => onUpdate?.(`experience.${exp.id}.description`, [...exp.description, ""])}
                      style={{ fontSize: "11px", fontWeight: 700, cursor: "pointer", background: "none", border: "none", color: "#000" }}
                    >
                      + ADD BULLET
                    </button>
                  </div>
                ) : (
                  <ul
                    style={{
                      paddingLeft: "20px",
                      margin: 0,
                      listStyleType: "disc",
                    }}
                  >
                    {exp.description.filter(Boolean).map((bullet, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: "12.5px",
                          lineHeight: 1.65,
                          marginBottom: "3px",
                          color: "#111",
                          textAlign: "justify",
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
        </Section>
      )}

      {/* ── PROJECTS ── */}
      {(projects.length > 0 || isEditable) && (
        <Section 
          label="Projects" 
          isEditable={isEditable} 
          onAdd={() => onUpdate?.("projects.add", {})}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {projects.map((proj) => (
              <div key={proj.id} style={{ position: "relative" }}>
                {isEditable && (
                  <button 
                    onClick={() => onUpdate?.("projects.remove", proj.id)}
                    style={{ position: "absolute", left: "-24px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {isEditable ? (
                    <input
                      defaultValue={proj.name}
                      placeholder="Project Name"
                      onBlur={(e) => onUpdate?.(`projects.${proj.id}.name`, e.target.value)}
                      style={{ fontWeight: 700, fontSize: "13px", width: "50%", background: "transparent", border: "1px dashed #000", outline: "none" }}
                    />
                  ) : (
                    <span style={{ fontWeight: 700, fontSize: "13px" }}>
                      {proj.name}
                    </span>
                  )}
                  {isEditable ? (
                    <input
                      defaultValue={proj.link}
                      placeholder="Link"
                      onBlur={(e) => onUpdate?.(`projects.${proj.id}.link`, e.target.value)}
                      style={{ fontSize: "11px", color: "#1a3a5c", fontStyle: "italic", width: "40%", textAlign: "right", background: "transparent", border: "1px dashed #000", outline: "none" }}
                    />
                  ) : proj.link && (
                    <a
                      href={formatUrl(proj.link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: "11px",
                        color: "#1a3a5c",
                        fontStyle: "italic",
                        textDecoration: "none"
                      }}
                    >
                      {proj.link}
                    </a>
                  )}
                </div>
                {isEditable ? (
                  <textarea
                    defaultValue={proj.description}
                    placeholder="Description..."
                    onBlur={(e) => onUpdate?.(`projects.${proj.id}.description`, e.target.value)}
                    style={{ width: "100%", fontSize: "12.5px", color: "#333", background: "transparent", border: "1px dashed #000", outline: "none", minHeight: "60px", resize: "vertical" }}
                  />
                ) : proj.description && (
                  <MarkdownText 
                    content={proj.description}
                    style={{
                      fontSize: "12.5px",
                      color: "#333",
                      lineHeight: 1.6,
                      marginTop: "3px",
                      fontStyle: "italic",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </Section>
      )}


      {/* ── VOLUNTEERING ── */}
      {(volunteering && volunteering.length > 0 || isEditable) && (
        <Section 
          label="Volunteering" 
          isEditable={isEditable} 
          onAdd={() => onUpdate?.("volunteering.add", {})}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {(volunteering || []).map((vol) => (
              <div key={vol.id} style={{ position: "relative" }}>
                {isEditable && (
                  <button 
                    onClick={() => onUpdate?.("volunteering.remove", vol.id)}
                    style={{ position: "absolute", left: "-24px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {isEditable ? (
                    <input
                      defaultValue={vol.role}
                      placeholder="Role"
                      onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)}
                      style={{ fontWeight: 700, fontSize: "14px", width: "60%", background: "transparent", border: "1px dashed #000", outline: "none" }}
                    />
                  ) : (
                    <span style={{ fontWeight: 700, fontSize: "14px" }}>{vol.role}</span>
                  )}
                  {isEditable ? (
                    <DurationPicker 
                      value={vol.duration} 
                      onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} 
                    />
                  ) : (
                    <span style={{ fontSize: "12px", color: "#333", fontWeight: 700 }}>{vol.duration}</span>
                  )}
                </div>
                {isEditable ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
                    <input
                      defaultValue={vol.organization}
                      placeholder="Organization"
                      onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)}
                      style={{ fontSize: "13px", fontStyle: "italic", width: "150px", background: "transparent", border: "1px dashed #000", outline: "none", color: "#444" }}
                    />
                    <div style={{ display: "flex", gap: "4px" }}>
                      <MapPin size={10} color="#000" />
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
                        style={{ fontSize: "11px", width: "80px", background: "transparent", border: "1px dashed #000", outline: "none" }}
                      />
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: "13px", fontStyle: "italic", color: "#444", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{vol.organization}</span>
                    {(vol.location || vol.county || vol.country) && (
                      <span style={{ fontSize: "11px", color: "#666" }}>
                        {[vol.location, vol.county, vol.country].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </div>
                )}
                {isEditable ? (
                  <textarea
                    defaultValue={vol.description}
                    placeholder="Description..."
                    onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.target.value)}
                    style={{ width: "100%", fontSize: "12.5px", color: "#333", background: "transparent", border: "1px dashed #000", outline: "none", minHeight: "60px", resize: "vertical" }}
                  />
                ) : (
                  <MarkdownText content={vol.description} style={{ fontSize: "12.5px", color: "#333", lineHeight: 1.6 }} />
                )}
                {isEditable && (
                    <button 
                      onClick={() => onRefine?.("volunteering", vol.id)}
                      disabled={refiningId === vol.id || !vol.description}
                      style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 700, color: "#000", background: "rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.2)", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", marginTop: "4px", opacity: (refiningId === vol.id || !vol.description) ? 0.5 : 1 }}
                    >
                      {refiningId === vol.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                      AI REFINE
                    </button>
                  )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── LANGUAGES ── */}
      {(languages && languages.length > 0 || isEditable) && (
        <Section 
          label="Languages" 
          isEditable={isEditable} 
          onAdd={() => onUpdate?.("languages.add", { name: "New Language", proficiency: "Native" })}
          simpleAdd
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 40px" }}>
            {(languages || []).map((lang, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {isEditable && (
                    <button 
                      onClick={() => onUpdate?.("languages.remove", i)}
                      style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  {isEditable ? (
                    <input 
                      defaultValue={lang.name}
                      placeholder="Language"
                      onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.target.value)}
                      style={{ 
                        background: "transparent", 
                        border: "1px dashed #000", 
                        fontSize: "12px", 
                        color: "#000", 
                        padding: "1px 4px", 
                        outline: "none",
                        width: "110px",
                        fontWeight: 700 
                      }}
                    />
                  ) : (
                    <span style={{ fontWeight: 700 }}>{lang.name}</span>
                  )}
                </div>
                {isEditable ? (
                  <PopSelect 
                    value={lang.proficiency || "Level"}
                    options={["Native", "Fluent", "Professional", "Intermediate", "Basic"]}
                    onSelect={(val) => onUpdate?.(`languages.${i}.proficiency`, val)}
                  />
                ) : (
                  <span style={{ fontStyle: "italic", color: "#555" }}>({lang.proficiency})</span>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function DetailRow({ label, value, onUpdate, isEditable }: { label: string, value?: string, onUpdate?: (val: string) => void, isEditable: boolean }) {
  if (!isEditable && !value) return null
  return (
    <div style={{ fontSize: "12px", display: "flex", gap: "8px" }}>
      <span style={{ fontWeight: 700, minWidth: "90px" }}>{label}:</span>
      {isEditable ? (
        <input 
          defaultValue={value}
          onBlur={(e) => onUpdate?.(e.target.value)}
          style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", padding: "0 4px", outline: "none", width: "100%", fontFamily: "inherit" }}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  )
}

function Section({
  label,
  children,
  isEditable,
  onAdd,
  onRefine,
  refining,
  simpleAdd
}: {
  label: string
  children: React.ReactNode
  isEditable?: boolean
  onAdd?: () => void
  onRefine?: () => void
  refining?: boolean
  simpleAdd?: boolean
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #000", paddingBottom: "3px", marginBottom: "10px" }}>
        <h3
          style={{
            fontSize: "13.5px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontFamily: "'Times New Roman', serif",
            margin: 0
          }}
        >
          {label}
        </h3>
        {isEditable && (
          <div style={{ display: "flex", gap: "12px" }}>
            {onRefine && (
              <button 
                onClick={onRefine} 
                disabled={refining}
                style={{ background: "none", border: "none", color: "#000", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 700 }}
              >
                {refining ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI REFINE
              </button>
            )}
            {onAdd && (
              <button 
                onClick={onAdd}
                style={{ background: "none", border: "none", color: "#000", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 700 }}
              >
                <PlusCircle size={12} /> {simpleAdd ? "" : `ADD ${label.toUpperCase()}`}
              </button>
            )}
          </div>
        )}
      </div>

      {children}
    </div>
  )
}

function ContactItem({ icon, text, placeholder, href, isEditable, onUpdate, renderEditable }: { icon: React.ReactNode; text: string; placeholder?: string; href?: string; isEditable?: boolean; onUpdate?: (val: string) => void; renderEditable?: () => React.ReactNode }) {
  const content = isEditable ? (
    renderEditable ? renderEditable() : (
      <input
        defaultValue={text}
        placeholder={placeholder}
        onBlur={(e) => onUpdate?.(e.target.value)}
        style={{ fontSize: "11.5px", color: "#000", background: "transparent", border: "1px dashed #000", outline: "none", padding: "1px 4px" }}
      />
    )
  ) : (
    <span style={{ color: href ? "#1a3a5c" : "#333", textDecoration: "none" }}>
      {text}
    </span>
  )

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <span style={{ display: "flex", alignItems: "center", color: "#666" }}>{icon}</span>
      {href && !isEditable ? (
        <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )
}
function PopSelect({ value, options, onSelect }: { value: string; options: string[]; onSelect: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const [openUp, setOpenUp] = useState(false)

  useEffect(() => {
    if (isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      setOpenUp(spaceBelow < 250 && spaceAbove > spaceBelow)
    }
  }, [isOpen])

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
          borderBottom: "1px dashed #000",
          fontSize: "11px",
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
                backgroundColor: value === opt ? "#e0f2fe" : "transparent",
                color: value === opt ? "#1a3a5c" : "#374151",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f9ff")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = value === opt ? "#e0f2fe" : "transparent")}
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

  const [openUp, setOpenUp] = useState(false)

  useEffect(() => {
    if (isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      setOpenUp(spaceBelow < 250 && spaceAbove > spaceBelow)
    }
  }, [isOpen])

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block", minWidth: width || "100px" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "none",
          border: "none",
          borderBottom: "1px dashed #000",
          color: "#000",
          fontSize: "11px",
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
                  backgroundColor: value === opt ? "#e0f2fe" : "transparent",
                  color: value === opt ? "#1a3a5c" : "#374151",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f9ff")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = value === opt ? "#e0f2fe" : "transparent")}
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
