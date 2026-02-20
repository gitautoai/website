import Image from "next/image";
import Link from "next/link";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { RELATIVE_URLS } from "@/config/urls";

export default function DashboardTriggerPage() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard Trigger</h1>

      <div className="prose prose-lg max-w-none space-y-12">
        {/* What */}
        <div>
          <p className="text-lg text-gray-700">
            Trigger GitAuto from the{" "}
            <Link
              href={RELATIVE_URLS.DASHBOARD.COVERAGE}
              className="text-pink-600 hover:text-pink-700 underline"
            >
              coverage dashboard
            </Link>{" "}
            by selecting specific files. This method provides a visual interface for targeted test
            generation with coverage data insights.
          </p>
        </div>

        {/* Why */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Why use the dashboard trigger?</h2>

          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="text-pink-600 font-semibold">Visual File Selection:</span> Browse
              your repository files with coverage percentages displayed, making it easy to identify
              which files need tests.
            </p>

            <p className="text-gray-700">
              <span className="text-rose-600 font-semibold">Bulk Operations:</span> Select multiple
              files at once and create issues for all of them simultaneously, saving time on large
              repositories.
            </p>

            <p className="text-gray-700">
              <span className="text-fuchsia-600 font-semibold">Perfect for:</span> Teams managing
              large codebases and QA managers tracking coverage metrics systematically.
            </p>
          </div>
        </div>

        {/* How */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">How to use the dashboard trigger</h2>

          <div className="space-y-8">
            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">
                  Sign in to the GitAuto dashboard
                </h3>
                <p className="text-gray-700 mb-3">
                  Click the &quot;Sign in&quot; button in the top right corner and authenticate with
                  your GitHub account.
                </p>
                <Image
                  src="/docs/sign-in.png"
                  alt="Screenshot of the GitAuto dashboard sign in page with the sign in button"
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
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Select your repository</h3>
                <p className="text-gray-700 mb-3">
                  Select your GitHub organization and repository from the dropdown menus. Only
                  repositories where GitAuto is installed will be displayed.
                </p>
                <Image
                  src="/docs/select-repo.png"
                  alt="Screenshot showing the repository selection interface with organization and repository dropdowns"
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
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Browse repository files</h3>
                <p className="text-gray-700 mb-3">
                  The dashboard displays a list of files in your repository. If you&apos;ve
                  integrated coverage reports, you&apos;ll see coverage percentages for each file.
                </p>
                <Image
                  src="/docs/file-list.png"
                  alt="Screenshot showing the file list view with coverage percentages and selection checkboxes"
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
                  Select files and generate tests
                </h3>
                <p className="text-gray-700 mb-3">
                  Check the boxes next to the files you want to generate tests for, then click the
                  &quot;Actions&quot; button and select &quot;Create Issues&quot; to trigger
                  GitAuto.
                </p>
                <Image
                  src="/docs/select-files-on-dashboard.png"
                  alt="Screenshot showing file selection with checkboxes and the Actions button"
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
          Ready to explore your codebase?{" "}
          <Link
            href={RELATIVE_URLS.DASHBOARD.COVERAGE}
            className="text-pink-600 hover:text-pink-700 underline"
          >
            Visit the coverage dashboard
          </Link>{" "}
          and start selecting files for targeted test generation. Or learn more about the{" "}
          <Link
            href={RELATIVE_URLS.DOCS.COVERAGE.OVERVIEW}
            className="text-pink-600 hover:text-pink-700 underline"
          >
            coverage dashboard
          </Link>{" "}
          to see how to use the coverage dashboard. Once you start improving your coverage, track
          your progress with the{" "}
          <Link
            href={RELATIVE_URLS.DOCS.COVERAGE.CHARTS}
            className="text-pink-600 hover:text-pink-700 underline"
          >
            Coverage Charts
          </Link>
        </p>
      </div>

      <DocsContact
        title="Dashboard Looking Empty?"
        description="Empty coverage in your dashboard usually means your coverage reports aren't making it through the pipeline. It's like having a beautiful sports car with no gas. Let's get your data flowing!"
        callToAction="Contact us"
        linkText="and fill up that dashboard!"
      />

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.ISSUE_LABEL,
          title: "Issue Label Trigger",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.REVIEW_COMMENT,
          title: "Review Comment Trigger",
        }}
      />
    </div>
  );
}
