// @ts-check
"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export interface JobPostingInput {
  title: string
  company: string
  state?: string
  country: string
  type: string
  salary?: string
  currency?: string
  description: string
  image?: string
  applyUrl?: string
  contractDuration?: string
}

export async function createJobPosting(data: JobPostingInput) {
  try {
    const job = await prisma.jobPosting.create({
      data: {
        title: data.title,
        company: data.company,
        state: data.state || null,
        country: data.country,
        type: data.type,
        salary: data.salary || null,
        currency: data.currency || null,
        description: data.description,
        image: data.image || null,
        applyUrl: data.applyUrl || null,
        contractDuration: data.contractDuration || null,
      }
    })
    return { success: true, job }
  } catch (error: any) {
    console.error("Failed to create job posting:", error.message)
    return { success: false, error: error.message }
  }
}

export interface JobFilters {
  q?: string
  country?: string
  state?: string
  type?: string
  page?: number
  limit?: number
}

export async function getJobPostings(filters?: JobFilters) {
  try {
    const where: any = {}
    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const skip = (page - 1) * limit

    if (filters) {
      if (filters.q) {
        where.OR = [
          { title: { contains: filters.q, mode: 'insensitive' } },
          { company: { contains: filters.q, mode: 'insensitive' } },
          { description: { contains: filters.q, mode: 'insensitive' } },
        ]
      }
      if (filters.country) {
        where.country = filters.country
      }
      if (filters.state) {
        where.state = filters.state
      }
      if (filters.type) {
        where.type = filters.type
      }
    }

    const [total, jobs] = await Promise.all([
      prisma.jobPosting.count({ where }),
      prisma.jobPosting.findMany({
        where,
        orderBy: { postedAt: "desc" },
        skip,
        take: limit,
      })
    ])

    return { 
      success: true, 
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error: any) {
    console.error("Failed to fetch job postings:", error.message)
    return { success: false, jobs: [], error: error.message, pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } }
  }
}

export async function getJobPostingById(id: string) {
  try {
    const job = await prisma.jobPosting.findUnique({
      where: { id }
    })
    return { success: true, job }
  } catch (error: any) {
    console.error("Failed to fetch job posting:", error.message)
    return { success: false, error: error.message }
  }
}
