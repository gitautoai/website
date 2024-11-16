import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => (
      <h1 className="text-3xl md:text-4xl text-center mt-24 mb-8 font-semibold">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl md:text-3xl text-center my-16 font-semibold">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="text-xl md:text-2xl my-8 font-semibold">{children}</h3>,
    p: ({ children }) => <p className="text-base md:text-lg py-1">{children}</p>,
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noreferer noopener"
        className="cursor-pointer text-pink-500 visited:text-pink-700 underline text-base md:text-lg"
      >
        {children}
      </a>
    ),
    ol: ({ children }) => (
      <ol
        type="1"
        className="list-decimal list-outside space-y-1 md:space-y-1 pl-4 text-base md:text-lg"
      >
        {children}
      </ol>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-outside space-y-1 md:space-y-1 pl-4 text-base md:text-lg">
        {children}
      </ul>
    ),
    li: ({ children }) => <li className="list-item">{children}</li>,

    ...components,
  };
}
