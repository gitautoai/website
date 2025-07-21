import Image from "next/image";
import Link from "next/link";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { RELATIVE_URLS } from "@/config/urls";
import { CREDIT_PRICING } from "@/config/pricing";
import { ALLOWED_INTERVALS, MAX_EXECUTIONS } from "@/config/schedule";

export default function ScheduleTriggerPage() {
  const monthlyRequests = 100;
  const exampleExecutions = 5;
  const costForRequests = monthlyRequests * CREDIT_PRICING.PER_PR.AMOUNT_USD;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Schedule Trigger</h1>

      <div className="prose prose-lg max-w-none space-y-12">
        {/* What */}
        <div>
          <p className="text-lg text-gray-700">
            The Schedule Trigger automatically generates unit tests at specified times, targeting
            files with the lowest test coverage. It runs consistently without manual intervention,
            prioritizing files by coverage percentage, file size, and alphabetical order.
          </p>
        </div>

        {/* Why */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Why use the schedule trigger?</h2>

          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="text-rose-600 font-semibold">Consistent Progress:</span> Unlike human
              QA engineers who may be inconsistent or get pulled into other tasks, GitAuto runs
              exactly as scheduled every day, ensuring steady test coverage improvements.
            </p>

            <p className="text-gray-700">
              <span className="text-pink-600 font-semibold">Smart Prioritization:</span>{" "}
              Automatically targets the most impactful files first - those with the lowest coverage
              and smallest size - maximizing your coverage improvements with minimal effort.
            </p>

            <p className="text-gray-700">
              <span className="text-fuchsia-600 font-semibold">Cost Effective:</span>{" "}
              {exampleExecutions} files per day × 20 workdays = {monthlyRequests} files with tests
              per month for ${costForRequests}/month vs. hiring a dedicated QA engineer at
              $5,000+/month who may not consistently deliver {exampleExecutions} files per day.
            </p>

            <p className="text-gray-700">
              <span className="text-purple-600 font-semibold">Perfect for:</span> Large codebases
              needing consistent coverage improvements, teams wanting gradual progress over
              event-driven testing, and organizations seeking to minimize manual intervention in
              test generation.
            </p>
          </div>
        </div>

        {/* How */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">How to use the schedule trigger</h2>

          <div className="space-y-8">
            <div className="flex items-start">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Navigate to Settings</h3>
                <p className="text-gray-700">
                  Go to your{" "}
                  <Link
                    href={RELATIVE_URLS.SETTINGS.TRIGGERS}
                    className="text-pink-600 hover:text-pink-700"
                  >
                    Trigger Settings
                  </Link>{" "}
                  page.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Select Repository</h3>
                <p className="text-gray-700 mb-3">
                  Choose the repository where you want to enable the Schedule Trigger.
                </p>
                <Image
                  src="/docs/triggers/repository-selector.png"
                  alt="Screenshot of repository selector dropdown showing available repositories"
                  width={500}
                  height={200}
                  className="border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Enable Schedule Trigger</h3>
                <p className="text-gray-700 mb-3">
                  Toggle the &quot;On schedule&quot; option to enable the trigger.
                </p>
                <Image
                  src="/docs/triggers/enable-schedule-toggle.png"
                  alt="Screenshot of the Schedule Trigger toggle switch in enabled state"
                  width={500}
                  height={150}
                  className="border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Configure Schedule</h3>
                <p className="text-gray-700 mb-3">
                  Set your start time ({ALLOWED_INTERVALS.join(", ")} minute intervals), execution
                  count (1-{MAX_EXECUTIONS} times per day), and weekend preference.
                </p>
                <Image
                  src="/docs/triggers/schedule-settings-form.png"
                  alt="Screenshot of schedule configuration form with time picker, execution count dropdown, interval selector, and weekend checkbox"
                  width={600}
                  height={300}
                  className="border border-gray-200 rounded-lg"
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
          Ready to automate your test coverage?{" "}
          <Link
            href={RELATIVE_URLS.SETTINGS.TRIGGERS}
            className="text-pink-600 hover:text-pink-700 underline"
          >
            Enable Schedule Trigger in your settings
          </Link>{" "}
          and let GitAuto consistently improve your codebase while you focus on building features.
        </p>
      </div>

      <DocsContact
        title="Planning Your Coverage Victory?"
        description="Going from 0% to 90% coverage is like planning a marathon! You need the right strategy, pacing, and realistic milestones. We love helping teams design their coverage improvement journey!"
        callToAction="Contact us"
        linkText="and let's map out your path to victory!"
      />

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.TEST_FAILURE,
          title: "Test Failure Trigger",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.PR_CHANGE,
          title: "PR Change Trigger",
        }}
      />
    </div>
  );
}
