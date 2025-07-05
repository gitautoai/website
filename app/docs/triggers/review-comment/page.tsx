"use client";

import Image from "next/image";
import Link from "next/link";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";
import { useAccountContext } from "@/app/components/contexts/Account";

export default function ReviewCommentTriggerPage() {
  const { currentOwnerName, currentRepoName } = useAccountContext();
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Review Comment Trigger</h1>

      <div className="prose prose-lg max-w-none space-y-12">
        {/* What */}
        <div>
          <p className="text-lg text-gray-700">
            The Review Comment Trigger allows you to request fixes on GitAuto-created PRs by leaving
            review comments, just like you would with human team members. GitAuto will analyze your
            feedback and create fix commits automatically.
          </p>
        </div>

        {/* Why */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Why use the review comment trigger?</h2>

          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="text-pink-600 font-semibold">Natural Workflow:</span> Use the same
              GitHub review process you&apos;re already familiar with - no need to learn new tools
              or interfaces.
            </p>

            <p className="text-gray-700">
              <span className="text-rose-600 font-semibold">Flexible Feedback:</span> Leave comments
              on specific lines, entire files, or the PR as a whole. GitAuto understands all types
              of review feedback.
            </p>

            <p className="text-gray-700">
              <span className="text-fuchsia-600 font-semibold">Iterative Improvement:</span>{" "}
              Continue the conversation with multiple rounds of feedback until the tests meet your
              exact requirements.
            </p>

            <p className="text-gray-700">
              <span className="text-purple-600 font-semibold">Perfect for:</span> Fine-tuning
              generated tests, requesting specific test scenarios, and ensuring tests match your
              team&apos;s coding standards.
            </p>
          </div>
        </div>

        {/* How */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">
            How to use the review comment trigger
          </h2>

          <div className="space-y-8">
            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0 mt-1">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Enable the Trigger</h3>
                <p className="text-gray-700 mb-3">
                  Go to your{" "}
                  <Link
                    href={RELATIVE_URLS.SETTINGS.TRIGGERS}
                    className="text-pink-600 hover:text-pink-700"
                  >
                    Trigger Settings
                  </Link>{" "}
                  and ensure &quot;On review comment&quot; is enabled. This trigger is enabled by
                  default.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0 mt-1">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Open a GitAuto-created PR</h3>
                <p className="text-gray-700 mb-3">
                  Navigate to any pull request created by GitAuto in your repository. This trigger
                  only works on PRs created by GitAuto, not on human-created PRs.
                </p>
                <Image
                  src="/docs/triggers/gitauto-pr-example.png"
                  alt="Screenshot showing a GitAuto-created pull request with test files"
                  width={700}
                  height={400}
                  className="w-full border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0 mt-1">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Leave a Review Comment</h3>
                <p className="text-gray-700 mb-3">
                  Click &quot;Start a review&quot; and select &quot;Request changes&quot;. Leave
                  your feedback as comments. You can comment on specific lines, files, or the entire
                  PR.
                </p>
                <Image
                  src="/docs/triggers/add-review-comment-to-a-line.png"
                  alt="Screenshot showing how to add a review comment on a GitAuto PR"
                  width={700}
                  height={400}
                  className="w-full border border-gray-200 rounded-lg"
                />
                <Image
                  src="/docs/triggers/add-review-comment-to-a-file.png"
                  alt="Screenshot showing how to add a review comment on a GitAuto PR"
                  width={700}
                  height={400}
                  className="w-full border border-gray-200 rounded-lg mt-3"
                />
                <Image
                  src="/docs/triggers/submit-review-request.png"
                  alt="Screenshot showing how to submit a review request on a GitAuto PR"
                  width={700}
                  height={400}
                  className="w-full border border-gray-200 rounded-lg mt-3"
                />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
                  <p className="text-blue-800 text-sm">
                    <strong>Important:</strong> Make sure to select &quot;Request changes&quot; when
                    submitting your review. Comments without this selection won&apos;t trigger
                    GitAuto.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0 mt-1">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">GitAuto Creates Fix Commits</h3>
                <p className="text-gray-700 mb-3">
                  GitAuto will analyze your feedback and automatically create commits addressing
                  your concerns. You can continue this process with additional review rounds if
                  needed.
                </p>
                <Image
                  src="/docs/triggers/fix-commit-example.png"
                  alt="Screenshot showing GitAuto's fix commit responding to review feedback"
                  width={700}
                  height={400}
                  className="w-full border border-gray-200 rounded-lg"
                />
                <Image
                  src="/docs/triggers/fix-commit-complete-comment.png"
                  alt="Screenshot showing GitAuto's fix commit responding to review feedback"
                  width={700}
                  height={400}
                  className="w-full border border-gray-200 rounded-lg mt-3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Usage Cost */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Usage Cost</h2>
          <p className="text-gray-700">
            No Cost - Review comments are free. This trigger adds fixes to existing GitAuto PRs
            without creating new ones.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-gray-700">
          Ready to collaborate with GitAuto?{" "}
          <Link
            href={`https://github.com/${currentOwnerName}/${currentRepoName}/pulls`}
            className="text-pink-600 hover:text-pink-700 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Find a GitAuto PR in your repository
          </Link>{" "}
          and start leaving review comments to fine-tune your tests.
        </p>
      </div>

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.DASHBOARD,
          title: "Dashboard Trigger",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.TEST_FAILURE,
          title: "Test Failure Trigger",
        }}
      />
    </div>
  );
}
