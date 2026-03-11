// @ts-nocheck
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { LoadingLine } from "@/components/LoadingLine";
import { CookieConsent } from "@/components/CookieConsent";
import { Suspense } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXTAUTH_URL || 'https://cvmyjob.online';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "cvmyjob | Create Your Professional ATS-Friendly CV for Free",
    template: "%s | cvmyjob"
  },
  description: "cvmyjob is the ultimate 100% free CV builder. No watermark, no paywall, no hidden charges. Create your high-quality, ATS-friendly CV in minutes.",
  keywords: ["cv builder", "resume builder", "free cv template", "no watermark resume", "professional resume", "job search tools", "cvmyjob", "ATS resume"],
  authors: [{ name: "cvmyjob Team" }],
  creator: "cvmyjob",
  publisher: "cvmyjob",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: "ilt-gaTpoL9aFUhs-op9lSSCw_T3bIa2LiLmnvfWuh8",
  },
  openGraph: {
    title: "cvmyjob | Create Your Professional ATS-Friendly CV for Free",
    description: "Start your career on the right foot with a premium CV, completely free of charge. No watermarks, no hidden fees.",
    siteName: 'cvmyjob',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'cvmyjob - Professional CV Builder'
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "cvmyjob | Create Your Professional ATS-Friendly CV for Free",
    description: "Create your high-quality, ATS-friendly CV in minutes. 100% free, no watermarks.",
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { Chatbot } from "@/components/Chatbot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-brand-action selection:text-white`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P84Z1X9HXS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P84Z1X9HXS');
          `}
        </Script>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AntdRegistry>
              <Suspense fallback={null}>
                <LoadingLine />
              </Suspense>
              <CookieConsent />
              {children}
              <Chatbot />
              <Analytics />
            </AntdRegistry>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
