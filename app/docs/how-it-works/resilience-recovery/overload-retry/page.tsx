import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function OverloadRetryPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.OVERLOAD_RETRY,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Overload Retry</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto handles HTTP 529 (overloaded) errors with exponential backoff retry. When the
            model&apos;s API returns an overload response, GitAuto waits progressively longer
            between retries instead of immediately failing.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            HTTP 529 errors are transient - the model is temporarily busy serving other requests.
            Retrying after a short wait usually succeeds because the server has processed some of
            its queue. Without backoff, rapid retries make the problem worse by adding more load to
            an already overloaded system. A single 529 error should not cause an entire PR
            generation to fail when waiting 30 seconds would resolve it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            When a 529 response is received, GitAuto waits before retrying. The wait time doubles
            with each retry: first 10 seconds, then 20, then 40, and so on. This exponential backoff
            gives the server time to recover. After a configurable number of retries (typically
            3-5), if the model is still overloaded, GitAuto falls back to the next model in the
            fallback chain rather than continuing to retry indefinitely.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.MODEL_FALLBACK}
                className="text-pink-600 hover:underline"
              >
                Model Fallback
              </Link>{" "}
              - switches to a different model after retries are exhausted
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
