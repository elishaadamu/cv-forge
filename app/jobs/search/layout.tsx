import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Global Job Search | cvmyjob Aggregator",
  description: "Search millions of job openings from LinkedIn, Glassdoor, Indeed, and more—all in one place with the cvmyjob Global Aggregator.",
  openGraph: {
    title: "Global Job Search | cvmyjob Aggregator",
    description: "Search all the major job boards at once. Find your next role with our powerful global search.",
    images: [{
      url: '/logo.png',
      width: 1200,
      height: 630,
      alt: 'cvmyjob Global Job Search'
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "cvmyjob Global Job Search",
    description: "The most powerful way to search millions of jobs globally.",
    images: ['/logo.png'],
  }
}

export default function SearchJobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
