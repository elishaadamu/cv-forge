import { Metadata } from "next";
import { getCVPreview } from "@/lib/actions";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { id } = await params;
  const res = await getCVPreview(id);
  
  const baseUrl = process.env.NEXTAUTH_URL || 'https://cvmyjob.com';

  if (!res.success || !res.data) {
    return {
      title: "CV Preview | cvmyjob",
      description: "View professional CVs created with cvmyjob.",
    };
  }

  const name = res.data.personalInfo.fullName;
  const jobTitle = res.data.personalInfo.jobTitle;
  const title = `${name}${jobTitle ? ` - ${jobTitle}` : ""} | Professional CV`;
  const description = `Check out the professional CV of ${name}, created with cvmyjob - the 100% free CV builder.`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "cvmyjob",
      images: [
        {
          url: "/og-image.png", // Fallback to site OG image
          width: 1200,
          height: 630,
          alt: `${name}'s Professional CV`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
