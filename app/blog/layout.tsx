import type { Metadata } from "next";
import { defaultMetadata } from "@/config/metadata";

export const metadata: Metadata = defaultMetadata;

/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
 */
export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="px-5 md:px-52 pt-36 pb-52">{children}</div>;
}
