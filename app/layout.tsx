import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import { PHProvider } from "@/components/PostHog";
import SessionProvider from "@/components/SessionProvider";
import { AccountContextWrapper } from "@/components/Context/Account";

// 3rd Party Styles
import { Providers } from "./providers";

// Analytics
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { template: "%s | GitAuto", default: "GitAuto" },
  description: "Automatic PR's for Bugs",
  generator: "Next.js",
  applicationName: "GitAuto",
  referrer: "origin-when-cross-origin",
  keywords: [
    "AI",
    "artificial intelligence",
    "coding",
    "pull requests",
    "github",
    "git",
    "gitauto",
    "git auto",
    "git-auto",
    "automatic pull requests",
    "automatic prs",
    "automatic pr",
    "automatic pr for bugs",
    "automatic pr for issues",
    "automatic pr for issues",
  ],
  authors: [
    { name: "Hiroshi Nishio" },
    { name: "Nikita Malinovsky", url: "https://gitauto.ai" },
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://gitauto.ai"),
  openGraph: {
    title: "GitAuto",
    description: "AI engineer that generates GitHub PRs from issues",
    url: "https://gitauto.ai",
    siteName: "GitAuto",
    images: [
      {
        url: "https://gitauto.ai/og-logo.png", // Must be an absolute URL
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    site: "https://gitauto.ai",
    siteId: "@gitauto_ai",
    creator: "Hiroshi Nishio, Nikita Malinovsky",
    description: "AI engineer that generates GitHub PRs from issues",
    title: "GitAuto",
    images: {
      url: "https://gitauto.ai/og-logo.png", // Must be an absolute URL
      width: 1200,
      height: 630,
    },
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PHProvider>
        <body className={`${inter.className} min-h-full`}>
          <SessionProvider>
            <AccountContextWrapper>
              <Providers>
                <Navbar />
                {children}
                <SpeedInsights />
                <Analytics mode={"production"} />
              </Providers>
            </AccountContextWrapper>
          </SessionProvider>
        </body>
      </PHProvider>
    </html>
  );
}
