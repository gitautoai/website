// Third-party imports
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Local imports
import { RELATIVE_URLS } from "@/config/urls";

export const metadata: Metadata = {
  title: "GitHub Issues Checkbox - Getting Started with GitAuto",
  description: "Learn how to use GitHub issues to trigger GitAuto test generation.",
};

export default function IssueCheckboxTriggerPage() {
  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Generate Tests Using GitHub Issues</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <p className="text-lg text-gray-700">
          After installing GitAuto, you can create tests directly from GitHub issues with a few
          simple steps.
        </p>

        <div className="space-y-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                1
              </div>
              <h2 className="text-xl font-semibold my-4">Create a new GitHub issue</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/new-issue-button-on-github.png"
                alt="Screenshot showing the GitHub 'New Issue' page. The image displays the issue creation form with fields for title and description. Take a screenshot of your repository's issue creation page with a sample title like 'Generate tests for user authentication'."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              Create a new issue in your GitHub repository. The title can be anything descriptive
              about what you want to test.
            </p>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                2
              </div>
              <h2 className="text-xl font-semibold my-4">Check the GitAuto checkbox</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/gitauto-checkbox.png"
                alt="Screenshot showing a GitHub issue with GitAuto's automated comment containing a checkbox. The image shows an issue thread where GitAuto has added a comment that contains a checkbox labeled 'Generate tests with GitAuto'. The screenshot should show the checkbox both unchecked and then checked."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              GitAuto will automatically add a comment to your issue with a checkbox. Check this box
              to trigger GitAuto to analyze your issue and generate test cases and a pull request.
            </p>
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> For existing issues without the GitAuto checkbox, you can add
                the &quot;gitauto&quot; label to trigger the same functionality. No worries,
                I&apos;ll get into the details next.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                3
              </div>
              <h2 className="text-xl font-semibold my-4">Review and merge the pull request</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/review-pr.png"
                alt="Screenshot showing the pull request created by GitAuto. The image displays a GitHub pull request page with code changes for the generated tests. Take a screenshot of a sample PR that shows test files being added with visible code changes."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              GitAuto will create a pull request with the generated tests. Review the code, make any
              necessary adjustments, and merge the pull request to add the tests to your repository.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <Link
            href={RELATIVE_URLS.DOCS.GETTING_STARTED.INSTALLATION}
            className="flex items-center text-pink-600 hover:text-pink-700 font-medium"
          >
            <FaChevronLeft className="h-5 w-5 mr-1" />
            <span>Installation</span>
          </Link>

          <Link
            href={RELATIVE_URLS.DOCS.GETTING_STARTED.ISSUE_LABEL_TRIGGER}
            className="flex items-center text-pink-600 hover:text-pink-700 font-medium"
          >
            <span>GitHub Issues Label Trigger</span>
            <FaChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
