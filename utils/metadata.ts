// Third-party imports
import { Metadata } from "next";
import { OpenGraphType } from "next/dist/lib/metadata/types/opengraph-types";

// Local imports
import { isPrd } from "@/config";
import { KEYWORDS } from "@/config/keywords";
import { defaultMetadata } from "@/config/metadata";

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
 * Validate description length for SEO optimization
 */
function validateDescriptionLength(description: string, url: string): void {
  const length = description.length;
  if (length < 110 || length > 160) {
    throw new Error(
      `Meta description length violation for ${url}: ${length} characters. Must be between 110-160 characters according to Ahrefs.\nDescription: "${description}"`
    );
  }
}

/**
 * Generate specific metadata for each page
 */
export function createPageMetadata(options: PageMetadataOptions): Metadata {
  const { title, description, url, images = [], keywords = [], type = "website" } = options;

  // Validate description length in development
  if (!isPrd) validateDescriptionLength(description, url);

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
