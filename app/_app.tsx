import "@/styles/globals.css";
import type { AppProps } from "next/app";

import MainLayout from "../components/Layouts/main";
import { ChakraProvider } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import theme from "../theme/styles";
import { Comfortaa, Poppins, Lexend } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Analytics } from "@vercel/analytics/react";

import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
      <MainLayout>
        <AnimatePresence initial={true}>
          <div
            className={`${comfortaa.variable} ${poppins.variable} ${lexend.variable} font-helvetica`}
          >
            <Component {...pageProps} />
            <Analytics mode={"production"} />
          </div>
        </AnimatePresence>
      </MainLayout>
    </ChakraProvider>
  );
}
