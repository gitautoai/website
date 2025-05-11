import Link from "next/link";

interface DocsLinkProps {
  className?: string;
}

export default function DocsLink({ className = "" }: DocsLinkProps) {
  return (
    <Link
      href="/docs/coverage"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 ${className}`}
      aria-label="Documentation"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
      <span className="text-sm font-medium">Docs</span>
    </Link>
  );
}
