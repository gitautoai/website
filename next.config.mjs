import { withSentryConfig } from "@sentry/nextjs";
import remarkGfm from "remark-gfm";
import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  // https://nextjs.org/docs/app/api-reference/next-config-js/logging
  logging: false,
  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   },
  //   level: "debug",
  // },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactStrictMode: false,
  experimental: {
    mdxRs: false,
    // turbo: {}, // https://nextjs.org/docs/app/api-reference/next-config-js/turbo
  },
  // Suppress the MDX webpack warning
  webpack: (config, { isServer }) => {
    config.infrastructureLogging = {
      level: "error",
    };
    return config;
  },
};

const withMDX = createMDX({
  extension: /\mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#step-2-configure
export default withSentryConfig(withMDX(nextConfig), {
  org: "gitauto-ai",
  project: "website",

  // Suppresses source map uploading logs during build
  silent: true,
});
