import { Metadata } from 'next'
import JobClient from "./JobClient"
import { getRemoteJobs } from "@/lib/jobs"

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  const selectedId = params?.selected

  if (selectedId && typeof selectedId === 'string') {
    const data = await getRemoteJobs()
    const job = data.jobs?.find(j => j.id.toString() === selectedId)

    if (job) {
      return {
        title: `${job.title} at ${job.company_name} | cvmyjob`,
        description: `Apply for ${job.title} at ${job.company_name}. Salary: ${job.salary || "Competitive"}. Location: ${job.candidate_required_location}.`,
        openGraph: {
          title: `${job.title} at ${job.company_name}`,
          description: `Salary: ${job.salary || "Competitive"} | Location: ${job.candidate_required_location}`,
          images: [
            {
              url: job.company_logo || '/logo.png',
              width: 1200,
              height: 630,
              alt: `${job.title} at ${job.company_name}`
            }
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${job.title} at ${job.company_name}`,
          description: `New Job Opportunity: ${job.title} at ${job.company_name}.`,
          images: [job.company_logo || '/logo.png'],
        }
      }
    }
  }

  return {
    title: 'Remote Jobs | cvmyjob',
    description: 'Discover your next remote challenge. Hand-picked opportunities from across the globe.',
  }
}

export default function JobsPage() {
  return <JobClient />
}
