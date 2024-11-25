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
import { isPrd } from "@/config";
import { defaultMetadata } from "@/config/metadata";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = defaultMetadata;

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
