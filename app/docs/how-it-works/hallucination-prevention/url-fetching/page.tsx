import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function UrlFetchingPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.URL_FETCHING,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">URL Fetching</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto provides the model with a URL fetching tool that retrieves the full content of a
            webpage and returns it as clean markdown. The model uses this after{" "}
            <Link
              href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.WEB_SEARCH}
              className="text-pink-600 hover:underline"
            >
              web search
            </Link>{" "}
            to read documentation pages, API references, and changelogs that contain the details it
            needs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Web search returns titles and short snippets - enough to confirm that a library exists
            or find the right documentation page, but not enough to read the actual API surface.
            When the model needs to know the exact function signature, configuration format, or
            migration steps from one version to another, it needs to read the full page. Without
            this tool, the model would have to guess the details based on the snippet alone, which
            leads to partially correct but subtly wrong code.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            When the model calls the fetch tool with a URL, GitAuto fetches the page, strips out
            non-content elements (navigation, ads, footers, scripts, styles, SVGs), and finds the
            main content area using semantic HTML selectors like{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{"<main>"}</code>,{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{"<article>"}</code>, or{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">{"div[role='main']"}</code>.
            The cleaned HTML is then converted to markdown so the model can parse headings, code
            blocks, and links naturally.
          </p>
          <p className="text-gray-600 mb-4">
            The tool description tells the model to use it after web search and only for relevant
            URLs, preventing unnecessary fetches that waste time and tokens.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.WEB_SEARCH}
                className="text-pink-600 hover:underline"
              >
                Web Search
              </Link>{" "}
              - searches the web and returns snippets to identify relevant pages
            </li>
            <li>
              <Link
                href={
                  RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION
                    .ANTI_HALLUCINATION_PROMPTS
                }
                className="text-pink-600 hover:underline"
              >
                Anti-Hallucination Prompts
              </Link>{" "}
              - system instructions that tell the model to verify before writing
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.STRICT_TOOL_SCHEMAS}
                className="text-pink-600 hover:underline"
              >
                Strict Tool Schemas
              </Link>{" "}
              - ensures the fetch tool receives well-formed arguments
            </li>
          </ul>
        </section>
      </div>

      <DocsContact />

      <DocsNavigation
        previousLink={prev ? { href: prev.href, title: prev.title } : undefined}
        nextLink={next ? { href: next.href, title: next.title } : undefined}
      />
    </>
  );
}
