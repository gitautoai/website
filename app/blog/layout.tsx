/**
 * Root Layout for the entire application
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
 */
export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="px-5 md:px-52 pt-36 pb-52">{children}</div>;
}
