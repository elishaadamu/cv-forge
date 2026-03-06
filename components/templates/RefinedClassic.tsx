import { Phone, Mail, Linkedin, MapPin, Globe, Github, Facebook, PlusCircle, Trash2, Sparkles, Loader2, Camera, X } from "lucide-react"
import { CVData } from "./ModernProfessional"
import { MarkdownText } from "../MarkdownText"
import { DurationPicker } from "../DurationPicker"
import React from "react"

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
            defaultValue={personalInfo.fullName}
            placeholder="YOUR NAME"
            onBlur={(e) => onUpdate?.("personalInfo.fullName", e.target.value)}
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
            defaultValue={personalInfo.jobTitle}
            placeholder="JOB TITLE"
            onBlur={(e) => onUpdate?.("personalInfo.jobTitle", e.target.value)}
            style={{
              fontSize: "13px",
              color: "#b45309",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 400,
              marginBottom: "16px",
              width: "100%",
              background: "transparent",
              border: "1px dashed #d6d3d1",
              outline: "none",
              fontFamily: "inherit",
              textAlign: "center"
            }}
          />
        ) : (
          <p style={{ fontSize: "13px", color: "#b45309", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 400, marginBottom: "16px" }}>
            {personalInfo.jobTitle}
          </p>
        )}

        {/* Contact */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
            fontSize: "10.5px",
            color: "#57534e",
          }}
        >
          {isEditable ? (
             <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", width: "100%" }}>
                <input defaultValue={personalInfo.email || ""} placeholder="Email" onBlur={(e) => onUpdate?.("personalInfo.email", e.target.value)} style={{ background: "transparent", border: "1px dashed #d6d3d1", fontSize: "10.5px", width: "150px", textAlign: "center" }} />
                <input defaultValue={personalInfo.phone || ""} placeholder="Phone" onBlur={(e) => onUpdate?.("personalInfo.phone", e.target.value)} style={{ background: "transparent", border: "1px dashed #d6d3d1", fontSize: "10.5px", width: "120px", textAlign: "center" }} />
                <input defaultValue={personalInfo.location || ""} placeholder="Location" onBlur={(e) => onUpdate?.("personalInfo.location", e.target.value)} style={{ background: "transparent", border: "1px dashed #d6d3d1", fontSize: "10.5px", width: "150px", textAlign: "center" }} />
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
                <GoldContact icon={<MapPin size={10} />} text={[personalInfo.county, personalInfo.country, personalInfo.location].filter(Boolean).join(", ")} />
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
                defaultValue={personalInfo.summary}
                placeholder="Professional summary..."
                onBlur={(e) => onUpdate?.("personalInfo.summary", e.target.value)}
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
                         <div style={{ display: "flex", gap: "4px" }}>
                            <input defaultValue={exp.role} placeholder="Role" onBlur={(e) => onUpdate?.(`experience.${exp.id}.role`, e.target.value)} style={{ fontWeight: 700, fontSize: "13.5px", background: "transparent", border: "1px dashed #d6d3d1", outline: "none" }} />
                            <span style={{ fontSize: "12px", color: "#b45309" }}>—</span>
                            <input defaultValue={exp.company} placeholder="Company" onBlur={(e) => onUpdate?.(`experience.${exp.id}.company`, e.target.value)} style={{ color: "#b45309", fontSize: "12px", background: "transparent", border: "1px dashed #d6d3d1", outline: "none" }} />
                         </div>
                      ) : (
                        <>
                          <span style={{ fontWeight: 700, fontSize: "13.5px", color: "#1c1917" }}>{exp.role}</span>
                          <span style={{ fontSize: "12px", color: "#b45309", marginLeft: "8px" }}>— {exp.company}</span>
                        </>
                      )}
                    </div>
                    {isEditable ? (
                      <DurationPicker value={exp.duration} onChange={(val) => onUpdate?.(`experience.${exp.id}.duration`, val)} />
                    ) : (
                      <span style={{ fontSize: "11px", fontStyle: "italic", color: "#78716c", whiteSpace: "nowrap" }}>{exp.duration}</span>
                    )}
                  </div>
                  {isEditable ? (
                    <div style={{ marginTop: "4px" }}>
                      {exp.description.map((bullet, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                          <input defaultValue={bullet} onBlur={(e) => {
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
                 <button onClick={() => onUpdate?.("skills.add", "New Category")} style={{ background: "none", border: "none", color: "#b45309", cursor: "pointer" }}><PlusCircle size={14} /></button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {isEditable ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                  {skills.map((skill, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                       <input defaultValue={skill.category} onBlur={(e) => onUpdate?.(`skills.${i}.category`, e.target.value)} style={{ fontWeight: 700, width: "120px", background: "transparent", border: "1px dashed #d6d3d1", color: "#b45309" }} />
                       <input defaultValue={skill.items.join(", ")} onBlur={(e) => onUpdate?.(`skills.${i}.items`, e.target.value.split(",").map(s => s.trim()))} style={{ flex: 1, background: "transparent", border: "1px dashed #d6d3d1" }} />
                       <button onClick={() => onUpdate?.("skills.remove", i)} style={{ color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                    </div>
                  ))}
                </div>
              ) : (
                skills.map((group, i) => (
                  <p key={i} style={{ fontSize: "12px", color: "#44403c", margin: 0 }}>
                    <span style={{ fontWeight: 700, color: "#b45309" }}>{group.category}: </span>
                    {group.items.join("  ·  ")}
                  </p>
                ))
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
                 <button onClick={() => onUpdate?.("education.add", {})} style={{ background: "none", border: "none", color: "#b45309", cursor: "pointer" }}><PlusCircle size={14} /></button>
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
                      <div style={{ display: "flex", gap: "4px" }}>
                        <input defaultValue={edu.degree} placeholder="Degree" onBlur={(e) => onUpdate?.(`education.${edu.id}.degree`, e.target.value)} style={{ fontWeight: 700, fontSize: "12.5px", background: "transparent", border: "1px dashed #d6d3d1" }} />
                        <span style={{ fontSize: "12px", color: "#78716c" }}>—</span>
                        <input defaultValue={edu.school} placeholder="School" onBlur={(e) => onUpdate?.(`education.${edu.id}.school`, e.target.value)} style={{ fontSize: "12px", color: "#78716c", background: "transparent", border: "1px dashed #d6d3d1" }} />
                      </div>
                      <DurationPicker value={edu.duration} onChange={(val) => onUpdate?.(`education.${edu.id}.duration`, val)} />
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: "12.5px", color: "#1c1917" }}>{edu.degree}</span>
                        <span style={{ fontSize: "12px", color: "#78716c", marginLeft: "8px" }}>— {edu.school}</span>
                      </div>
                      {edu.duration && <span style={{ fontSize: "11px", fontStyle: "italic", color: "#78716c" }}>{edu.duration}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {(projects.length > 0 || isEditable) && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
               <ClassicSectionHead label="Notable Projects" />
               {isEditable && (
                 <button onClick={() => onUpdate?.("projects.add", {})} style={{ background: "none", border: "none", color: "#b45309", cursor: "pointer" }}><PlusCircle size={14} /></button>
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
                         <input defaultValue={proj.name} placeholder="Project Name" onBlur={(e) => onUpdate?.(`projects.${proj.id}.name`, e.target.value)} style={{ fontWeight: 700, fontSize: "13px", color: "#1c1917", background: "transparent", border: "1px dashed #d6d3d1" }} />
                         <input defaultValue={proj.link} placeholder="Link" onBlur={(e) => onUpdate?.(`projects.${proj.id}.link`, e.target.value)} style={{ fontSize: "10px", color: "#b45309", background: "transparent", border: "1px dashed #d6d3d1", fontStyle: "italic" }} />
                         <textarea defaultValue={proj.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`projects.${proj.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "12px", color: "#44403c", background: "transparent", border: "1px dashed #d6d3d1", outline: "none", fontFamily: "inherit" }} />
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


        {/* ── VOLUNTEERING ── */}
        {(volunteering && volunteering.length > 0 || isEditable) && (
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <ClassicSectionHead label="Volunteering" />
              {isEditable && (
                 <button onClick={() => onUpdate?.("volunteering.add", {})} style={{ background: "none", border: "none", color: "#d97706", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold", fontSize: "11px" }}>
                  <PlusCircle size={14} /> ADD ROLE
                </button>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {(volunteering || []).map((vol) => (
                <div key={vol.id} style={{ position: "relative" }}>
                   {isEditable && (
                    <button onClick={() => onUpdate?.("volunteering.remove", vol.id)} style={{ position: "absolute", left: "-24px", color: "#ef4444", background: "none", border: "none" }}><Trash2 size={12} /></button>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                    <div>
                      {isEditable ? (
                         <div style={{ display: "flex", gap: "8px" }}>
                            <input defaultValue={vol.role} placeholder="Role" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.role`, e.target.value)} style={{ fontSize: "14px", fontWeight: 700, color: "#1c1917", background: "transparent", border: "1px dashed #d6d3d1" }} />
                            <span style={{ color: "#78716c", fontSize: "13px", fontStyle: "italic" }}>at</span>
                            <input defaultValue={vol.organization} placeholder="Organization" onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.organization`, e.target.value)} style={{ color: "#78716c", fontSize: "13px", background: "transparent", border: "1px dashed #d6d3d1", fontStyle: "italic" }} />
                         </div>
                      ) : (
                        <>
                          <span style={{ fontSize: "14px", fontWeight: 700, color: "#1c1917" }}>{vol.role}</span>
                          <span style={{ color: "#78716c", fontSize: "13px", marginLeft: "10px", fontStyle: "italic" }}>{vol.organization}</span>
                        </>
                      )}
                    </div>
                    {isEditable ? (
                      <DurationPicker value={vol.duration} onChange={(val) => onUpdate?.(`volunteering.${vol.id}.duration`, val)} />
                    ) : (
                      <span style={{ fontSize: "11px", color: "#b45309", fontWeight: 700 }}>{vol.duration}</span>
                    )}
                  </div>
                  {isEditable ? (
                    <textarea defaultValue={vol.description} placeholder="Description..." onBlur={(e) => onUpdate?.(`volunteering.${vol.id}.description`, e.target.value)} style={{ width: "100%", fontSize: "12px", color: "#44403c", background: "transparent", border: "1px dashed #d6d3d1", outline: "none", fontFamily: "inherit", resize: "vertical" }} />
                  ) : (
                    <MarkdownText content={vol.description} style={{ fontSize: "12px", color: "#44403c", lineHeight: 1.6 }} />
                  )}
                  {isEditable && (
                      <button 
                        onClick={() => onRefine?.("volunteering", vol.id)}
                        disabled={refiningId === vol.id || !vol.description}
                        style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "bold", color: "#d97706", background: "rgba(217, 119, 6, 0.05)", border: "1px solid rgba(217, 119, 6, 0.2)", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", marginTop: "4px", opacity: (refiningId === vol.id || !vol.description) ? 0.5 : 1 }}
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

        {/* ── DETAILS & LANGUAGES ── */}
        <div style={{ display: "flex", gap: "56px", marginTop: "20px", borderTop: "1px solid #e7e5e4", paddingTop: "28px" }}>
          {(hasPersonalDetails || isEditable) && (
            <div style={{ flex: 1 }}>
              <ClassicSectionHead label="Details" />
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                 {(personalInfo.dateOfBirth || isEditable) && <DetailRow label="DOB" value={personalInfo.dateOfBirth} onUpdate={(val: string) => onUpdate?.("personalInfo.dateOfBirth", val)} isEditable={isEditable} />}
                 {(personalInfo.placeOfBirth || isEditable) && <DetailRow label="Birth Place" value={personalInfo.placeOfBirth} onUpdate={(val: string) => onUpdate?.("personalInfo.placeOfBirth", val)} isEditable={isEditable} />}
                 {(personalInfo.nationality || isEditable) && <DetailRow label="Nationality" value={personalInfo.nationality} onUpdate={(val: string) => onUpdate?.("personalInfo.nationality", val)} isEditable={isEditable} />}
                 {(personalInfo.gender || isEditable) && <DetailRow label="Gender" value={personalInfo.gender} onUpdate={(val: string) => onUpdate?.("personalInfo.gender", val)} isEditable={isEditable} />}
                 {(personalInfo.passport || isEditable) && <DetailRow label="Passport" value={personalInfo.passport} onUpdate={(val: string) => onUpdate?.("personalInfo.passport", val)} isEditable={isEditable} />}
                 {(personalInfo.workPermit || isEditable) && <DetailRow label="Work Permit" value={personalInfo.workPermit} onUpdate={(val: string) => onUpdate?.("personalInfo.workPermit", val)} isEditable={isEditable} />}
              </div>
            </div>
          )}
          {(languages && languages.length > 0 || isEditable) && (
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <ClassicSectionHead label="Languages" />
                {isEditable && (
                  <button onClick={() => onUpdate?.("languages.add", { name: "New Language", proficiency: "Native" })} style={{ background: "none", border: "none", color: "#d97706", cursor: "pointer" }}><PlusCircle size={14} /></button>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {(languages || []).map((lang, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
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
                      <input defaultValue={lang.proficiency} onBlur={(e) => onUpdate?.(`languages.${i}.proficiency`, e.target.value)} style={{ background: "transparent", border: "1px dashed #d6d3d1", width: "80px", textAlign: "right", fontStyle: "italic", color: "#78716c" }} />
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
    <div style={{ marginBottom: "10px" }}>
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
