import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
                src="/docs/select-files.png"
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
              <h2 className="text-xl font-semibold my-4">Create GitHub issues</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/create-issues.png"
                alt="Screenshot showing the 'Create Issues' button and the issue creation process in the GitAuto dashboard. The image displays the button being clicked and potentially a confirmation dialog or progress indicator. Take a screenshot showing the issue creation action being performed."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              Click the &quot;Create Issues&quot; button to create GitHub issues for the selected
              files. GitAuto will create one issue per selected file, and if you&apos;ve set a
              parent issue, these will be linked as child issues.
            </p>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                8
              </div>
              <h2 className="text-xl font-semibold my-4">Assign issues to GitAuto</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/assign-to-gitauto.png"
                alt="Screenshot showing GitHub issues being assigned to GitAuto. The image displays the GitHub issue page with the assignee dropdown open, showing GitAuto as an option to assign. Take a screenshot showing the assignment process or GitAuto already assigned to an issue."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              Navigate to the created GitHub issues and assign them to GitAuto. Once assigned,
              GitAuto will automatically analyze the code and generate test cases, creating pull
              requests with the generated tests.
            </p>
          </div>
        </div>
      </div>

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
