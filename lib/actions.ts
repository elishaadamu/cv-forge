"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { signIn, auth } from "@/auth"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { sendPasswordChangedEmail, sendWelcomeEmail, sendOTPEmail } from "./mail"

type ActionResponse = {
  success?: boolean;
  error?: string;
  message?: string;
}

export async function registerUser(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password || !name) {
    return { error: "Please fill in all fields" }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    }) as any

    if (existingUser && existingUser.emailVerified) {
      return { error: "User already exists with this email" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = new Date(Date.now() + 15 * 60 * 1000) // 15 mins

    if (existingUser) {
      // Update unverified user
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name,
          password: hashedPassword,
          otpCode: otp,
          otpExpiry: expiry
        }
      })
    } else {
      // Create new unverified user
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          otpCode: otp,
          otpExpiry: expiry,
          emailVerified: null
        }
      })
    }

    const emailRes = await sendOTPEmail(email, otp)
    if (!emailRes.success) {
      return { error: "Failed to dispatch verification code. Please check your email/SMTP." }
    }

    return { success: true, message: "A 6-digit verification code has been dispatched to your email." }
  } catch (error) {
    console.error("Registration initiation error:", error)
    return { error: "Failed to initiate registration" }
  }
}

export async function verifySignupOTP(email: string, otp: string) {
  if (!email || !otp) return { error: "Missing required information" }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    }) as any

    if (!user) return { error: "Account not found." }
    if (user.emailVerified) return { error: "Account already verified." }
    if (user.otpCode !== otp) return { error: "Invalid verification code." }
    if (!user.otpExpiry || user.otpExpiry < new Date()) return { error: "Verification code has expired." }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        otpCode: null,
        otpExpiry: null
      }
    })

    // Send Welcome Email AFTER successful verification
    if (user.email && user.name) {
      await sendWelcomeEmail(user.email, user.name)
    }

    return { success: true }
  } catch (error) {
    console.error("Signup verification error:", error)
    return { error: "Failed to verify account" }
  }
}

export async function loginUser(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard"

  if (!email || !password) {
    return { error: "Please fill in all fields" }
  }

  try {
    console.log("LOGIN_ACTION: Calling signIn for", email)
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    })
    // This part should technically not be reached if redirect: true
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      console.log("LOGIN_ACTION: AuthError", error.type)
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." }
        default:
          return { error: "Something went wrong." }
      }
    }
    
    // Rethrow everything else, including redirects
    console.log("LOGIN_ACTION: Rethrowing error/redirect")
    throw error
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function refineTextWithAI(text: string, type: "summary" | "experience" | "comment") {
  if (!text) return { error: "No text provided" }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    
    let prompt = ""
    if (type === "summary") {
      prompt = `Refine the following professional CV summary to be more impactful, professional, and concise. Maintain the original meaning but improve the vocabulary and flow: "${text}"`
    } else if (type === "experience") {
      prompt = `Refine the following job description/experience bullet points for a CV. Make them more action-oriented, professional, and clear. Maintain the original achievements: "${text}"`
    } else if (type === "comment") {
      prompt = `Refine the following blog comment to be elegant, professional, and insightful, aligned with a career-focused website goal. 
      Maintain the original sentiment but improve the vocabulary and tone. 
      Output ONLY the refined text as a single, impactful sentence. 
      Do NOT provide options. 
      Do NOT use any markdown formatting (no bold, no italics, no quotes). 
      Comment: "${text}"`
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    let refinedText = response.text().trim()

    // Clean up potential markdown formatting if Gemini ignored instructions
    if (refinedText.startsWith("```")) {
      refinedText = refinedText.replace(/^```[a-z]*\n/i, "").replace(/\n```$/g, "").trim()
    }
    
    // Remove surrounding quotes if present
    refinedText = refinedText.replace(/^["'](.*)["']$/g, "$1")

    return { success: true, refinedText: refinedText.trim() }
  } catch (error) {
    console.error("AI refinement error:", error)
    return { error: "Failed to refine text with AI" }
  }
}

export async function analyzeCVATS(cvData: any, jobDescription?: string) {
  if (!cvData) return { error: "No CV data provided" }
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    })
    
    const prompt = `
      You are an expert ATS (Applicant Tracking System) Auditor. Analyze the following CV data for ATS compliance, readability, and keyword optimization.
      
      CV Data: ${JSON.stringify(cvData)}
      ${jobDescription ? `Job Description: ${jobDescription}` : ""}

      Analyze the following:
      1. Structural integrity (Contact info, section headers).
      2. Quantifiable results in experience.
      3. Keyword density ${jobDescription ? "relative to the job description" : "(industry standard)"}.
      4. Formatting best practices.

      Return a JSON object with this exact structure:
      {
        "score": number (0-100),
        "checks": [
          { "label": "string", "status": "pass" | "warning" | "fail", "message": "string" }
        ],
        "suggestions": ["string" (max 3)],
        "missingKeywords": ["string" (up to 5)]
      }
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()
    console.log("ATS Raw Response:", text)
    
    // Clean up Markdown if present
    if (text.includes("```json")) {
      text = text.split("```json")[1].split("```")[0].trim()
    } else if (text.includes("```")) {
      text = text.split("```")[1].split("```")[0].trim()
    }

    const analysis = JSON.parse(text)

    const session = await auth()
    if (session?.user?.id) {
      try {
        await prisma.atsAudit.create({
          data: {
            userId: session.user.id,
            jobDescription: jobDescription || null,
            score: analysis.score,
            analysisData: JSON.stringify(analysis)
          }
        })
      } catch (error) {
        console.error("Failed to save ATS audit to db:", error)
      }
    }

    return { success: true, analysis }
  } catch (error) {
    console.error("ATS analysis error:", error)
    return { error: "Failed to audit CV. Please check your data and try again." }
  }
}

export async function saveCV(userId: string, data: any, id?: string) {
  if (!userId) return { error: "User not authenticated" }

  try {
    const baseData = {
      name: data.personalInfo.fullName ? `${data.personalInfo.fullName}'s CV` : "Untitled CV",
      templateId: data.templateId || "modern",
      status: data.status || "DRAFT",
      userId,
    }

    let cv
    if (id && id !== "edit-id") {
      // Update existing CV
      cv = await (prisma.cV as any).update({
        where: { id },
        data: {
          ...baseData,
          personalInfo: {
            upsert: {
              create: {
                fullName: data.personalInfo.fullName,
                email: data.personalInfo.email,
                phoneCode: data.personalInfo.phoneCode,
                phone: data.personalInfo.phone,
                country: data.personalInfo.country,
                county: data.personalInfo.county,
                location: data.personalInfo.location,
                facebook: data.personalInfo.facebook,
                jobTitle: data.personalInfo.jobTitle,
                website: data.personalInfo.website,
                linkedin: data.personalInfo.linkedin,
                github: data.personalInfo.github,
                summary: data.personalInfo.summary,
                profileImage: data.personalInfo.profileImage,
                dateOfBirth: data.personalInfo.dateOfBirth,
                placeOfBirth: data.personalInfo.placeOfBirth,
                nationality: data.personalInfo.nationality,
                gender: data.personalInfo.gender,
                passport: data.personalInfo.passport,
                workPermit: data.personalInfo.workPermit,
              },
              update: {
                fullName: data.personalInfo.fullName,
                email: data.personalInfo.email,
                phoneCode: data.personalInfo.phoneCode,
                phone: data.personalInfo.phone,
                country: data.personalInfo.country,
                county: data.personalInfo.county,
                location: data.personalInfo.location,
                facebook: data.personalInfo.facebook,
                jobTitle: data.personalInfo.jobTitle,
                website: data.personalInfo.website,
                linkedin: data.personalInfo.linkedin,
                github: data.personalInfo.github,
                summary: data.personalInfo.summary,
                profileImage: data.personalInfo.profileImage,
                dateOfBirth: data.personalInfo.dateOfBirth,
                placeOfBirth: data.personalInfo.placeOfBirth,
                nationality: data.personalInfo.nationality,
                gender: data.personalInfo.gender,
                passport: data.personalInfo.passport,
                workPermit: data.personalInfo.workPermit,
              }
            }
          },
          experiences: {
            deleteMany: {},
            create: data.experience.map((exp: any) => ({
              company: exp.company,
              role: exp.role,
              duration: exp.duration,
              location: exp.location,
              description: exp.description,
            }))
          },
          educations: {
            deleteMany: {},
            create: data.education.map((edu: any) => ({
              school: edu.school,
              degree: edu.degree,
              duration: edu.duration,
              location: edu.location,
              fieldOfStudy: edu.fieldOfStudy,
              grade: edu.grade,
            }))
          },
          skills: {
            deleteMany: {},
            create: data.skills.map((skill: any) => ({
              category: skill.category,
              items: skill.items,
            }))
          },
          projects: {
            deleteMany: {},
            create: data.projects.map((proj: any) => ({
              name: proj.name,
              description: proj.description,
              link: proj.link,
            }))
          },
          languages: {
            deleteMany: {},
            create: (data.languages || []).map((lang: any) => ({
              name: lang.name,
              proficiency: lang.proficiency,
            }))
          },
          volunteering: {
            deleteMany: {},
            create: (data.volunteering || []).map((vol: any) => ({
              organization: vol.organization,
              role: vol.role,
              duration: vol.duration,
              location: vol.location,
              description: vol.description,
            }))
          }
        },
      })
    } else {
      // Create new CV
      cv = await (prisma.cV as any).create({
        data: {
          ...baseData,
          personalInfo: {
            create: {
              fullName: data.personalInfo.fullName,
              email: data.personalInfo.email,
              phoneCode: data.personalInfo.phoneCode,
              phone: data.personalInfo.phone,
              country: data.personalInfo.country,
              county: data.personalInfo.county,
              location: data.personalInfo.location,
              facebook: data.personalInfo.facebook,
              jobTitle: data.personalInfo.jobTitle,
              website: data.personalInfo.website,
              linkedin: data.personalInfo.linkedin,
              github: data.personalInfo.github,
              summary: data.personalInfo.summary,
              profileImage: data.personalInfo.profileImage,
              dateOfBirth: data.personalInfo.dateOfBirth,
              placeOfBirth: data.personalInfo.placeOfBirth,
              nationality: data.personalInfo.nationality,
              gender: data.personalInfo.gender,
              passport: data.personalInfo.passport,
              workPermit: data.personalInfo.workPermit,
            }
          },
          experiences: {
            create: data.experience.map((exp: any) => ({
              company: exp.company,
              role: exp.role,
              duration: exp.duration,
              location: exp.location,
              description: exp.description,
            }))
          },
          educations: {
            create: data.education.map((edu: any) => ({
              school: edu.school,
              degree: edu.degree,
              duration: edu.duration,
              location: edu.location,
              fieldOfStudy: edu.fieldOfStudy,
              grade: edu.grade,
            }))
          },
          skills: {
            create: data.skills.map((skill: any) => ({
              category: skill.category,
              items: skill.items,
            }))
          },
          projects: {
            create: data.projects.map((proj: any) => ({
              name: proj.name,
              description: proj.description,
              link: proj.link,
            }))
          },
          languages: {
            create: (data.languages || []).map((lang: any) => ({
              name: lang.name,
              proficiency: lang.proficiency,
            }))
          },
          volunteering: {
            create: (data.volunteering || []).map((vol: any) => ({
              organization: vol.organization,
              role: vol.role,
              duration: vol.duration,
              location: vol.location,
              description: vol.description,
            }))
          }
        },
      })
    }

    return { success: true, id: cv.id }
  } catch (error) {
    console.error("Save CV error:", error)
    return { error: "Failed to save CV" }
  }
}

export async function getCV(id: string, userId: string) {
  try {
    const cv = await (prisma.cV as any).findUnique({
      where: { id, userId },
      include: {
        personalInfo: true,
        experiences: true,
        educations: true,
        skills: true,
        projects: true,
        languages: true,
        volunteering: true,
      }
    }) as any

    if (!cv) return { error: "CV not found" }

    // Transform to UI structure
    const transformedData = {
      personalInfo: {
        fullName: cv.personalInfo?.fullName || "",
        jobTitle: cv.personalInfo?.jobTitle || "",
        email: cv.personalInfo?.email || "",
        phoneCode: cv.personalInfo?.phoneCode || "",
        phone: cv.personalInfo?.phone || "",
        country: cv.personalInfo?.country || "",
        county: cv.personalInfo?.county || "",
        location: cv.personalInfo?.location || "",
        website: cv.personalInfo?.website || "",
        linkedin: cv.personalInfo?.linkedin || "",
        github: cv.personalInfo?.github || "",
        facebook: cv.personalInfo?.facebook || "",
        summary: cv.personalInfo?.summary || "",
        profileImage: cv.personalInfo?.profileImage || "",
        dateOfBirth: cv.personalInfo?.dateOfBirth || "",
        placeOfBirth: cv.personalInfo?.placeOfBirth || "",
        nationality: cv.personalInfo?.nationality || "",
        gender: cv.personalInfo?.gender || "",
        passport: cv.personalInfo?.passport || "",
        workPermit: cv.personalInfo?.workPermit || "",
      },
      experience: cv.experiences.map((e: any) => ({
        id: e.id,
        role: e.role,
        company: e.company,
        duration: e.duration,
        location: e.location || "",
        description: e.description,
      })),
      education: cv.educations.map((e: any) => ({
        id: e.id,
        degree: e.degree,
        school: e.school,
        duration: e.duration,
        location: e.location || "",
        fieldOfStudy: e.fieldOfStudy || "",
        grade: e.grade || "",
      })),
      skills: cv.skills.map((s: any) => ({
        category: s.category,
        items: s.items,
      })),
      projects: cv.projects.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        link: p.link || "",
      })),
      languages: cv.languages.map((l: any) => ({
        name: l.name,
        proficiency: l.proficiency,
      })),
      volunteering: cv.volunteering.map((v: any) => ({
        id: v.id,
        role: v.role,
        organization: v.organization,
        duration: v.duration,
        location: v.location || "",
        description: v.description || "",
      })),
      templateId: cv.templateId,
    }

    return { success: true, data: transformedData }
  } catch (error) {
    console.error("Get CV error:", error)
    return { error: "Failed to fetch CV" }
  }
}

export async function listCVs(userId: string) {
  const start = Date.now()
  console.log("LIST_CVS_ACTION: Starting for user", userId)
  if (!userId) {
    console.error("LIST_CVS_ACTION: No userId provided")
    return { error: "User not authenticated" }
  }

  try {
    const fetchPromise = prisma.cV.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        updatedAt: true,
        templateId: true,
        status: true,
      } as any
    })

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database response timeout")), 12000)
    })

    const cvs = await Promise.race([fetchPromise, timeoutPromise]) as any[]

    const duration = Date.now() - start
    console.log(`LIST_CVS_ACTION: Success in ${duration}ms, found ${cvs.length} CVs`)
    return { success: true, cvs }
  } catch (error) {
    const duration = Date.now() - start
    console.error(`LIST_CVS_ACTION: Error after ${duration}ms -`, error)
    return { error: "Failed to fetch CVs - DB may be unresponsive" }
  }
}

export async function deleteCV(id: string, userId: string) {
  if (!id || !userId) return { error: "Missing required info" }

  try {
    await prisma.cV.delete({
      where: { id, userId }
    })
    return { success: true }
  } catch (error) {
    console.error("Delete CV error:", error)
    return { error: "Failed to delete CV" }
  }
}


export async function getUserProfile(userId: string) {
  if (!userId) return { error: "Unauthenticated" }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, image: true }
    })
    return { success: true, user }
  } catch (error) {
    return { error: "Failed to fetch profile" }
  }
}

export async function updateProfile(userId: string, data: { name?: string, image?: string }) {
  if (!userId) return { error: "Unauthenticated" }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        image: data.image
      }
    })

    return { success: true, user: updatedUser }
  } catch (error) {
    console.error("Update profile error:", error)
    return { error: "Failed to update profile" }
  }
}

export async function sendSecurityOTP(identifier: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: identifier },
          { email: identifier }
        ]
      }
    }) as any

    if (!user || !user.email) return { error: "Identify your identity. User not found." }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = new Date(Date.now() + 10 * 60 * 1000) // 10 mins

    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpiry: expiry
      }
    })

    const emailRes = await sendOTPEmail(user.email, otp)
    if (!emailRes.success) {
      console.error("OTP_EMAIL_FAILED:", emailRes.error)
      return { error: "Failed to dispatch email. Please verify your SMTP settings." }
    }

    return { success: true, message: "A 6-digit verification code has been dispatched to your email." }
  } catch (error) {
    console.error("OTP_ACTION_EXCEPTION:", error)
    return { error: `Failed to dispatch verification code: ${error instanceof Error ? error.message : "System Error"}` }
  }
}

export async function verifyOTPAndUpdatePassword(identifier: string, otp: string, newPassword: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { id: identifier },
          { email: identifier }
        ]
      }
    }) as any

    if (!user) return { error: "User not found." }
    if (user.otpCode !== otp) return { error: "Invalid verification code." }
    if (!user.otpExpiry || user.otpExpiry < new Date()) return { error: "Verification code has expired." }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otpCode: null,
        otpExpiry: null
      }
    })

    if (user.email) {
      await sendPasswordChangedEmail(user.email)
    }

    return { success: true, message: "Security updated. Password changed successfully." }
  } catch (error) {
    console.error("Password update error:", error)
    return { error: "Failed to update security." }
  }
}

export async function addComment(blogSlug: string, userId: string, content: string) {
  if (!blogSlug || !userId || !content) return { error: "Missing required information" }

  try {
    const comment = await prisma.comment.create({
      data: {
        blogSlug,
        userId,
        content,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          }
        }
      }
    })

    return { success: true, comment }
  } catch (error) {
    console.error("Add comment error:", error)
    return { error: "Failed to post comment" }
  }
}

export async function getComments(blogSlug: string) {
  if (!blogSlug) return { error: "Missing blog slug" }

  try {
    const comments = await prisma.comment.findMany({
      where: { blogSlug },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          }
        }
      }
    })

    return { success: true, comments }
  } catch (error) {
    console.error("Get comments error:", error)
    return { error: "Failed to fetch comments" }
  }
}

export async function deleteComment(commentId: string, userId: string) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    })

    if (!comment) return { error: "Comment not found" }
    if (comment.userId !== userId) return { error: "Unauthorized" }

    await prisma.comment.delete({
      where: { id: commentId }
    })

    return { success: true };
  } catch (error) {
    console.error("Delete comment error:", error);
    return { success: false, error: "Failed to delete comment" };
  }
}

export async function generateBlogAIContent(topic: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return { success: false, error: "AI Hub Offline: API Key Missing" };
    }

    // Initialize the 2.5 Pro model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are CV my job AI, an elite career strategist and resume expert. 
      Create a high-quality blog post draft about: "${topic}".
      
      Requirements:
      1. Return the result in valid Markdown format.
      2. Provide a Title, Excerpt, and Full Content.
      3. Focus on actionable career advice, resume optimization, or job search strategies.
      
      Format your response exactly as follows:
      TITLE: [The Title]
      EXCERPT: [The Excerpt]
      CONTENT:
      [The Full Markdown Content]
    `;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    // Improved parsing using regex to handle potential extra whitespace or formatting
    const title = text.match(/TITLE:\s*(.*)/i)?.[1]?.trim() || "Solar Evolution";
    const excerpt = text.match(/EXCERPT:\s*([\s\S]*?)(?=CONTENT:)/i)?.[1]?.trim() || "";
    const content = text.split(/CONTENT:/i)[1]?.trim() || text;

    const session = await auth()
    if (session?.user?.id) {
      try {
        await prisma.aiGeneration.create({
          data: {
            userId: session.user.id,
            topic,
            title,
            excerpt,
            content
          }
        })
      } catch (error) {
        console.error("Failed to save AI generation to db:", error)
      }
    }

    return { 
      success: true, 
      title, 
      excerpt, 
      content 
    };
  } catch (error: any) {
    console.error("AI Blog Generation Error:", error);
    return { success: false, error: error.message || "Neural Grid Timeout" };
  }
}

export async function deleteUser(userId: string) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { error: "Permission denied" }
  }

  try {
    await prisma.user.delete({
      where: { id: userId }
    })
    return { success: true, message: "Member account terminated" }
  } catch (error) {
    return { error: "Nuclear failure: User could not be removed" }
  }
}

export async function updateUserRole(userId: string, role: "USER" | "ADMIN") {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { error: "Permission denied" }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role }
    })
    return { success: true, message: `Access level updated to ${role}` }
  } catch (error) {
    return { error: "Elevation failed: Registry lock" }
  }
}

export async function adminDeleteCV(cvId: string) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { error: "Permission denied" }
  }

  try {
    await prisma.cV.delete({
      where: { id: cvId }
    })
    return { success: true, message: "Asset purged from database" }
  } catch (error) {
    return { error: "Deletion failed: Protection fault" }
  }
}

export async function adminCreateUser(data: { name: string, email: string, phone: string, role: "USER" | "ADMIN" }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return { error: "Permission denied" }
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) return { error: "Identity conflict: User already exists" }

    const hashedPassword = await bcrypt.hash(data.phone, 10)

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        emailVerified: new Date(),
      }
    })
    return { success: true, message: "New member manually registered" }
  } catch (error) {
    return { error: "Creation failed: Database rejection" }
  }
}

export async function getSavedAtsAudits() {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthenticated" }
  try {
    const audits = await prisma.atsAudit.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    })
    return { success: true, audits }
  } catch (error) {
    return { error: "Failed to fetch ATS audits" }
  }
}

export async function getSavedAiGenerations() {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthenticated" }
  try {
    const generations = await prisma.aiGeneration.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    })
    return { success: true, generations }
  } catch (error) {
    return { error: "Failed to fetch AI generations" }
  }
}

export async function getCVPreview(id: string) {
  try {
    const cv = await (prisma.cV as any).findUnique({
      where: { id },
      include: {
        personalInfo: true,
        experiences: true,
        educations: true,
        skills: true,
        projects: true,
      }
    }) as any

    if (!cv) return { error: "CV not found" }

    // Transform to UI structure
    const transformedData = {
      personalInfo: {
        fullName: cv.personalInfo?.fullName || "",
        jobTitle: cv.personalInfo?.jobTitle || "",
        email: cv.personalInfo?.email || "",
        phoneCode: cv.personalInfo?.phoneCode || "",
        phone: cv.personalInfo?.phone || "",
        country: cv.personalInfo?.country || "",
        county: cv.personalInfo?.county || "",
        location: cv.personalInfo?.location || "",
        website: cv.personalInfo?.website || "",
        linkedin: cv.personalInfo?.linkedin || "",
        github: cv.personalInfo?.github || "",
        facebook: cv.personalInfo?.facebook || "",
        summary: cv.personalInfo?.summary || "",
        profileImage: cv.personalInfo?.profileImage || "",
      },
      experience: cv.experiences.map((e: any) => ({
        id: e.id,
        role: e.role,
        company: e.company,
        duration: e.duration,
        description: e.description,
      })),
      education: cv.educations.map((e: any) => ({
        id: e.id,
        degree: e.degree,
        school: e.school,
        duration: e.duration,
      })),
      skills: cv.skills.map((s: any) => ({
        category: s.category,
        items: s.items,
      })),
      projects: cv.projects.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        link: p.link || "",
      })),
      templateId: cv.templateId,
    }

    return { success: true, data: transformedData }
  } catch (error) {
    console.error("Get CV Preview error:", error)
    return { error: "Failed to fetch CV preview" }
  }
}
