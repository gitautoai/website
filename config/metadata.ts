import { Metadata } from "next";
import { ABSOLUTE_URLS, DESCRIPTION, EMAIL, KEYWORDS, PRODUCT_NAME } from ".";

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
export const defaultMetadata: Metadata = {
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

  // alternates: {
  //   canonical: ".",
  // },

  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#opengraph
  openGraph: {
    title: undefined,
    description: undefined,
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
    title: undefined,
    description: undefined,
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
    index: true, // Allow all bots to index this page.
    follow: true, // Allow all bots to follow links on this page.
    nocache: false, // Allow caching if you want to improve load times for repeat visitors.
    // noarchive:
    noimageindex: false, // false if you want images to be indexed.
    nositelinkssearchbox: false, // false unless you want to prevent the sitelinks search box.
    nosnippet: false, // false unless you want to prevent caching.
    notranslate: false, // false unless you have specific reasons to prevent translation.
    indexifembedded: true, // true to allow indexing even if the page is embedded.
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1, // No limit on video previews.
      "max-image-preview": "large", // Allows large image previews.
      "max-snippet": -1, // No limit on the length of text snippet.
    },
  },

  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#category
  bookmarks: [ABSOLUTE_URLS.GITAUTO.INDEX],

  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#category
  category: "AI Coding Agent",
};
