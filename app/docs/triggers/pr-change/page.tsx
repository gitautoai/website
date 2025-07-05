import Image from "next/image";
import Link from "next/link";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function PRChangeTriggerPage() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">PR Change Trigger</h1>

      <div className="prose prose-lg max-w-none space-y-12">
        {/* What */}
        <div>
          <p className="text-lg text-gray-700">
            The PR Change Trigger automatically adds unit tests when pull requests are opened,
            updated, or synchronized. Instead of committing tests immediately, GitAuto adds a
            comment with checkboxes listing changed files. So you can choose which files to generate
            tests for.
          </p>
        </div>

        {/* Why */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Why use the PR change trigger?</h2>

          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="text-pink-600 font-semibold">Coverage Gate Compliance:</span> Perfect
              for repositories with strict coverage requirements. Tests are added before merge,
              ensuring CI/CD pipelines pass.
            </p>

            <p className="text-gray-700">
              <span className="text-rose-600 font-semibold">Zero Manual Work:</span> Developers
              focus entirely on features while GitAuto handles test case generation automatically on
              every PR update.
            </p>

            <p className="text-gray-700">
              <span className="text-fuchsia-600 font-semibold">Perfect for:</span> Teams with strict
              coverage gates and CI/CD pipelines that block merges on low coverage.
            </p>
          </div>
        </div>

        {/* How */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">How to use the PR change trigger</h2>

          <div className="space-y-8">
            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Navigate to Settings</h3>
                <p className="text-gray-700">
                  Go to your{" "}
                  <Link
                    href={RELATIVE_URLS.SETTINGS.TRIGGERS}
                    className="text-pink-600 hover:text-pink-700"
                  >
                    Trigger Settings
                  </Link>{" "}
                  page.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Select Repository</h3>
                <p className="text-gray-700">
                  Choose the repository where you want to enable the PR Change Trigger.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Enable PR Change Trigger</h3>
                <p className="text-gray-700 mb-3">
                  Toggle the "On PR change" option to enable the trigger.
                </p>
                <Image
                  src="/docs/triggers/enable-schedule-toggle.png"
                  alt="Screenshot of the PR Change Trigger toggle switch in enabled state"
                  width={500}
                  height={150}
                  className="border border-gray-200 rounded-lg"
                />
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-3">
                  <p className="text-orange-800 text-sm">
                    <strong>Note:</strong> PR Change Trigger cannot be used together with PR Merge
                    Trigger. Enabling one will automatically disable the other.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Select Files for Testing</h3>
                <p className="text-gray-700 mb-3">
                  When you create or update a PR, GitAuto will add a comment with checkboxes for
                  each changed file. You can check only the files you want tests for—GitAuto will
                  generate and commit tests for those files only.
                </p>
                <Image
                  src="/docs/triggers/pr-change-checkbox.png"
                  alt="Screenshot showing GitAuto's comment on a PR with checkboxes for each changed file"
                  width={700}
                  height={400}
                  className="w-full border border-gray-200 rounded-lg mb-3"
                />
                <p className="text-gray-700">
                  If you want to disable this behavior, you can turn off the trigger in settings.
                  For most teams, leaving it enabled is recommended for flexible, case-by-case test
                  requests.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                5
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">
                  Rollback Protection (Optional)
                </h3>
                <p className="text-gray-700 mb-3">
                  If you're not satisfied with generated tests, you can easily revert using Git.
                  Since your local branch is still clean (GitAuto only modified remote), you can
                  simply force push your original code:
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  <div className="text-green-400">git push --force-with-lease</div>
                </div>
                <p className="text-gray-700 mt-3">
                  This overwrites GitAuto's remote changes with your clean local code.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Cost */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Usage Cost</h2>
          <p className="text-gray-700">
            1 Pull Request - Each trigger creates one pull request with generated tests.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-gray-700">
          Ready to automate test coverage on every PR?{" "}
          <Link
            href={RELATIVE_URLS.SETTINGS.TRIGGERS}
            className="text-pink-600 hover:text-pink-700 underline"
          >
            Enable PR Change Trigger in your settings
          </Link>{" "}
          and never worry about coverage gates again.
        </p>
      </div>

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.SCHEDULE,
          title: "Schedule Trigger",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.PR_MERGE,
          title: "PR Merge Trigger",
        }}
      />
    </div>
  );
}
