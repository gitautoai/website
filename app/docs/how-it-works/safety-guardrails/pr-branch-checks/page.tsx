import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function PrBranchChecksPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.PR_BRANCH_CHECKS,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">PR/Branch Checks</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            Before each iteration, GitAuto checks whether the PR is still open and the branch still
            exists on GitHub. If either has been closed or deleted, the agent stops processing
            immediately instead of continuing to work on a dead target.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            A user might close a PR or delete a branch while GitAuto is still actively working on
            it. Without these checks, the agent continues making commits to a dead branch, burning
            API tokens, Lambda compute time, and CI minutes for work that will never be reviewed or
            merged.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            At the start of each iteration, GitAuto makes two GitHub API calls: one to check the
            PR&apos;s state (open, closed, or merged) and one to verify the branch ref exists. If
            the PR is no longer open or the branch has been deleted, the agent logs the reason,
            updates any internal tracking, and exits cleanly. No commit is attempted, and no CI run
            is triggered.
          </p>
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
