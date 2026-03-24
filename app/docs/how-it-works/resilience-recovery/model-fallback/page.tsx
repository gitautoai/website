import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function ModelFallbackPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.MODEL_FALLBACK,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Model Fallback</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto implements a model fallback chain: Claude Opus 4.6 → 4.5 → Sonnet 4.6 → 4.5 →
            4.0. When a model fails due to overload, rate limiting, or errors, GitAuto automatically
            falls back to the next model in the chain.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Anthropic models occasionally have capacity issues, especially during peak usage
            periods. A single model being unavailable would cause the entire PR generation to fail,
            leaving users waiting for the service to recover. Rather than failing the PR, falling
            back to a slightly less capable model keeps the work going. A completed PR from Sonnet
            is more valuable than no PR from an unavailable Opus.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            When an API call returns a 529 (overloaded), 429 (rate limited), or 500 (server error)
            status, GitAuto catches the error and retries with the next model in the chain. The
            conversation history is preserved across model switches - only the model parameter
            changes. If all models in the chain fail, the error is raised and the PR generation
            stops with a clear error message explaining which models were attempted.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.OVERLOAD_RETRY}
                className="text-pink-600 hover:underline"
              >
                Overload Retry
              </Link>{" "}
              - retries the same model with exponential backoff before falling back
            </li>
            <li>
              <Link
                href={
                  RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.INFRASTRUCTURE_FAILURE_DETECTION
                }
                className="text-pink-600 hover:underline"
              >
                Infrastructure Failure Detection
              </Link>{" "}
              - detects when failures are infrastructure-related vs. code-related
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
