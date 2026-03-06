import React, { useState, useRef, useEffect } from "react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"
import { PlusCircle, Trash2, X, Sparkles, Loader2, ChevronDown, Check, Search } from "lucide-react"
import { DurationPicker } from "../DurationPicker"
import countriesData from "@/lib/countries-data.json"

export function StartupTech({ 
  data,
  isEditable = false,
  onUpdate
}: { 
  data: CVData,
  isEditable?: boolean,
  onUpdate?: (field: string, value: any) => void
}) {
  const { personalInfo, experience, skills, projects, education, volunteering, languages } = data
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
        fontFamily: "'Courier New', Courier, monospace",
        color: "#000",
        position: "relative"
      }}
    >
      
      <header style={{ marginBottom: "16px" }}>
        {isEditable ? (
          <input
            defaultValue={personalInfo.fullName}
            placeholder="FULL NAME"
            onBlur={(e) => onUpdate?.("personalInfo.fullName", e.target.value)}
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              margin: "0 0 4px 0",
              width: "100%",
              background: "transparent",
              border: "1px dashed #000",
              outline: "none",
              fontFamily: "inherit"
            }}
          />
        ) : (
          <h1 style={{ fontSize: "30px", fontWeight: "bold", margin: "0 0 4px 0" }}>{personalInfo.fullName}</h1>
        )}
        {isEditable ? (
          <input
            defaultValue={personalInfo.jobTitle}
            placeholder="JOB TITLE"
            onBlur={(e) => onUpdate?.("personalInfo.jobTitle", e.target.value)}
            style={{
              color: "#4b5563",
              margin: 0,
              width: "100%",
              background: "transparent",
              border: "1px dashed #000",
              outline: "none",
              fontFamily: "inherit"
            }}
          />
        ) : (
          <p style={{ color: "#4b5563", margin: 0 }}>{personalInfo.jobTitle}</p>
        )}
      </header>

      {(hasPersonalDetails || isEditable) && (
        <section style={{ marginBottom: "24px", padding: "12px", background: "#f9fafb", borderRadius: "4px" }}>
          <h2 style={{ fontWeight: "bold", fontSize: "13px", textTransform: "uppercase", marginBottom: "8px", color: "#4b5563" }}>Personal Details</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
             {(personalInfo.dateOfBirth || isEditable) && <DetailRow label="DOB" value={personalInfo.dateOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.dateOfBirth", val)} isEditable={isEditable} type="date" />}
             {(personalInfo.placeOfBirth || isEditable) && <DetailRow label="PLACE" value={personalInfo.placeOfBirth} onUpdate={(val) => onUpdate?.("personalInfo.placeOfBirth", val)} isEditable={isEditable} />}
             {(personalInfo.nationality || isEditable) && (
                <div style={{ fontSize: "11px", display: "flex", gap: "4px", alignItems: "center" }}>
                  <span style={{ fontWeight: "bold", minWidth: "40px" }}>NAT:</span>
                  {isEditable ? (
                    <SearchableSelect 
                      value={personalInfo.nationality || "Select"} 
                      options={countriesData.map(c => c.name)} 
                      onSelect={(val: string) => onUpdate?.("personalInfo.nationality", val)} 
                      variant="light"
                      width="100%"
                    />
                  ) : (
                    <span>{personalInfo.nationality}</span>
                  )}
                </div>
             )}
             {(personalInfo.gender || isEditable) && (
                <div style={{ fontSize: "11px", display: "flex", gap: "4px", alignItems: "center" }}>
                  <span style={{ fontWeight: "bold", minWidth: "40px" }}>GEN:</span>
                  {isEditable ? (
                    <PopSelect 
                      value={personalInfo.gender || "Select"} 
                      options={["Male", "Female", "Other", "Prefer not to say"]} 
                      onSelect={(val: string) => onUpdate?.("personalInfo.gender", val)} 
                      variant="light"
                    />
                  ) : (
                    <span>{personalInfo.gender}</span>
                  )}
                </div>
             )}
             {(personalInfo.passport || isEditable) && <DetailRow label="PASS" value={personalInfo.passport} onUpdate={(val) => onUpdate?.("personalInfo.passport", val)} isEditable={isEditable} />}
             {(personalInfo.workPermit || isEditable) && <DetailRow label="PERMIT" value={personalInfo.workPermit} onUpdate={(val) => onUpdate?.("personalInfo.workPermit", val)} isEditable={isEditable} />}
          </div>
        </section>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "11px", color: "#6b7280", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #e5e7eb" }}>
        {isEditable ? (
           <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", width: "100%" }}>
              <input defaultValue={personalInfo.email || ""} placeholder="Email" onBlur={(e) => onUpdate?.("personalInfo.email", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", width: "180px", outline: "none" }} />
              <div style={{ display: "flex", gap: "4px", alignItems: "center", whiteSpace: "nowrap" }}>
                <SearchableSelect 
                  value={personalInfo.phoneCode || "+1"} 
                  options={countriesData.map(c => `${c.phonecode.startsWith('+') ? '' : '+'}${c.phonecode.split(',')[0].trim()} - ${c.name}`)} 
                  onSelect={(val: string) => {
                    const code = val.split(" - ")[0];
                    onUpdate?.("personalInfo.phoneCode", code.startsWith('+') ? code : `+${code}`);
                  }}
                  width="80px"
                  variant="light"
                />
                <input defaultValue={personalInfo.phone || ""} placeholder="Phone" onBlur={(e) => onUpdate?.("personalInfo.phone", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", width: "110px", outline: "none" }} />
              </div>
              <input defaultValue={personalInfo.location || ""} placeholder="City" onBlur={(e) => onUpdate?.("personalInfo.location", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", width: "120px", outline: "none" }} />
              <SearchableSelect 
                value={personalInfo.country || "Country"} 
                options={countriesData.map(c => c.name)} 
                onSelect={(val: string) => {
                  onUpdate?.("personalInfo.country", val)
                  onUpdate?.("personalInfo.county", "")
                }}
                variant="light"
              />
              <SearchableSelect 
                value={personalInfo.county || "State"} 
                options={personalInfo.country ? (countriesData.find((c: any) => c.name === personalInfo.country)?.states || []).map((s: any) => s.name) : []} 
                onSelect={(val: string) => onUpdate?.("personalInfo.county", val)} 
                variant="light"
              />
              <input defaultValue={personalInfo.website || ""} placeholder="Website" onBlur={(e) => onUpdate?.("personalInfo.website", e.target.value)} style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", width: "180px", outline: "none" }} />
           </div>
        ) : (
          <>
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phoneCode || ''} {personalInfo.phone}</span>}
            {(personalInfo.location || personalInfo.county || personalInfo.country) && (
              <span>{[personalInfo.location, personalInfo.county, personalInfo.country].filter(Boolean).join(", ")}</span>
            )}
            {personalInfo.website && <span>{personalInfo.website.replace(/^https?:\/\//, "")}</span>}
            {personalInfo.linkedin && <span>linkedin.com/in/{personalInfo.linkedin.split('/').pop()}</span>}
            {personalInfo.github && <span>github.com/{personalInfo.github.split('/').pop()}</span>}
          </>
        )}
      </div>

      {(personalInfo.summary || isEditable) && (
        <section style={{ marginBottom: "24px" }}>
          {isEditable ? (
            <textarea
              defaultValue={personalInfo.summary}
              placeholder="Professional Summary"
              onBlur={(e) => onUpdate?.("personalInfo.summary", e.target.value)}
              style={{ width: "100%", minHeight: "80px", fontSize: "13px", background: "transparent", border: "1px dashed #000", outline: "none", fontFamily: "inherit", resize: "vertical" }}
            />
          ) : (
            <MarkdownText content={personalInfo.summary} style={{ fontSize: "13px", lineHeight: "1.5" }} />
          )}
        </section>
      )}


      {/* Education - Moved up */}
      {(education && education.length > 0 || isEditable) && (
        <section style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
            <h2 style={{ fontWeight: "bold", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Education</h2>
            {isEditable && (
              <button onClick={() => onUpdate?.("education.add", {})} style={{ background: "none", border: "none", color: "#000", cursor: "pointer" }}><PlusCircle size={14} /></button>
            )}
          </div>
          {(education || []).map((edu) => (
            <div key={edu.id} style={{ marginBottom: "12px", position: "relative" }}>
               {isEditable && (
                <button onClick={() => onUpdate?.("education.remove", edu.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", flex: 1 }}>
                  {isEditable ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <input defaultValue={edu.degree} placeholder="Degree" onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)} style={{ fontWeight: "600", background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "14px", flex: 1 }} />
                        <span>at</span>
                        <input defaultValue={edu.school} placeholder="School" onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)} style={{ background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "14px", flex: 1 }} />
                      </div>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <input defaultValue={edu.fieldOfStudy} placeholder="Field of Study" onBlur={(e) => onUpdate?.(`education.${edu.id}.fieldOfStudy`, e.target.value)} style={{ fontSize: "12px", background: "transparent", border: "1px dashed #000", outline: "none", width: "60%" }} />
                        <input defaultValue={edu.grade} placeholder="Grade" onBlur={(e) => onUpdate?.(`education.${edu.id}.grade`, e.target.value)} style={{ fontSize: "12px", background: "transparent", border: "1px dashed #000", outline: "none", width: "40%" }} />
                      </div>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <SearchableSelect 
                          value={edu.country || "Country"} 
                          options={countriesData.map(c => c.name)} 
                          onSelect={(val: string) => {
                            onUpdate?.(`education.${edu.id}.country`, val)
                            onUpdate?.(`education.${edu.id}.county`, "")
                          }}
                          variant="light"
                        />
                        <SearchableSelect 
                          value={edu.county || "State"} 
                          options={edu.country ? (countriesData.find((c: any) => c.name === edu.country)?.states || []).map((s: any) => s.name) : []} 
                          onSelect={(val: string) => onUpdate?.(`education.${edu.id}.county`, val)} 
                          variant="light"
                        />
                        <input defaultValue={edu.location || ""} placeholder="City" onBlur={(e) => onUpdate?.(`education.${edu.id}.location`, e.target.value)} style={{ background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "12px", width: "100px" }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <span style={{ fontWeight: "600" }}>{edu.degree}</span>
                      <span style={{ color: "#9ca3af" }}>at</span>
                      <span>{edu.school}</span>
                      {edu.fieldOfStudy && <span style={{ fontSize: "12px", color: "#4b5563" }}> • {edu.fieldOfStudy}</span>}
                      {edu.grade && <span style={{ fontSize: "12px", color: "#4b5563" }}> • {edu.grade}</span>}
                      {(edu.location || edu.county || edu.country) && (
                        <span style={{ color: "#6b7280", fontSize: "12px" }}>• {[edu.location, edu.county, edu.country].filter(Boolean).join(", ")}</span>
                      )}
                    </>
                  )}
                </div>
                {isEditable ? (
                  <DurationPicker value={edu.duration} onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} />
                ) : (
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>{edu.duration}</span>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "16px" }}>
          <h2 style={{ fontWeight: "bold", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Experience</h2>
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
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", marginBottom: "4px" }}>
              {isEditable ? (
                <div style={{ display: "flex", gap: "4px", width: "70%" }}>
                   <input defaultValue={exp.role} placeholder="Role" onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)} style={{ fontWeight: "600", background: "transparent", border: "1px dashed #000", outline: "none", width: "45%" }} />
                   <span>@</span>
                   <input defaultValue={exp.company} placeholder="Company" onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)} style={{ fontWeight: "600", background: "transparent", border: "1px dashed #000", outline: "none", width: "45%" }} />
                </div>
              ) : (
                <span>{exp.role} @ {exp.company}</span>
              )}
              {isEditable ? (
                <DurationPicker value={exp.duration} onChange={(val) => onUpdate?.(`experience.${exp.id}.duration`, val)} />
              ) : (
                <span style={{ fontSize: "12px", color: "#6b7280" }}>
                  {exp.duration}
                </span>
              )}
            </div>
            {isEditable ? (
              <div style={{ marginTop: "4px" }}>
                <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
                  <SearchableSelect 
                    value={exp.country || "Country"} 
                    options={countriesData.map(c => c.name)} 
                    onSelect={(val: string) => {
                      onUpdate?.(`experience.${exp.id}.country`, val)
                      onUpdate?.(`experience.${exp.id}.county`, "")
                    }}
                    variant="light"
                  />
                  <SearchableSelect 
                    value={exp.county || "State"} 
                    options={exp.country ? (countriesData.find((c: any) => c.name === exp.country)?.states || []).map((s: any) => s.name) : []} 
                    onSelect={(val: string) => onUpdate?.(`experience.${exp.id}.county`, val)} 
                    variant="light"
                  />
                  <input defaultValue={exp.location || ""} placeholder="City" onBlur={(e) => onUpdate?.(`experience.${exp.id}.location`, e.target.value)} style={{ background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "12px", width: "100px" }} />
                </div>
                
                {(exp.workDescription || exp.description.length > 0) && (
                  <div style={{ position: "relative", marginBottom: "8px" }}>
                    <textarea 
                      defaultValue={exp.workDescription || exp.description.join('\n')} 
                      placeholder="Work Description..." 
                      onBlur={(e) => onUpdate?.(`experience.${exp.id}.workDescription`, e.target.value)} 
                      style={{ width: "100%", fontSize: "13px", color: "#374151", background: "transparent", border: "1px dashed #000", outline: "none", fontFamily: "inherit", minHeight: "100px" }} 
                    />
                    <button 
                      onClick={() => onUpdate?.("experience.refine", exp.id)}
                      style={{ position: "absolute", bottom: "8px", right: "8px", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", background: "#fff", border: "1px solid #000", padding: "2px 8px", borderRadius: "4px", cursor: "pointer" }}
                    >
                      <Sparkles size={10} /> AI REFINE
                    </button>
                  </div>
                )}

                {exp.description.map((bullet, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                    <input defaultValue={bullet} onBlur={(e) => {
                      const newDesc = [...exp.description]
                      newDesc[i] = e.target.value
                      onUpdate?.(`experience.${exp.id}.description`, newDesc)
                    }} style={{ flex: 1, fontSize: "13px", background: "transparent", border: "1px dashed #000", outline: "none", fontFamily: "inherit" }} />
                    <button onClick={() => {
                      const newDesc = exp.description.filter((_, idx) => idx !== i)
                      onUpdate?.(`experience.${exp.id}.description`, newDesc)
                    }} style={{ color: "#ef4444", background: "none", border: "none" }}><X size={12} /></button>
                  </div>
                ))}
                <button onClick={() => onUpdate?.(`experience.${exp.id}.description`, [...exp.description, ""])} style={{ fontSize: "11px", fontWeight: "bold", background: "none", border: "none", cursor: "pointer" }}>+ ADD BULLET</button>
              </div>
            ) : (
              <div style={{ marginTop: "4px" }}>
                {(exp.location || exp.county || exp.country) && (
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 4px 0" }}>
                    {[exp.location, exp.county, exp.country].filter(Boolean).join(", ")}
                  </p>
                )}
                {exp.workDescription ? (
                  <MarkdownText content={exp.workDescription} style={{ fontSize: "13px", marginBottom: "8px" }} />
                ) : (
                  <ul style={{ paddingLeft: "16px", margin: 0, listStyleType: "square", fontSize: "13px" }}>
                    {exp.description.filter(Boolean).map((d, i) => (
                      <li key={i} style={{ marginBottom: "2px" }}>
                        <MarkdownText content={d} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <section style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
          <h2 style={{ fontWeight: "bold", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Tech Stack</h2>
          {isEditable && (
             <button onClick={() => onUpdate?.("skills.add", "New Category")} style={{ background: "none", border: "none", color: "#000", cursor: "pointer" }}><PlusCircle size={14} /></button>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {isEditable ? (
             <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                {skills.map((skill, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                    <input defaultValue={skill.category} onBlur={(e) => onUpdate?.(`skills.${i}.category`, e.target.value)} style={{ fontWeight: "bold", width: "120px", background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "11px" }} />
                    <input defaultValue={skill.items.join(", ")} onBlur={(e) => onUpdate?.(`skills.${i}.items`, e.target.value.split(",").map(s => s.trim()))} style={{ flex: 1, background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "11px" }} />
                    <button onClick={() => onUpdate?.("skills.remove", i)} style={{ color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                  </div>
                ))}
             </div>
          ) : (
            skills.flatMap((s) => s.items).map((item, i) => (
              <span
                key={i}
                style={{ padding: "4px 12px", fontSize: "11px", background: "rgba(0,0,0,0.05)", borderRadius: "4px" }}
              >
                {item}
              </span>
            ))
          )}
        </div>
      </section>

      { (projects.length > 0 || isEditable) && (
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
            <h2 style={{ fontWeight: "bold", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Projects</h2>
            {isEditable && (
                <button onClick={() => onUpdate?.("projects.add", {})} style={{ background: "none", border: "none", color: "#000", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                <PlusCircle size={14} /> ADD PROJECT
              </button>
            )}
          </div>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: "16px", position: "relative" }}>
               {isEditable && (
                <button onClick={() => onUpdate?.("projects.remove", proj.id)} style={{ position: "absolute", left: "-28px", top: "0", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
              )}
              {isEditable ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                   <div style={{ display: "flex", gap: "8px" }}>
                    <input defaultValue={proj.name} placeholder="Project Name" onBlur={(e) => onUpdate?.(`projects.${proj.id}.name`, e.target.value)} style={{ fontWeight: "600", background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "14px", flex: 1 }} />
                    <input defaultValue={proj.link} placeholder="Link" onBlur={(e) => onUpdate?.(`projects.${proj.id}.link`, e.target.value)} style={{ fontSize: "12px", background: "transparent", border: "1px dashed #000", outline: "none", width: "150px" }} />
                   </div>
                   <div style={{ display: "flex", gap: "4px" }}>
                      <SearchableSelect 
                        value={proj.country || "Country"} 
                        options={countriesData.map(c => c.name)} 
                        onSelect={(val: string) => {
                          onUpdate?.(`projects.${proj.id}.country`, val)
                          onUpdate?.(`projects.${proj.id}.county`, "")
                        }}
                        variant="light"
                      />
                      <SearchableSelect 
                        value={proj.county || "State"} 
                        options={proj.country ? (countriesData.find((c: any) => c.name === proj.country)?.states || []).map((s: any) => s.name) : []} 
                        onSelect={(val: string) => onUpdate?.(`projects.${proj.id}.county`, val)} 
                        variant="light"
                      />
                      <input defaultValue={proj.location || ""} placeholder="City" onBlur={(e) => onUpdate?.(`projects.${proj.id}.location`, e.target.value)} style={{ background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "12px", width: "100px" }} />
                   </div>
                   <textarea defaultValue={proj.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`projects.${proj.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "13px", color: "#374151", background: "transparent", border: "1px dashed #000", outline: "none", fontFamily: "inherit", minHeight: "60px" }} />
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                    <p style={{ fontWeight: "600", margin: "0" }}>{proj.name}</p>
                    {proj.link && <span style={{ fontSize: "11px", color: "#6b7280" }}>({proj.link.replace(/^https?:\/\//, "")})</span>}
                  </div>
                  {(proj.location || proj.county || proj.country) && (
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 2px 0" }}>
                      {[proj.location, proj.county, proj.country].filter(Boolean).join(", ")}
                    </p>
                  )}
                  <MarkdownText content={proj.description} style={{ fontSize: "13px", color: "#374151" }} />
                </>
              )}
            </div>
          ))}
        </section>
      )}


      {/* Volunteering */}
      {(volunteering && volunteering.length > 0 || isEditable) && (
        <section style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
            <h2 style={{ fontWeight: "bold", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Volunteering</h2>
            {isEditable && (
               <button onClick={() => onUpdate?.("volunteering.add", {})} style={{ background: "none", border: "none", color: "#000", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                <PlusCircle size={14} /> ADD ROLE
              </button>
            )}
          </div>
          {(volunteering || []).map((vol) => (
            <div key={vol.id} style={{ marginBottom: "20px", position: "relative" }}>
               {isEditable && (
                <button onClick={() => onUpdate?.("volunteering.remove", vol.id)} style={{ position: "absolute", left: "-28px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={14} /></button>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", flex: 1 }}>
                  {isEditable ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
                       <div style={{ display: "flex", gap: "4px" }}>
                        <input defaultValue={vol.role} placeholder="Role" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)} style={{ fontWeight: "600", background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "14px", flex: 1 }} />
                        <span>at</span>
                        <input defaultValue={vol.organization} placeholder="Organization" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)} style={{ background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "14px", flex: 1 }} />
                       </div>
                       <div style={{ display: "flex", gap: "4px" }}>
                          <SearchableSelect 
                            value={vol.country || "Country"} 
                            options={countriesData.map(c => c.name)} 
                            onSelect={(val: string) => {
                              onUpdate?.(`volunteering.${vol.id}.country`, val)
                              onUpdate?.(`volunteering.${vol.id}.county`, "")
                            }}
                            variant="light"
                          />
                          <SearchableSelect 
                            value={vol.county || "State"} 
                            options={vol.country ? (countriesData.find((c: any) => c.name === vol.country)?.states || []).map((s: any) => s.name) : []} 
                            onSelect={(val: string) => onUpdate?.(`volunteering.${vol.id}.county`, val)} 
                            variant="light"
                          />
                          <input defaultValue={vol.location || ""} placeholder="City" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.location`, e.target.value)} style={{ background: "transparent", border: "1px dashed #000", outline: "none", fontSize: "12px", width: "100px" }} />
                       </div>
                    </div>
                  ) : (
                    <>
                      <span style={{ fontWeight: "600" }}>{vol.role}</span>
                      <span style={{ color: "#9ca3af" }}>at</span>
                      <span style={{ color: "#4b5563" }}>{vol.organization}</span>
                      {(vol.location || vol.county || vol.country) && (
                        <span style={{ color: "#6b7280", fontSize: "12px" }}>• {[vol.location, vol.county, vol.country].filter(Boolean).join(", ")}</span>
                      )}
                    </>
                  )}
                </div>
                {isEditable ? (
                  <DurationPicker value={vol.duration} onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} />
                ) : (
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>{vol.duration}</span>
                )}
              </div>
              {isEditable ? (
                <div style={{ position: "relative" }}>
                  <textarea defaultValue={vol.workDescription || vol.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.workDescription`, e.target.value)} style={{ width: "100%", fontSize: "13px", color: "#374151", background: "transparent", border: "1px dashed #000", outline: "none", fontFamily: "inherit", minHeight: "80px" }} />
                  <button 
                    onClick={() => onUpdate?.("volunteering.refine", vol.id)}
                    style={{ position: "absolute", bottom: "8px", right: "8px", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", background: "#fff", border: "1px solid #000", padding: "2px 8px", borderRadius: "4px", cursor: "pointer" }}
                  >
                    <Sparkles size={10} /> AI REFINE
                  </button>
                </div>
              ) : (
                <MarkdownText content={vol.workDescription || vol.description} style={{ fontSize: "13px", color: "#374151" }} />
              )}
            </div>
          ))}
        </section>
      )}

      <section style={{ borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
        {(languages && languages.length > 0 || isEditable) && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "12px" }}>
              <h2 style={{ fontWeight: "bold", fontSize: "14px", textTransform: "uppercase", margin: 0 }}>Languages</h2>
              {isEditable && (
                <button onClick={() => onUpdate?.("languages.add", { name: "New Language", proficiency: "Native" })} style={{ background: "none", border: "none", color: "#000", cursor: "pointer" }}><PlusCircle size={14} /></button>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
              {(languages || []).map((lang, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", background: "#f9fafb", padding: "4px 12px", borderRadius: "100px", border: "1px solid #e5e7eb" }}>
                   {isEditable && (
                    <button onClick={() => onUpdate?.("languages.remove", i)} style={{ color: "#ef4444", background: "none", border: "none", padding: 0 }}><X size={12} /></button>
                  )}
                  {isEditable ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <input defaultValue={lang.name} onBlur={(e) => onUpdate?.(`languages.${i}.name`, e.target.value)} style={{ fontWeight: "bold", background: "transparent", border: "1px dashed #000", width: "80px", outline: "none" }} />
                      <PopSelect 
                        value={lang.proficiency || "Select"} 
                        options={["Beginner", "Intermediate", "Advanced", "Professional", "Fluent", "Native"]} 
                        onSelect={(val: string) => onUpdate?.(`languages.${i}.proficiency`, val)} 
                        variant="light"
                      />
                    </div>
                  ) : (
                    <span><span style={{ fontWeight: "bold" }}>{lang.name}</span>: {lang.proficiency}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

function DetailRow({ label, value, onUpdate, isEditable, type = "text" }: { label: string, value?: string, onUpdate?: (val: string) => void, isEditable: boolean, type?: string }) {
  if (!isEditable && !value) return null
  return (
    <div style={{ fontSize: "11px", display: "flex", gap: "4px", alignItems: "center" }}>
      <span style={{ fontWeight: "bold", minWidth: "40px" }}>{label}:</span>
      {isEditable ? (
        <input 
          type={type}
          defaultValue={value}
          onBlur={(e) => onUpdate?.(e.target.value)}
          style={{ background: "transparent", border: "1px dashed #000", fontSize: "11px", width: "100%", outline: "none", fontFamily: "inherit" }}
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  )
}

function PopSelect({ value, options, onSelect, variant = "dark" }: { value: string; options: string[]; onSelect: (val: string) => void; variant?: "light" | "dark" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [openUp, setOpenUp] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isPlaceholder = !value || value === "Select" || value === "Country" || value === "State"

  const handleOpen = () => {
    if (!isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUp(spaceBelow < 260 && rect.top > 260)
    }
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const style = {
    button: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "2px 6px",
      background: "transparent",
      border: `1px dashed ${variant === "dark" ? "rgba(255,255,255,0.4)" : "#eee"}`,
      fontSize: "11px",
      cursor: "pointer",
      borderRadius: "2px",
      fontWeight: "bold",
      color: variant === "dark" 
        ? (isPlaceholder ? "rgba(255,255,255,0.5)" : "#fff")
        : (isPlaceholder ? "#9ca3af" : "#333")
    }
  }

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button onClick={handleOpen} style={style.button as any}>
        {value || "Select"} <ChevronDown size={10} />
      </button>
      {isOpen && (
        <div style={{ position: "absolute", bottom: openUp ? "100%" : "auto", top: openUp ? "auto" : "100%", left: 0, zIndex: 1000, background: "#fff", border: "1px solid #9333ea", borderRadius: "2px", marginBottom: openUp ? "4px" : "0", marginTop: openUp ? "0" : "2px", minWidth: "120px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", maxHeight: "250px", overflowY: "auto" }}>
          {options.filter(Boolean).map((opt) => (
            <div key={opt} onClick={() => { onSelect(opt); setIsOpen(false) }} style={{ padding: "4px 8px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", borderBottom: "1px solid #f3f4f6", color: "#333" }}>
              {opt} {value === opt && <Check size={10} color="#9333ea" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchableSelect({ value, options, onSelect, width = "120px", variant = "dark" }: { value: string; options: string[]; onSelect: (val: string) => void; width?: string; variant?: "light" | "dark" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [openUp, setOpenUp] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)
  const isPlaceholder = !value || value === "Select" || value === "Country" || value === "State"

  const handleOpen = () => {
    if (!isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      setOpenUp(spaceBelow < 260 && rect.top > 260)
    }
    setIsOpen(!isOpen)
  }

  const filtered = options.filter(opt => opt && opt.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const style = {
    button: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "4px",
      padding: "2px 6px",
      background: "transparent",
      border: `1px dashed ${variant === "dark" ? "rgba(255,255,255,0.4)" : "#eee"}`,
      fontSize: "11px",
      cursor: "pointer",
      width: "100%",
      textAlign: "left",
      fontWeight: "bold",
      color: variant === "dark" 
        ? (isPlaceholder ? "rgba(255,255,255,0.5)" : "#fff")
        : (isPlaceholder ? "#9ca3af" : "#333")
    }
  }

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block", width: width === "100%" ? "100%" : "auto" }}>
      <button onClick={handleOpen} style={style.button as any}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value || "Select"}</span>
        <ChevronDown size={10} />
      </button>
      {isOpen && (
        <div style={{ position: "absolute", bottom: openUp ? "100%" : "auto", top: openUp ? "auto" : "100%", left: 0, zIndex: 1000, background: "#fff", border: "1px solid #9333ea", borderRadius: "2px", marginBottom: openUp ? "4px" : "0", marginTop: openUp ? "0" : "2px", width: "200px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
          <div style={{ padding: "4px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: "4px" }}>
            <Search size={10} color="#666" />
            <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." style={{ border: "none", outline: "none", fontSize: "11px", width: "100%" }} onClick={(e) => e.stopPropagation()} />
          </div>
          <div style={{ maxHeight: "250px", overflowY: "auto" }}>
            {filtered.map((opt) => (
              <div key={opt} onClick={() => { onSelect(opt); setIsOpen(false); setSearch("") }} style={{ padding: "4px 8px", cursor: "pointer", fontSize: "11px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#333" }}>
                {opt} {value === opt && <Check size={10} color="#9333ea" />}
              </div>
            ))}
            {filtered.length === 0 && <div style={{ padding: "8px", fontSize: "11px", color: "#999" }}>No results</div>}
          </div>
        </div>
      )}
    </div>
  )
}
