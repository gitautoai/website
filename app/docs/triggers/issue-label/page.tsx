"use client";

import Image from "next/image";
import Link from "next/link";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { RELATIVE_URLS } from "@/config/urls";
import { useAccountContext } from "@/app/components/contexts/Account";

export default function IssueLabelTriggerPage() {
  const { currentOwnerName, currentRepoName } = useAccountContext();

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Issue Label Trigger</h1>

      <div className="prose prose-lg max-w-none space-y-12">
        {/* What */}
        <div>
          <p className="text-lg text-gray-700">
            Trigger GitAuto by adding the &quot;gitauto&quot; label to GitHub issues. This method
            works with existing issues and supports automation through APIs, GitHub Actions, and
            external workflows.
          </p>
        </div>

        {/* Why */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Why use the issue label trigger?</h2>

          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="text-pink-600 font-semibold">Works with Existing Issues:</span> You
              can add the label to any issue, including those created before GitAuto was installed
              in your repository.
            </p>

            <p className="text-gray-700">
              <span className="text-rose-600 font-semibold">API Integration:</span> External tools
              and services can automatically create issues with the &quot;gitauto&quot; label,
              enabling powerful automation workflows.
            </p>

            <p className="text-gray-700">
              <span className="text-fuchsia-600 font-semibold">Perfect for:</span> Teams using issue
              management tools and automated workflows that need to trigger GitAuto
              programmatically.
            </p>
          </div>
        </div>

        {/* How */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">How to use the issue label trigger</h2>

          <div className="space-y-8">
            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Find or create a GitHub issue</h3>
                <p className="text-gray-700 mb-3">
                  Navigate to an existing issue or create a new one. You can use any issue,
                  including those created before GitAuto was installed.
                </p>
                <Image
                  src="/docs/label-trigger-issue.png"
                  alt="Screenshot showing a GitHub issue page with the issue title, description, and right sidebar"
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
                <h3 className="text-lg font-semibold mt-0.5 mb-2">
                  Add the &quot;gitauto&quot; label
                </h3>
                <p className="text-gray-700 mb-3">
                  In the right sidebar, click the gear icon next to &quot;Labels&quot; and type
                  &quot;gitauto&quot;. If the label doesn&apos;t exist, GitHub will let you create
                  it.
                </p>
                <Image
                  src="/docs/add-gitauto-label.png"
                  alt="Screenshot showing how to add the 'gitauto' label in the GitHub issue's right sidebar"
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
                <h3 className="text-lg font-semibold mt-0.5 mb-2">GitAuto analyzes and responds</h3>
                <p className="text-gray-700 mb-3">
                  Once the label is added, GitAuto will automatically analyze the issue and add a
                  comment acknowledging that it&apos;s working on generating tests.
                </p>
                <Image
                  src="/docs/gitauto-response.png"
                  alt="Screenshot showing GitAuto's response comment acknowledging the issue analysis"
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
                <h3 className="text-lg font-semibold mt-0.5 mb-2">
                  Review and merge the pull request
                </h3>
                <p className="text-gray-700 mb-3">
                  GitAuto will create a pull request with the generated tests. The PR will be linked
                  in a comment on the issue.
                </p>
                <Image
                  src="/docs/label-trigger-pr.png"
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
          Ready to automate your workflow?{" "}
          {currentOwnerName && currentRepoName ? (
            <Link
              href={`https://github.com/${currentOwnerName}/${currentRepoName}/issues`}
              className="text-pink-600 hover:text-pink-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Add the &quot;gitauto&quot; label to any issue
            </Link>
          ) : (
            <span className="text-gray-500">Add the &quot;gitauto&quot; label to any issue</span>
          )}{" "}
          and experience seamless test generation integration.
        </p>
      </div>

      <DocsContact
        title="Want to Build Something Cool?"
        description="The label trigger opens up amazing automation possibilities! We've seen teams build incredible workflows, from Slack bots that create labeled issues to project management integrations that automatically request tests."
        callToAction="Contact us"
        linkText="and let's brainstorm your automation ideas!"
      />

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.DASHBOARD,
          title: "Dashboard Trigger",
        }}
      />
    </div>
  );
}
