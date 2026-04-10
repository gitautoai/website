import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function SiblingBranchRetargetPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Sibling Branch Retarget</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            When you change the{" "}
            <Link
              href={RELATIVE_URLS.DASHBOARD.RULES}
              className="text-pink-600 hover:text-pink-700"
            >
              target branch
            </Link>{" "}
            in your repository settings, GitAuto automatically retargets all open PRs to the new
            base branch. If the old and new branches are siblings (e.g.{" "}
            <code>release/20260401</code> to <code>release/20260501</code>), GitAuto rewrites the PR
            to produce a clean diff.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">The Problem</h2>
          <p className="text-gray-600 mb-4">
            GitHub&apos;s &quot;change base branch&quot; API only updates metadata - it doesn&apos;t
            touch the git history. When two release branches are siblings (both forked from the same
            trunk at different points), changing the base causes the PR diff to explode with
            hundreds of unrelated files. Git recomputes the merge base against an entirely different
            branch, and every file that differs between the two release branches appears in the
            diff.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How GitAuto Handles It</h2>
          <ol className="list-decimal pl-8 text-gray-600 space-y-2">
            <li>
              <strong>Save</strong> the PR&apos;s actual file contents from the current branch
            </li>
            <li>
              <strong>Change</strong> the base branch on GitHub (metadata only)
            </li>
            <li>
              <strong>Reset</strong> the local branch to the new base via <code>git fetch</code> +{" "}
              <code>git reset</code>
            </li>
            <li>
              <strong>Rewrite</strong> the saved files onto the new base
            </li>
            <li>
              <strong>Commit per file</strong> with the correct verb (Add, Update, or Delete) and
              force push
            </li>
          </ol>
          <p className="text-gray-600 mt-4">
            The result is a clean PR diff showing only the actual changes, regardless of how
            different the two base branches are.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How to Trigger</h2>
          <ol className="list-decimal pl-8 text-gray-600 space-y-2">
            <li>
              <strong>Change the target branch</strong> in your{" "}
              <Link
                href={RELATIVE_URLS.DASHBOARD.RULES}
                className="text-pink-600 hover:text-pink-700"
              >
                repository rules
              </Link>{" "}
              dashboard. GitAuto will retarget all open PRs for that repository.
            </li>
            <li>
              <strong>
                Or leave a{" "}
                <Link
                  href={RELATIVE_URLS.DOCS.TRIGGERS.REVIEW_COMMENT}
                  className="text-pink-600 hover:text-pink-700"
                >
                  review comment
                </Link>
              </strong>{" "}
              on a specific PR asking to change its target branch (e.g. &quot;please target
              release/20260501 instead&quot;).
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Not Rebase?</h2>
          <p className="text-gray-600 mb-4">
            A human developer would use <code>git rebase --onto</code>, but this has two problems in
            automation: rebase can hit merge conflicts and halt (requiring manual resolution), and
            it requires full commit history which is unavailable in shallow clones (
            <code>--depth 1</code>). The save-reset-rewrite approach is deterministic,
            conflict-free, and works with any clone depth. Read more in our{" "}
            <Link
              href="/blog/why-retargeting-a-pr-explodes-the-diff"
              className="text-pink-600 hover:text-pink-700"
            >
              blog post on this topic
            </Link>
            .
          </p>
        </section>
      </div>

      <DocsContact />

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.ACTIONS.AUTO_MERGE,
          title: "Auto-Merge",
        }}
      />
    </>
  );
}
