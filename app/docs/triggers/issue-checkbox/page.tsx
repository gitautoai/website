"use client";

import Image from "next/image";
import Link from "next/link";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { RELATIVE_URLS } from "@/config/urls";
import { useAccountContext } from "@/app/components/contexts/Account";

export default function IssueCheckboxTriggerPage() {
  const { currentOwnerName, currentRepoName } = useAccountContext();
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Issue Checkbox Trigger</h1>

      <div className="prose prose-lg max-w-none space-y-12">
        {/* What */}
        <div>
          <p className="text-lg text-gray-700">
            Trigger GitAuto by checking a box in GitHub issues. This is the simplest and most
            straightforward way to request unit tests for specific files mentioned in your issues.
          </p>
        </div>

        {/* Why */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Why use the issue checkbox trigger?</h2>

          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="text-pink-600 font-semibold">Simplest Method:</span> No need to
              remember labels or navigate to dashboards. Just check a box and GitAuto handles the
              rest.
            </p>

            <p className="text-gray-700">
              <span className="text-rose-600 font-semibold">Issue Context:</span> GitAuto analyzes
              the issue description and comments to understand exactly what you want to test,
              providing more targeted results.
            </p>

            <p className="text-gray-700">
              <span className="text-fuchsia-600 font-semibold">Perfect for:</span> New users getting
              started with GitAuto and one-off test requests with specific context.
            </p>
          </div>
        </div>

        {/* How */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">
            How to use the issue checkbox trigger
          </h2>

          <div className="space-y-8">
            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Create a new GitHub issue</h3>
                <p className="text-gray-700 mb-3">
                  Create a new issue in your GitHub repository. The title can be anything
                  descriptive about what you want to test.
                </p>
                <Image
                  src="/docs/new-issue-button-on-github.png"
                  alt="Screenshot showing the GitHub 'New Issue' page with the issue creation form and sample title"
                  width={700}
                  height={400}
                  className="w-full border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Check the GitAuto checkbox</h3>
                <p className="text-gray-700 mb-3">
                  GitAuto will automatically add a comment to your issue with a checkbox. Check this
                  box to trigger GitAuto to analyze your issue and generate test cases.
                </p>
                <Image
                  src="/docs/gitauto-checkbox.png"
                  alt="Screenshot showing a GitHub issue with GitAuto's automated comment containing a checkbox"
                  width={700}
                  height={400}
                  className="w-full border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">
                  Review and merge the pull request
                </h3>
                <p className="text-gray-700 mb-3">
                  GitAuto will create a pull request with the generated tests. Review the code and
                  merge the pull request to add the tests to your repository.
                </p>
                <Image
                  src="/docs/review-pr.png"
                  alt="Screenshot showing the pull request created by GitAuto with generated test files"
                  width={700}
                  height={400}
                  className="w-full border border-gray-200 rounded-lg"
                />
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
          Ready to get started?{" "}
          {currentOwnerName && currentRepoName ? (
            <Link
              href={`https://github.com/${currentOwnerName}/${currentRepoName}/issues/new`}
              className="text-pink-600 hover:text-pink-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Create an issue in your repository
            </Link>
          ) : (
            <span className="text-gray-500">Create an issue in your repository</span>
          )}{" "}
          and watch GitAuto automatically add a checkbox for you to trigger test generation.
        </p>
      </div>

      <DocsContact
        title="Checkbox Not Appearing?"
        description="It's frustrating when you create an issue and GitAuto stays silent! Usually it's a simple permission or installation issue, but sometimes GitHub webhooks can be mysterious."
        callToAction="Contact us"
        linkText="and we'll get that checkbox showing up!"
      />

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.OVERVIEW,
          title: "Triggers Overview",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.ISSUE_LABEL,
          title: "Issue Label Trigger",
        }}
      />
    </div>
  );
}
