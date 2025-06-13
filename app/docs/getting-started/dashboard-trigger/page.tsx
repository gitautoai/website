import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { RELATIVE_URLS } from "@/config/urls";

export const metadata: Metadata = {
  title: "Dashboard Trigger - Getting Started with GitAuto",
  description: "Learn how to use the GitAuto dashboard to generate tests for your repositories.",
};

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
          {/* Step 1 */}
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

          {/* Step 2 */}
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

          {/* Step 3 */}
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

          {/* Step 4 */}
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
              will display a list of files in your repository. If you've integrated with coverage
              reports, you'll also see coverage percentages for each file.
            </p>
          </div>

          {/* Step 5 - Parent Issue */}
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

          {/* Step 6 */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                6
              </div>
              <h2 className="text-xl font-semibold my-4">Generate tests</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/generate-tests.png"
                alt="Screenshot showing the test generation interface. The image displays several files selected with checkboxes and the Actions dropdown menu expanded, showing options for 'Create Issue Only' and 'Create Issue & PR'. Take a screenshot with files selected and the Actions menu open to show these options."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              Select files you want to test by checking the boxes next to them. We recommend
              starting with smaller files. Then click the pink &quot;Actions&quot; button and choose
              either:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong>Create Issue Only</strong> - Creates a GitHub issue for review before
                generating tests
              </li>
              <li>
                <strong>Create Issue & PR</strong> - Creates both an issue and generates a pull
                request with tests immediately
              </li>
            </ul>
          </div>

          {/* Step 7 */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                7
              </div>
              <h2 className="text-xl font-semibold my-4">Review on GitHub</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/go-to-github-issue.png"
                alt="Screenshot showing the dashboard after test generation with links to GitHub issues. The image displays the file list with GitHub issue links next to files that have had tests generated. The screenshot should show these links in the dashboard interface, indicating successful test generation."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              Once successful, issue URLs will be linked to the files in the{" "}
              <Link
                href={RELATIVE_URLS.DASHBOARD.COVERAGE}
                className="text-pink-600 hover:text-pink-700 underline"
              >
                dashboard
              </Link>
              . Click these links to go to GitHub issues where you can review the generated tests.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <Link
            href={RELATIVE_URLS.DOCS.GETTING_STARTED.ISSUE_LABEL_TRIGGER}
            className="flex items-center text-pink-600 hover:text-pink-700 font-medium"
          >
            <FaChevronLeft className="h-5 w-5 mr-1" />
            <span>GitHub Issues Label Trigger</span>
          </Link>
          <Link
            href={RELATIVE_URLS.DOCS.GETTING_STARTED.PARENT_ISSUE_RULES}
            className="flex items-center text-pink-600 hover:text-pink-700 font-medium"
          >
            <span>Parent Issue Rules</span>
            <FaChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
