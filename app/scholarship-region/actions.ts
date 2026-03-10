"use server"

import { prisma } from "@/lib/prisma"

export interface ScholarshipRegionFilters {
  q?: string;
  country?: string;
  type?: string;
  page: number;
  limit: number;
}

export async function getScholarshipRegions(filters: ScholarshipRegionFilters) {
  try {
    const { q, country, type, page, limit } = filters;
    
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

    if (type) {
      where.type = type;
    }

    const skip = (page - 1) * limit;

    const [scholarships, totalItems] = await Promise.all([
      prisma.scholarshipRegion.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          postedAt: 'desc'
        }
      }),
      prisma.scholarshipRegion.count({ where })
    ]);

    const formattedScholarships = scholarships.map((item: any) => ({
      id: item.id,
      title: item.title,
      company: item.provider || 'Scholarship Region',
      description: item.description,
      amount: item.amount || '',
      currency: item.currency || '',
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
    console.error("Failed to query scholarship regions from database:", error);
    return {
      scholarships: [],
      pagination: {
        totalPages: 1,
        totalItems: 0
      }
    };
  }
}

export async function getScholarshipRegionById(id: string) {
  try {
    const item = await prisma.scholarshipRegion.findUnique({
      where: { id }
    });

    if (!item) {
      return { success: false, scholarship: null };
    }

    const formattedScholarship = {
      id: item.id,
      title: item.title,
      company: item.provider || 'Scholarship Region',
      description: item.description,
      amount: item.amount || '',
      currency: item.currency || '',
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
    console.error("Failed to query scholarship region by id:", error);
    return { success: false, scholarship: null };
  }
}
