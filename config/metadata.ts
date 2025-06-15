import { Metadata } from "next";
import { DESCRIPTION, EMAIL, LEGAL_NAME, PRODUCT_NAME, TEAM_NAME, TITLE } from "@/config";
import { KEYWORDS } from "@/config/keywords";
import { THUMBNAIL } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const IMAGES = { url: THUMBNAIL.HOME, width: 1200, height: 630, alt: TITLE } as const;

/**
 * Metadata for the entire application
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#metadata
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const defaultMetadata: Metadata = {
  title: {
    template: `%s | ${PRODUCT_NAME} - Automated Unit Testing`,
    default: `${PRODUCT_NAME} - Automated Unit Testing for GitHub | 0% to 90% Test Coverage`,
  },
  description: DESCRIPTION,
  generator: "Next.js",
  applicationName: PRODUCT_NAME,
  referrer: "origin-when-cross-origin",
  keywords: KEYWORDS,
  authors: [{ name: TEAM_NAME, url: ABSOLUTE_URLS.GITAUTO.INDEX }],
  creator: TEAM_NAME,
  publisher: LEGAL_NAME,
  abstract: DESCRIPTION,
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL(ABSOLUTE_URLS.GITAUTO.INDEX),

  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#opengraph
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: ABSOLUTE_URLS.GITAUTO.INDEX,
    siteName: PRODUCT_NAME,
    images: [IMAGES],
    locale: "en_US",
    emails: [EMAIL],
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
    title: TITLE,
    description: DESCRIPTION,
    site: "@gitautoai",
    creator: "@hnishio0105",
    images: [IMAGES],
  },

  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noimageindex: false,
    nositelinkssearchbox: false,
    nosnippet: false,
    notranslate: false,
    indexifembedded: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // https://nextjs.org/docs/app/api-reference/functions/generate-metadata#category
  bookmarks: [ABSOLUTE_URLS.GITAUTO.INDEX],
  category: "Developer Tools",
};
