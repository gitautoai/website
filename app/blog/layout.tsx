import { Metadata } from "next";
import { headers } from "next/headers";
import InstallButton from "@/components/Button/Install";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const url = new URL(referer || "");
  const pathname = url.pathname;
  console.log({ headersList });

  return {
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      url: pathname,
    },
  };
}

/**
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
 */
export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
