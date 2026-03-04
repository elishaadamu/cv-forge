import { NextRequest, NextResponse } from "next/server"
import HTMLtoDOCX from "html-to-docx"

export async function POST(req: NextRequest) {
  try {
    const { cvData } = await req.json()

    if (!cvData) {
      return NextResponse.json({ error: "No CV data provided" }, { status: 400 })
    }

    const htmlString = `
      <div style="font-family: 'Calibri', 'Arial', sans-serif;">
        <h1 style="font-size: 24pt; margin-bottom: 0;">${cvData.personalInfo.fullName}</h1>
        <p style="font-size: 14pt; color: #444; margin-top: 0;">${cvData.personalInfo.jobTitle}</p>
        
        <p style="font-size: 10pt; color: #666; margin-bottom: 20pt;">
          ${cvData.personalInfo.email} | ${cvData.personalInfo.phone} | ${cvData.personalInfo.location}<br/>
          ${cvData.personalInfo.linkedin ? `LinkedIn: ${cvData.personalInfo.linkedin} | ` : ""}
          ${cvData.personalInfo.website ? `Website: ${cvData.personalInfo.website}` : ""}
        </p>

        <h2 style="font-size: 16pt; border-bottom: 1px solid #ccc; padding-bottom: 5pt; text-transform: uppercase;">Professional Summary</h2>
        <p style="font-size: 11pt; line-height: 1.5;">${cvData.personalInfo.summary}</p>

        <h2 style="font-size: 16pt; border-bottom: 1px solid #ccc; padding-bottom: 5pt; text-transform: uppercase; margin-top: 20pt;">Work Experience</h2>
        ${cvData.experience.map((exp: any) => `
          <div style="margin-bottom: 15pt;">
            <table style="width: 100%;">
              <tr>
                <td style="font-weight: bold; font-size: 12pt;">${exp.role}</td>
                <td style="text-align: right; font-size: 10pt; color: #666;">${exp.duration}</td>
              </tr>
            </table>
            <p style="font-style: italic; color: #e76f3c; margin-top: 2pt;">${exp.company}</p>
            <ul style="margin-top: 5pt;">
              ${exp.description.filter(Boolean).map((bullet: string) => `
                <li style="font-size: 11pt; margin-bottom: 3pt;">${bullet}</li>
              `).join("")}
            </ul>
          </div>
        `).join("")}

        <h2 style="font-size: 16pt; border-bottom: 1px solid #ccc; padding-bottom: 5pt; text-transform: uppercase; margin-top: 20pt;">Education</h2>
        ${cvData.education.map((edu: any) => `
          <div style="margin-bottom: 10pt;">
            <table style="width: 100%;">
              <tr>
                <td style="font-weight: bold; font-size: 11pt;">${edu.degree}</td>
                <td style="text-align: right; font-size: 10pt; color: #666;">${edu.duration}</td>
              </tr>
            </table>
            <p style="margin-top: 2pt; color: #666;">${edu.school}</p>
          </div>
        `).join("")}

        <h2 style="font-size: 16pt; border-bottom: 1px solid #ccc; padding-bottom: 5pt; text-transform: uppercase; margin-top: 20pt;">Technical Skills</h2>
        ${cvData.skills.map((skill: any) => `
          <p style="font-size: 11pt; margin-bottom: 5pt;">
            <strong style="color: #444;">${skill.category}:</strong> ${skill.items.join(", ")}
          </p>
        `).join("")}

        ${cvData.projects && cvData.projects.length > 0 ? `
          <h2 style="font-size: 16pt; border-bottom: 1px solid #ccc; padding-bottom: 5pt; text-transform: uppercase; margin-top: 20pt;">Projects</h2>
          ${cvData.projects.map((proj: any) => `
            <div style="margin-bottom: 10pt;">
              <p style="font-weight: bold; font-size: 11pt; margin-bottom: 2pt;">${proj.name} ${proj.link ? `<span style="font-weight: normal; font-size: 9pt; color: #3b82f6;">(${proj.link})</span>` : ""}</p>
              <p style="font-size: 10.5pt; color: #444; margin-top: 0;">${proj.description}</p>
            </div>
          `).join("")}
        ` : ""}
      </div>
    `

    const docxBuffer = await HTMLtoDOCX(htmlString, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    })

    return new NextResponse(docxBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${(cvData.personalInfo?.fullName || 'CV').replace(/\s+/g, "_")}_CV.docx"`,
      },
    })
  } catch (error) {
    console.error("DOCX generation error:", error)
    return NextResponse.json({ error: "Failed to generate Word document" }, { status: 500 })
  }
}
