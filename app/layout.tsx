import type { Metadata } from "next";
import { Suspense } from "react";

// Styles
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/styles.css";

// Components
import Navbar from "@/components/Navbar";
import { PHProvider } from "@/components/PostHog";
import SessionProvider from "@/components/SessionProvider";
import { AccountContextWrapper } from "@/components/Context/Account";
import Footer from "@/components/Footer";

// 3rd Party Styles
import { Providers } from "./providers";

// Analytics
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { DESCRIPTION, KEYWORDS, PRODUCT_NAME, RELATIVE_URLS, ABSOLUTE_URLS } from "@/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { template: "%s | GitAuto", default: PRODUCT_NAME },
  description: DESCRIPTION,
  generator: "Next.js",
  applicationName: PRODUCT_NAME,
  referrer: "origin-when-cross-origin",
  keywords: KEYWORDS,
  authors: [{ name: "GitAuto Marketing Team", url: RELATIVE_URLS.INDEX }],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(ABSOLUTE_URLS.GITAUTO.INDEX),
  openGraph: {
    title: PRODUCT_NAME,
    description: DESCRIPTION,
    url: ABSOLUTE_URLS.GITAUTO.INDEX,
    siteName: PRODUCT_NAME,
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
    site: "@gitautoai",
    creator: "@hnishio0105",
    description: DESCRIPTION,
    title: PRODUCT_NAME,
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
        <body className={`${inter.className} w-full min-h-screen md:text-xl`}>
          <Suspense>
            <SessionProvider>
              <AccountContextWrapper>
                <Providers>
                  <Navbar />
                  {children}
                  <Footer />
                  <SpeedInsights />
                  <Analytics mode={"production"} />
                </Providers>
              </AccountContextWrapper>
            </SessionProvider>
          </Suspense>
        </body>
      </PHProvider>
    </html>
  );
}
