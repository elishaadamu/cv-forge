import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Remote Jobs | cvmyjob — Global Career Opportunities",
  description: "Browse thousands of hand-picked remote jobs across development, design, marketing, and more. Find your next global role on cvmyjob.",
  openGraph: {
    title: "Remote Jobs | cvmyjob — Global Career Opportunities",
    description: "Discover the best remote positions from around the world. Vetted and verified roles.",
    images: [{
      url: '/logo.png',
      width: 1200,
      height: 630,
      alt: 'cvmyjob Remote Jobs'
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "cvmyjob Remote Jobs",
    description: "Your global career starts here. Explore hand-picked remote roles.",
    images: ['/logo.png'],
  }
}

export default function RemoteJobsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
