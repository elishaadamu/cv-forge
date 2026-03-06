// @ts-nocheck
import { Phone, Mail, Linkedin, MapPin, Globe, Github, Facebook, PlusCircle, Trash2, Sparkles, Loader2, Camera, Plus, X, Heart, Languages as LangIcon, ChevronDown, Check, Search, Hash } from "lucide-react"
import { MarkdownText } from "../MarkdownText"
import React, { useRef, useState, useEffect } from "react"
import { DurationPicker } from "../DurationPicker"
import countriesData from "@/lib/countries-data.json"

export interface CVData {
  personalInfo: {
    fullName: string
    jobTitle: string
    email: string
    phoneCode?: string
    phone: string
    country?: string
    county?: string
    location: string
    website: string
    linkedin: string
    github: string
    facebook?: string
    summary: string
    profileImage?: string
    dateOfBirth?: string
    placeOfBirth?: string
    nationality?: string
    gender?: string
    passport?: string
    workPermit?: string
  }
  experience: Array<{
    id: string
    role: string
    company: string
    duration: string
    description: string[]
    workDescription?: string
    location?: string
    country?: string
    county?: string
  }>
  education: Array<{
    id: string
    degree: string
    school: string
    duration: string
    location?: string
    country?: string
    county?: string
    fieldOfStudy?: string
    grade?: string
  }>
  skills: Array<{
    category: string
    items: string[]
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    link: string
    duration?: string
  }>
  languages?: Array<{
    name: string
    proficiency: string
  }>
  volunteering?: Array<{
    id: string
    role: string
    organization: string
    duration: string
    location?: string
    country?: string
    county?: string
    description: string
  }>
  templateId?: string
}

function formatUrl(url: string) {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url
  }
  if (url.includes("@")) return `mailto:${url}`
  return `https://${url}`
}

export function ModernProfessional({
  data,
  isEditable = false,
  onUpdate,
  onRefine,
  refiningId,
  onImageClick
}: {
  data: CVData,
  isEditable?: boolean,
  onUpdate?: (path: string, value: any) => void,
  onRefine?: (type: string, id?: string) => void,
  refiningId?: string | null,
  onImageClick?: () => void
}) {
  const { personalInfo, experience, education, skills, projects, languages, volunteering } = data

  // Flatten all skills into a simple list for sidebar display
  const allSkills = Array.isArray(skills) 
    ? skills.flatMap((s: any) => typeof s === 'string' ? [s] : (s.items || [])) 
    : []

  const hasPersonalDetails = personalInfo.dateOfBirth || personalInfo.nationality || personalInfo.gender || personalInfo.passport || personalInfo.workPermit || personalInfo.placeOfBirth

  return (
    <div
      style={{
        background: "#fff",
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
        fontSize: "13px",
        color: "#222",
        display: "flex",
        flexDirection: "row",
        position: "relative",
        boxSizing: "border-box",
      }}
    >

      {/* ── LEFT MAIN COLUMN ── */}
      <div style={{ flex: 1, padding: "48px 36px 48px 48px", boxSizing: "border-box" }}>
        {/* Name + Title */}
        <div style={{ marginBottom: "28px" }}>
          {isEditable ? (
            <input
              value={personalInfo.fullName}
              placeholder="Your Full Name"
              onChange={(e) => onUpdate?.("personalInfo.fullName", e.target.value)}
              style={{
                fontSize: "36px",
                fontWeight: 900,
                color: "#1a3a5c",
                lineHeight: 1.1,
                textTransform: "uppercase",
                letterSpacing: "-0.5px",
                marginBottom: "6px",
                width: "100%",
                background: "transparent",
                border: "1px dashed rgba(26, 58, 92, 0.3)",
                padding: "2px 8px",
                outline: "none",
                fontFamily: "inherit"
              }}
            />
          ) : (
            <h1
              style={{
                fontSize: "36px",
                fontWeight: 900,
                color: "#1a3a5c",
                lineHeight: 1.1,
                textTransform: "uppercase",
                letterSpacing: "-0.5px",
                marginBottom: "6px",
              }}
            >
              {personalInfo.fullName || "Your Name"}
            </h1>
          )}
          <p
            style={{
              fontSize: "13px",
              color: "#6b7280",
              fontStyle: "italic",
              letterSpacing: "0.5px",
            }}
          >
            CURRICULUM VITAE
          </p>
        </div>

        {/* Section: Professional Summary */}
        {(personalInfo.summary || isEditable) && (
          <div style={{ marginBottom: "32px", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <SectionHeading label="Professional Summary" />
              {isEditable && (
                <button 
                  onClick={() => onRefine?.("summary")}
                  disabled={refiningId === "summary"}
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "6px", 
                    fontSize: "10px", 
                    fontWeight: 700, 
                    color: "#1a3a5c", 
                    background: "rgba(26, 58, 92, 0.05)", 
                    border: "1px solid rgba(26, 58, 92, 0.2)",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
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
                style={{
                  width: "100%",
                  minHeight: "100px",
                  fontSize: "12.5px",
                  color: "#374151",
                  lineHeight: 1.7,
                  background: "transparent",
                  border: "1px dashed rgba(26, 58, 92, 0.3)",
                  padding: "8px",
                  borderRadius: "4px",
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit"
                }}
              />
            ) : (
              <MarkdownText 
                content={personalInfo.summary}
                style={{
                  fontSize: "12.5px",
                  color: "#374151",
                  lineHeight: 1.7,
                }}
              />
            )}
          </div>
        )}

        {/* Section: Work Experience */}
        {(experience.length > 0 || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <SectionHeading label="Work Experience" />
              {isEditable && (
                <button 
                  onClick={() => onUpdate?.("experience.add", {})}
                  style={{ background: "none", border: "none", color: "#1a3a5c", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700 }}
                >
                  <PlusCircle size={14} /> ADD ROLE
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {experience.map((exp) => (
                <div key={exp.id} style={{ position: "relative" }}>
                  {isEditable && (
                    <button 
                      onClick={() => onUpdate?.("experience.remove", exp.id)}
                      style={{ position: "absolute", left: "-32px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                    >
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
                      <input
                        value={exp.company}
                        placeholder="Company"
                        onChange={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)}
                        style={{
                          fontWeight: 700,
                          fontSize: "13px",
                          color: "#1a3a5c",
                          background: "transparent",
                          border: "1px dashed rgba(26, 58, 92, 0.3)",
                          padding: "2px 6px",
                          outline: "none",
                          width: "50%",
                          fontFamily: "inherit"
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "13px",
                          color: "#1a3a5c",
                        }}
                      >
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
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "6px" }}>
                    {isEditable ? (
                      <input
                        value={exp.role}
                        placeholder="Role"
                        onChange={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)}
                        style={{
                          fontSize: "11.5px",
                          color: "#6b7280",
                          fontStyle: "italic",
                          background: "transparent",
                          border: "1px dashed rgba(26, 58, 92, 0.3)",
                          padding: "2px 6px",
                          outline: "none",
                          width: "60%",
                          fontFamily: "inherit"
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          fontSize: "11.5px",
                          color: "#6b7280",
                          fontStyle: "italic",
                          margin: 0
                        }}
                      >
                        {exp.role}
                      </p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={10} color="#9ca3af" />
                      {isEditable ? (
                        <input
                          value={exp.location}
                          placeholder="City, Country"
                          onChange={(e) => onUpdate?.(`experience.${exp.id}.location`, e.target.value)}
                          style={{
                            fontSize: "11px",
                            color: "#9ca3af",
                            background: "transparent",
                            border: "1px dashed rgba(26, 58, 92, 0.3)",
                            padding: "1px 4px",
                            outline: "none",
                            width: "120px",
                            fontFamily: "inherit"
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "11px", color: "#9ca3af" }}>{exp.location}</span>
                      )}
                    </div>
                  </div>
                    {isEditable ? (
                      <button 
                        onClick={() => onRefine?.("experience", exp.id)}
                        disabled={refiningId === exp.id || (exp.description.length === 0 && !exp.workDescription)}
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "5px", 
                          fontSize: "9px", 
                          fontWeight: 700, 
                          color: "#1a3a5c", 
                          background: "rgba(26, 58, 92, 0.05)", 
                          border: "1px solid rgba(26, 58, 92, 0.15)",
                          padding: "3px 8px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          opacity: (refiningId === exp.id || (exp.description.length === 0 && !exp.workDescription)) ? 0.5 : 1
                        }}
                      >
                        {refiningId === exp.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                      </button>
                    ) : null}
                  
                  {exp.workDescription || isEditable ? (
                    <div style={{ marginBottom: "10px" }}>
                      {isEditable ? (
                        <textarea 
                          value={exp.workDescription}
                          placeholder="Briefly describe your role and key responsibilities..."
                          onChange={(e) => onUpdate?.(`experience.${exp.id}.workDescription`, e.target.value)}
                          style={{ 
                            fontSize: "12px", 
                            color: "#374151", 
                            lineHeight: 1.6, 
                            outline: "none",
                            background: "transparent",
                            border: "1px dashed rgba(26, 58, 92, 0.2)",
                            padding: "4px 8px",
                            borderRadius: "3px",
                            width: "100%",
                            minHeight: "40px",
                            resize: "vertical",
                            fontFamily: "inherit"
                          }}
                        />
                      ) : (
                        <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6, textAlign: "justify" }}>
                          {exp.workDescription}
                        </div>
                      )}
                    </div>
                  ) : null}
                  {isEditable ? (
                    <div style={{ marginTop: "4px" }}>
                      {exp.description.map((bullet, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px", alignItems: "start" }}>
                          <span style={{ fontSize: "12px", color: "#9ca3af", minWidth: "20px", marginTop: "4px", fontWeight: 700 }}>{i + 1}.</span>
                          <input
                            value={bullet}
                            placeholder="List tasks (e.g. Developed user interfaces)..."
                            onChange={(e) => {
                              const newDesc = [...exp.description]
                              newDesc[i] = e.target.value
                              onUpdate?.(`experience.${exp.id}.description`, newDesc)
                            }}
                            style={{
                              flex: 1,
                              fontSize: "12px",
                              color: "#374151",
                              background: "transparent",
                              border: "1px dashed rgba(26, 58, 92, 0.3)",
                              padding: "2px 6px",
                              outline: "none",
                              fontFamily: "inherit"
                            }}
                          />
                          <button onClick={() => {
                            const newDesc = exp.description.filter((_, idx) => idx !== i)
                            onUpdate?.(`experience.${exp.id}.description`, newDesc)
                          }} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", marginTop: "4px" }}>
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => onUpdate?.(`experience.${exp.id}.description`, [...exp.description, ""])}
                        style={{ fontSize: "10px", color: "#1a3a5c", background: "none", border: "none", cursor: "pointer", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <PlusCircle size={10} /> ADD WORK LIST <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: "9px" }}>(optional)</span>
                      </button>
                    </div>
                  ) : (
                    <ol style={{ paddingLeft: "32px", margin: "8px 0", listStyleType: "decimal" }}>
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
                    </ol>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Projects */}
        {(projects.length > 0 || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <SectionHeading label="Projects" />
              {isEditable && (
                <button 
                  onClick={() => onUpdate?.("projects.add", {})}
                  style={{ background: "none", border: "none", color: "#1a3a5c", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700 }}
                >
                  <PlusCircle size={14} /> ADD PROJECT
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {projects.map((proj) => (
                <div key={proj.id} style={{ position: "relative" }}>
                  {isEditable && (
                    <button 
                      onClick={() => onUpdate?.("projects.remove", proj.id)}
                      style={{ position: "absolute", left: "-32px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
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
                        value={proj.name}
                        placeholder="Project Name"
                        onChange={(e) => onUpdate?.(`projects.${proj.id}.name`, e.target.value)}
                        style={{
                          fontWeight: 700,
                          fontSize: "13px",
                          color: "#1a3a5c",
                          background: "transparent",
                          border: "1px dashed rgba(26, 58, 92, 0.3)",
                          padding: "2px 6px",
                          outline: "none",
                          width: "50%",
                          fontFamily: "inherit"
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "13px",
                          color: "#1a3a5c",
                        }}
                      >
                        {proj.name}
                      </span>
                    )}
                    {isEditable ? (
                      <input
                        value={proj.link}
                        placeholder="Link (e.g. github.com/user/repo)"
                        onChange={(e) => onUpdate?.(`projects.${proj.id}.link`, e.target.value)}
                        style={{
                          fontSize: "10px",
                          color: "#3b82c4",
                          background: "transparent",
                          border: "1px dashed rgba(59, 130, 196, 0.3)",
                          padding: "2px 6px",
                          outline: "none",
                          width: "40%",
                          textAlign: "right",
                          fontFamily: "inherit"
                        }}
                      />
                    ) : proj.link && (
                      <a 
                        href={formatUrl(proj.link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "10px", color: "#3b82c4", textDecoration: "none" }}
                      >
                        {proj.link}
                      </a>
                    )}
                  </div>
                  {isEditable ? (
                    <textarea
                      value={proj.description}
                      placeholder="Project description..."
                      onChange={(e) => onUpdate?.(`projects.${proj.id}.description`, e.target.value)}
                      style={{
                        width: "100%",
                        fontSize: "12px",
                        color: "#374151",
                        lineHeight: 1.6,
                        marginTop: "3px",
                        background: "transparent",
                        border: "1px dashed rgba(26, 58, 92, 0.3)",
                        padding: "4px 6px",
                        outline: "none",
                        resize: "vertical",
                        fontFamily: "inherit"
                      }}
                    />
                  ) : proj.description && (
                    <MarkdownText 
                      content={proj.description}
                      style={{
                        fontSize: "12px",
                        color: "#374151",
                        lineHeight: 1.6,
                        marginTop: "3px",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Volunteering */}
        {(volunteering && volunteering.length > 0 || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <SectionHeading label="Volunteering" />
              {isEditable && (
                <button 
                  onClick={() => onUpdate?.("volunteering.add", {})}
                  style={{ background: "none", border: "none", color: "#1a3a5c", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700 }}
                >
                  <PlusCircle size={14} /> ADD VOLUNTEERING
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {(volunteering || []).map((vol) => (
                <div key={vol.id} style={{ position: "relative" }}>
                  {isEditable && (
                    <button 
                      onClick={() => onUpdate?.("volunteering.remove", vol.id)}
                      style={{ position: "absolute", left: "-24px", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    {isEditable ? (
                      <input 
                        value={vol.role}
                        placeholder="Volunteer Role"
                        onChange={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)}
                        style={{ fontWeight: 700, fontSize: "14px", color: "#1a3a5c", outline: "none", background: "transparent", border: "1px dashed rgba(26, 58, 92, 0.3)", padding: "2px 8px", borderRadius: "3px", width: "60%", fontFamily: "inherit" }}
                      />
                    ) : (
                      <h4 style={{ fontWeight: 700, fontSize: "14px", color: "#1a3a5c", margin: 0 }}>{vol.role}</h4>
                    )}
                    {isEditable ? (
                      <DurationPicker 
                        value={vol.duration} 
                        onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} 
                      />
                    ) : (
                      <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>{vol.duration}</span>
                    )}
                  </div>
                  {isEditable ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", marginBottom: "6px" }}>
                      <input 
                        value={vol.organization}
                        placeholder="Organization"
                        onChange={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)}
                        style={{ fontSize: "13px", color: "#3b82c4", fontWeight: 600, outline: "none", background: "transparent", border: "1px dashed rgba(59, 130, 196, 0.3)", padding: "2px 8px", borderRadius: "3px", width: "150px", fontFamily: "inherit" }}
                      />
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <MapPin size={10} color="#9ca3af" />
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
                          style={{ fontSize: "11px", color: "#9ca3af", outline: "none", background: "transparent", border: "1px dashed rgba(26, 58, 92, 0.3)", padding: "2px 8px", borderRadius: "3px", width: "90px", fontFamily: "inherit" }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                      <div style={{ fontSize: "13px", color: "#3b82c4", fontWeight: 600 }}>{vol.organization}</div>
                      {(vol.location || vol.county || vol.country) && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <MapPin size={10} color="#9ca3af" />
                          <span style={{ fontSize: "11.5px", color: "#6b7280" }}>
                            {[vol.location, vol.county, vol.country].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  {isEditable ? (
                    <textarea 
                      value={vol.description}
                      placeholder="Describe your volunteer work..."
                      onChange={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.target.value)}
                      style={{ width: "100%", fontSize: "12px", color: "#4b5563", lineHeight: 1.6, background: "transparent", border: "1px dashed rgba(26, 58, 92, 0.3)", padding: "4px 8px", outline: "none", resize: "vertical", fontFamily: "inherit" }}
                    />
                  ) : (
                    <MarkdownText content={vol.description} style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.6 }} />
                  )}
                  {isEditable && (
                    <button 
                      onClick={() => onRefine?.("volunteering", vol.id)}
                      disabled={refiningId === vol.id || !vol.description}
                      style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 700, color: "#1a3a5c", background: "rgba(26, 58, 92, 0.05)", border: "1px solid rgba(26, 58, 92, 0.2)", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", marginTop: "4px", opacity: (refiningId === vol.id || !vol.description) ? 0.5 : 1 }}
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

      {/* ── RIGHT SIDEBAR ── */}
      <div
        style={{
          width: "240px",
          background: "#f0f4f8",
          padding: "48px 24px 48px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          flexShrink: 0,
          boxSizing: "border-box",
        }}
      >
        {/* Profile photo */}
        <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
          {personalInfo.profileImage ? (
            <div
              onClick={isEditable ? onImageClick : undefined}
              style={{
                position: "relative",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid #fff",
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                cursor: isEditable ? "pointer" : "default",
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
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: 0,
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              )}
            </div>
          ) : isEditable ? (
            <div
              onClick={onImageClick}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                border: "2px dashed #cbd5e1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: "#f8fafc",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
          ) : null}
        </div>

        {/* Personal Details - Moved here */}
        {(hasPersonalDetails || isEditable) && (
          <div style={{ marginBottom: "20px" }}>
            <SidebarHeading label="Personal Details" />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
              {(personalInfo.dateOfBirth || isEditable) && (
                <SidebarDetail 
                  label="DOB" 
                  value={personalInfo.dateOfBirth} 
                  type="date"
                  onUpdate={(val: string) => onUpdate?.("personalInfo.dateOfBirth", val)} 
                  isEditable={isEditable} 
                />
              )}
              {(personalInfo.placeOfBirth || isEditable) && (
                <SidebarDetail 
                  label="Birth Place" 
                  value={personalInfo.placeOfBirth} 
                  placeholder="City, Country"
                  onUpdate={(val: string) => onUpdate?.("personalInfo.placeOfBirth", val)} 
                  isEditable={isEditable} 
                />
              )}
              {(personalInfo.nationality || isEditable) && (
                <SidebarDetail 
                  label="Nationality" 
                  value={personalInfo.nationality} 
                  type="country"
                  onUpdate={(val: string) => onUpdate?.("personalInfo.nationality", val)} 
                  isEditable={isEditable} 
                />
              )}
              {(personalInfo.gender || isEditable) && (
                <SidebarDetail 
                  label="Gender" 
                  value={personalInfo.gender} 
                  type="options"
                  options={["Male", "Female", "Other", "Prefer not to say"]}
                  onUpdate={(val: string) => onUpdate?.("personalInfo.gender", val)} 
                  isEditable={isEditable} 
                />
              )}
              {(personalInfo.passport || isEditable) && (
                <SidebarDetail 
                  label="Passport" 
                  value={personalInfo.passport} 
                  placeholder="Passport Number"
                  onUpdate={(val: string) => onUpdate?.("personalInfo.passport", val)} 
                  isEditable={isEditable} 
                />
              )}
              {(personalInfo.workPermit || isEditable) && (
                <SidebarDetail 
                  label="Work Permit" 
                  value={personalInfo.workPermit} 
                  placeholder="Visa / Status"
                  onUpdate={(val: string) => onUpdate?.("personalInfo.workPermit", val)} 
                  isEditable={isEditable} 
                />
              )}
            </div>
          </div>
        )}

        {/* Name + Title in sidebar */}
        <div>
          <p
            style={{
              fontWeight: 800,
              fontSize: "12px",
              color: "#1a3a5c",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "2px",
            }}
          >
            {personalInfo.fullName}
          </p>
          <p style={{ fontSize: "11px", color: "#6b7280" }}>
            {personalInfo.jobTitle}
          </p>
        </div>

        {/* Contact */}
        <div>
          <SidebarHeading label="Contact" />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "7px",
              marginTop: "8px",
            }}
          >
            {(personalInfo.phone || isEditable) && (
              <ContactRow 
                icon={<Phone size={12} />} 
                text={`${personalInfo.phoneCode || ''} ${personalInfo.phone}`} 
                href={isEditable ? undefined : `tel:${personalInfo.phoneCode || ''}${personalInfo.phone}`}
                isEditable={isEditable}
                renderEditable={() => (
                  <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                    <PopSelect 
                      value={personalInfo.phoneCode || "+1"} 
                      options={countriesData.map(c => c.phonecode)}
                      onSelect={(val) => onUpdate?.("personalInfo.phoneCode", val)}
                    />
                    <input
                      defaultValue={personalInfo.phone}
                      onBlur={(e) => onUpdate?.("personalInfo.phone", e.target.value)}
                      placeholder="Phone number"
                      style={{
                        fontSize: "11px",
                        color: "#1a3a5c",
                        background: "transparent",
                        border: "1px dashed rgba(26, 58, 92, 0.3)",
                        padding: "1px 4px",
                        outline: "none",
                        width: "100%",
                        fontFamily: "inherit"
                      }}
                    />
                  </div>
                )}
              />
            )}
            {(personalInfo.email || isEditable) && (
              <ContactRow 
                icon={<Mail size={12} />} 
                text={personalInfo.email || ""} 
                placeholder="email@example.com"
                href={isEditable ? undefined : `mailto:${personalInfo.email || ""}`}
                isEditable={isEditable}
                onUpdate={(val) => onUpdate?.("personalInfo.email", val)}
              />
            )}
            {(personalInfo.linkedin || isEditable) && (
              <ContactRow 
                icon={<Linkedin size={12} />} 
                text={personalInfo.linkedin || ""} 
                placeholder="linkedin.com/in/username"
                href={isEditable ? undefined : formatUrl(personalInfo.linkedin)}
                isEditable={isEditable}
                onUpdate={(val) => onUpdate?.("personalInfo.linkedin", val)}
              />
            )}
            {(personalInfo.country || isEditable) && (
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ fontSize: "11px", flexShrink: 0, width: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
                  <MapPin size={12} />
                </span>
                {isEditable ? (
                  <SearchableSelect
                    value={personalInfo.country || "Country"}
                    options={countriesData.map(c => c.name)}
                    onSelect={(val) => onUpdate?.("personalInfo.country", val)}
                  />
                ) : (
                  <span style={{ fontSize: "11px", color: "#1a3a5c" }}>{personalInfo.country}</span>
                )}
              </div>
            )}
            {(personalInfo.county || isEditable) && (
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <span style={{ fontSize: "11px", flexShrink: 0, width: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}></span>
                {isEditable ? (
                  <SearchableSelect
                    value={personalInfo.county || "State/Province"}
                    options={personalInfo.country ? (countriesData.find((c: any) => c.name === personalInfo.country)?.states || []).map((s: any) => s.name) : []}
                    onSelect={(val) => onUpdate?.("personalInfo.county", val)}
                  />
                ) : (
                  <span style={{ fontSize: "11px", color: "#1a3a5c" }}>{personalInfo.county}</span>
                )}
              </div>
            )}
            {(personalInfo.location || isEditable) && (
              <ContactRow
                icon={<Hash size={12} />}
                text={personalInfo.location || ""}
                placeholder="Postal code (e.g. 10123)"
                isEditable={isEditable}
                onUpdate={(val) => onUpdate?.("personalInfo.location", val)}
              />
            )}
            {(personalInfo.website || isEditable) && (
              <ContactRow
                icon={<Globe size={12} />}
                text={personalInfo.website || ""}
                placeholder="portfolio.com"
                href={isEditable ? undefined : formatUrl(personalInfo.website)}
                isEditable={isEditable}
                onUpdate={(val) => onUpdate?.("personalInfo.website", val)}
              />
            )}
            {(personalInfo.github || isEditable) && (
              <ContactRow 
                icon={<Github size={12} />} 
                text={personalInfo.github || ""} 
                placeholder="github.com/username"
                href={isEditable ? undefined : formatUrl(personalInfo.github)}
                isEditable={isEditable}
                onUpdate={(val) => onUpdate?.("personalInfo.github", val)}
              />
            )}
            {(personalInfo.facebook || isEditable) && (
              <ContactRow 
                icon={<Facebook size={12} />} 
                text={personalInfo.facebook || ""} 
                placeholder="facebook.com/username"
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <SidebarHeading label="Skills" />
              {isEditable && (
                <button 
                  onClick={() => {
                    onUpdate?.("skills", [...allSkills, ""])
                  }}
                  style={{ background: "none", border: "none", color: "#1a3a5c", cursor: "pointer", display: "flex", alignItems: "center" }}
                >
                  <PlusCircle size={12} />
                </button>
              )}
            </div>
            <ul style={{ marginTop: "8px", paddingLeft: "0", listStyle: "none" }}>
              {allSkills.map((skill, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: "11.5px",
                    color: "#374151",
                    padding: "3px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    position: "relative"
                  }}
                >
                  {isEditable && (
                    <button 
                      onClick={() => onUpdate?.("skills", allSkills.filter(s => s !== skill))}
                      style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "0" }}
                    >
                      <X size={10} />
                    </button>
                  )}
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#3b82c4",
                      flexShrink: 0,
                      display: "inline-block",
                    }}
                  />
                  {isEditable ? (
                    <input
                      defaultValue={skill}
                      placeholder="Add skill..."
                      onBlur={(e) => {
                        const newVal = e.target.value.trim()
                        if (!newVal) return
                        onUpdate?.("skills", allSkills.map(s => s === skill ? newVal : s))
                      }}
                      style={{
                        background: "transparent",
                        border: "1px dashed rgba(26, 58, 92, 0.3)",
                        fontSize: "11px",
                        padding: "1px 4px",
                        outline: "none",
                        width: "100%",
                        fontFamily: "inherit"
                      }}
                    />
                  ) : skill}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Education */}
        {(education.length > 0 || isEditable) && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <SidebarHeading label="Education" />
              {isEditable && (
                <button 
                  onClick={() => onUpdate?.("education.add", {})}
                  style={{ background: "none", border: "none", color: "#1a3a5c", cursor: "pointer" }}
                >
                  <PlusCircle size={12} />
                </button>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginTop: "8px",
              }}
            >
              {education.map((edu) => (
                <div key={edu.id} style={{ position: "relative" }}>
                  {isEditable && (
                    <button 
                      onClick={() => onUpdate?.("education.remove", edu.id)}
                      style={{ position: "absolute", right: "0", top: "0", color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                  {isEditable ? (
                    <DurationPicker 
                      value={edu.duration} 
                      onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} 
                    />
                  ) : edu.duration ? (
                    <p style={{ fontSize: "10.5px", color: "#9ca3af", marginBottom: "3px" }}>
                      {edu.duration}
                    </p>
                  ) : null}
                  {isEditable ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "8px" }}>
                      <input
                        defaultValue={edu.degree}
                        placeholder="Degree"
                        onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)}
                        style={{
                          fontWeight: 700,
                          fontSize: "11.5px",
                          color: "#1a3a5c",
                          background: "transparent",
                          border: "1px dashed rgba(26, 58, 92, 0.3)",
                          padding: "1px 4px",
                          outline: "none",
                          width: "100%",
                          fontFamily: "inherit"
                        }}
                      />
                      <input
                        defaultValue={edu.fieldOfStudy}
                        placeholder="Field of Study"
                        onBlur={(e) => onUpdate?.(`education.${edu.id}.fieldOfStudy`, e.target.value)}
                        style={{
                          fontSize: "10.5px",
                          color: "#3b82c4",
                          background: "transparent",
                          border: "1px dashed rgba(59, 130, 196, 0.3)",
                          padding: "1px 4px",
                          outline: "none",
                          width: "100%",
                          fontFamily: "inherit"
                        }}
                      />
                      <input
                        defaultValue={edu.grade}
                        placeholder="Grade / GPA"
                        onBlur={(e) => onUpdate?.(`education.${edu.id}.grade`, e.target.value)}
                        style={{
                          fontSize: "10px",
                          color: "#6b7280",
                          background: "transparent",
                          border: "1px dashed rgba(107, 114, 128, 0.3)",
                          padding: "1px 4px",
                          outline: "none",
                          width: "60%",
                          fontFamily: "inherit"
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ marginBottom: "4px" }}>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: "11.5px",
                          color: "#1a3a5c",
                          marginBottom: "1px",
                        }}
                      >
                        {edu.degree}
                      </p>
                      {edu.fieldOfStudy && (
                        <p style={{ fontSize: "10.5px", color: "#3b82c4", fontWeight: 500 }}>{edu.fieldOfStudy}</p>
                      )}
                      {edu.grade && (
                        <p style={{ fontSize: "10px", color: "#6b7280" }}>Grade: {edu.grade}</p>
                      )}
                    </div>
                  )}
                  {isEditable ? (
                    <input
                      defaultValue={edu.school}
                      placeholder="School"
                      onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)}
                      style={{
                        fontSize: "11px",
                        color: "#6b7280",
                        background: "transparent",
                        border: "1px dashed rgba(26, 58, 92, 0.3)",
                        padding: "1px 4px",
                        outline: "none",
                        width: "100%",
                        marginBottom: "2px",
                        fontFamily: "inherit"
                      }}
                    />
                  ) : (
                    <p style={{ fontSize: "11px", color: "#6b7280" }}>
                      {edu.school}
                    </p>
                  )}
                  {isEditable ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
                      <MapPin size={10} color="#9ca3af" />
                      <SearchableSelect 
                        value={edu.location || "Location"} 
                        options={countriesData.map(c => c.name)} 
                        onSelect={(val) => onUpdate?.(`education.${edu.id}.location`, val)} 
                      />
                    </div>
                  ) : edu.location ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
                      <MapPin size={10} color="#9ca3af" />
                      <p style={{ fontSize: "10.5px", color: "#6b7280" }}>{edu.location}</p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {(languages && languages.length > 0 || isEditable) && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <SidebarHeading label="Languages" />
              {isEditable && (
                <button 
                  onClick={() => onUpdate?.("languages.add", { name: "New Language", proficiency: "Native" })}
                  style={{ background: "none", border: "none", color: "#1a3a5c", cursor: "pointer" }}
                >
                  <PlusCircle size={12} />
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
              {(languages || []).map((lang, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11.5px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {isEditable && (
                      <button 
                        onClick={() => onUpdate?.("languages.remove", i)}
                        style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        <X size={10} />
                      </button>
                    )}
                    {isEditable ? (
                      <input 
                        defaultValue={lang.name}
                        onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.target.value)}
                        style={{ background: "transparent", border: "1px dashed rgba(26, 58, 92, 0.3)", fontSize: "11px", padding: "1px 4px", outline: "none", width: "70px", fontFamily: "inherit" }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600, color: "#374151" }}>{lang.name}</span>
                    )}
                  </div>
                  {isEditable ? (
                    <PopSelect 
                      value={lang.proficiency || "Proficiency"} 
                      options={["Beginner", "Elementary", "Intermediate", "Upper Intermediate", "Advanced", "Native/Bilingual"]}
                      onSelect={(val) => onUpdate?.(`languages.${i}.proficiency`, val)}
                    />
                  ) : (
                    <span style={{ color: "#6b7280", fontSize: "10.5px" }}>{lang.proficiency}</span>
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

function SectionHeading({ label }: { label: string }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <h3
        style={{
          fontSize: "13px",
          fontWeight: 800,
          color: "#3b82c4",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "4px",
        }}
      >
        {label}
      </h3>
      <div
        style={{ height: "2px", background: "#3b82c4", width: "100%" }}
      />
    </div>
  )
}

function SidebarHeading({ label }: { label: string }) {
  return (
    <h4
      style={{
        fontSize: "12px",
        fontWeight: 800,
        color: "#1a3a5c",
        textTransform: "uppercase",
        letterSpacing: "0.8px",
        borderBottom: "1.5px solid #cbd5e1",
        paddingBottom: "4px",
      }}
    >
      {label}
    </h4>
  )
}

function SidebarDetail({ 
  label, 
  value, 
  onUpdate, 
  isEditable,
  type = "text",
  options = [],
  placeholder
}: { 
  label: string, 
  value?: string, 
  onUpdate?: (val: string) => void, 
  isEditable: boolean,
  type?: "text" | "date" | "options" | "country",
  options?: string[],
  placeholder?: string
}) {
  if (!isEditable && !value) return null
  
  const renderField = () => {
    if (type === "options") {
      return <PopSelect value={value || "---"} options={options} onSelect={(val) => onUpdate?.(val)} />
    }
    if (type === "country") {
      return (
        <SearchableSelect 
          value={value || "---"} 
          options={countriesData.map(c => c.name)} 
          onSelect={(val) => onUpdate?.(val)} 
        />
      )
    }
    if (type === "date") {
      return (
        <input 
          type="date"
          value={value || ""}
          onChange={(e) => onUpdate?.(e.target.value)}
          style={{ 
            background: "transparent", 
            border: "1px dashed rgba(26, 58, 92, 0.3)", 
            fontSize: "11px", 
            padding: "0 4px", 
            outline: "none", 
            width: "100%", 
            fontFamily: "inherit",
            color: "#374151"
          }}
        />
      )
    }
    return (
      <input 
        defaultValue={value}
        placeholder={placeholder}
        onBlur={(e) => onUpdate?.(e.target.value)}
        style={{ 
          background: "transparent", 
          border: "1px dashed rgba(26, 58, 92, 0.3)", 
          fontSize: "11px", 
          padding: "0 4px", 
          outline: "none", 
          width: "100%", 
          fontFamily: "inherit",
          color: "#374151"
        }}
      />
    )
  }

  return (
    <div style={{ fontSize: "11px", display: "flex", gap: "4px", alignItems: "center" }}>
      <span style={{ fontWeight: 700, color: "#1a3a5c", minWidth: "75px" }}>{label}:</span>
      {isEditable ? renderField() : (
        <span style={{ color: "#4b5563" }}>{value}</span>
      )}
    </div>
  )
}

function ContactRow({ icon, text, href, isEditable, onUpdate, renderEditable, placeholder }: { icon: React.ReactNode; text: string; href?: string; isEditable: boolean; onUpdate?: (val: string) => void; renderEditable?: () => React.ReactNode; placeholder?: string }) {
  const content = isEditable ? (
    renderEditable ? renderEditable() : (
      <input
        defaultValue={text}
        placeholder={placeholder}
        onBlur={(e) => onUpdate?.(e.target.value)}
        style={{
          fontSize: "11px",
          color: "#1a3a5c",
          background: "transparent",
          border: "1px dashed rgba(26, 58, 92, 0.3)",
          padding: "1px 4px",
          outline: "none",
          width: "100%",
          fontFamily: "inherit"
        }}
      />
    )
  ) : (
    <span
      style={{
        fontSize: "11px",
        color: href ? "#3b82c4" : "#374151",
        textDecoration: "none",
        wordBreak: "break-word",
      }}
    >
      {text}
    </span>
  )

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
      <span style={{ fontSize: "11px", flexShrink: 0, width: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
        {icon}
      </span>
      {href && !isEditable ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none", display: "flex", wordBreak: "break-word", width: "100%" }}
        >
          {content}
        </a>
      ) : (
        <div style={{ width: "100%" }}>{content}</div>
      )}
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
          borderBottom: "1px dashed #1a3a5c",
          color: "#1a3a5c",
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
    <div ref={ref} style={{ position: "relative", display: "inline-block", minWidth: "120px" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          background: "none",
          border: "none",
          borderBottom: "1px dashed #1a3a5c",
          color: "#1a3a5c",
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
