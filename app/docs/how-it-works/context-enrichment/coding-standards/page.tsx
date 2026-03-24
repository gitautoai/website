import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function CodingStandardsPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.CODING_STANDARDS,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Coding Standards</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto injects an XML document into every model session. This document codifies test
            design principles, code quality rules, and anti-pattern definitions. It acts as a
            universal baseline that applies to every repository, regardless of language or
            framework.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Without codified standards, the model produces tests with common anti-patterns: testing
            implementation details instead of behavior, over-mocking dependencies so tests pass even
            when code is broken, and writing tautological assertions like{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              expect(mock).toHaveBeenCalled()
            </code>{" "}
            right after calling the mock directly. The coding standards document explicitly names
            these anti-patterns and provides correct alternatives. It is the product of hundreds of
            real code reviews - every time a pattern was consistently rejected by reviewers, it was
            added to the standards to prevent recurrence.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Produce Anti-Patterns</h2>
          <p className="text-gray-600 mb-4">
            Models learn from training data that includes both good and bad code. They replicate
            patterns they have seen most frequently, not patterns that are correct. Testing
            anti-patterns like over-mocking and tautological assertions are extremely common in
            real-world codebases, so models reproduce them confidently. Without explicit rules
            saying &quot;don&apos;t do X, do Y instead,&quot; models default to the most
            statistically common pattern - which for tests is often the wrong one. The model has no
            inherent sense of test quality; it only knows what patterns appeared most often in its
            training data. Code generation benchmarks like HumanEval and SWE-bench reinforce this -
            they measure whether code passes tests, not whether the tests themselves follow best
            practices. Models are never penalized during training or evaluation for writing
            over-mocked tests or tautological assertions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            The standards document is structured in XML with distinct sections:
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2 mb-4">
            <li>
              <strong>Test design principles</strong> - behavioral testing over implementation
              testing, meaningful assertion messages, test isolation requirements
            </li>
            <li>
              <strong>Mock management</strong> - when to mock, when not to mock, how to avoid
              over-mocking that makes tests meaningless
            </li>
            <li>
              <strong>Anti-pattern catalog</strong> - specific patterns to avoid with examples of
              what to do instead
            </li>
            <li>
              <strong>Code quality rules</strong> - naming conventions, file organization, import
              hygiene
            </li>
            <li>
              <strong>Dead code handling</strong> - rules for identifying and removing unreachable
              code rather than writing impossible tests for it. This is key to achieving 100%
              coverage. See{" "}
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.DEAD_CODE_REMOVAL}
                className="text-pink-600 hover:underline"
              >
                Dead Code Removal
              </Link>{" "}
              for the full implementation.
            </li>
            <li>
              <strong>GITAUTO.md guidance</strong> - instructions for when and how to update the
              repo&apos;s GITAUTO.md file with new learnings
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            The document is injected into the system message alongside trigger-specific prompts and
            repository rules. It has lower priority than GITAUTO.md but higher priority than the
            model&apos;s default training, ensuring these standards are followed unless explicitly
            overridden by repo-specific configuration.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.CUSTOMIZATION.GITAUTO_MD}
                className="text-pink-600 hover:underline"
              >
                GITAUTO.md
              </Link>{" "}
              - repo-specific overrides that take priority over universal standards
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.CUSTOMIZATION.REPOSITORY_RULES}
                className="text-pink-600 hover:underline"
              >
                Repository Rules
              </Link>{" "}
              - user-configured rules that supplement the built-in standards
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TRIGGER_SPECIFIC_PROMPTS}
                className="text-pink-600 hover:underline"
              >
                Trigger-Specific Prompts
              </Link>{" "}
              - scenario-specific instructions injected alongside standards
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
