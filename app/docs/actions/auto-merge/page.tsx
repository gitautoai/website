import Image from "next/image";
import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function AutoMergePage() {
  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Auto-Merge</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <p className="text-lg text-gray-700">
          Automatically merge GitAuto pull requests when all tests pass and conditions are met. Save
          time by eliminating manual PR merging for test generation tasks.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">How Auto-Merge Works</h2>
            <p className="text-gray-700 mb-3">
              Auto-merge happens immediately when check suite completes successfully and all
              conditions are met:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>All status checks pass</li>
              <li>No merge conflicts</li>
              <li>Branch is up to date</li>
              <li>
                Repository does NOT require reviews (reviews haven&apos;t happened yet at this
                point)
              </li>
            </ul>
            <div className="mt-4 bg-yellow-50 p-4 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Auto-merge won&apos;t work if your repository requires
                reviews in branch protection. See the configuration section below to learn how to
                bypass this requirement.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Who Should Use This</h2>
            <p className="text-gray-700">
              Teams with scheduled triggers creating many PRs per day who are already familiar with
              GitAuto&apos;s changes and want to reduce the manual burden of merging PRs they would
              normally merge without detailed code review when tests pass.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Enabling Auto-Merge</h2>
            <p className="text-gray-700 mb-3">
              To enable auto-merge for your repository, go to{" "}
              <Link
                href={RELATIVE_URLS.SETTINGS.ACTIONS}
                className="text-pink-600 hover:text-pink-700 underline"
              >
                Actions Settings
              </Link>{" "}
              and configure the following:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>Select your repository from the dropdown</li>
              <li>Toggle &quot;Auto-merge&quot; to enabled</li>
              <li>
                <strong>Only test files (optional):</strong> Only auto-merge when PR contains
                exclusively test files
              </li>
              <li>
                <strong>Merge method:</strong> Choose merge, squash, or rebase method
              </li>
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Bypassing Branch Protection Approval Requirements
            </h2>
            <p className="text-gray-700 mb-3">
              If your repository requires pull request approvals in branch protection (e.g.,
              &quot;Require 2 approving reviews&quot;), you need to configure GitAuto to bypass this
              requirement while keeping it for human developers.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">Configuration Steps</h3>
            <ol className="list-decimal pl-6 space-y-3 text-gray-700">
              <li>Navigate to your repository on GitHub</li>
              <li>Go to Settings → Branches</li>
              <li>
                Under &quot;Branch protection rules&quot;, find your default branch (usually{" "}
                <code>main</code> or <code>master</code>) and click <strong>Edit</strong>
              </li>
              <li>Scroll down to the &quot;Require a pull request before merging&quot; section</li>
              <li>
                Check the box:{" "}
                <strong>&quot;Allow specified actors to bypass required pull requests&quot;</strong>
              </li>
              <li>
                In the search field, type <strong>git</strong> and select{" "}
                <strong>gitauto-ai</strong> from the dropdown
              </li>
            </ol>

            <div className="mt-4">
              <Image
                src="/docs/branch-protection-bypass.png"
                alt="GitHub branch protection settings showing 'Allow specified actors to bypass required pull requests' checkbox and search field with gitauto-ai selected"
                width={700}
                height={600}
                className="w-full border border-gray-200 rounded-lg"
              />
            </div>

            <div className="mt-4 bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Result:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-blue-800">
                <li>Human developers still need approving reviews to merge PRs</li>
                <li>GitAuto can auto-merge its own PRs without approvals when tests pass</li>
                <li>All other branch protection rules remain enforced for everyone</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
            <div className="bg-yellow-50 p-4 rounded-md">
              <p className="text-sm font-semibold text-yellow-800 mb-2">
                If GitAuto cannot merge after configuration:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-yellow-800">
                <li>Verify GitAuto is installed on the repository</li>
                <li>Check that auto-merge is enabled in GitAuto Actions Settings</li>
                <li>Ensure the branch protection rule is applied to the correct branch</li>
                <li>Confirm all required status checks are passing</li>
                <li>Make sure there are no merge conflicts</li>
                <li>Verify the branch is up to date with the base branch</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <DocsContact
        title="Need Help Configuring Auto-Merge?"
        description="Branch protection rules can be tricky to configure correctly. If you're having trouble getting auto-merge to work with your specific setup, we're here to help!"
        callToAction="Contact us"
        linkText="and we'll help you get auto-merge working."
      />

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.CUSTOMIZATION.REPOSITORY_RULES,
          title: "Repository Rules",
        }}
      />
    </div>
  );
}
