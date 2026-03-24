import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function SkipCiIntermediatePage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.SKIP_CI_INTERMEDIATE,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Skip CI Intermediate</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto adds{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">[skip ci]</code> to
            intermediate commit messages during an agent session. CI only runs on the final commit,
            saving compute costs and avoiding noise from in-progress builds.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            A 10-commit agent session would trigger 10 separate CI runs without this optimization.
            Each CI run takes 5-10 minutes and costs compute resources. The first 9 commits are
            intermediate states - incomplete code that will change in subsequent iterations. Running
            CI on these intermediate states wastes time, money, and clutters the PR with failed
            check results that are immediately outdated.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            Every commit made during the agent loop includes{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">[skip ci]</code> in its
            commit message. Most CI providers (GitHub Actions, CircleCI, Travis CI) recognize this
            tag and skip the pipeline. On the final commit - after all iterations are complete and
            verification has passed - GitAuto omits the tag so CI runs normally against the finished
            code.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.FORCED_VERIFICATION}
                className="text-pink-600 hover:underline"
              >
                Forced Verification
              </Link>{" "}
              - ensures quality checks run before the final commit
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
