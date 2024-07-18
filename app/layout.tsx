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
import IntercomMessenger from "@/components/Intercom";

// 3rd Party Styles
import { Providers } from "./providers";

// Analytics
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { DESCRIPTION, KEYWORDS, PRODUCT_NAME, ABSOLUTE_URLS, isPrd, EMAIL } from "@/config";

const inter = Inter({ subsets: ["latin"] });
const IMAGES = {
  url: ABSOLUTE_URLS.GITAUTO.THUMBNAIL, // Must be an absolute URL
  width: 960,
  height: 540,
} as const;

/**
 * Metadata for the entire application
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#metadata
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
  title: { template: "%s | GitAuto", default: PRODUCT_NAME },
  description: DESCRIPTION,
  generator: "Next.js",
  applicationName: PRODUCT_NAME,
  referrer: "origin-when-cross-origin",
  keywords: KEYWORDS,
  authors: [{ name: "GitAuto Marketing Team", url: ABSOLUTE_URLS.LINKEDIN }],
  creator: "GitAuto Marketing Team",
  publisher: PRODUCT_NAME,
  abstract: DESCRIPTION,
  // alternates: [],
  // appleWebApp: {},
  // appLinks: {},
  // archives: [],
  // assets: [],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(ABSOLUTE_URLS.GITAUTO.INDEX),

  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#opengraph
  openGraph: {
    title: PRODUCT_NAME,
    description: DESCRIPTION,
    url: ABSOLUTE_URLS.GITAUTO.INDEX,
    siteName: PRODUCT_NAME,
    images: [IMAGES],
    locale: "en_US",
    // alternateLocale: "ja_JP",
    // countryName: "United States",
    // determiner: "auto",
    emails: [EMAIL],
    // faxNumbers: ["+1-650-253-0000"],
    // phoneNumbers: ["+1-650-253-0000"],
    // ttl: 60 * 60 * 24 * 7, // 1 week
    // audio: [],
    videos: [
      {
        url: ABSOLUTE_URLS.YOUTUBE.DEMO,
        width: 1280,
        height: 720,
      },
    ],
    type: "website",
  },

  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#twitter
  twitter: {
    card: "summary",
    title: PRODUCT_NAME,
    description: DESCRIPTION,
    site: "@gitautoai", // https://x.com/gitautoai
    // siteId: "1234567890",
    creator: "@hnishio0105", // https://x.com/hnishio0105
    // creatorId: "1234567890",
    images: [IMAGES],
  },

  // We have already verified the site in Google Search Console
  // https://search.google.com/u/3/search-console/ownership?resource_id=sc-domain%3Agitauto.ai
  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#verification
  // verification: {},

  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#robots
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

  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#category
  bookmarks: [ABSOLUTE_URLS.GITAUTO.INDEX],

  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#category
  category: "AI Coding Agent",
};

/**
 * Root Layout for the entire application
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PHProvider>
        <body className={`${inter.className} w-full min-h-screen text-base sm:text-sm md:text-xl`}>
          <Suspense>
            <SessionProvider>
              <AccountContextWrapper>
                <Providers>
                  <Navbar />
                  {children}
                  <Footer />
                  <IntercomMessenger />
                  {isPrd && (
                    <>
                      <SpeedInsights />
                      <Analytics mode={"production"} />
                    </>
                  )}
                </Providers>
              </AccountContextWrapper>
            </SessionProvider>
          </Suspense>
        </body>
      </PHProvider>
    </html>
  );
}
