import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { AntdRegistry } from '@ant-design/nextjs-registry';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CVForge | Build Your Professional CV for Free",
  description: "CVForge is the ultimate 100% free CV builder. No watermark, no paywall, no hidden charges. Create your high-quality, ATS-friendly CV in minutes.",
  keywords: ["cv builder", "resume builder", "free cv template", "no watermark resume", "professional resume", "job search tools"],
  authors: [{ name: "CVForge Team" }],
  openGraph: {
    title: "CVForge | 100% Free Professional CV Builder",
    description: "Start your career on the right foot with a premium CV, completely free of charge.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-brand-action selection:text-white`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AntdRegistry>
              {children}
            </AntdRegistry>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
