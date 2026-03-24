import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function TriggerSpecificPromptsPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TRIGGER_SPECIFIC_PROMPTS,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Trigger-Specific Prompts</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto loads different XML prompt files depending on what triggered the run - a new PR,
            a CI test failure, a review comment, or a scheduled task. Each prompt contains
            specialized instructions tailored to that scenario, ensuring the model approaches each
            type of work with the right mindset and context.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            A test-failure response requires fundamentally different context than a new-PR response.
            When fixing a test failure, the model needs to focus on error logs, understand what
            changed, and produce a minimal fix. When creating a new PR, the model needs to
            understand the task, explore relevant source files, and write comprehensive tests. A
            one-size-fits-all prompt led to poor results in both cases - the prompt was either too
            generic to be useful or too specific to one scenario. By splitting prompts per trigger
            type, each set of instructions can be optimized independently.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Need Explicit Context</h2>
          <p className="text-gray-600 mb-4">
            Models have no awareness of what triggered them. A model receiving &quot;fix this test
            failure&quot; doesn&apos;t inherently know whether it was triggered by a CI failure, a
            reviewer comment, or a scheduled run. Each trigger implies different constraints - a
            review comment means someone is watching and expects a response; a schedule trigger
            means no one is waiting - but models treat all inputs identically unless explicitly told
            the context. Without trigger-specific instructions, the model applies the same generic
            approach to every situation, missing the nuances that make each scenario different. It
            cannot infer intent from the input alone because it has no memory of how or why it was
            invoked.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            When a trigger fires, GitAuto determines the trigger type and loads the corresponding
            XML prompt file. The main trigger types are:
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2 mb-4">
            <li>
              <strong>New PR</strong> - instructions for implementing features or writing tests from
              a GitHub issue description
            </li>
            <li>
              <strong>Test failure</strong> - instructions for analyzing CI logs and creating
              targeted fix commits
            </li>
            <li>
              <strong>Review comment</strong> - instructions for understanding reviewer feedback and
              making requested changes
            </li>
            <li>
              <strong>Schedule</strong> - instructions for proactive work like generating tests for
              uncovered files
            </li>
          </ul>
          <p className="text-gray-600 mb-4">
            The prompt files use XML structure for clear section boundaries. They are injected into
            the system message alongside other context like repository rules and coding standards.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.CODING_STANDARDS}
                className="text-pink-600 hover:underline"
              >
                Coding Standards
              </Link>{" "}
              - universal rules injected alongside trigger-specific prompts
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.TRIGGERS.TEST_FAILURE}
                className="text-pink-600 hover:underline"
              >
                Test Failure Trigger
              </Link>{" "}
              - the trigger type that benefits most from specialized prompts
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
