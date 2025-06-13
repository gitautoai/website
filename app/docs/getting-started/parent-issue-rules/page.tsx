import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { RELATIVE_URLS } from "@/config/urls";

export const metadata: Metadata = {
  title: "Parent Issue Rules - Getting Started with GitAuto",
  description:
    "Learn how to write effective parent issue rules for consistent test generation with GitAuto.",
};

export default function ParentIssueRulesPage() {
  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Parent Issue Rules</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <p className="text-lg text-gray-700">
          Parent issues allow you to define common rules and guidelines that GitAuto will apply when
          generating tests for child issues. This ensures consistency across all your test
          generation tasks.
        </p>

        <div className="space-y-8">
          {/* What are Parent Issues */}
          <div>
            <h2 className="text-xl font-semibold mb-4">What are Parent Issues?</h2>
            <p>
              Parent issues serve as templates that contain shared rules, coding standards, and
              guidelines. When you create child issues for test generation, GitAuto uses the parent
              issue content as a system prompt, ensuring all generated tests follow the same
              standards.
            </p>
            <div className="mt-4 bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Benefits:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2 text-sm text-blue-800">
                <li>Consistent test quality across your entire codebase</li>
                <li>No need to repeat common instructions in each issue</li>
                <li>Easy to update rules for all future test generations</li>
                <li>Better organization of related test generation tasks</li>
              </ul>
            </div>
          </div>

          {/* How to Use */}
          <div>
            <h2 className="text-xl font-semibold mb-4">How to Use Parent Issues</h2>
            <div className="mb-5">
              <Image
                src="/docs/parent-issue-example-on-github.png"
                alt="Screenshot showing an example parent issue with test coding rules, file path rules, and constant rules clearly defined. The image displays a GitHub issue with well-structured sections for different types of rules."
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Create a new GitHub issue in your repository</li>
              <li>Add comprehensive rules and guidelines (see examples below)</li>
              <li>Keep the issue open - GitAuto only shows open issues as parent options</li>
              <li>
                Select this issue as the parent when using the{" "}
                <Link
                  href={RELATIVE_URLS.DASHBOARD.COVERAGE}
                  className="text-pink-600 hover:text-pink-700 underline"
                >
                  dashboard
                </Link>
              </li>
              <li>All child issues will inherit these rules automatically</li>
            </ol>
          </div>

          {/* Example Rules */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Example Parent Issue Rules</h2>
            <p className="mb-4">
              Here&apos;s a comprehensive example of what to include in your parent issue:
            </p>

            <div className="bg-gray-50 p-6 rounded-lg border">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">## Test Coding Rule</h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                    <li>
                      Do not use `class` in test code. Always prefer plain `function` style, even
                      for mocks.
                    </li>
                    <li>Ensure **comprehensive test coverage**, including extreme edge cases.</li>
                    <li>No comments in the code.</li>
                    <li>No corresponding URLs in the code.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    ## Test File Path Rule
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                    <li>
                      Place test files next to the target files instead of creating a separate tests
                      folder. Do not use dedicated test directories like `tests/` or `__tests__`
                    </li>
                    <li>Name test files with the pattern `test_{"{original_filename}"}.py`</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    ## Test Constant Rule
                  </h3>
                  <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
                    <li>Use `OWNER` in `tests/constants.py` for an owner</li>
                    <li>Use `REPO` in `tests/constants.py` for a repo</li>
                    <li>
                      Use `FORKED_REPO` in `tests/constants.py` for a forked repo if necessary
                    </li>
                    <li>Use `TOKEN` in `tests/constants.py` for a token</li>
                    <li>
                      If you introduce any test constant used more than once, define it in
                      tests/constants.py and reference it from there.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Structure Your Rules</h3>
                <p className="text-gray-700">
                  Organize your rules into clear sections using markdown headers. This makes them
                  easier to read and maintain.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Be Specific</h3>
                <p className="text-gray-700">
                  Include specific examples and patterns. The more detailed your rules, the more
                  consistent your generated tests will be.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Update Regularly</h3>
                <p className="text-gray-700">
                  As you learn what works best for your project, update the parent issue rules. All
                  future child issues will use the updated rules.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Language-Specific Rules</h3>
                <p className="text-gray-700">
                  Create separate parent issues for different programming languages if your
                  repository is multilingual.
                </p>
              </div>
            </div>
          </div>

          {/* Limitations */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Limitations</h2>
            <div className="bg-yellow-50 p-4 rounded-md">
              <ul className="list-disc pl-6 space-y-2 text-sm text-yellow-800">
                <li>
                  <strong>100 Child Issue Limit:</strong> Each parent issue can have a maximum of
                  100 child issues attached to it.
                </li>
                <li>
                  <strong>Open Issues Only:</strong> Only open GitHub issues appear in the parent
                  issue dropdown.
                </li>
                <li>
                  <strong>Repository Scope:</strong> Parent issues must be in the same repository as
                  the files you&apos;re testing.
                </li>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">When You Reach the Limit</h3>
              <p className="text-gray-700 mb-2">
                When you approach 100 child issues, you have several options:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Close completed child issues to free up slots</li>
                <li>Create a new parent issue by copying the rules from the current one</li>
                <li>Archive old child issues that are no longer relevant</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <Link
            href={RELATIVE_URLS.DOCS.GETTING_STARTED.DASHBOARD_TRIGGER}
            className="flex items-center text-pink-600 hover:text-pink-700 font-medium"
          >
            <FaChevronLeft className="h-5 w-5 mr-1" />
            <span>Dashboard Trigger</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
