"use server"

import { prisma } from "@/lib/prisma"

export interface ScholarshipFilters {
  q?: string;
  country?: string;
  state?: string;
  type?: string;
  page: number;
  limit: number;
}

export async function getScholarships(filters: ScholarshipFilters) {
  try {
    const { q, country, state, type, page, limit } = filters;
    
    // Construct Prisma query from provided filter object
    const where: any = {};

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { provider: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (country) {
      where.country = country;
    }

    if (state) {
      where.state = state;
    }

    if (type) {
      where.type = type;
    }

    // Determine pagination offset
    const skip = (page - 1) * limit;

    // Run parallel query to ensure pagination is fully counted
    const [scholarships, totalItems] = await Promise.all([
      prisma.scholarship.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          postedAt: 'desc'
        }
      }),
      prisma.scholarship.count({ where })
    ]);

    // Format scholarships for front-end interface expectations 
    const formattedScholarships = scholarships.map((item: any) => ({
      id: item.id,
      title: item.title,
      company: item.provider, // Re-mapped variable for template consistency
      description: item.description,
      amount: item.amount || '',
      currency: item.currency || '$',
      deadline: item.deadline ? item.deadline.toISOString() : null,
      applyUrl: item.applyUrl,
      type: item.type,
      country: item.country,
      state: item.state,
      postedAt: item.postedAt.toISOString(),
      image: item.image,
    }));

    return {
      scholarships: formattedScholarships,
      pagination: {
        totalPages: Math.ceil(totalItems / limit) || 1,
        totalItems
      }
    };
  } catch (error) {
    console.error("Failed to query scholarships from database:", error);
    return {
      scholarships: [],
      pagination: {
        totalPages: 1,
        totalItems: 0
      }
    };
  }
}

export async function getScholarshipById(id: string) {
  try {
    const item = await prisma.scholarship.findUnique({
      where: { id }
    });

    if (!item) {
      return { success: false, scholarship: null };
    }

    const formattedScholarship = {
      id: item.id,
      title: item.title,
      company: item.provider, // Re-mapped variable for template consistency
      description: item.description,
      amount: item.amount || '',
      currency: item.currency || '$',
      deadline: item.deadline ? item.deadline.toISOString() : null,
      applyUrl: item.applyUrl,
      type: item.type,
      country: item.country,
      state: item.state,
      postedAt: item.postedAt.toISOString(),
      image: item.image,
    };

    return { success: true, scholarship: formattedScholarship };
  } catch (error) {
    console.error("Failed to query scholarship by id from database:", error);
    return { success: false, scholarship: null };
  }
}
