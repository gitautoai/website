import Image from "next/image";
import Link from "next/link";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function MergeTriggerPage() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">PR Merge Trigger</h1>

      <div className="prose prose-lg max-w-none space-y-12">
        {/* What */}
        <div>
          <p className="text-lg text-gray-700">
            The PR Merge Trigger creates separate pull requests with unit tests after your code is
            merged. This provides a safer approach by keeping test additions completely separate
            from feature development.
          </p>
        </div>

        {/* Why */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">Why use the PR merge trigger?</h2>

          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="text-pink-600 font-semibold">Clean Separation:</span> Feature
              development and test creation are completely separate processes, keeping your feature
              PRs focused and uncluttered.
            </p>

            <p className="text-gray-700">
              <span className="text-rose-600 font-semibold">Easy Rejection:</span> Simply close the
              test PR if you don't want the generated tests - no need to learn Git reset commands or
              worry about rollbacks.
            </p>

            <p className="text-gray-700">
              <span className="text-fuchsia-600 font-semibold">Perfect for:</span> Production
              environments where feature and test changes should be separate, and teams without
              strict coverage gates.
            </p>
          </div>
        </div>

        {/* How */}
        <div>
          <h2 className="text-2xl font-semibold mt-0 mb-4">How to use the PR merge trigger</h2>

          <div className="space-y-8">
            <div className="flex">
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

            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Select Repository</h3>
                <p className="text-gray-700">
                  Choose the repository where you want to enable the PR Merge Trigger.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Enable PR Merge Trigger</h3>
                <p className="text-gray-700 mb-3">
                  Toggle the "On merge" option to enable the trigger.
                </p>
                <Image
                  src="/docs/triggers/enable-schedule-toggle.png"
                  alt="Screenshot of the PR Merge Trigger toggle switch in enabled state"
                  width={500}
                  height={150}
                  className="border border-gray-200 rounded-lg"
                />
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-3">
                  <p className="text-orange-800 text-sm">
                    <strong>Note:</strong> PR Merge Trigger cannot be used together with PR Change
                    Trigger. Enabling one will automatically disable the other.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium mr-4 flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold mt-0.5 mb-2">Workflow Example</h3>
                <p className="text-gray-700 mb-3">
                  Here's what happens after you enable this trigger:
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <strong>1. Merge Feature PR:</strong> You merge your feature PR into main branch
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <strong>2. GitAuto Analyzes:</strong> Changed files are automatically identified
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <strong>3. Test PR Created:</strong> A separate PR with unit tests is created
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <strong>4. Review & Merge:</strong> You review and merge the test PR (or close
                    it)
                  </div>
                </div>
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
          Ready for safer test automation?{" "}
          <Link
            href={RELATIVE_URLS.SETTINGS.TRIGGERS}
            className="text-pink-600 hover:text-pink-700 underline"
          >
            Enable PR Merge Trigger in your settings
          </Link>{" "}
          and enjoy clean separation between features and tests.
        </p>
      </div>

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.PR_CHANGE,
          title: "PR Change Trigger",
        }}
      />
    </div>
  );
}
