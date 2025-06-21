import Image from "next/image";
import Link from "next/link";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function DashboardTriggerPage() {
  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Generate Tests Using Dashboard</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <p className="text-lg text-gray-700">
          After installation, the{" "}
          <Link
            href={RELATIVE_URLS.DASHBOARD.COVERAGE}
            className="text-pink-600 hover:text-pink-700 underline"
          >
            GitAuto dashboard
          </Link>{" "}
          provides a visual interface to manage test generation for your repositories.
        </p>

        <div className="space-y-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                1
              </div>
              <h2 className="text-xl font-semibold my-4">Sign in to the GitAuto dashboard</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/sign-in.png"
                alt="Screenshot of the GitAuto dashboard sign in page. The image shows the sign in interface with a 'Sign in' button prominently displayed. Take a screenshot of the initial GitAuto dashboard sign in screen before authentication."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              First, on the top right corner of any page, click on the &quot;Sign in&quot; button.
              Then, sign in with your GitHub account.
            </p>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                2
              </div>
              <h2 className="text-xl font-semibold my-4">Visit the GitAuto dashboard</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/coverage-dashboard.png"
                alt="Screenshot of the GitAuto dashboard home page. The image shows the dashboard home page with a list of repositories and a 'Actions' button prominently displayed. Take a screenshot of the initial GitAuto dashboard home page."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              After signing in, you will be redirected to the{" "}
              <Link
                href={RELATIVE_URLS.DASHBOARD.COVERAGE}
                className="text-pink-600 hover:text-pink-700 underline"
              >
                GitAuto dashboard
              </Link>
              . The dashboard will display a list of organizations and repositories where GitAuto is
              installed.
            </p>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                3
              </div>
              <h2 className="text-xl font-semibold my-4">
                Select your GitHub organization and repository
              </h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/select-repo.png"
                alt="Screenshot showing the repository selection interface in the GitAuto dashboard. The image displays dropdown menus for selecting an organization and repository. Take a screenshot showing both dropdown menus expanded or with a repository already selected."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              Select your GitHub organization and repository from the dropdown menu. Only
              repositories where GitAuto is installed will be displayed.
            </p>
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> If you don&apos;t see your repository, verify that GitAuto is
                installed for that organization and that you have appropriate permissions.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                4
              </div>
              <h2 className="text-xl font-semibold my-4">Browse repository files</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/file-list.png"
                alt="Screenshot showing the file list view in the GitAuto dashboard. The image displays a table of repository files with columns for file paths, coverage percentages (if available), and selection checkboxes. Take a screenshot showing multiple files listed with their coverage information."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              The{" "}
              <Link
                href={RELATIVE_URLS.DASHBOARD.COVERAGE}
                className="text-pink-600 hover:text-pink-700 underline"
              >
                dashboard
              </Link>{" "}
              will display a list of files in your repository. If you&apos;ve integrated with
              coverage reports, you&apos;ll also see coverage percentages for each file.
            </p>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                5
              </div>
              <h2 className="text-xl font-semibold my-4">Set Parent Issue (Optional)</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/parent-issue-selection.png"
                alt="Screenshot showing the Parent Issue selection dropdown in the GitAuto dashboard. The image displays the dropdown menu with available open issues that can be selected as parent issues. Take a screenshot showing the Parent Issue dropdown expanded with several issue options visible."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              Before generating tests, you can optionally select a Parent Issue. When you set a
              parent issue, GitAuto will create child issues linked to it. This allows you to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2 mb-4">
              <li>
                <strong>Define common rules</strong> - Write shared testing rules and guidelines in
                the parent issue that will be applied to all child issues
              </li>
              <li>
                <strong>Organize test generation</strong> - Group related test generation tasks
                under a single parent issue
              </li>
              <li>
                <strong>Reuse system prompts</strong> - The parent issue content serves as a system
                prompt for GitAuto when generating tests
              </li>
            </ul>
            <div className="mt-4 bg-pink-50 p-4 rounded-md">
              <p className="text-sm text-pink-800">
                <strong>Tip:</strong> You can attach up to 100 child issues to a single parent
                issue. When you reach this limit, detach closed child issues from the parent issue
                or create a new parent issue.
              </p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Learn more about{" "}
                <Link
                  href={RELATIVE_URLS.DOCS.GETTING_STARTED.PARENT_ISSUE_RULES}
                  className="text-pink-600 hover:text-pink-700 underline"
                >
                  what rules to include in parent issues
                </Link>
                .
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                6
              </div>
              <h2 className="text-xl font-semibold my-4">Select files for test generation</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/select-files-on-dashboard.png"
                alt="Screenshot showing file selection in the GitAuto dashboard. The image displays checkboxes next to file names, with some files selected (checked). Take a screenshot showing the file selection interface with multiple files checked for test generation."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              Use the checkboxes to select which files you want to generate tests for. You can
              select individual files or use the &quot;Select All&quot; option to choose all files
              at once.
            </p>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                7
              </div>
              <h2 className="text-xl font-semibold my-4">Choose your test generation approach</h2>
            </div>
            <p>
              As shown in the dashboard interface, you have two options for generating tests. Each
              approach has its own advantages depending on your workflow preferences:
            </p>

            <div className="mt-6 space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-pink-600">
                  Option 1: Create Issues Only
                </h3>
                <div className="mb-4">
                  <Image
                    src="/docs/create-issues-button-on-dashboard.png"
                    alt="Screenshot showing the 'Create Issues' button in the GitAuto dashboard. The image displays the button for creating GitHub issues only, allowing for manual triggering later."
                    width={700}
                    height={400}
                    className="w-full"
                  />
                </div>
                <p className="mb-4">
                  Click the &quot;Create Issues&quot; button to create GitHub issues for the
                  selected files. GitAuto will create one issue per selected file, and if
                  you&apos;ve set a parent issue, these will be linked as child issues.
                </p>
                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Advantages of this approach:</h4>
                  <ul className="list-disc pl-6 space-y-1 text-blue-700">
                    <li>
                      <strong>Add custom context:</strong> You can edit each issue to add specific
                      requirements, edge cases, or additional context before triggering GitAuto
                    </li>
                    <li>
                      <strong>Review before generation:</strong> Perfect for cases where you want to
                      provide detailed instructions or review the scope before test generation
                      begins
                    </li>
                    <li>
                      <strong>Flexible timing:</strong> Generate tests at your own pace by manually
                      triggering GitAuto when ready
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-gray-600">
                  After creating issues, you&apos;ll need to manually trigger GitAuto by{" "}
                  <Link
                    href={RELATIVE_URLS.DOCS.GETTING_STARTED.ISSUE_CHECKBOX_TRIGGER}
                    className="text-pink-600 hover:text-pink-700 underline"
                  >
                    checking the GitAuto checkbox
                  </Link>{" "}
                  or{" "}
                  <Link
                    href={RELATIVE_URLS.DOCS.GETTING_STARTED.ISSUE_LABEL_TRIGGER}
                    className="text-pink-600 hover:text-pink-700 underline"
                  >
                    adding the gitauto label
                  </Link>
                  .
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-pink-600">
                  Option 2: Create Issues + Pull Requests
                </h3>
                <div className="mb-4">
                  <Image
                    src="/docs/create-issues-and-prs-button-on-dashboard.png"
                    alt="Screenshot showing the 'Create Issues + PRs' button in the GitAuto dashboard. The image displays the button for creating both GitHub issues and pull requests simultaneously."
                    width={700}
                    height={400}
                    className="w-full"
                  />
                </div>
                <p className="mb-4">
                  Click the &quot;Create Issues + PRs&quot; button to automatically create both
                  GitHub issues and pull requests for the selected files. GitAuto will immediately
                  start generating test cases using coverage data and uncovered lines, functions,
                  and conditional branches.
                </p>
                <div className="bg-green-50 p-4 rounded-md mb-4">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Advantages of this approach:
                  </h4>
                  <ul className="list-disc pl-6 space-y-1 text-green-700">
                    <li>
                      <strong>Maximum efficiency:</strong> One click generates complete test suites
                      with pull requests ready for review
                    </li>
                    <li>
                      <strong>Bulk processing:</strong> Theoretically, you could generate tests for
                      all files in a single day with sufficient credits
                    </li>
                    <li>
                      <strong>Perfect for parent issues:</strong> When you have common rules defined
                      in a parent issue, this approach applies them consistently across all files
                    </li>
                    <li>
                      <strong>Immediate results:</strong> No manual intervention required - tests
                      are generated and ready for review immediately
                    </li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <strong>Best for:</strong> Teams with well-defined testing standards,
                    established parent issue rules, and the need for rapid test coverage improvement
                    across multiple files.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                8
              </div>
              <h2 className="text-xl font-semibold my-4">Monitor progress and review results</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/monitor-test-generation-progress.png"
                alt="Screenshot showing the progress monitoring interface in the GitAuto dashboard or GitHub, displaying created issues and pull requests with their current status."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              Regardless of which approach you choose, you can monitor the progress of test
              generation:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2 mb-4">
              <li>
                <strong>For Issues Only:</strong> Track when you manually trigger GitAuto and
                monitor the resulting pull request creation
              </li>
              <li>
                <strong>For Issues + PRs:</strong> Review the automatically generated pull requests,
                check test quality, and merge when satisfied
              </li>
            </ul>
            <p>
              All generated tests will include comprehensive coverage for the selected files,
              targeting uncovered lines, functions, and conditional branches identified in your
              coverage reports.
            </p>
          </div>
        </div>
      </div>

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.GETTING_STARTED.ISSUE_LABEL_TRIGGER,
          title: "GitHub Issues Label Trigger",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.GETTING_STARTED.PARENT_ISSUE_RULES,
          title: "Parent Issue Rules",
        }}
      />
    </div>
  );
}
