import Head from "next/head";
import React, { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex flex-col relative">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="application-name" content="GitAuto" />
        <meta
          name="keywords"
          content="AI, artificial intelligence, coding, pull requests, github, git, gitauto, git auto, git-auto, automatic pull requests, automatic prs, automatic pr, automatic pr for bugs, automatic pr for issues, automatic pr for issues"
        />
        <meta name="author" content="Hiroshi Nishio, Nikita Malinovsky" />
        <meta name="description" content="Automatic PR's for Bugs" />
        <meta
          property="image"
          content="https://www.acalanesalumni.com/landing_page.png"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <meta property="og:title" content="Acalanes Alumni Network" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="Automatic PR's for Bug." />
        <meta
          property="og:image"
          content="https://www.acalanesalumni.com/landing_page.png"
        />
        <meta property="og:url" content="/"></meta>
        <title>GitAuto</title>

        <meta
          name="twitter:card"
          content="https://www.acalanesalumni.com/landing_page.png"
        ></meta>
        <meta property="twitter:title" content="GitAuto" />
        <meta property="twitter:description" content="Automatic PR's for Bug" />
        <meta
          name="twitter:image"
          content="https://www.acalanesalumni.com/landing_page.png"
        ></meta>
      </Head>
      {children}
    </div>
  );
}
