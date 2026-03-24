import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function WebSearchPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.WEB_SEARCH,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Web Search</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto provides the model with a web search tool that returns titles, snippets, and
            URLs for a given query. The model uses this to verify current information about
            libraries, GitHub Actions versions, API usage, and tool configurations before generating
            code.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            The model&apos;s training data has a cutoff date. It confidently writes code using
            outdated package versions, deprecated API methods, and non-existent GitHub Action
            versions. For example, it might use{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">actions/checkout@v3</code>{" "}
            when v4 is current, or reference a library function that was renamed two versions ago.
            Web search lets the model verify before writing, reducing hallucinations about the
            current state of the ecosystem.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Hallucinate APIs and Libraries</h2>
          <p className="text-gray-600 mb-4">
            Model training data has a cutoff date. After that date, APIs change, packages get
            deprecated, and new versions introduce breaking changes. But the model doesn&apos;t know
            its knowledge is stale - it writes code using the API it remembers with full confidence.
            A model trained before a library&apos;s v3 release will confidently generate v2 code
            that doesn&apos;t compile. Training data is a static snapshot from the cutoff date, so
            the model has no way to know that an API changed after collection. Benchmarks use stable
            APIs, making this weakness invisible during evaluation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            The search tool is defined with a strict JSON schema that requires a search query
            string. When the model calls it, GitAuto executes the search and returns the top results
            including titles, snippets, and URLs. The results are snippets only - enough to verify a
            version number or check if an API exists, but not enough to read full documentation. For
            that, the model can follow up with the{" "}
            <Link
              href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.URL_FETCHING}
              className="text-pink-600 hover:underline"
            >
              URL fetching tool
            </Link>{" "}
            to read the full page content.
          </p>
          <p className="text-gray-600 mb-4">
            The tool description explicitly tells the model: &quot;NEVER search for
            repository-specific content - assume the repository is private.&quot; This prevents
            wasted searches for code that won&apos;t appear in public results.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.URL_FETCHING}
                className="text-pink-600 hover:underline"
              >
                URL Fetching
              </Link>{" "}
              - reads the full page content from a search result URL
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
              - ensures the search tool receives well-formed arguments
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
