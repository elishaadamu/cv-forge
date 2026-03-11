import { getScholarshipRegions } from "./actions"
import { stripHtml } from "@/lib/utils"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const { scholarships } = await getScholarshipRegions({ page: 1, limit: 1 })
  const firstScholarship = scholarships[0]
  
  const baseUrl = process.env.NEXTAUTH_URL || "https://cvmyjob.online"
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  
  const title = "Global Scholarships | CVMYJOB"
  const description = firstScholarship 
    ? stripHtml(firstScholarship.description).substring(0, 160) + (firstScholarship.description.length > 160 ? "..." : "")
    : "Browse the latest global scholarship opportunities."
    
  const imagePath = firstScholarship?.image || '/logo.png'
  const imageUrl = imagePath.startsWith('http') 
    ? imagePath 
    : `${normalizedBase}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${normalizedBase}/scholarship-region`,
      siteName: 'cvmyjob',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    }
  }
}

export default function ScholarshipRegionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
