// Third-party imports
import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Local imports
import { RELATIVE_URLS } from "@/config/urls";

export default function IssueLabelTriggerPage() {
  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Generate Tests Using GitHub Issue Labels</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <p className="text-lg text-gray-700">
          GitAuto can be triggered by adding a &quot;gitauto&quot; label to any GitHub issue. This
          is especially useful for existing issues or when creating issues programmatically.
        </p>

        <div className="space-y-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                1
              </div>
              <h2 className="text-xl font-semibold my-4">Find or create a GitHub issue</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/label-trigger-issue.png"
                alt="Screenshot showing a GitHub issue page. The image displays an open issue with its title, description, and the right sidebar containing various options."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              Navigate to an existing issue or create a new one in your GitHub repository. You can
              use any issue - both new ones and those created before GitAuto was installed.
            </p>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                2
              </div>
              <h2 className="text-xl font-semibold my-4">Add the &quot;gitauto&quot; label</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/add-gitauto-label.png"
                alt="Screenshot showing how to add the 'gitauto' label. The image shows the GitHub issue's right sidebar with the Labels section expanded. The cursor is typing 'gitauto' in the label search field, and the label might not exist yet but can be created on-the-fly."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              In the right sidebar of the issue, click on the gear icon next to &quot;Labels&quot;
              and type &quot;gitauto&quot; in the search field. If the label doesn&apos;t exist yet,
              GitHub will let you create it on the fly by clicking on &quot;Create new label&quot;
              or pressing Enter.
            </p>
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> If you&apos;re creating the label for the first time,
                you&apos;ll need to set a color for it. Any color works - GitAuto only cares about
                the label name &quot;gitauto&quot; (case insensitive).
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                3
              </div>
              <h2 className="text-xl font-semibold my-4">GitAuto analyzes and responds</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/gitauto-response.png"
                alt="Screenshot showing GitAuto's response as a comment in the issue. The image displays GitAuto's automated comment that acknowledges it's analyzing the issue and will create tests."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              Once the label is added, GitAuto will automatically analyze the issue and add a
              comment acknowledging that it&apos;s working on generating tests. This typically
              happens within a minute of adding the label.
            </p>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                4
              </div>
              <h2 className="text-xl font-semibold my-4">Review and merge the pull request</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/label-trigger-pr.png"
                alt="Screenshot showing the pull request created by GitAuto. The image displays a GitHub pull request page with the code changes, showing the newly generated test files."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              GitAuto will create a pull request with the generated tests. The PR will be linked in
              a comment on the issue. Review the code, make any necessary adjustments, and merge the
              pull request to add the tests to your repository.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
            <h3 className="text-xl font-bold mb-4">Automating with GitHub Issue Labels</h3>
            <p>The label-based trigger is especially powerful for automation workflows:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong>Integration with external tools:</strong> Tools like Sentry, Jira, or other
                issue trackers can be configured to automatically create GitHub issues with the
                &quot;gitauto&quot; label when certain events occur.
              </li>
              <li>
                <strong>Automated testing workflows:</strong> You can set up GitHub Actions or other
                CI/CD workflows to add the &quot;gitauto&quot; label to issues based on specific
                criteria, triggering test generation automatically.
              </li>
              <li>
                <strong>Legacy issues:</strong> For repositories with many existing issues created
                before GitAuto was installed, you can batch-add the &quot;gitauto&quot; label to
                generate tests for multiple issues at once.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <Link
            href={RELATIVE_URLS.DOCS.GETTING_STARTED.ISSUE_CHECKBOX_TRIGGER}
            className="flex items-center text-pink-600 hover:text-pink-700 font-medium"
          >
            <FaChevronLeft className="h-5 w-5 mr-1" />
            <span>GitHub Issues Checkbox Trigger</span>
          </Link>

          <Link
            href={RELATIVE_URLS.DOCS.GETTING_STARTED.DASHBOARD_TRIGGER}
            className="flex items-center text-pink-600 hover:text-pink-700 font-medium"
          >
            <span>Dashboard Trigger</span>
            <FaChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
