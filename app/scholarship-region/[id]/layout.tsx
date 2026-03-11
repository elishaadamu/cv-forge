import { getScholarshipRegionById } from "@/app/scholarship-region/actions"
import { stripHtml } from "@/lib/utils"
import { Metadata } from "next"

interface Props {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { scholarship } = await getScholarshipRegionById(id)
  
  if (!scholarship) return { title: "Scholarship Not Found" }

  const description = scholarship.description || ""
  const cleanDescription = stripHtml(description).substring(0, 160) + (description.length > 160 ? "..." : "")
  const baseUrl = process.env.NEXTAUTH_URL || "https://cvmyjob.online"
  
  // Ensure we have a proper absolute URL for images
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const imagePath = scholarship.image || '/logo.png'
  const normalizedImage = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  
  const imageUrl = scholarship.image?.startsWith('http') 
    ? scholarship.image 
    : `${normalizedBase}${normalizedImage}`

  return {
    title: `${scholarship.title} | Global Scholarships`,
    description: cleanDescription,
    openGraph: {
      title: scholarship.title,
      description: cleanDescription,
      url: `${normalizedBase}/scholarship-region/${id}`,
      siteName: 'cvmyjob',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: scholarship.title
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: scholarship.title,
      description: cleanDescription,
      images: [imageUrl],
    }
  }
}

export default function ScholarshipLayout({ children }: Props) {
  return <>{children}</>
}
