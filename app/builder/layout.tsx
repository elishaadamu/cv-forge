import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build Your Professional CV",
  description: "The most intuitive and powerful free CV builder. Create, edit, and export your professional resume in minutes.",
  openGraph: {
    title: "Build Your Professional CV | cvmyjob Builder",
    description: "The most intuitive, 100% free CV builder. Create your professional resume in minutes with our executive tools.",
    images: [
      {
        url: '/executive.png',
        width: 1200,
        height: 630,
        alt: 'cvmyjob Builder - Create Your CV'
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Build Your Professional CV | cvmyjob Builder",
    description: "The most intuitive, 100% free CV builder. Create your professional resume in minutes.",
    images: ['/executive.png'],
  },
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
