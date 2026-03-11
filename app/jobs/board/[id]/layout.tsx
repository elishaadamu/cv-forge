import { getJobPostingById } from "@/app/admin/jobs/job-actions"
import { stripHtml } from "@/lib/utils"
import { Metadata } from "next"

interface Props {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { job } = await getJobPostingById(id)
  
  if (!job) return { title: "Job Not Found" }

  const description = job.description || ""
  const cleanDescription = stripHtml(description).substring(0, 160) + (description.length > 160 ? "..." : "")
  const baseUrl = process.env.NEXTAUTH_URL || "https://cvmyjob.online"
  
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const imagePath = job.image || '/logo.png'
  const imageUrl = imagePath.startsWith('http') 
    ? imagePath 
    : `${normalizedBase}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`

  return {
    title: `${job.title} at ${job.company} | cvmyjob`,
    description: cleanDescription,
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: cleanDescription,
      url: `${normalizedBase}/jobs/board/${id}`,
      siteName: 'cvmyjob',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${job.title} at ${job.company}`
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${job.title} at ${job.company}`,
      description: cleanDescription,
      images: [imageUrl],
    }
  }
}

export default function JobDetailLayout({ children }: Props) {
  return <>{children}</>
}
