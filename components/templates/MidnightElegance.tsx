// @ts-nocheck
"use client"
import { Phone, Mail, Linkedin, MapPin, Globe, Github, Facebook, PlusCircle, Trash2, Sparkles, Languages as LangIcon, Heart, ChevronDown, Check, Search, Loader2 } from "lucide-react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"
import React, { useRef, useState, useEffect } from "react"
import countriesData from "@/lib/countries-data.json"
import { DatePicker, ConfigProvider, theme } from "antd"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

dayjs.extend(customParseFormat)

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
  onUpdate,
  onRefine,
  refiningId
}: { 
  data: CVData, 
  isEditable?: boolean, 
  onUpdate?: (field: string, value: any) => void,
  onRefine?: (type: "summary" | "experience" | "project" | "volunteering", itemId?: string) => void,
  refiningId?: string | null
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
        cursor: isEditable ? undefined : "default",
        userSelect: "text",
        WebkitUserSelect: "text",
        MozUserSelect: "text",
        msUserSelect: "text",
      }}
    >
      {/* Inject placeholder CSS only in edit mode */}
      {isEditable && (
        <style>{`
          [data-placeholder]:empty::before {
            content: attr(data-placeholder);
            color: rgba(124,58,237,0.28);
            pointer-events: none;
            font-style: italic;
          }
          [data-placeholder-white]:empty::before {
            content: attr(data-placeholder-white);
            color: rgba(255,255,255,0.25);
            pointer-events: none;
            font-style: italic;
          }
        `}</style>
      )}
      
      {/* PDF page break controls */}
      <style>{`
        .cv-section {
          break-inside: avoid;
          page-break-inside: avoid;
          margin-top: 12pt;
        }
        .cv-section.new-page {
          margin-top: 150pt !important;
          padding-top: 30pt !important;
        }
        .cv-section-title {
          break-after: avoid;
          page-break-after: avoid;
        }
        .cv-section-content {
          break-before: avoid;
          page-break-before: avoid;
        }
      `}</style>
      
      {/* Script to mark sections that start on new pages */}
      {!isEditable && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function markNewPageSections() {
                  const sections = document.querySelectorAll('.cv-section');
                  const pageHeight = 1122; // A4 height in pixels at 96 DPI
                  let currentPosition = 0;
                  let previousPageEnd = 0;
                  
                  sections.forEach((section, index) => {
                    if (index === 0) {
                      section.classList.remove('new-page');
                      return;
                    }
                    
                    const sectionTop = section.offsetTop;
                    const pageAtSectionTop = Math.floor(sectionTop / pageHeight);
                    const previousSectionEnd = index > 0 ? sections[index - 1].offsetTop + sections[index - 1].offsetHeight : 0;
                    const pageAtPreviousEnd = Math.floor(previousSectionEnd / pageHeight);
                    
                    if (pageAtSectionTop > pageAtPreviousEnd) {
                      section.classList.add('new-page');
                    } else {
                      section.classList.remove('new-page');
                    }
                  });
                }
                
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', markNewPageSections);
                } else {
                  markNewPageSections();
                }
                
                window.addEventListener('load', markNewPageSections);
              })();
            `,
          }}
        />
      )}
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
            data-placeholder-white="Full Name"
            onBlur={(e) => onUpdate?.("personalInfo.fullName", e.currentTarget.innerText.trim())}
            style={{
              fontSize: "34px",
              fontWeight: 700,
              letterSpacing: "1px",
              marginBottom: "4px",
              lineHeight: 1.1,
              outline: "none",
              border: isEditable ? "1px dashed rgba(255,255,255,0.3)" : "none",
              padding: isEditable ? "4px 10px" : "0",
              borderRadius: isEditable ? "4px" : "0",
              display: "block",
              minWidth: isEditable ? "160px" : "auto",
              cursor: isEditable ? "text" : "default",
            }}
          >
            {personalInfo.fullName}
          </h1>
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning={true}
            data-placeholder-white="Professional Title"
            onBlur={(e) => onUpdate?.("personalInfo.jobTitle", e.currentTarget.innerText.trim())}
            style={{
              fontSize: "13px",
              color: "#c4b5fd",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: 400,
              outline: "none",
              border: isEditable ? "1px dashed rgba(196,181,253,0.3)" : "none",
              padding: isEditable ? "2px 10px" : "0",
              borderRadius: isEditable ? "4px" : "0",
              display: "block",
              minWidth: isEditable ? "160px" : "auto",
              marginTop: "8px",
              cursor: isEditable ? "text" : "default",
            }}
          >
            {personalInfo.jobTitle}
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
                    data-placeholder="number"
                    onBlur={(e) => onUpdate?.("personalInfo.phone", e.currentTarget.innerText.trim())}
                    style={{ outline: "none", border: "1px dashed rgba(124,58,237,0.3)", padding: "1px 6px", borderRadius: "3px", minWidth: "60px", display: "inline-block" }}
                  >
                    {personalInfo.phone}
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
            text={personalInfo.email} 
            placeholder="email@example.com"
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
            text={personalInfo.location}
            placeholder="Postal code"
            isEditable={isEditable}
            onUpdate={(val) => onUpdate?.("personalInfo.location", val)}
          />
        )}
        {(personalInfo.linkedin || isEditable) && (
          <ContactChip 
            icon={<Linkedin size={10} />} 
            text={personalInfo.linkedin}
            placeholder="LinkedIn URL"
            href={formatUrl(personalInfo.linkedin)}
            isEditable={isEditable}
            onUpdate={(val) => onUpdate?.("personalInfo.linkedin", val)}
          />
        )}
        {(personalInfo.website || isEditable) && (
          <ContactChip 
            icon={<Globe size={10} />} 
            text={personalInfo.website}
            placeholder="Website URL"
            href={formatUrl(personalInfo.website)}
            isEditable={isEditable}
            onUpdate={(val) => onUpdate?.("personalInfo.website", val)}
          />
        )}
        {(personalInfo.github || isEditable) && (
          <ContactChip 
            icon={<Github size={10} />} 
            text={personalInfo.github}
            placeholder="GitHub URL"
            href={formatUrl(personalInfo.github)}
            isEditable={isEditable}
            onUpdate={(val) => onUpdate?.("personalInfo.github", val)}
          />
        )}
        {(personalInfo.facebook || isEditable) && (
          <ContactChip 
            icon={<Facebook size={10} />} 
            text={personalInfo.facebook}
            placeholder="Facebook URL"
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
          <div className="cv-section" style={{ marginBottom: "28px", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <SectionTitle label="Professional Profile" noMargin />
              {isEditable && (
                <button 
                  onClick={() => onRefine?.("summary")}
                  disabled={refiningId === "summary" || !personalInfo.summary}
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "6px", 
                    fontSize: "10px", 
                    fontWeight: 700, 
                    color: "#7c3aed", 
                    background: "rgba(124, 58, 237, 0.05)", 
                    border: "1px solid rgba(124, 58, 237, 0.2)",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    opacity: (refiningId === "summary" || !personalInfo.summary) ? 0.5 : 1
                  }}
                >
                  {refiningId === "summary" ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  AI REFINE
                </button>
              )}
            </div>
            <div
              contentEditable={isEditable}
              suppressContentEditableWarning={true}
              data-placeholder="Briefly describe your professional journey..."
              onBlur={(e) => onUpdate?.("personalInfo.summary", e.currentTarget.innerText.trim())}
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
                cursor: isEditable ? "text" : "default",
                border: isEditable ? "1px dashed rgba(124,58,237,0.2)" : "none",
                padding: isEditable ? "8px 16px" : "0 0 0 16px",
                borderRadius: isEditable ? "4px" : "0",
              }}
            >
              {personalInfo.summary}
            </div>
          </div>
        )}

        {/* Personal Details */}
        {(hasPersonalDetails || isEditable) && (
          <div className="cv-section" style={{ marginBottom: "28px" }}>
            <SectionTitle label="Personal Details" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 32px", paddingLeft: "16px", borderLeft: "2px solid #e5e2f0" }}>
              {(personalInfo.dateOfBirth || isEditable) && <DetailRow label="Date of Birth" value={personalInfo.dateOfBirth} type="date" isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.dateOfBirth", val)} />}
              {(personalInfo.placeOfBirth || isEditable) && <DetailRow label="Place of Birth" value={personalInfo.placeOfBirth} placeholder="City, Country" isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.placeOfBirth", val)} />}
              {(personalInfo.nationality || isEditable) && <DetailRow label="Nationality" value={personalInfo.nationality} type="country" isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.nationality", val)} />}
              {(personalInfo.gender || isEditable) && <DetailRow label="Gender" value={personalInfo.gender} type="options" options={["Male", "Female", "Other", "Prefer not to say"]} isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.gender", val)} />}
              {(personalInfo.passport || isEditable) && <DetailRow label="Passport" value={personalInfo.passport} placeholder="Passport Number" isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.passport", val)} />}
              {(personalInfo.workPermit || isEditable) && <DetailRow label="Work Permit" value={personalInfo.workPermit} placeholder="Work Permit / Visa Status" isEditable={isEditable} onUpdate={(val) => onUpdate?.("personalInfo.workPermit", val)} />}
            </div>
          </div>
        )}

        {/* Experience */}
        {(experience.length > 0 || isEditable) && (
          <div className="cv-section" style={{ marginBottom: "28px" }}>
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
                      data-placeholder="Role / Job Title"
                      onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.currentTarget.innerText.trim())}
                      style={{ fontWeight: 700, fontSize: "13.5px", color: "#1a1a2e", outline: "none",
                        border: isEditable ? "1px dashed rgba(124,58,237,0.3)" : "none",
                        padding: isEditable ? "2px 8px" : "0",
                        borderRadius: isEditable ? "3px" : "0",
                        minWidth: isEditable ? "100px" : "auto",
                        display: "inline-block",
                      }}
                    >
                      {exp.role}
                    </span>
                    {isEditable ? (
                      <DurationPicker 
                        value={exp.duration} 
                        onChange={(val) => onUpdate?.(`experience.${exp.id}.duration`, val)} 
                      />
                    ) : (
                      <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 600, whiteSpace: "nowrap", marginLeft: "12px" }}>
                        {exp.duration}
                      </span>
                    )}
                  </div>
                  <p 
                    contentEditable={isEditable}
                    suppressContentEditableWarning={true}
                    data-placeholder="Company name"
                    onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.currentTarget.innerText.trim())}
                    style={{ fontSize: "12px", color: "#6d28d9", marginBottom: "2px", fontStyle: "italic", outline: "none",
                      border: isEditable ? "1px dashed rgba(109,40,217,0.3)" : "none",
                      padding: isEditable ? "2px 8px" : "0",
                      borderRadius: isEditable ? "3px" : "0",
                      minWidth: isEditable ? "100px" : "auto",
                      display: "block",
                    }}
                  >
                    {exp.company}
                  </p>
                   <div style={{ marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", color: "#6b7280", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      {isEditable && <MapPin size={10} strokeWidth={3} />}
                      {isEditable ? (
                        <SearchableSelect 
                          value={exp.location || "Location"} 
                          options={countriesData.map(c => c.name)} 
                          onSelect={(val) => onUpdate?.(`experience.${exp.id}.location`, val)} 
                        />
                      ) : (
                        exp.location ? <><MapPin size={10} strokeWidth={2} /><span>{exp.location}</span></> : null
                      )}
                    </span>
                    {isEditable && (
                      <button 
                        onClick={() => onRefine?.("experience", exp.id)}
                        disabled={refiningId === exp.id || (exp.description.length === 0 && !exp.workDescription)}
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "5px", 
                          fontSize: "9px", 
                          fontWeight: 700, 
                          color: "#7c3aed", 
                          background: "rgba(124, 58, 237, 0.05)", 
                          border: "1px solid rgba(124, 58, 237, 0.15)",
                          padding: "3px 8px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          opacity: (refiningId === exp.id || (exp.description.length === 0 && !exp.workDescription)) ? 0.5 : 1
                        }}
                      >
                        {refiningId === exp.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                        AI REFINE
                      </button>
                    )}
                  </div>
                  {(exp.workDescription || isEditable) && (
                    <div style={{ marginBottom: "10px" }}>
                      <div
                        contentEditable={isEditable}
                        suppressContentEditableWarning={true}
                        data-placeholder="Briefly describe your role and key responsibilities..."
                        onBlur={(e) => onUpdate?.(`experience.${exp.id}.workDescription`, e.currentTarget.innerText.trim())}
                        style={{ 
                          fontSize: "12px", 
                          color: "#374151", 
                          lineHeight: 1.6, 
                          outline: "none",
                          backgroundColor: isEditable ? "rgba(124, 58, 237, 0.01)" : "transparent",
                          border: isEditable ? "1px dashed rgba(124,58,237,0.1)" : "none",
                          padding: isEditable ? "4px 8px" : "0",
                          borderRadius: "3px",
                          minHeight: isEditable && !exp.workDescription ? "20px" : "auto",
                          textAlign: "justify"
                        }}
                      >
                        {exp.workDescription}
                      </div>
                    </div>
                  )}
                  <ul style={{ paddingLeft: "16px", margin: 0, listStyleType: "disc" }}>
                    {exp.description.map((bullet, i) => (
                      <li key={i} style={{ fontSize: "12px", color: "#374151", lineHeight: 1.65, marginBottom: "4px", position: "relative" }}>
                        <div
                          contentEditable={isEditable}
                          suppressContentEditableWarning={true}
                          data-placeholder="Bullet point..."
                          onBlur={(e) => {
                            const newBullets = [...exp.description]
                            newBullets[i] = e.currentTarget.innerText
                            onUpdate?.(`experience.${exp.id}.description`, newBullets.filter(b => b.trim() || isEditable))
                          }}
                          style={{ outline: "none",
                            border: isEditable ? "1px dashed rgba(124,58,237,0.2)" : "none",
                            padding: isEditable ? "2px 6px" : "0",
                            borderRadius: isEditable ? "3px" : "0",
                            minWidth: isEditable ? "120px" : "auto",
                          }}
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
          <div className="cv-section" style={{ marginBottom: "28px" }}>
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
                      data-placeholder="Degree / Certificate"
                      onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.currentTarget.innerText.trim())}
                      style={{ fontWeight: 700, fontSize: "13px", color: "#1a1a2e", outline: "none",
                        border: isEditable ? "1px dashed rgba(124,58,237,0.3)" : "none",
                        padding: isEditable ? "2px 8px" : "0",
                        borderRadius: isEditable ? "3px" : "0",
                        minWidth: isEditable ? "100px" : "auto",
                        display: "inline-block",
                      }}
                    >
                      {edu.degree}
                    </span>
                    {isEditable ? (
                      <DurationPicker 
                        value={edu.duration} 
                        onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} 
                      />
                    ) : (
                      <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 600, whiteSpace: "nowrap", marginLeft: "12px" }}>
                        {edu.duration}
                      </span>
                    )}
                  </div>
                  <p 
                    contentEditable={isEditable}
                    suppressContentEditableWarning={true}
                    data-placeholder="School / Institution"
                    onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.currentTarget.innerText.trim())}
                    style={{ fontSize: "12px", color: "#6d28d9", marginBottom: "2px", fontStyle: "italic", outline: "none",
                      border: isEditable ? "1px dashed rgba(109,40,217,0.3)" : "none",
                      padding: isEditable ? "2px 8px" : "0",
                      borderRadius: isEditable ? "3px" : "0",
                      minWidth: isEditable ? "100px" : "auto",
                      display: "block",
                    }}
                  >
                    {edu.school}
                  </p>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", color: "#6b7280", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      {isEditable && <MapPin size={10} />}
                      {isEditable ? (
                        <SearchableSelect 
                          value={edu.location || "Location"} 
                          options={countriesData.map(c => c.name)} 
                          onSelect={(val) => onUpdate?.(`education.${edu.id}.location`, val)} 
                        />
                      ) : (
                        edu.location ? <><MapPin size={10} /><span>{edu.location}</span></> : null
                      )}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ fontSize: "11px", color: "#374151" }}>
                        <span style={{ fontWeight: 600, color: "#4c1d95" }}>Field:</span>{" "}
                        <span 
                          contentEditable={isEditable}
                          suppressContentEditableWarning={true}
                          data-placeholder="Field of study"
                          onBlur={(e) => onUpdate?.(`education.${edu.id}.fieldOfStudy`, e.currentTarget.innerText.trim())}
                          style={{ outline: "none",
                            border: isEditable ? "1px dashed rgba(124,58,237,0.25)" : "none",
                            padding: isEditable ? "1px 6px" : "0",
                            borderRadius: isEditable ? "3px" : "0",
                            minWidth: isEditable ? "80px" : "auto",
                            display: "inline-block",
                          }}
                        >
                          {edu.fieldOfStudy}
                        </span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#374151" }}>
                        <span style={{ fontWeight: 600, color: "#4c1d95" }}>Grade:</span>{" "}
                        <span 
                          contentEditable={isEditable}
                          suppressContentEditableWarning={true}
                          data-placeholder="Grade"
                          onBlur={(e) => onUpdate?.(`education.${edu.id}.grade`, e.currentTarget.innerText.trim())}
                          style={{ outline: "none",
                            border: isEditable ? "1px dashed rgba(124,58,237,0.25)" : "none",
                            padding: isEditable ? "1px 6px" : "0",
                            borderRadius: isEditable ? "3px" : "0",
                            minWidth: isEditable ? "60px" : "auto",
                            display: "inline-block",
                          }}
                        >
                          {edu.grade}
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
          <div className="cv-section" style={{ marginBottom: "28px" }}>
            <SectionTitle label="Core Competencies" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
              {allSkills.map((skill, i) => (
                <span
                  key={i}
                  contentEditable={isEditable}
                  suppressContentEditableWarning={true}
                  data-placeholder="Skill..."
                  onBlur={(e) => {
                    const newSkills = [...allSkills]
                    newSkills[i] = e.currentTarget.innerText.trim()
                    onUpdate?.("skills", newSkills.filter(s => s.trim() || isEditable))
                  }}
                  style={{
                    background: "#f5f3ff",
                    color: "#4c1d95",
                    fontSize: "10.5px",
                    fontWeight: 600,
                    padding: "4px 12px",
                    borderRadius: "6px",
                    border: isEditable ? "1px dashed rgba(124,58,237,0.5)" : "1px solid #e5e2f0",
                    outline: "none",
                    position: "relative",
                    minWidth: isEditable ? "60px" : "auto",
                    display: "inline-block",
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
          <div className="cv-section" style={{ marginBottom: "28px" }}>
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
                    data-placeholder="Language"
                    onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.currentTarget.innerText.trim())}
                    style={{ fontWeight: 700, fontSize: "12px", color: "#1a1a2e", outline: "none",
                      border: isEditable ? "1px dashed rgba(124,58,237,0.3)" : "none",
                      padding: isEditable ? "1px 6px" : "0",
                      borderRadius: isEditable ? "3px" : "0",
                      minWidth: isEditable ? "50px" : "auto",
                      display: "inline-block",
                    }}
                  >
                    {lang.name}
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
          <div className="cv-section" style={{ marginBottom: "28px" }}>
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
                      data-placeholder="Project name"
                      onBlur={(e) => onUpdate?.(`projects.${proj.id}.name`, e.currentTarget.innerText.trim())}
                      style={{ fontWeight: 700, fontSize: "13px", color: "#1a1a2e", outline: "none",
                        border: isEditable ? "1px dashed rgba(124,58,237,0.3)" : "none",
                        padding: isEditable ? "2px 8px" : "0",
                        borderRadius: isEditable ? "3px" : "0",
                        minWidth: isEditable ? "100px" : "auto",
                        display: "inline-block",
                      }}
                    >
                      {proj.name}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span 
                        contentEditable={isEditable}
                        suppressContentEditableWarning={true}
                        data-placeholder="project link"
                        onBlur={(e) => onUpdate?.(`projects.${proj.id}.link`, e.currentTarget.innerText.trim())}
                        style={{ fontSize: "10px", color: "#7c3aed", textDecoration: "none", outline: "none",
                          border: isEditable ? "1px dashed rgba(124,58,237,0.3)" : "none",
                          padding: isEditable ? "1px 6px" : "0",
                          borderRadius: isEditable ? "3px" : "0",
                          minWidth: isEditable ? "70px" : "auto",
                          display: "inline-block",
                        }}
                      >
                        {proj.link}
                      </span>
                      {isEditable && (
                        <DurationPicker 
                          value={proj.duration || ""} 
                          onChange={(val) => onUpdate?.(`projects.${proj.id}.duration`, val)} 
                        />
                      )}
                    </div>
                  </div>
                   <div style={{ position: "relative" }}>
                    <div
                      contentEditable={isEditable}
                      suppressContentEditableWarning={true}
                      data-placeholder="Describe your project..."
                      onBlur={(e) => onUpdate?.(`projects.${proj.id}.description`, e.currentTarget.innerText.trim())}
                      style={{ 
                        fontSize: "12px", 
                        color: "#374151", 
                        lineHeight: 1.6, 
                        marginTop: "3px", 
                        outline: "none", 
                        minHeight: isEditable ? "30px" : "auto", 
                        backgroundColor: isEditable ? "rgba(124, 58, 237, 0.02)" : "transparent", 
                        cursor: isEditable ? "text" : "default",
                        border: isEditable ? "1px dashed rgba(124,58,237,0.2)" : "none",
                        padding: isEditable ? "4px 8px" : "0",
                        borderRadius: isEditable ? "3px" : "0",
                      }}
                    >
                      {proj.description}
                    </div>
                    {isEditable && (
                      <button 
                        onClick={() => onRefine?.("project", proj.id)}
                        disabled={refiningId === `project-${proj.id}` || !proj.description}
                        style={{ 
                          position: "absolute",
                          right: "8px",
                          bottom: "8px",
                          display: "flex", 
                          alignItems: "center", 
                          gap: "4px", 
                          fontSize: "8px", 
                          fontWeight: 700, 
                          color: "#7c3aed", 
                          background: "white", 
                          border: "1px solid rgba(124, 58, 237, 0.3)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                          opacity: (refiningId === `project-${proj.id}` || !proj.description) ? 0.5 : 1
                        }}
                      >
                        {refiningId === `project-${proj.id}` ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                        REFINE
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Volunteering */}
        {((volunteering && volunteering.length > 0) || isEditable) && (
          <div className="cv-section" style={{ marginBottom: "28px" }}>
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
                      data-placeholder="Volunteer role"
                      onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.currentTarget.innerText.trim())}
                      style={{ fontWeight: 700, fontSize: "13px", color: "#1a1a2e", outline: "none",
                        border: isEditable ? "1px dashed rgba(124,58,237,0.3)" : "none",
                        padding: isEditable ? "2px 8px" : "0",
                        borderRadius: isEditable ? "3px" : "0",
                        minWidth: isEditable ? "100px" : "auto",
                        display: "inline-block",
                      }}
                    >
                      {vol.role}
                    </span>
                    {isEditable ? (
                      <DurationPicker 
                        value={vol.duration} 
                        onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} 
                      />
                    ) : (
                      <span style={{ fontSize: "11px", color: "#7c3aed", fontWeight: 600, whiteSpace: "nowrap", marginLeft: "12px" }}>
                        {vol.duration}
                      </span>
                    )}
                  </div>
                  <p 
                    contentEditable={isEditable}
                    suppressContentEditableWarning={true}
                    data-placeholder="Organization name"
                    onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.currentTarget.innerText.trim())}
                    style={{ fontSize: "12px", color: "#6d28d9", marginBottom: "2px", fontStyle: "italic", outline: "none",
                      border: isEditable ? "1px dashed rgba(109,40,217,0.3)" : "none",
                      padding: isEditable ? "2px 8px" : "0",
                      borderRadius: isEditable ? "3px" : "0",
                      minWidth: isEditable ? "100px" : "auto",
                      display: "block",
                    }}
                  >
                    {vol.organization}
                  </p>
                  <div style={{ marginBottom: "6px" }}>
                    <span style={{ fontSize: "11px", color: "#6b7280", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                      {isEditable && <MapPin size={10} />}
                      {isEditable ? (
                        <SearchableSelect 
                          value={vol.location || "Location"} 
                          options={countriesData.map(c => c.name)} 
                          onSelect={(val) => onUpdate?.(`volunteering.${vol.id}.location`, val)} 
                        />
                      ) : (
                        vol.location ? <><MapPin size={10} /><span>{vol.location}</span></> : null
                      )}
                    </span>
                  </div>
                   <div style={{ position: "relative" }}>
                    <div
                      contentEditable={isEditable}
                      suppressContentEditableWarning={true}
                      data-placeholder="Describe your volunteer work..."
                      onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.currentTarget.innerText.trim())}
                      style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6, outline: "none", 
                        backgroundColor: isEditable ? "rgba(124, 58, 237, 0.02)" : "transparent", 
                        cursor: isEditable ? "text" : "default",
                        border: isEditable ? "1px dashed rgba(124,58,237,0.2)" : "none",
                        padding: isEditable ? "4px 8px" : "0",
                        borderRadius: isEditable ? "3px" : "0",
                        minHeight: isEditable ? "40px" : "auto",
                      }}
                    >
                      {vol.description}
                    </div>
                    {isEditable && (
                      <button 
                        onClick={() => onRefine?.("volunteering", vol.id)}
                        disabled={refiningId === vol.id || !vol.description}
                        style={{ 
                          position: "absolute",
                          right: "8px",
                          bottom: "8px",
                          display: "flex", 
                          alignItems: "center", 
                          gap: "4px", 
                          fontSize: "8px", 
                          fontWeight: 700, 
                          color: "#7c3aed", 
                          background: "white", 
                          border: "1px solid rgba(124, 58, 237, 0.3)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                          opacity: (refiningId === vol.id || !vol.description) ? 0.5 : 1
                        }}
                      >
                        {refiningId === vol.id ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                        REFINE
                      </button>
                    )}
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

function DurationPicker({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      
      // If less than 400px below and more space above, flip to top
      if (spaceBelow < 400 && spaceAbove > spaceBelow) {
        setPosition('top')
      } else {
        setPosition('bottom')
      }

      // Smooth scroll if needed
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [isOpen])

  const parts = value.split(" - ")
  const startPart = parts[0]?.trim() || ""
  const endPart = parts[1]?.trim() || ""
  
  const isPresent = endPart === "Present" || endPart === "Current"
  
  // Safe parsing helper
  const parseDate = (str: string) => {
    if (!str || str === "Present" || str === "Current") return null
    const d = dayjs(str, "MMM YYYY")
    return d.isValid() ? d : null
  }

  const startDayjs = parseDate(startPart)
  const endDayjs = isPresent ? null : parseDate(endPart)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        // Don't close if clicking inside the antd date picker dropdown
        const target = e.target as HTMLElement
        if (target.closest('.ant-picker-dropdown')) return
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleStartChange = (date: dayjs.Dayjs | null) => {
    const startStr = date && date.isValid() ? date.format("MMM YYYY") : ""
    const currentEndStr = isPresent ? "Present" : (endDayjs && endDayjs.isValid() ? endDayjs.format("MMM YYYY") : "")
    onChange(startStr || currentEndStr ? `${startStr} - ${currentEndStr}` : "")
  }

  const handleEndChange = (date: dayjs.Dayjs | null) => {
    const startStr = startDayjs && startDayjs.isValid() ? startDayjs.format("MMM YYYY") : ""
    const endStr = date && date.isValid() ? date.format("MMM YYYY") : ""
    onChange(startStr || endStr ? `${startStr} - ${endStr}` : "")
  }

  const togglePresent = () => {
    const startStr = startDayjs && startDayjs.isValid() ? startDayjs.format("MMM YYYY") : ""
    const nextIsPresent = !isPresent
    const endStr = nextIsPresent ? "Present" : ""
    onChange(startStr || endStr ? `${startStr} - ${endStr}` : "")
  }

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          fontSize: "10px",
          color: "#7c3aed",
          fontWeight: 700,
          background: "rgba(124, 58, 237, 0.05)",
          border: "1px dashed #7c3aed",
          padding: "2px 8px",
          borderRadius: "4px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "4px"
        }}
      >
        {value || "Select Duration"} <ChevronDown size={10} />
      </button>

      {isOpen && (
        <div style={{
          position: "absolute",
          [position === 'top' ? 'bottom' : 'top']: "100%",
          left: 0,
          zIndex: 1000,
          background: "#fff",
          border: "1px solid #e5e2f0",
          borderRadius: "12px",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
          padding: "16px",
          width: "280px",
          marginTop: position === 'bottom' ? "8px" : "0",
          marginBottom: position === 'top' ? "8px" : "0",
        }}>
          <div style={{ marginBottom: "12px" }}>
            <p style={{ fontSize: "9px", fontWeight: 800, color: "#9ca3af", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Start Date</p>
            <DatePicker 
              picker="month"
              value={startDayjs}
              onChange={handleStartChange}
              format="MMM YYYY"
              style={{ width: "100%" }}
              placeholder="Select month"
              allowClear={false}
            />
          </div>
          
          <div style={{ marginBottom: "12px", paddingTop: "12px", borderTop: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <p style={{ fontSize: "9px", fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "1px" }}>End Date</p>
              <button
                type="button"
                onClick={togglePresent}
                style={{
                  fontSize: "8px",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "4px",
                  border: "none",
                  background: isPresent ? "#7c3aed" : "rgba(124, 58, 237, 0.1)",
                  color: isPresent ? "#fff" : "#7c3aed",
                  cursor: "pointer",
                  textTransform: "uppercase"
                }}
              >
                Present
              </button>
            </div>
            {!isPresent && (
              <DatePicker 
                picker="month"
                value={endDayjs}
                onChange={handleEndChange}
                format="MMM YYYY"
                style={{ width: "100%" }}
                placeholder="Select month"
                allowClear={false}
              />
            )}
          </div>

          <button
            onClick={() => setIsOpen(false)}
            style={{
              width: "100%",
              padding: "8px",
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "10px",
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              marginTop: "4px"
            }}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}

function SectionTitle({ label, noMargin }: { label: string; noMargin?: boolean }) {
  return (
    <div style={{ marginBottom: noMargin ? "0" : "10px" }} className="cv-section-title">
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
  options = [],
  placeholder
}: {
  label: string;
  value: string;
  isEditable?: boolean;
  onUpdate?: (val: string) => void;
  type?: "text" | "date" | "options" | "country";
  options?: string[];
  placeholder?: string;
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
        data-placeholder={placeholder || "---"}
        onBlur={(e) => onUpdate?.(e.currentTarget.innerText.trim())}
        style={{
          color: "#374151",
          outline: "none",
          border: isEditable ? "1px dashed rgba(124,58,237,0.25)" : "none",
          padding: isEditable ? "1px 6px" : "0",
          borderRadius: isEditable ? "3px" : "0",
          minWidth: isEditable ? "60px" : "auto",
          display: "inline-block",
        }}
      >
        {value}
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

function ContactChip({ icon, text, href, isEditable, onUpdate, placeholder }: { icon: React.ReactNode; text: string; href?: string; isEditable?: boolean; onUpdate?: (val: string) => void; placeholder?: string }) {
  const inner = (
    <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</span>
      <span 
        contentEditable={isEditable}
        suppressContentEditableWarning={true}
        data-placeholder={isEditable ? (placeholder || "") : undefined}
        onBlur={(e) => onUpdate?.(e.currentTarget.innerText.trim())}
        style={{
          textDecoration: "none",
          color: href ? "#6d28d9" : "#4c1d95",
          outline: "none",
          border: isEditable ? "1px dashed rgba(124,58,237,0.3)" : "none",
          padding: isEditable ? "1px 6px" : "0",
          borderRadius: isEditable ? "3px" : "0",
          minWidth: isEditable ? "60px" : "auto",
          display: "inline-block",
        }}
      >
        {text}
      </span>
    </span>
  )

  if (isEditable) return inner

  return href && text ? (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
      {inner}
    </a>
  ) : (
    inner
  )
}
