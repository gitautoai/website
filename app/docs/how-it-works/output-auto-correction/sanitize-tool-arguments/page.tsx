import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function SanitizeToolArgumentsPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.SANITIZE_TOOL_ARGUMENTS,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Sanitize Tool Arguments</h1>
      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto strips malformed XML fragments from the model&apos;s tool arguments before
            parsing them as JSON. The model sometimes includes XML artifacts from its own internal
            processing in tool call arguments, which causes JSON parsing failures that crash the
            agent loop.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            The model&apos;s tool calls are structured as JSON, but the model occasionally leaks
            fragments of its own XML-based thinking process into the arguments. The most common
            artifact is a trailing <code>&lt;/antml</code> fragment that appears at the end of
            argument strings. When the agent loop tries to parse these arguments as JSON, the parser
            throws an error and the entire iteration fails. This was an intermittent but persistent
            issue that was difficult to debug because the XML fragment appeared random.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Leak XML Into JSON</h2>
          <p className="text-gray-600 mb-4">
            The model&apos;s API uses XML-like structures internally for tool call formatting. When
            generating JSON tool arguments, the model occasionally appends fragments of these
            internal formatting tokens at the end of its output. This is a known edge case in
            autoregressive generation: the model generates tokens one at a time, and near the end of
            a structured output, it can &quot;drift&quot; into a different format it associates with
            output boundaries. The result is a JSON string with a stray XML fragment appended, which
            breaks JSON parsing.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            Before parsing tool arguments, GitAuto runs a sanitization pass that detects and removes
            known XML artifact patterns. The sanitizer strips trailing XML-like fragments that do
            not belong in JSON, then validates that the remaining content is valid JSON. This runs
            on every tool call and adds negligible overhead since it is a simple string operation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TOOL_NAME_CORRECTION}
                className="text-pink-600 hover:underline"
              >
                Tool Name Correction
              </Link>{" "}
              - Fixes hallucinated tool names alongside sanitized arguments
            </li>
            <li>
              <Link
                href={
                  RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TOOL_ARGUMENT_CORRECTION
                }
                className="text-pink-600 hover:underline"
              >
                Tool Argument Correction
              </Link>{" "}
              - Routes arguments to the correct tool after sanitization
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
