// @ts-nocheck
import { Metadata } from "next";

const baseUrl = process.env.NEXTAUTH_URL || 'https://cvmyjob.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Career Insights & Professional Growth",
  description: "Expert advice on resume writing, job search strategies, and career development to help you land your dream job.",
  openGraph: {
    title: "Career Insights & Professional Growth | cvmyjob Blog",
    description: "Expert advice on resume writing, job search strategies, and career development.",
    images: [
      {
        url: '/modern.png',
        width: 1200,
        height: 630,
        alt: 'cvmyjob Blog - Career Insights'
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Career Insights & Professional Growth | cvmyjob Blog",
    description: "Expert advice on resume writing, job search strategies, and career development.",
    images: ['/modern.png'],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
