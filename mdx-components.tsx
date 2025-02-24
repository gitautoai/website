import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// Helper function to convert text to URL-safe slug
const toSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove invalid chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-"); // Replace multiple - with single -
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => (
      <h1 className="text-3xl md:text-4xl text-center mt-24 mb-8 font-semibold">{children}</h1>
    ),
    h2: ({ children }) => {
      const text = String(children);
      const slug = toSlug(text);
      return (
        <h2
          id={slug}
          className="text-2xl md:text-3xl text-center mt-16 mb-8 md:my-16 md:mb-12 font-semibold"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => <h3 className="text-xl md:text-2xl my-8 font-semibold">{children}</h3>,
    p: ({ children }) => <p className="text-base md:text-lg py-1">{children}</p>,
    a: ({ href, children }) => {
      // Skip empty hrefs
      if (!href) {
        return (
          <a
            href={href}
            className="cursor-pointer text-orange-500 visited:text-orange-700 underline text-base md:text-lg"
          >
            {children}
          </a>
        );
      }

      // Check if the URL is for our domain
      const url = new URL(href, "https://gitauto.ai");
      const isInternalLink =
        url.hostname === "gitauto.ai" || href.startsWith("#") || href.startsWith("/");

      if (isInternalLink) {
        // Use pathname + search + hash for internal links
        const internalHref =
          href.startsWith("#") || href.startsWith("/")
            ? href
            : url.pathname + url.search + url.hash;
        return (
          <Link
            href={internalHref}
            className="cursor-pointer text-pink-500 visited:text-pink-700 underline text-base md:text-lg"
          >
            {children}
          </Link>
        );
      }

      // External link
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferer noopener"
          className="cursor-pointer text-pink-500 visited:text-pink-700 underline text-base md:text-lg"
        >
          {children}
        </a>
      );
    },
    ol: ({ children }) => (
      <ol
        type="1"
        className="list-decimal list-outside space-y-1 md:space-y-1 py-3 pl-5 text-base md:text-lg"
      >
        {children}
      </ol>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-outside space-y-1 md:space-y-1 py-2 pl-4 text-base md:text-lg">
        {children}
      </ul>
    ),
    li: ({ children }) => <li className="list-item">{children}</li>,

    table: ({ children }) => (
      <div style={{ overflowX: "auto", fontSize: "0.875rem" }} className="my-8 text-sm md:text-lg">
        <table
          style={{ width: "100%" }}
          className="table-auto border-collapse border border-gray-200"
        >
          {children}
        </table>
      </div>
    ),

    // table header
    thead: ({ children }) => <thead>{children}</thead>,

    // table body
    tbody: ({ children }) => <tbody>{children}</tbody>,

    // table row
    tr: ({ children }) => <tr>{children}</tr>,

    // table header
    th: ({ children }) => (
      <th
        style={{ padding: "0.25rem 0.5rem", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
        className="md:px-3 md:py-2 text-left font-semibold border border-gray-200 bg-gray-100"
      >
        {children}
      </th>
    ),

    // table data
    td: ({ children }) => (
      <td
        style={{
          padding: "0.25rem 0.5rem",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          lineHeight: "1.25",
        }}
        className="md:px-3 md:py-2 border border-gray-200 leading-normal"
      >
        {children}
      </td>
    ),

    // Add custom styling for diff blocks
    pre: ({ children }) => <pre className="overflow-x-auto my-4">{children}</pre>,
    code: ({ className, children }) => {
      const language = className?.replace("language-", "") || "plaintext";
      const [lang, path] = language.split(":");

      // Special handling for diff blocks
      if (lang.includes("diff")) {
        return (
          <>
            {path && (
              <div
                className="text-sm text-gray-500 mb-2"
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {path}
              </div>
            )}
            <code className={className} style={{ fontFamily: "monospace", fontSize: "1rem" }}>
              {String(children)
                .split("\n")
                .map((line, i) => {
                  if (line.startsWith("+")) {
                    return (
                      <div
                        key={i}
                        style={{
                          backgroundColor: "#e6ffe6",
                          margin: "0 -1rem",
                          padding: "0 1rem",
                          fontFamily: "inherit",
                          fontSize: "inherit",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {line}
                      </div>
                    );
                  }
                  if (line.startsWith("-")) {
                    return (
                      <div
                        key={i}
                        style={{
                          backgroundColor: "#ffe6e6",
                          margin: "0 -1rem",
                          padding: "0 1rem",
                          fontFamily: "inherit",
                          fontSize: "inherit",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {line}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={i}
                      style={{
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {line}
                    </div>
                  );
                })}
            </code>
          </>
        );
      }

      // Default code block styling
      return (
        <>
          {path && (
            <div
              className="text-sm text-gray-500 mb-2"
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {path}
            </div>
          )}
          <code
            className={`language-${lang}`}
            style={{
              fontFamily: "monospace",
              fontSize: "1rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {children}
          </code>
        </>
      );
    },

    ...components,
  };
}
