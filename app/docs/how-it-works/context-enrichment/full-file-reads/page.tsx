import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function FullFileReadsPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.FULL_FILE_READS,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Full File Reads</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto forces the model to read entire files rather than partial snippets. For files
            under 2,000 lines, any attempt by the model to read only a portion is overridden,
            ensuring it always sees the complete file content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Partial file reads cause a cascade of problems: missing import statements, unknown type
            definitions, invisible class fields, and incomplete understanding of function signatures
            that appeared earlier or later in the file. The result is diffs that look reasonable in
            isolation but break when applied. The model adds an import that already exists, misses a
            required field in a data structure, or duplicates a function that was defined outside
            the truncated window. Full file reads eliminate this entire class of errors by forcing
            complete context regardless of what the model requests.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Read Partial Files</h2>
          <p className="text-gray-600 mb-4">
            When given a tool with offset and limit parameters, models default to reading just 20-50
            lines around the area they think is relevant, rather than loading the full file. This is
            a learned behavior from training data where partial file reads are common - and it is
            reinforced by instruction-following training that teaches models to be
            &quot;efficient.&quot; But for code generation, partial context leads to duplicate
            imports, missing fields, and broken diffs. The model ends up optimizing for smaller
            requests instead of maximizing code correctness.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            When the model requests to read a file, GitAuto intercepts the request. If the file is
            under 2,000 lines, GitAuto overrides any partial-read request and returns the entire
            file content. This happens transparently - the model receives the full file as if it had
            requested it that way.
          </p>
          <p className="text-gray-600 mb-4">
            The 2,000-line threshold exists because extremely large files would consume too much of
            the context window. For files above this threshold, truncation parameters are respected
            to avoid token budget exhaustion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.LINE_NUMBERS}
                className="text-pink-600 hover:underline"
              >
                Line Numbers
              </Link>{" "}
              - numbers every line in the full file for precise references
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.TOKEN_TRIMMING}
                className="text-pink-600 hover:underline"
              >
                Token Trimming
              </Link>{" "}
              - manages context window size when multiple full files are loaded
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
