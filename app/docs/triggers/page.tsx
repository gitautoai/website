import Link from "next/link";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { RELATIVE_URLS } from "@/config/urls";

export default function TriggersOverviewPage() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Triggers Overview</h1>

      <div className="prose prose-lg max-w-none space-y-12">
        <p className="text-lg text-gray-700">
          GitAuto offers various trigger types that automatically generate unit tests based on
          different events in your development workflow.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mt-0 mb-4">Issue Checkbox Trigger</h2>
            <p className="text-gray-700">
              Trigger GitAuto by checking a box in GitHub issues. Simple and straightforward way to
              request unit tests for specific files.{" "}
              <Link
                href={RELATIVE_URLS.DOCS.TRIGGERS.ISSUE_CHECKBOX}
                className="text-pink-600 hover:text-pink-700"
              >
                Learn more →
              </Link>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mt-0 mb-4">Issue Label Trigger</h2>
            <p className="text-gray-700">
              Trigger GitAuto by adding the &quot;gitauto&quot; label to GitHub issues. Works with
              existing issues and supports API/workflow automation.{" "}
              <Link
                href={RELATIVE_URLS.DOCS.TRIGGERS.ISSUE_LABEL}
                className="text-pink-600 hover:text-pink-700"
              >
                Learn more →
              </Link>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mt-0 mb-4">Dashboard Trigger</h2>
            <p className="text-gray-700">
              Trigger GitAuto from the{" "}
              <Link
                href={RELATIVE_URLS.DASHBOARD.COVERAGE}
                className="text-pink-600 hover:text-pink-700"
              >
                coverage dashboard
              </Link>{" "}
              by selecting specific files. Perfect for targeted test generation based on coverage
              data.{" "}
              <Link
                href={RELATIVE_URLS.DOCS.TRIGGERS.DASHBOARD}
                className="text-pink-600 hover:text-pink-700"
              >
                Learn more →
              </Link>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mt-0 mb-4">Review Comment Trigger</h2>
            <p className="text-gray-700">
              Request fixes on GitAuto-created PRs by leaving review comments. GitAuto responds with
              automatic fix commits just like collaborating with team members.{" "}
              <Link
                href={RELATIVE_URLS.DOCS.TRIGGERS.REVIEW_COMMENT}
                className="text-pink-600 hover:text-pink-700"
              >
                Learn more →
              </Link>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mt-0 mb-4">Test Failure Trigger</h2>
            <p className="text-gray-700">
              Automatically analyzes failed CI/CD workflows on GitAuto PRs and creates fix commits.
              Includes smart workflow cancellation to prevent resource waste.{" "}
              <Link
                href={RELATIVE_URLS.DOCS.TRIGGERS.TEST_FAILURE}
                className="text-pink-600 hover:text-pink-700"
              >
                Learn more →
              </Link>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mt-0 mb-4">Schedule Trigger</h2>
            <p className="text-gray-700">
              Automatically generates unit tests on a set schedule, prioritizing files with the
              lowest test coverage. Perfect for maintaining consistent test coverage improvements.{" "}
              <Link
                href={RELATIVE_URLS.DOCS.TRIGGERS.SCHEDULE}
                className="text-pink-600 hover:text-pink-700"
              >
                Learn more →
              </Link>
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-8">
          <h2 className="text-2xl font-semibold mt-0 mb-4">Getting Started</h2>
          <p className="text-gray-700 mb-4">To configure triggers:</p>
          <ol className="text-gray-700 space-y-2">
            <li>
              1. Go to your{" "}
              <Link
                href={RELATIVE_URLS.SETTINGS.TRIGGERS}
                className="text-pink-600 hover:text-pink-700"
              >
                Trigger Settings
              </Link>
            </li>
            <li>2. Select the repository you want to configure</li>
            <li>3. Enable the triggers that fit your workflow</li>
          </ol>
        </div>
      </div>

      <DocsContact
        title="Trigger Overload?"
        description="With 6 different triggers, it's easy to feel overwhelmed! Each team's workflow is unique, and what works for one project might not work for another. Let's find your perfect trigger combination."
        callToAction="Contact us"
        linkText="and we'll design your ideal workflow!"
      />

      <DocsNavigation
        nextLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.ISSUE_CHECKBOX,
          title: "Issue Checkbox Trigger",
        }}
      />
    </div>
  );
}
