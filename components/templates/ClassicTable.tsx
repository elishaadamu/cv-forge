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
        <div
          style={{
            fontSize: "11.5px",
            color: "#333",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
            marginTop: "10px",
            alignItems: "center"
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
                  <input
                    defaultValue={personalInfo.phone}
                    onBlur={(e) => onUpdate?.("personalInfo.phone", e.target.value)}
                    style={{ fontSize: "11.5px", color: "#000", background: "transparent", border: "1px dashed #000", outline: "none", padding: "1px 4px", width: "80px" }}
                  />
                </div>
              )}
            />
          )}
          {(personalInfo.email || isEditable) && (
            <ContactItem icon={<Mail size={11} />} text={personalInfo.email} href={isEditable ? undefined : `mailto:${personalInfo.email}`} isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.email", val)} />
          )}
          {(personalInfo.linkedin || isEditable) && (
            <ContactItem icon={<Linkedin size={11} />} text={personalInfo.linkedin} href={isEditable ? undefined : formatUrl(personalInfo.linkedin)} isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.linkedin", val)} />
          )}
          {(personalInfo.country || personalInfo.county || personalInfo.location || isEditable) && (
            <ContactItem
              icon={<MapPin size={11} />}
              text={[personalInfo.county, personalInfo.country, personalInfo.location].filter(Boolean).join(", ")}
              isEditable={isEditable}
              onUpdate={(val) => onUpdate?.("personalInfo.location", val)}
              renderEditable={() => (
                <div style={{ display: "flex", gap: "4px" }}>
                  <SearchableSelect
                    value={personalInfo.country || "Country"}
                    options={countriesData.map(c => c.name)}
                    onSelect={(val) => onUpdate?.("personalInfo.country", val)}
                  />
                  <SearchableSelect
                    value={personalInfo.county || "State/Province"}
                    options={personalInfo.country ? (countriesData.find((c: any) => c.name === personalInfo.country)?.states || []).map((s: any) => s.name) : []}
                    onSelect={(val) => onUpdate?.("personalInfo.county", val)}
                  />
                  <input
                    defaultValue={personalInfo.location}
                    onBlur={(e) => onUpdate?.("personalInfo.location", e.target.value)}
                    style={{ fontSize: "11.5px", color: "#000", background: "transparent", border: "1px dashed #000", outline: "none", padding: "1px 4px", width: "80px" }}
                  />
                </div>
              )}
            />
          )}
          {(personalInfo.website || isEditable) && (
            <ContactItem icon={<Globe size={11} />} text={personalInfo.website || ""} href={isEditable ? undefined : formatUrl(personalInfo.website)} isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.website", val)} />
          )}
          {(personalInfo.github || isEditable) && (
            <ContactItem icon={<Github size={11} />} text={personalInfo.github || ""} href={isEditable ? undefined : formatUrl(personalInfo.github)} isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.github", val)} />
          )}
          {(personalInfo.facebook || isEditable) && (
            <ContactItem icon={<Facebook size={11} />} text={personalInfo.facebook || ""} href={isEditable ? undefined : formatUrl(personalInfo.facebook)} isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.facebook", val)} />
          )}
        </div>
      </div>

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
                      paddingBottom: "6px",
                      verticalAlign: "top",
                      width: "55%",
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
                      <input
                        defaultValue={edu.degree}
                        placeholder="Degree"
                        onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)}
                        style={{ fontWeight: 700, fontSize: "13px", width: "95%", background: "transparent", border: "1px dashed #000", outline: "none" }}
                      />
                    ) : (
                      <span style={{ fontWeight: 700, fontSize: "13px" }}>
                        {edu.degree}
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      paddingBottom: "6px",
                      verticalAlign: "top",
                      width: "30%",
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
                      paddingBottom: "6px",
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

      {/* ── CORE COMPETENCIES ── */}
      {(allSkillItems.length > 0 || isEditable) && (
        <Section 
          label="Core Competencies" 
          isEditable={isEditable}
          onAdd={() => onUpdate?.("skills.add", "New Category")}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #999",
            }}
          >
            <tbody>
              {skills.map((group, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom:
                      idx < skills.length - 1 ? "1px solid #bbb" : "none",
                    position: "relative"
                  }}
                >
                  <td
                    style={{
                      padding: "5px 10px",
                      fontWeight: 700,
                      fontSize: "12px",
                      verticalAlign: "top",
                      width: "25%",
                      background: "#f5f5f5",
                      borderRight: "1px solid #bbb",
                    }}
                  >
                    {isEditable ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <button 
                          onClick={() => onUpdate?.("skills.remove", idx)}
                          style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                        >
                          <Trash2 size={10} />
                        </button>
                        <input
                          defaultValue={group.category}
                          onBlur={(e) => onUpdate?.(`skills.${idx}.category`, e.target.value)}
                          style={{ fontSize: "12px", fontWeight: 700, width: "80%", background: "transparent", border: "1px dashed #000", outline: "none" }}
                        />
                      </div>
                    ) : (
                      group.category
                    )}
                  </td>
                  <td style={{ padding: "5px 10px", fontSize: "12px" }}>
                    {isEditable ? (
                      <input
                        defaultValue={group.items.join(", ")}
                        onBlur={(e) => onUpdate?.(`skills.${idx}.items`, e.target.value.split(",").map(s => s.trim()))}
                        style={{ fontSize: "12px", width: "100%", background: "transparent", border: "1px dashed #000", outline: "none" }}
                      />
                    ) : (
                      group.items.join(", ")
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  <input
                    defaultValue={exp.role}
                    placeholder="Role"
                    onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)}
                    style={{ fontSize: "12.5px", fontStyle: "italic", color: "#555", width: "100%", background: "transparent", border: "1px dashed #000", outline: "none", marginBottom: "6px" }}
                  />
                ) : (
                  <p
                    style={{
                      fontSize: "12.5px",
                      fontStyle: "italic",
                      color: "#555",
                      marginBottom: "6px",
                    }}
                  >
                    {exp.role}
                  </p>
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

      {/* ── PERSONAL DETAILS ── */}
      {(hasPersonalDetails || isEditable) && (
        <Section label="Personal Details">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 40px" }}>
            {(personalInfo.dateOfBirth || isEditable) && <DetailRow label="Date of Birth" value={personalInfo.dateOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.dateOfBirth", val)} isEditable={isEditable} />}
            {(personalInfo.placeOfBirth || isEditable) && <DetailRow label="Place of Birth" value={personalInfo.placeOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.placeOfBirth", val)} isEditable={isEditable} />}
            {(personalInfo.nationality || isEditable) && <DetailRow label="Nationality" value={personalInfo.nationality} onUpdate={(val) => onUpdate?.("personalInfo.nationality", val)} isEditable={isEditable} />}
            {(personalInfo.gender || isEditable) && <DetailRow label="Gender" value={personalInfo.gender} onUpdate={(val) => onUpdate?.("personalInfo.gender", val)} isEditable={isEditable} />}
            {(personalInfo.passport || isEditable) && <DetailRow label="Passport" value={personalInfo.passport} onUpdate={(val) => onUpdate?.("personalInfo.passport", val)} isEditable={isEditable} />}
            {(personalInfo.workPermit || isEditable) && <DetailRow label="Work Permit" value={personalInfo.workPermit} onUpdate={(val) => onUpdate?.("personalInfo.workPermit", val)} isEditable={isEditable} />}
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
                  <input
                    defaultValue={vol.organization}
                    placeholder="Organization"
                    onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)}
                    style={{ fontSize: "13px", fontStyle: "italic", width: "80%", background: "transparent", border: "1px dashed #000", outline: "none", color: "#444", marginBottom: "4px" }}
                  />
                ) : (
                  <div style={{ fontSize: "13px", fontStyle: "italic", color: "#444" }}>{vol.organization}</div>
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
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 40px" }}>
            {(languages || []).map((lang, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                      onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.target.value)}
                      style={{ background: "transparent", border: "1px dashed #000", fontSize: "13px", padding: "1px 4px", outline: "none", width: "100px" }}
                    />
                  ) : (
                    <span style={{ fontWeight: 700 }}>{lang.name}</span>
                  )}
                </div>
                {isEditable ? (
                  <input 
                    defaultValue={lang.proficiency}
                    onBlur={(e) => onUpdate?.(`languages.${i}.proficiency`, e.target.value)}
                    style={{ background: "transparent", border: "1px dashed #000", fontSize: "12px", padding: "1px 4px", outline: "none", width: "80px", textAlign: "right" }}
                  />
                ) : (
                  <span style={{ fontStyle: "italic", color: "#555" }}>{lang.proficiency}</span>
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
  refining
}: {
  label: string
  children: React.ReactNode
  isEditable?: boolean
  onAdd?: () => void
  onRefine?: () => void
  refining?: boolean
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
                <PlusCircle size={12} /> ADD ITEM
              </button>
            )}
          </div>
        )}
      </div>

      {children}
    </div>
  )
}

function ContactItem({ icon, text, href, isEditable, onUpdate }: { icon: React.ReactNode; text: string; href?: string; isEditable?: boolean; onUpdate?: (val: string) => void }) {
  const content = isEditable ? (
    <input
      defaultValue={text}
      onBlur={(e) => onUpdate?.(e.target.value)}
      style={{ fontSize: "11.5px", color: "#000", background: "transparent", border: "1px dashed #000", outline: "none", padding: "1px 4px" }}
    />
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
