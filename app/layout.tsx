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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "cvmyjob | Build Your Professional CV for Free",
  description: "cvmyjob is the ultimate 100% free CV builder. No watermark, no paywall, no hidden charges. Create your high-quality, ATS-friendly CV in minutes.",
  keywords: ["cv builder", "resume builder", "free cv template", "no watermark resume", "professional resume", "job search tools", "cvmyjob"],
  authors: [{ name: "cvmyjob Team" }],
  verification: {
    google: "ilt-gaTpoL9aFUhs-op9lSSCw_T3bIa2LiLmnvfWuh8",
  },
  openGraph: {
    title: "cvmyjob | 100% Free Professional CV Builder",
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
            </AntdRegistry>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
