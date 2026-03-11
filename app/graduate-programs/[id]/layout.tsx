import { getScholarshipById } from "@/app/graduate-programs/actions"
import { stripHtml } from "@/lib/utils"
import { Metadata } from "next"

interface Props {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { scholarship } = await getScholarshipById(id)
  
  if (!scholarship) return { title: "Program Not Found" }

  const description = scholarship.description || ""
  const cleanDescription = stripHtml(description).substring(0, 160) + (description.length > 160 ? "..." : "")
  const baseUrl = process.env.NEXTAUTH_URL || "https://cvmyjob.online"
  
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const imagePath = scholarship.image || '/logo.png'
  const imageUrl = imagePath.startsWith('http') 
    ? imagePath 
    : `${normalizedBase}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`

  return {
    title: `${scholarship.title} | Graduate Programs`,
    description: cleanDescription,
    openGraph: {
      title: scholarship.title,
      description: cleanDescription,
      url: `${normalizedBase}/graduate-programs/${id}`,
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

export default function GraduateProgramDetailLayout({ children }: Props) {
  return <>{children}</>
}
