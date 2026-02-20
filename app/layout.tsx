// Third party imports
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";

// Local imports
import { AccountContextWrapper } from "@/app/components/contexts/Account";
import Footer from "@/app/components/Footer";
import { InstallationSuccessPopup } from "@/app/components/InstallationSuccessPopup";
// import IntercomMessenger from "@/app/components/Intercom";
import Navbar from "@/app/components/navigations/Navbar";
import { PostHogWrapper } from "@/app/components/PostHog";
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
      <PostHogWrapper>
        <body className={`${inter.className} w-full min-h-screen text-base sm:text-sm md:text-xl`}>
          <Suspense>
            <SessionProvider>
              <AccountContextWrapper>
                <InstallationSuccessPopup />
                <Navbar />
                <main className="px-4 sm:px-8 md:px-16">{children}</main>
                <Footer />
                {/* <IntercomMessenger /> */}
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
      </PostHogWrapper>
    </html>
  );
}
