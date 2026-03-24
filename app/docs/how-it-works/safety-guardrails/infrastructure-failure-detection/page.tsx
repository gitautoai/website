import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function InfrastructureFailureDetectionPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.INFRASTRUCTURE_FAILURE_DETECTION,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Infrastructure Failure Detection</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto detects transient infrastructure failures in CI logs - segfaults, network
            timeouts, connection resets, out-of-memory crashes - and retries CI instead of trying to
            fix code. These failures are infrastructure flakiness, not code bugs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            A segfault in Node.js, a network timeout during npm install, or a connection reset
            during a database test is not a code bug - it is infrastructure flakiness. Without
            detection, the agent reads the error log and tries to &quot;fix&quot; the code, making
            changes that have nothing to do with the actual problem. A simple CI re-run would pass,
            but the agent wastes iterations and commits on phantom bugs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            GitAuto scans CI log output for known infrastructure failure patterns: segmentation
            faults, SIGKILL/SIGTERM signals, network timeout errors, DNS resolution failures,
            connection reset messages, and OOM killer output. When a match is found, instead of
            passing the log to the model for code analysis, GitAuto triggers a CI re-run directly.
            The re-run count is tracked separately (MAX_INFRA_RETRIES=3) to prevent infinite retries
            on persistently broken infrastructure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.DUPLICATE_ERROR_HASHING}
                className="text-pink-600 hover:underline"
              >
                Duplicate Error Hashing
              </Link>{" "}
              - detects repeated code errors after infrastructure failures are filtered out
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
