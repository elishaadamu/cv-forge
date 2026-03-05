// @ts-nocheck
import { Metadata } from "next";

const baseUrl = process.env.NEXTAUTH_URL || 'https://cvmyjob.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Professional ATS-Friendly CV Templates",
  description: "Browse our collection of recruiter-approved, ATS-optimized CV templates. 100% free to use and export.",
  openGraph: {
    title: "Professional ATS-Friendly CV Templates | cvmyjob",
    description: "Choose from our curated collection of high-performance CV templates designed to pass ATS and impress recruiters.",
    images: [
      {
        url: '/midnight.png',
        width: 1200,
        height: 630,
        alt: 'cvmyjob templates - Professional Designs'
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Professional ATS-Friendly CV Templates | cvmyjob",
    description: "Choose from our curated collection of high-performance CV templates.",
    images: ['/midnight.png'],
  },
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
