import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => (
      <h1
        style={{
          fontSize: "48px",
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 style={{ fontSize: "28px", marginTop: "15px", marginBottom: "15px" }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ fontSize: "20px", marginTop: "10px", marginBottom: "10px" }}>
        {children}
      </h3>
    ),
    ol: ({ children }) => (
      <ol type="1" style={{ fontSize: "16px", listStyleType: "decimal" }}>
        {children}
      </ol>
    ),
    ul: ({ children }) => (
      <ol
        style={{ fontSize: "16px", listStyleType: "disc", marginLeft: "24px" }}
      >
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li
        style={{
          fontSize: "16px",
          display: "list-item",
          listStylePosition: "inside",
        }}
      >
        {children}
      </li>
    ),
    table: ({ children }) => (
      <table className="table-auto border-x border-b">{children}</table>
    ),
    th: ({ children }) => (
      <th className="font-bold p-2 border-b border-l border-indigo-700 text-left bg-indigo-700 text-white">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="p-2 border-b border-l text-left">{children}</td>
    ),

    ...components,
  };
}
