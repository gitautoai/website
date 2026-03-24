import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function DuplicateErrorHashingPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.DUPLICATE_ERROR_HASHING,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Duplicate Error Hashing</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto hashes CI error logs after each test run and compares the hash against previous
            attempts. If the same error hash appears twice, the agent knows its fix did not work and
            should try a different approach or give up.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Without error hashing, the agent can make the same incorrect fix repeatedly, creating
            10+ commits that all fail in the exact same way. Each commit triggers a full CI run, and
            the agent reads the same error log, generates the same wrong fix, commits it, and loops.
            Error hashing breaks this cycle by detecting when the agent is stuck.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            After each CI run, GitAuto extracts the relevant error portion of the logs, normalizes
            it (removing timestamps, line numbers, and other volatile content), and computes a hash.
            This hash is stored alongside the iteration number. Before starting a new fix attempt,
            the agent checks whether the current error hash matches any previous hash. If it finds a
            duplicate, it knows the previous fix was ineffective and can either try a fundamentally
            different approach or stop and report the issue.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={
                  RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.INFRASTRUCTURE_FAILURE_DETECTION
                }
                className="text-pink-600 hover:underline"
              >
                Infrastructure Failure Detection
              </Link>{" "}
              - distinguishes infrastructure errors from code errors before hashing
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
