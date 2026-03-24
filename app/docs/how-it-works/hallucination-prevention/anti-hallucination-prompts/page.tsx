import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function AntiHallucinationPromptsPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.ANTI_HALLUCINATION_PROMPTS,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Anti-Hallucination Prompts</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto includes explicit instructions in the system message that tell the model:
            &quot;NEVER claim a file exists unless you can see it,&quot; &quot;Do NOT invent or
            hallucinate file names,&quot; and &quot;Always verify by reading the file first.&quot;
            These prompts reduce the frequency of hallucinated imports and file references.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            The model confidently imports from files that don&apos;t exist, references functions
            with wrong signatures, and assumes project structures based on common patterns rather
            than the actual repository. Without explicit anti-hallucination instructions, the model
            writes imports like{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              {"import { utils } from './utils'"}
            </code>{" "}
            for a utils file it has never seen and that may not exist. These phantom imports cause
            immediate build failures that waste agent iterations to debug.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Why Models Hallucinate File Paths and Imports
          </h2>
          <p className="text-gray-600 mb-4">
            Models predict file paths based on naming conventions they&apos;ve seen in training
            data. If a project puts utilities in{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">src/lib/utils</code>, but
            the model&apos;s training data more commonly shows{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">src/utils</code> or{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">lib/helpers</code>, it will
            confidently generate the wrong import path. The model has no file system access to
            verify paths exist - it&apos;s purely guessing based on patterns. Code generation
            benchmarks provide self-contained problems where all imports are known, so models are
            never evaluated on navigating real repositories with complex directory structures and
            have no training signal for import path accuracy in unfamiliar codebases.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            The anti-hallucination instructions are embedded in the system message that starts every
            agent session. They are phrased as direct prohibitions: &quot;NEVER,&quot; &quot;Do
            NOT,&quot; &quot;ALWAYS verify.&quot; Strong wording is intentional because softer
            instructions like &quot;try to verify files&quot; are ignored under pressure when the
            model is trying to complete a task quickly. The instructions reduce but do not fully
            eliminate hallucinations - the model still occasionally invents imports, which is why
            other safeguards like verification exist.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.WEB_SEARCH}
                className="text-pink-600 hover:underline"
              >
                Web Search
              </Link>{" "}
              - lets the model search for current information about libraries and APIs
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.URL_FETCHING}
                className="text-pink-600 hover:underline"
              >
                URL Fetching
              </Link>{" "}
              - lets the model read full page content from search results
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.FULL_FILE_READS}
                className="text-pink-600 hover:underline"
              >
                Full File Reads
              </Link>{" "}
              - gives the model actual file contents to reference instead of guessing
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
