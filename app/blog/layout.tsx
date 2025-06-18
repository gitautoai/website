import InstallButton from "@/app/components/Button/Install";
import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { blogJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Blog - Automated Testing Insights & Tutorials`,
  description: `Read the latest insights on automated testing, unit test generation, and software quality. Learn best practices for test coverage, CI/CD, and development productivity.`,
  url: ABSOLUTE_URLS.GITAUTO.BLOG,
  images: [{ url: THUMBNAILS.BLOG.INDEX, alt: `${PRODUCT_NAME} Blog` }],
  keywords: [
    "automated testing blog",
    "unit test generation",
    "test coverage insights",
    "software quality",
    "CI/CD best practices",
    "development productivity",
    "testing tutorials",
  ],
});

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <JsonLdScript data={blogJsonLd} id="jsonld-blog" />
      <div className="px-5 md:px-52 pt-28 md:pt-36 pb-20 md:pb-36">
        {children}
        <div className="flex flex-col items-center justify-center gap-4 text-center mt-20 md:mt-36 border-t pt-20 md:pt-36">
          <h2 className="text-2xl font-bold">Want to ship 500x faster?</h2>
          <p className="max-w-2xl">
            GitAuto is your AI coding agent that turns backlog tickets into pull requests in just 3
            minutes for $10 - making it 500x faster and 99.5% cheaper.
          </p>
          <div className="w-fit">
            <InstallButton text="Install GitAuto" />
          </div>
          <p>It requires GitHub sign-in.</p>
        </div>
      </div>
    </>
  );
}
