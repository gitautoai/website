import Link from "next/link";

import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function SetupPage() {
  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Setup</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <p className="text-lg text-gray-700">
          After installing GitAuto, follow these steps to start generating tests and tracking
          coverage for your repositories.
        </p>

        <div className="space-y-12">
          {/* Step 1 */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                1
              </div>
              <h2 className="text-xl font-semibold my-4">
                Add a CI workflow that runs tests and uploads coverage
              </h2>
            </div>
            <p className="text-gray-700 mb-4">
              GitAuto needs a GitHub Actions workflow that runs your test suite and uploads a
              coverage report as an artifact. This is how GitAuto knows which lines and branches
              your tests cover.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Automatic setup:</strong> When you install GitAuto on a single repository (or
              add a single repo to an existing installation), it detects your language/framework and
              opens a pull request with the right workflow file. Check your repo for an open PR
              titled &quot;Set up test coverage workflow&quot;.
            </p>
            <p className="text-gray-700 mb-4">
              You can also trigger this from the{" "}
              <Link
                href={RELATIVE_URLS.DASHBOARD.COVERAGE}
                className="text-pink-600 hover:text-pink-700 underline"
              >
                Coverage Dashboard
              </Link>{" "}
              or the{" "}
              <Link
                href={RELATIVE_URLS.DASHBOARD.CHARTS}
                className="text-pink-600 hover:text-pink-700 underline"
              >
                Coverage Charts
              </Link>{" "}
              page when no coverage data is available.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Manual setup:</strong> If you prefer to configure the workflow yourself,
              follow the guide for your language:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { href: RELATIVE_URLS.DOCS.COVERAGE.PYTHON, label: "Python" },
                { href: RELATIVE_URLS.DOCS.COVERAGE.JAVASCRIPT, label: "JavaScript / TS" },
                { href: RELATIVE_URLS.DOCS.COVERAGE.JAVA, label: "Java" },
                { href: RELATIVE_URLS.DOCS.COVERAGE.GO, label: "Go" },
                { href: RELATIVE_URLS.DOCS.COVERAGE.PHP, label: "PHP" },
                { href: RELATIVE_URLS.DOCS.COVERAGE.RUBY, label: "Ruby" },
                { href: RELATIVE_URLS.DOCS.COVERAGE.FLUTTER, label: "Flutter" },
                { href: RELATIVE_URLS.DOCS.COVERAGE.MULTI_LANGUAGE, label: "Multi-Language" },
              ].map((lang) => (
                <Link
                  key={lang.href}
                  href={lang.href}
                  className="block p-3 border rounded-lg hover:border-pink-600 text-center text-sm font-medium text-gray-700 hover:text-pink-600"
                >
                  {lang.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                2
              </div>
              <h2 className="text-xl font-semibold my-4">Check your coverage and set a goal</h2>
            </div>
            <p className="text-gray-700 mb-4">
              The real goals are fewer bugs, less review burden, confidence when merging, and faster
              releases. Those are hard to measure directly, so we track test coverage as a practical
              proxy - not perfect, but simple and actionable.
            </p>
            <p className="text-gray-700 mb-4">
              Once your CI workflow uploads coverage, check the{" "}
              <Link
                href={RELATIVE_URLS.DASHBOARD.CHARTS}
                className="text-pink-600 hover:text-pink-700 underline"
              >
                Coverage Charts
              </Link>{" "}
              to see where you stand. Then set a target - 80% is the common standard, 90%+ for
              regulated codebases (fintech, healthcare), 95%+ for safety-critical systems
              (aerospace, automotive, medical devices).
            </p>
          </div>

          {/* Step 3 */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                3
              </div>
              <h2 className="text-xl font-semibold my-4">Enable the schedule trigger</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Enable the schedule trigger on the{" "}
              <Link
                href={RELATIVE_URLS.SETTINGS.TRIGGERS}
                className="text-pink-600 hover:text-pink-700 underline"
              >
                Triggers settings page
              </Link>
              . GitAuto will start creating test PRs on a recurring schedule, and you just review
              and merge.
            </p>
            <p className="text-gray-700 mb-4">
              To decide how many times per day to set, open the{" "}
              <Link
                href={RELATIVE_URLS.DASHBOARD.COVERAGE}
                className="text-pink-600 hover:text-pink-700 underline"
              >
                Coverage Dashboard
              </Link>{" "}
              and count how many files still need coverage. Work backwards from your goal: say you
              have 500 files below 90% and want to reach your target in 3 months - that&#39;s
              roughly 60 business days, so you&#39;d set it to 8-10 times per day.
            </p>
            <ul className="list-disc list-outside space-y-2 text-gray-700 ml-5">
              <li>
                <strong>
                  <Link
                    href={RELATIVE_URLS.DOCS.TRIGGERS.SCHEDULE}
                    className="text-pink-600 hover:text-pink-700 underline"
                  >
                    Schedule
                  </Link>
                </strong>{" "}
                (set-and-forget) - GitAuto creates test PRs on a recurring schedule.
                <ul className="list-['\2013\20'] list-outside space-y-1 ml-5 mt-2">
                  <li>
                    <Link
                      href={RELATIVE_URLS.DOCS.TRIGGERS.TEST_FAILURE}
                      className="text-pink-600 hover:text-pink-700 underline"
                    >
                      Test failure
                    </Link>{" "}
                    (set-and-forget) - Automatically fixes failing tests in the PR
                  </li>
                  <li>
                    <Link
                      href={RELATIVE_URLS.DOCS.TRIGGERS.REVIEW_COMMENT}
                      className="text-pink-600 hover:text-pink-700 underline"
                    >
                      Review comment
                    </Link>{" "}
                    (on-demand) - Leave comments on the PR to request changes
                  </li>
                </ul>
              </li>
              <li>
                <strong>
                  <Link
                    href={RELATIVE_URLS.DOCS.TRIGGERS.DASHBOARD}
                    className="text-pink-600 hover:text-pink-700 underline"
                  >
                    Dashboard
                  </Link>
                </strong>{" "}
                (on-demand) - Select files on the Coverage Dashboard and click &quot;Create
                PRs&quot;.
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              For all available triggers, see the{" "}
              <Link
                href={RELATIVE_URLS.DOCS.TRIGGERS.OVERVIEW}
                className="text-pink-600 hover:text-pink-700 underline"
              >
                Triggers Overview
              </Link>
              .
            </p>
          </div>

          {/* Step 4 */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                4
              </div>
              <h2 className="text-xl font-semibold my-4">Review, merge, repeat</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Check the PRs GitAuto creates. Make sure tests ran and are passing, review the
              changes, and merge if they look good. Repeat this cycle until you reach your target
              coverage.
            </p>
          </div>

          {/* Step 5 */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                5
              </div>
              <h2 className="text-xl font-semibold my-4">Scale up</h2>
            </div>
            <p className="text-gray-700 mb-4">
              Once you&#39;re happy with the results,{" "}
              <Link
                href={RELATIVE_URLS.DASHBOARD.CREDITS}
                className="text-pink-600 hover:text-pink-700 underline"
              >
                buy more credits
              </Link>{" "}
              to ramp up - more PRs per day, more repos.
            </p>
          </div>
        </div>
      </div>

      <DocsContact
        title="Need Help with Setup?"
        description="Every codebase is different. If you're unsure which workflow to use, or if your CI setup is non-standard, we can help you get coverage running."
        callToAction="Contact us"
        linkText="and we'll get you set up!"
      />

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.GETTING_STARTED.INSTALLATION,
          title: "Installation",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.OVERVIEW,
          title: "Triggers Overview",
        }}
      />
    </div>
  );
}
