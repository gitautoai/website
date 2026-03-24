import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function ToolArgumentCorrectionPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TOOL_ARGUMENT_CORRECTION,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Tool Argument Correction</h1>
      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto detects when the model passes arguments meant for one tool to another and
            automatically swaps the tool name to match the arguments. This is distinct from tool
            name correction: here the arguments are correct, but the tool name is wrong.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            The model sometimes picks the wrong tool name while providing perfectly valid arguments
            for a different tool. The most common case is passing a <code>unified_diff</code>{" "}
            argument to <code>write_and_commit_file</code> instead of{" "}
            <code>apply_diff_to_file</code>. The model knows it wants to apply a diff but grabs the
            wrong tool name. Without correction, the tool would receive arguments it does not
            expect, causing either an error or worse, writing the raw diff text as the file content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Pick the Wrong Tool</h2>
          <p className="text-gray-600 mb-4">
            When the agent has multiple tools with overlapping purposes (e.g., both{" "}
            <code>write_and_commit_file</code> and <code>apply_diff_to_file</code> modify files),
            the model sometimes selects the wrong one while correctly constructing the arguments for
            the intended tool. The model generates the tool name and arguments together in one pass,
            and if it starts with the wrong tool name, the rest of the output still follows the
            intended tool&apos;s argument structure. Training data contains many similar function
            names for file operations, so the model has weak signal about which exact name maps to
            which behavior.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            Before executing a tool call, GitAuto inspects the arguments. If the arguments contain
            keys that are specific to a different tool (e.g., <code>unified_diff</code> belongs
            exclusively to <code>apply_diff_to_file</code>), the system swaps the tool name to
            match. This is a lightweight check based on argument key signatures, not content
            inspection.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Detected:</strong> Tool <code>write_and_commit_file</code> called with{" "}
              <code>unified_diff</code> argument
            </p>
            <p className="text-sm text-gray-700">
              <strong>Corrected:</strong> Swapped to <code>apply_diff_to_file</code> which expects
              that argument
            </p>
          </div>
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
              - Maps hallucinated tool names to real ones
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.DIFF_HUNK_REPAIR}
                className="text-pink-600 hover:underline"
              >
                Diff Hunk Repair
              </Link>{" "}
              - Fixes the diff content itself after routing to the correct tool
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
