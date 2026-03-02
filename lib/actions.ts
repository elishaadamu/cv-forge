"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"
import { signIn } from "@/auth"
import { GoogleGenerativeAI } from "@google/generative-ai"

type ActionResponse = {
  success?: boolean;
  error?: string;
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

    if (existingUser) {
      return { error: "User already exists with this email" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to register user" }
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
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    })
    
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." }
        default:
          return { error: "Something went wrong." }
      }
    }
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
  if (!userId) return { error: "User not authenticated" }

  try {
    const cvs = await prisma.cV.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        updatedAt: true,
        templateId: true,
      }
    })

    return { success: true, cvs }
  } catch (error) {
    console.error("List CVs error:", error)
    return { error: "Failed to fetch CVs" }
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
