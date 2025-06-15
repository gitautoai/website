// Third party imports
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";

// Local imports
import { AccountContextWrapper } from "@/app/components/Context/Account";
import Footer from "@/app/components/Footer";
import IntercomMessenger from "@/app/components/Intercom";
import Navbar from "@/app/components/Navbar";
import { PHProvider } from "@/app/components/PostHog";
import SessionProvider from "@/app/components/SessionProvider";
import { isPrd } from "@/config";
import { defaultMetadata } from "@/config/metadata";
import { organizationJsonLd } from "@/app/jsonld";
import "@/styles/globals.css";
import "@/styles/styles.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = defaultMetadata;

/**
 * Root Layout for the entire application
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      {isPrd && (
        <Script id="apollo-script">
          {`function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,o.onload=function(){window.trackingFunctions.onLoad({appId:"6631c123b9befb01c76f5219"})},document.head.appendChild(o)}initApollo();`}
        </Script>
      )}
      <PHProvider>
        <body className={`${inter.className} w-full min-h-screen text-base sm:text-sm md:text-xl`}>
          <Suspense>
            <SessionProvider>
              <AccountContextWrapper>
                <Navbar />
                <main className="px-4 sm:px-8 md:px-16">{children}</main>
                <Footer />
                <IntercomMessenger />
                {isPrd && (
                  <>
                    <SpeedInsights />
                    <Analytics mode={"production"} />
                  </>
                )}
              </AccountContextWrapper>
            </SessionProvider>
          </Suspense>
        </body>
      </PHProvider>
    </html>
  );
}
