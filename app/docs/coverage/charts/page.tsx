import Image from "next/image";
import Link from "next/link";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function CoverageChartsPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Coverage Charts</h1>

      <div className="space-y-12">
        <section>
          <p className="text-lg text-gray-700 mb-6">
            Track your test coverage progress over time with GitAuto&apos;s{" "}
            <Link
              href={RELATIVE_URLS.DASHBOARD.CHARTS}
              className="text-pink-600 hover:text-pink-700 underline"
            >
              Coverage Charts
            </Link>
            . Visualize your journey from low coverage to high-quality, well-tested code.
          </p>
          <Image
            src="/docs/coverage/dummy-chart.png"
            alt="Coverage Charts"
            width={1000}
            height={1000}
          />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-0 mb-4">What are Coverage Charts?</h2>
          <p className="text-gray-700 mb-4">
            Coverage Charts provide a visual representation of your test coverage evolution, helping
            you understand trends, track improvements, and identify areas that need attention.
          </p>
          <p className="text-gray-700 mb-4">
            You should focus on <strong>Statement Coverage</strong> - the most fundamental coverage
            metric that shows which lines of code are executed by your tests.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Why Focus on Statement Coverage?</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              While there are three main types of coverage (Statement, Function, and Branch),
              Statement Coverage is your starting point for several reasons:
            </p>
            <ul className="list-disc list-outside space-y-2 text-gray-700 ml-5">
              <li>
                <strong>Foundation First:</strong> Statement coverage ensures basic code execution,
                forming the foundation for more advanced coverage types
              </li>
              <li>
                <strong>Immediate Impact:</strong> It&apos;s the most straightforward to understand
                and improve, giving you quick wins
              </li>
              <li>
                <strong>Practical Targets:</strong> Industry standards suggest 80% as a good target,
                90% as excellent - 100% is often unnecessary and can be counterproductive
              </li>
              <li>
                <strong>Universal Understanding:</strong> Anyone can grasp the concept - from
                developers to business stakeholders and executives.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Setting Coverage Goals</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Recommended Coverage Targets</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                🎯 <strong>80%</strong> - Good coverage, solid foundation
              </li>
              <li>
                🏆 <strong>90%</strong> - Excellent coverage, high confidence
              </li>
              <li>
                ⚠️ <strong>100%</strong> - Usually unnecessary, can become counterproductive
              </li>
            </ul>
          </div>
          <p className="text-gray-700 mb-4">
            Remember: As coverage percentage increases, the effort required grows exponentially.
            Focus on meaningful tests rather than chasing perfect numbers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Planning Your Coverage Journey</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Step 1: Assess Current State</h3>
              <ul className="list-disc list-outside space-y-2 text-gray-700 ml-5">
                <li>Check your current coverage percentage</li>
                <li>Identify total number of files in your codebase</li>
                <li>Determine which files have the lowest coverage</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Step 2: Set Realistic Goals</h3>
              <ul className="list-disc list-outside space-y-2 text-gray-700 ml-5">
                <li>Define your target coverage percentage (aim for 80%, then 90%)</li>
                <li>Set a realistic deadline for achieving your goal</li>
                <li>Calculate daily/weekly improvement needed</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Step 3: Configure GitAuto Schedule</h3>
              <p className="text-gray-700 mb-3">
                Use GitAuto&apos;s{" "}
                <Link
                  href={RELATIVE_URLS.DOCS.TRIGGERS.SCHEDULE}
                  className="text-pink-600 hover:text-pink-700 underline"
                >
                  Schedule Trigger
                </Link>{" "}
                to automate your coverage improvements:
              </p>
              <ul className="list-disc list-outside space-y-2 text-gray-700 ml-5">
                <li>Calculate execution frequency: Days remaining ÷ Files to improve</li>
                <li>Add buffer time for AI limitations and code complexity</li>
                <li>Account for files that might need refactoring before testing</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Preparing Your Codebase</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">⚠️ Important Considerations</h3>
            <p className="text-gray-700 mb-3">
              AI isn&apos;t perfect yet. Your codebase&apos;s structure significantly impacts test
              generation success:
            </p>
            <ul className="list-disc list-outside space-y-2 text-gray-700 ml-5">
              <li>
                <strong>File Length:</strong> Extremely long files are harder to test
                comprehensively
              </li>
              <li>
                <strong>Function Complexity:</strong> Files with many functions increase test
                complexity
              </li>
              <li>
                <strong>Multiple Responsibilities:</strong> Files doing too many things create
                complex, hard-to-read tests
              </li>
              <li>
                <strong>Tight Coupling:</strong> Highly coupled code makes testing and mocking
                difficult
              </li>
            </ul>
          </div>
          <p className="text-gray-700">
            Consider refactoring problematic files before running GitAuto to improve success rates
            and test quality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Using the Charts</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Accessing Coverage Charts</h3>
              <p className="text-gray-700 mb-3">
                Navigate to the{" "}
                <Link
                  href={RELATIVE_URLS.DASHBOARD.CHARTS}
                  className="text-pink-600 hover:text-pink-700 underline"
                >
                  Coverage Charts
                </Link>{" "}
                from your dashboard to view your coverage trends over time.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Interpreting the Data</h3>
              <ul className="list-disc list-outside space-y-2 text-gray-700 ml-5">
                <li>
                  <strong>Trend Lines:</strong> Look for consistent upward trends in coverage
                  percentage
                </li>
                <li>
                  <strong>Plateaus:</strong> Flat periods might indicate need for strategy
                  adjustment
                </li>
                <li>
                  <strong>Dips:</strong> Temporary decreases are normal when adding new uncovered
                  code
                </li>
                <li>
                  <strong>Progress Rate:</strong> Track whether you&apos;re meeting your timeline
                  goals
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Taking Action</h3>
              <p className="text-gray-700 mb-3">Use the charts to guide your next steps:</p>
              <ul className="list-disc list-outside space-y-2 text-gray-700 ml-5">
                <li>If progress is slow, consider increasing GitAuto schedule frequency</li>
                <li>If tests are failing frequently, focus on code refactoring first</li>
                <li>If coverage is improving steadily, maintain your current approach</li>
                <li>When you hit your target, celebrate and share your success!</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Success Stories</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">🎉 Share Your Achievement!</h3>
            <p className="text-gray-700 mb-3">
              When you successfully improve your coverage, don&apos;t keep it to yourself:
            </p>
            <ul className="list-disc list-outside space-y-2 text-gray-700 ml-5">
              <li>
                <strong>Internal Recognition:</strong> Share progress with your team and management
              </li>
              <li>
                <strong>External Visibility:</strong> Post about your success on social media or
                tech blogs
              </li>
              <li>
                <strong>Help GitAuto:</strong> Tell us about your journey - we love hearing success
                stories!
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              Your success story can inspire other teams and help improve GitAuto for everyone.{" "}
              <Link
                href={RELATIVE_URLS.CONTACT}
                className="text-pink-600 hover:text-pink-700 underline"
              >
                Contact us
              </Link>{" "}
              to share your coverage improvement journey!
            </p>
          </div>
        </section>
      </div>

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.COVERAGE.FLUTTER,
          title: "Flutter Testing",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.DASHBOARD,
          title: "Dashboard Trigger",
        }}
      />
    </>
  );
}
