import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";
import Link from "next/link";

export default function CircleCIIntegrationPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">CircleCI Integration</h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-600 mb-4">
            GitAuto uses your CircleCI token to automatically read build logs when tests fail. This
            helps GitAuto understand what went wrong and generate fixes more accurately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why CircleCI Integration is Needed</h2>
          <p className="text-gray-600 mb-4">
            When tests fail in CircleCI instead of GitHub Actions, GitAuto needs access to:
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>Build logs showing test failure details</li>
            <li>Error messages and stack traces</li>
            <li>Test output and assertions</li>
            <li>Build environment information</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Without CircleCI integration, GitAuto can only see that tests failed on GitHub, but
            cannot access the detailed logs from CircleCI to understand why they failed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">When to Use This</h2>
          <p className="text-gray-600 mb-4">You should configure CircleCI integration if:</p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>Your repository uses CircleCI for CI/CD instead of GitHub Actions</li>
            <li>You want GitAuto to automatically fix test failures</li>
            <li>You need GitAuto to analyze build logs for better issue resolution</li>
          </ul>
          <p className="text-gray-600 mt-4">
            <strong>Note:</strong> If you use GitHub Actions, this integration is not needed as
            GitAuto can access those logs directly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How to Configure</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-3">Step 1: Generate CircleCI Token</h3>
              <p className="text-gray-600 mb-2">
                Visit{" "}
                <a
                  href="https://app.circleci.com/settings/user/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:underline"
                >
                  CircleCI token settings
                </a>{" "}
                and create a new Personal API Token.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Step 2: Configure in GitAuto</h3>
              <p className="text-gray-600 mb-2">
                Go to{" "}
                <Link
                  href={RELATIVE_URLS.SETTINGS.INTEGRATIONS.CIRCLECI}
                  className="text-pink-600 hover:underline"
                >
                  CircleCI Integration Settings
                </Link>{" "}
                in GitAuto.
              </p>
              <ol className="list-decimal pl-8 text-gray-600 space-y-2">
                <li>Select your organization from the dropdown</li>
                <li>Paste your CircleCI Personal API Token</li>
                <li>Click Save</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Step 3: Automatic Log Access</h3>
              <p className="text-gray-600">
                Once configured, GitAuto will automatically fetch CircleCI build logs whenever tests
                fail. The logs are used to understand the failure and generate appropriate fixes.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Token Permissions</h2>
          <p className="text-gray-600 mb-4">Your CircleCI token needs the following permissions:</p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <strong>Read access</strong> to project builds and logs
            </li>
            <li>
              <strong>Personal API Token</strong> type (not project-specific token)
            </li>
          </ul>
          <p className="text-gray-600 mt-4">
            Write permissions are <strong>not required</strong> as GitAuto only reads build logs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Security</h2>
          <p className="text-gray-600 mb-4">
            Your CircleCI token is stored securely in our database. GitAuto uses it only to read
            build logs when tests fail. The token is:
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>Protected by database-level access controls</li>
            <li>Never exposed in logs or error messages</li>
            <li>Only accessible by your organization</li>
            <li>Used exclusively for reading CircleCI build logs</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal pl-8 text-gray-600 space-y-3">
            <li>Test fails in CircleCI on your repository</li>
            <li>GitHub reports the failure to GitAuto via webhook</li>
            <li>GitAuto uses your CircleCI token to fetch the build logs</li>
            <li>GitAuto analyzes the logs to understand the failure</li>
            <li>GitAuto generates a fix and creates a pull request</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">GitAuto cannot access CircleCI logs</h3>
              <p className="text-gray-600 text-sm">
                Verify that your CircleCI token is configured correctly and has not expired. Make
                sure the token has read access to all projects in your organization.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Token scope issues</h3>
              <p className="text-gray-600 text-sm">
                Ensure your token is a Personal API Token with read access to builds.
                Project-specific tokens may not work for all repositories.
              </p>
            </div>
          </div>
        </section>
      </div>

      <DocsContact
        title="Need Help with CircleCI Integration?"
        description="Setting up CI/CD integrations can be tricky. If you're having trouble accessing CircleCI logs or configuring your token, we're here to help!"
        callToAction="Contact us"
        linkText="and we'll get your integration working smoothly."
      />

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.CUSTOMIZATION.PARENT_ISSUE_RULES,
          title: "Parent Issue Rules",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.INTEGRATIONS.NPM,
          title: "npm Integration",
        }}
      />
    </>
  );
}
