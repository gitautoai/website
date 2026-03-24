import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function TestFilePreloadingPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TEST_FILE_PRELOADING,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Test File Preloading</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            Before the agent loop starts, GitAuto scans the repository for existing test files and
            pre-loads existing test files into the model&apos;s context. These serve as concrete
            examples of the project&apos;s testing patterns, import conventions, and assertion
            styles.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Without existing test files in context, generated tests are inconsistent with the rest
            of the codebase: wrong import paths, different test framework usage, unfamiliar
            assertion styles, and missed helper utilities. Every generated test feels like it was
            written by someone who had never seen the codebase. Pre-loading real test files from the
            repo teaches the model by example. If your tests use a custom render helper, the model
            sees it. If your tests follow a specific describe/it nesting pattern, the model
            replicates it. If your tests import from{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              @testing-library/react
            </code>{" "}
            with specific utilities, the model picks up that convention automatically.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Prefer Creating Over Finding</h2>
          <p className="text-gray-600 mb-4">
            Models have a strong bias toward generating new content rather than searching for
            existing content. Searching requires multiple tool calls with uncertain outcomes - the
            model has to guess file paths, run searches, interpret results, and try again if nothing
            comes back. Creating a new file is a single confident action with a guaranteed result.
            Left unchecked, the model will attempt a few searches, find nothing (or give up early),
            and create a brand new test file - ignoring the existing test suite&apos;s patterns,
            helpers, and conventions entirely. This is why GitAuto performs the search outside the
            model and injects the results before the model starts.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            GitAuto greps the repository for the implementation file name, then filters the results
            to find existing test files - all before the model starts. This is critical because the
            model will happily give up searching after a few attempts and create a new file instead.
            By doing the search upfront outside the model, GitAuto guarantees that existing tests
            are found and their content is injected into the initial context before the model begins
            its work.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TEST_NAMING_DETECTION}
                className="text-pink-600 hover:underline"
              >
                Test Naming Detection
              </Link>{" "}
              - detects the dominant naming convention across all test files
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.CODING_STANDARDS}
                className="text-pink-600 hover:underline"
              >
                Coding Standards
              </Link>{" "}
              - codified rules that complement the examples from preloaded files
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
