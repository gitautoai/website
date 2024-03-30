"use client";
import type { AppProps } from "next/app";

import "@/styles/globals.css";
import { Suspense } from "react";

import { Comfortaa, Poppins, Lexend } from "next/font/google";

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
    <div
      className={`${comfortaa.variable} ${poppins.variable} ${lexend.variable} font-helvetica`}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Component {...pageProps} />
      </Suspense>
    </div>
  );
}
