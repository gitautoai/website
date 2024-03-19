"use client";
import type { AppProps } from "next/app";

// Local Styles - Tailwind + Chakra
import "@/styles/globals.css";
import theme from "../theme/styles";

// 3rd Party Styles
import { ChakraProvider } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { Comfortaa, Poppins, Lexend } from "next/font/google";

// Analytics
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

import { Suspense } from "react";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <SpeedInsights />
      <AnimatePresence initial={true}>
        <Suspense fallback={<div>Loading...</div>}>
          <div
            className={`${comfortaa.variable} ${poppins.variable} ${lexend.variable} font-helvetica`}
          >
            <Component {...pageProps} />
            <Analytics mode={"production"} />
          </div>
        </Suspense>
      </AnimatePresence>
    </ChakraProvider>
  );
}
