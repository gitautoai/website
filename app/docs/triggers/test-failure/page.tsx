import Image from "next/image";
import Link from "next/link";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { RELATIVE_URLS } from "@/config/urls";

export default function TestFailureTriggerPage() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test Failure Trigger</h1>

      <div className="prose prose-lg max-w-none space-y-12">
        {/* What */}
        <div>
          <p className="text-lg text-gray-700">
            The Test Failure Trigger automatically analyzes failed CI/CD workflows on
            GitAuto-created PRs, identifies the root cause, and creates fix commits. It also cancels
            running workflows to prevent waste when new commits are added.
          </p>
        </div>

        {/* Why */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Why use the test failure trigger?</h2>

          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="text-pink-600 font-semibold">Automatic Error Analysis:</span> GitAuto
              reads error logs, identifies root causes, and creates targeted fixes without human
              intervention.
            </p>

            <p className="text-gray-700">
              <span className="text-rose-600 font-semibold">Workflow Optimization:</span> Cancels
              running workflows when fix commits are added, preventing unnecessary CI/CD resource
              usage and costs.
            </p>

            <p className="text-gray-700">
              <span className="text-fuchsia-600 font-semibold">Safety Mechanisms:</span> If the
              process encounters issues, you can safely stop it by closing the PR or deleting the
              branch.
            </p>

            <p className="text-gray-700">
              <span className="text-purple-600 font-semibold">Perfect for:</span> Teams with complex
              CI/CD pipelines, projects with strict test requirements, and reducing manual debugging
              of test failures.
            </p>
          </div>
        </div>

        {/* How */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">How to use the test failure trigger</h2>

          <div className="space-y-8">
            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Enable the Trigger</h3>
                <p className="text-gray-700 mb-3">
                  Go to your{" "}
                  <Link
                    href={RELATIVE_URLS.SETTINGS.TRIGGERS}
                    className="text-pink-600 hover:text-pink-700"
                  >
                    Trigger Settings
                  </Link>{" "}
                  and ensure &quot;On test failure&quot; is enabled. This trigger is enabled by
                  default.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">GitAuto Detects Test Failures</h3>
                <p className="text-gray-700 mb-3">
                  When a CI/CD workflow fails on a GitAuto-created PR, the trigger automatically
                  activates. It only responds to failures on GitAuto PRs, not human-created ones.
                </p>
                <Image
                  src="/docs/triggers/test-failure.png"
                  alt="Screenshot showing a failed CI/CD workflow on a GitAuto pull request"
                  width={700}
                  height={400}
                  className="w-full border border-gray-200 rounded-lg"
                />
                <Image
                  src="/docs/triggers/test-failure-detection.png"
                  alt="Screenshot showing a failed CI/CD workflow on a GitAuto pull request and GitAuto is working on it"
                  width={700}
                  height={400}
                  className="w-full border border-gray-200 rounded-lg mt-3"
                />
              </div>
            </div>

            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Error Analysis & Fix Creation</h3>
                <p className="text-gray-700 mb-3">
                  GitAuto analyzes the error logs, identifies the root cause, and creates a fix
                  commit. It also attempts to cancel any running workflows to prevent resource
                  waste.
                </p>
                <Image
                  src="/docs/triggers/error-analysis-fix-commit.png"
                  alt="Screenshot showing GitAuto analyzing errors and creating fix commits"
                  width={700}
                  height={400}
                  className="w-full border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Safety Controls</h3>
                <p className="text-gray-700 mb-3">
                  If the automated process encounters issues or you want to stop it, you have two
                  options:
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="border-l-4 border-red-500 pl-4">
                    <strong>Close the PR:</strong> This stops all GitAuto activity on that specific
                    pull request
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <strong>Delete the branch:</strong> This completely removes the branch and stops
                    the process
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-3">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> These safety mechanisms ensure you always have control
                    over the automated fixing process.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Cost */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Usage Cost</h2>
          <p className="text-gray-700">
            No Cost - Test failure fixes are free. This trigger adds fixes to existing GitAuto PRs
            without creating new ones.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-gray-700">
          Ready for automatic test fixing?{" "}
          <Link
            href={RELATIVE_URLS.SETTINGS.TRIGGERS}
            className="text-pink-600 hover:text-pink-700 underline"
          >
            Enable Test Failure Trigger in your settings
          </Link>{" "}
          and let GitAuto handle CI/CD failures automatically.
        </p>
      </div>

      <DocsContact
        title="CI/CD Pipeline Chaos?"
        description="When your CI/CD pipeline is more complex than a Rube Goldberg machine, getting GitAuto to play nicely can be challenging. We love solving these integration puzzles!"
        callToAction="Contact us"
        linkText="and let's tame that pipeline!"
      />

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.REVIEW_COMMENT,
          title: "Review Comment Trigger",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.SCHEDULE,
          title: "Schedule Trigger",
        }}
      />
    </div>
  );
}
