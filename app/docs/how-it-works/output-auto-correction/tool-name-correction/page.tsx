import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function ToolNameCorrectionPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TOOL_NAME_CORRECTION,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Tool Name Correction</h1>
      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto auto-corrects when the model calls a non-existent tool name by mapping common
            mistakes to their correct counterparts. The model hallucinates tool names that sound
            plausible but do not exist in the agent&apos;s tool set, which would otherwise crash the
            agent loop.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            The model has a tendency to invent tool names based on what it thinks should exist
            rather than what actually exists. For example, it might call{" "}
            <code>create_remote_file</code> when the real tool is <code>write_and_commit_file</code>
            , or call <code>edit_file</code> when the real tool is <code>apply_diff_to_file</code>.
            Without correction, these calls fail with a &quot;tool not found&quot; error, wasting an
            iteration and sometimes causing the agent to give up entirely.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Invent Tool Names</h2>
          <p className="text-gray-600 mb-4">
            Models predict the most likely next token. If a tool is conceptually &quot;apply a diff
            to a file,&quot; the model generates a name that sounds right (<code>apply_diff</code>,{" "}
            <code>patch_file</code>, <code>edit_file</code>) rather than the exact registered name.
            The model has seen thousands of different tool and function names in training and picks
            the most natural-sounding one, not the one that matches the schema. Training data
            contains thousands of different function and tool naming conventions, so the model has
            learned that tool names are flexible - only structured tool-use APIs require exact
            matches.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            GitAuto maintains a mapping of commonly hallucinated tool names to their correct
            equivalents. When the model emits a tool call with an unrecognized name, the system
            checks the mapping and silently substitutes the correct tool name before executing. This
            happens transparently, requiring no additional API calls or agent iterations.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-mono text-gray-700 mb-1">
              <code>create_remote_file</code> → <code>write_and_commit_file</code>
            </p>
            <p className="text-sm font-mono text-gray-700">
              <code>edit_file</code> → <code>apply_diff_to_file</code>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={
                  RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TOOL_ARGUMENT_CORRECTION
                }
                className="text-pink-600 hover:underline"
              >
                Tool Argument Correction
              </Link>{" "}
              - Fixes when the right arguments are sent to the wrong tool
            </li>
            <li>
              <Link
                href={
                  RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.SANITIZE_TOOL_ARGUMENTS
                }
                className="text-pink-600 hover:underline"
              >
                Sanitize Tool Arguments
              </Link>{" "}
              - Strips malformed XML from tool arguments
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
