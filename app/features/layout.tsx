// @ts-nocheck
import { Metadata } from "next";

const baseUrl = process.env.NEXTAUTH_URL || 'https://cvmyjob.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Advanced CV Builder Features for Modern Job Seekers | cvmyjob",
  description: "Discover the powerful tools that make cvmyjob the best free CV builder. AI analysis, keyword matching, and more.",
  openGraph: {
    title: "Advanced CV Builder Features for Modern Job Seekers | cvmyjob",
    description: "Explore our AI-powered CV builder, keyword analysis, and professional design tools. All for free.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'cvmyjob Features - Advanced Tools'
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Advanced CV Builder Features for Modern Job Seekers | cvmyjob",
    description: "Explore our AI-powered CV builder, keyword analysis, and professional design tools.",
    images: ['/og-image.png'],
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
