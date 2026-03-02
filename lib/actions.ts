"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { signIn } from "@/auth"
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
    })

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
    })

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

export async function refineTextWithAI(text: string, type: "summary" | "experience") {
  if (!text) return { error: "No text provided" }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const prompt = type === "summary" 
      ? `Refine the following professional CV summary to be more impactful, professional, and concise. Maintain the original meaning but improve the vocabulary and flow: "${text}"`
      : `Refine the following job description/experience bullet points for a CV. Make them more action-oriented, professional, and clear. Maintain the original achievements: "${text}"`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const refinedText = response.text()

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
      model: "gemini-1.5-flash",
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
      userId,
    }

    let cv
    if (id && id !== "edit-id") {
      // Update existing CV
      cv = await prisma.cV.update({
        where: { id },
        data: {
          ...baseData,
          personalInfo: {
            upsert: {
              create: {
                fullName: data.personalInfo.fullName,
                email: data.personalInfo.email,
                phone: data.personalInfo.phone,
                location: data.personalInfo.location,
                jobTitle: data.personalInfo.jobTitle,
                website: data.personalInfo.website,
                linkedin: data.personalInfo.linkedin,
                github: data.personalInfo.github,
                summary: data.personalInfo.summary,
                profileImage: data.personalInfo.profileImage,
              },
              update: {
                fullName: data.personalInfo.fullName,
                email: data.personalInfo.email,
                phone: data.personalInfo.phone,
                location: data.personalInfo.location,
                jobTitle: data.personalInfo.jobTitle,
                website: data.personalInfo.website,
                linkedin: data.personalInfo.linkedin,
                github: data.personalInfo.github,
                summary: data.personalInfo.summary,
                profileImage: data.personalInfo.profileImage,
              }
            }
          },
          experiences: {
            deleteMany: {},
            create: data.experience.map((exp: any) => ({
              company: exp.company,
              role: exp.role,
              duration: exp.duration,
              description: exp.description,
            }))
          },
          educations: {
            deleteMany: {},
            create: data.education.map((edu: any) => ({
              school: edu.school,
              degree: edu.degree,
              duration: edu.duration,
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
          }
        },
      })
    } else {
      // Create new CV
      cv = await prisma.cV.create({
        data: {
          ...baseData,
          personalInfo: {
            create: {
              fullName: data.personalInfo.fullName,
              email: data.personalInfo.email,
              phone: data.personalInfo.phone,
              location: data.personalInfo.location,
              jobTitle: data.personalInfo.jobTitle,
              website: data.personalInfo.website,
              linkedin: data.personalInfo.linkedin,
              github: data.personalInfo.github,
              summary: data.personalInfo.summary,
              profileImage: data.personalInfo.profileImage,
            }
          },
          experiences: {
            create: data.experience.map((exp: any) => ({
              company: exp.company,
              role: exp.role,
              duration: exp.duration,
              description: exp.description,
            }))
          },
          educations: {
            create: data.education.map((edu: any) => ({
              school: edu.school,
              degree: edu.degree,
              duration: edu.duration,
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
    const cv = await prisma.cV.findUnique({
      where: { id, userId },
      include: {
        personalInfo: true,
        experiences: true,
        educations: true,
        skills: true,
        projects: true,
      }
    })

    if (!cv) return { error: "CV not found" }

    // Transform to UI structure
    const transformedData = {
      personalInfo: {
        fullName: cv.personalInfo?.fullName || "",
        jobTitle: cv.personalInfo?.jobTitle || "",
        email: cv.personalInfo?.email || "",
        phone: cv.personalInfo?.phone || "",
        location: cv.personalInfo?.location || "",
        website: cv.personalInfo?.website || "",
        linkedin: cv.personalInfo?.linkedin || "",
        github: cv.personalInfo?.github || "",
        summary: cv.personalInfo?.summary || "",
        profileImage: cv.personalInfo?.profileImage || "",
      },
      experience: cv.experiences.map(e => ({
        id: e.id,
        role: e.role,
        company: e.company,
        duration: e.duration,
        description: e.description,
      })),
      education: cv.educations.map(e => ({
        id: e.id,
        degree: e.degree,
        school: e.school,
        duration: e.duration,
      })),
      skills: cv.skills.map(s => ({
        category: s.category,
        items: s.items,
      })),
      projects: cv.projects.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        link: p.link || "",
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
      }
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
    })

    if (!user || !user.email) return { error: "Identify your forge. User not found." }

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
    })

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

    return { success: true, message: "Forge security updated. Password changed successfully." }
  } catch (error) {
    console.error("Password update error:", error)
    return { error: "Failed to update security." }
  }
}
