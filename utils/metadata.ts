// Third-party imports
import { Metadata } from "next";
import { OpenGraphType } from "next/dist/lib/metadata/types/opengraph-types";

// Local imports
import { defaultMetadata } from "@/config/metadata";
import { KEYWORDS } from "@/config/keywords";

export interface PageMetadataOptions {
  title: string;
  description: string;
  url: string;
  images?: Array<{
    url: string;
    alt: string;
  }>;
  keywords?: string[];
  type?: OpenGraphType;
}

/**
 * Generate specific metadata for each page
 */
export function createPageMetadata(options: PageMetadataOptions): Metadata {
  const { title, description, url, images = [], keywords = [], type = "website" } = options;

  // Add standard dimensions to images
  const processedImages = images.map((img) => ({
    ...img,
    width: 1200,
    height: 630,
  }));

  return {
    // Default metadata
    ...defaultMetadata,

    // Override with page-specific metadata
    title,
    description,
    keywords: [...KEYWORDS, ...keywords],
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      url,
      images: processedImages,
      type,
    },

    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      images: processedImages,
    },

    alternates: { canonical: url },
  };
}
