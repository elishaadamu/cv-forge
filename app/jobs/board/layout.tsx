import { getJobPostings } from "@/app/admin/jobs/job-actions"
import { stripHtml } from "@/lib/utils"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  const { jobs } = await getJobPostings({ page: 1, limit: 1 })
  const firstJob = jobs[0]
  
  const baseUrl = process.env.NEXTAUTH_URL || "https://cvmyjob.online"
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  
  const title = "Job Board | cvmyjob — Curated Opportunities"
  const description = firstJob 
    ? stripHtml(firstJob.description).substring(0, 160) + (firstJob.description.length > 160 ? "..." : "")
    : "Hand-picked job opportunities from top companies, vetted by the cvmyjob team."
    
  const imagePath = firstJob?.image || '/logo.png'
  const imageUrl = imagePath.startsWith('http') 
    ? imagePath 
    : `${normalizedBase}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${normalizedBase}/jobs/board`,
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

export default function JobBoardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
