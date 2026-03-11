import { getScholarships } from "./actions"
import { stripHtml } from "@/lib/utils"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const { scholarships } = await getScholarships({ page: 1, limit: 1 })
  const firstItem = scholarships[0]
  
  const baseUrl = process.env.NEXTAUTH_URL || "https://cvmyjob.online"
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  
  const title = "Graduate Programs | CVMYJOB"
  const description = firstItem 
    ? stripHtml(firstItem.description).substring(0, 160) + (firstItem.description.length > 160 ? "..." : "")
    : "Unlock Your Future: Browse the highest-ranking and most affordable graduate programs worldwide."
    
  const imagePath = firstItem?.image || '/logo.png'
  const imageUrl = imagePath.startsWith('http') 
    ? imagePath 
    : `${normalizedBase}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${normalizedBase}/graduate-programs`,
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

export default function GraduateProgramsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
