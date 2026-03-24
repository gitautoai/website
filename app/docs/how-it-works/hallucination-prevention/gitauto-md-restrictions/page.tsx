import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function GitautoMdRestrictionsPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.GITAUTO_MD_RESTRICTIONS,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">GITAUTO.md Restrictions</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            Rules in coding_standards.xml restrict what can go into GITAUTO.md: only reusable,
            repo-specific learnings. No task-specific details, no temporary workarounds, no project
            documentation. This keeps GITAUTO.md focused and useful across future sessions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Without restrictions, the model dumps entire debugging sessions into GITAUTO.md. It
            writes entries like &quot;Fixed issue #123 by changing line 45 of auth.ts&quot; or
            &quot;Tried approach A, failed, then tried approach B.&quot; Over time, GITAUTO.md grows
            to thousands of lines of irrelevant noise that pollutes future sessions. The model reads
            all of it at the start of every run, wasting tokens on one-off debugging notes that will
            never be relevant again.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Over-Write to Memory Files</h2>
          <p className="text-gray-600 mb-4">
            Models treat any writable file as a place to dump information. Without restrictions, the
            model records every debugging step, every failed approach, and every one-off fix. This
            is the same behavior as excessive logging - the model errs on the side of &quot;more
            information is better&quot; with no sense of what&apos;s reusable vs what&apos;s noise.
            Filtering requires judgment about future sessions that the model doesn&apos;t have.
            Models are trained to be helpful and thorough, so recording more information feels
            &quot;helpful&quot; because training rewards comprehensive responses. The concept of
            &quot;this is noise, not signal&quot; requires domain judgment that training does not
            provide.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            The coding_standards.xml file includes explicit rules about GITAUTO.md content: entries
            must be reusable patterns that apply to future sessions (e.g., &quot;this repo uses Jest
            with ts-jest transformer&quot;), not task-specific details (e.g., &quot;fixed bug in PR
            #456&quot;). Temporary workarounds and step-by-step debugging logs are prohibited. The
            model is instructed to think about whether each potential entry would help a future
            agent session before writing it.
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
              - how GITAUTO.md is configured and used
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.CODING_STANDARDS}
                className="text-pink-600 hover:underline"
              >
                Coding Standards
              </Link>{" "}
              - the XML file that contains GITAUTO.md restriction rules
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
