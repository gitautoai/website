import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { PHProvider } from "@/components/PostHog";

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
    description: "Automatic PR's for Bugs",
    url: "https://gitauto.ai",
    siteName: "GitAuto",
    images: [
      {
        url: "https://gitauto.ai/favicon.ico", // Must be an absolute URL
        width: 600,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
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
        <body className={inter.className}>
          <Navbar />
          {children}
        </body>
      </PHProvider>
    </html>
  );
}
