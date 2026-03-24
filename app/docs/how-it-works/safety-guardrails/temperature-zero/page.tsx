import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function TemperatureZeroPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.TEMPERATURE_ZERO,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Temperature Zero</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto sets the model&apos;s temperature to 0.0 for all code generation requests. This
            eliminates randomness from the model&apos;s output, producing deterministic and
            consistent code across every invocation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Non-zero temperature introduces randomness into the model&apos;s responses. When
            generating code that must be deterministic and correct, this randomness causes
            inconsistent output across retries - different variable names, different logic paths,
            different formatting each time. If a test fails and GitAuto retries, the retry should
            produce the same fix attempt, not a random variation that may introduce new bugs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Why Non-Zero Temperature Is Dangerous for Code
          </h2>
          <p className="text-gray-600 mb-4">
            Temperature adds randomness to token selection by sampling from lower-probability
            tokens. For creative writing, this produces variety. For code generation, it introduces
            unnecessary variation - different variable names on each retry, slightly different logic
            paths, inconsistent formatting. In code, there is usually one correct answer, and
            randomness only reduces the chance of finding it. Worse, when a test fails and the agent
            retries, temperature randomness means the retry might produce a completely different
            (and possibly worse) approach instead of converging on the fix.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            Every API call to the model includes{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">temperature: 0.0</code> in
            the request parameters. At temperature zero, the model selects the highest-probability
            token at each step, making the output as deterministic as possible. This applies to all
            code generation, file editing, and tool-use calls throughout the agent loop.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.STRICT_TOOL_SCHEMAS}
                className="text-pink-600 hover:underline"
              >
                Strict Tool Schemas
              </Link>{" "}
              - enforces valid JSON output structure alongside deterministic generation
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.DUPLICATE_ERROR_HASHING}
                className="text-pink-600 hover:underline"
              >
                Duplicate Error Hashing
              </Link>{" "}
              - detects when deterministic output produces the same failing fix repeatedly
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
