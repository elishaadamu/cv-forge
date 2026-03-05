import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advanced Features for Modern Job Seekers",
  description: "Discover the powerful tools that make cvmyjob the best free CV builder. AI analysis, keyword matching, and more.",
  openGraph: {
    title: "Powerful Features for Your Job Search | cvmyjob",
    description: "Explore our AI-powered CV builder, keyword analysis, and professional design tools. All for free.",
    images: [
      {
        url: '/midnight.png',
        width: 1200,
        height: 630,
        alt: 'cvmyjob Features - Advanced Tools'
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Powerful Features for Your Job Search | cvmyjob",
    description: "Explore our AI-powered CV builder, keyword analysis, and professional design tools.",
    images: ['/midnight.png'],
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
