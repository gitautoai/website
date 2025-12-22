import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";
import Link from "next/link";

export default function NpmIntegrationPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">npm Integration</h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-600 mb-4">
            GitAuto uses your npm token to access private packages during test generation. This
            ensures that all dependencies are available when running build tools like ESLint,
            Prettier, TypeScript compiler, and test frameworks.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why npm Token is Required</h2>
          <p className="text-gray-600 mb-4">
            When GitAuto generates tests for your repository, it needs to:
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>Install all npm packages including private ones from your organization</li>
            <li>Run ESLint to ensure generated code follows your linting rules</li>
            <li>Run Prettier to format code according to your style guide</li>
            <li>Run TypeScript compiler (tsc) to check for type errors</li>
            <li>Run your test suite to verify generated tests work correctly</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Without a valid npm token, installations of private packages will fail, preventing these
            tools from running properly.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How to Configure</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-3">Step 1: Generate npm Token</h3>
              <p className="text-gray-600 mb-3">
                Visit{" "}
                <a
                  href="https://www.npmjs.com/settings/~/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:underline"
                >
                  npm token settings
                </a>{" "}
                and click &quot;Generate New Token&quot;. Use these settings:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <p className="font-semibold text-sm">Token name:</p>
                  <p className="text-gray-600 text-sm">Any name you prefer (e.g., &quot;GitAuto&quot;)</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Packages and scopes - Permissions:</p>
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>Read-only</strong> (GitAuto only needs to install packages, not publish
                    them)
                  </p>
                  <p className="font-semibold text-sm mt-2">Select packages:</p>
                  <p className="text-gray-600 text-sm">
                    <strong>All packages</strong> (recommended - applies to current and future
                    packages automatically)
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Organizations - Permissions:</p>
                  <p className="text-gray-600 text-sm">
                    <strong>No access</strong> (this permission is only for managing organization
                    settings/teams, not for installing packages)
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Bypass two-factor authentication:</p>
                  <p className="text-gray-600 text-sm">
                    <strong>Check this box</strong> - GitAuto runs in automated environments and
                    cannot provide 2FA codes
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Allowed IP ranges:</p>
                  <p className="text-gray-600 text-sm">Leave empty (not required)</p>
                </div>
                <div>
                  <p className="font-semibold text-sm">Expiration:</p>
                  <p className="text-gray-600 text-sm">
                    Choose <strong>Custom</strong> and set to <strong>365 days</strong> (1 year).
                    Since read-only tokens have lower security risk than write tokens, setting the
                    maximum expiration reduces maintenance overhead. npm tokens cannot be refreshed
                    - when expired, you must generate a new token and update it in GitAuto.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Step 2: Configure in GitAuto</h3>
              <p className="text-gray-600 mb-2">
                Go to{" "}
                <Link
                  href={RELATIVE_URLS.SETTINGS.INTEGRATIONS.NPM}
                  className="text-pink-600 hover:underline"
                >
                  npm Integration Settings
                </Link>{" "}
                in GitAuto.
              </p>
              <ol className="list-decimal pl-8 text-gray-600 space-y-2">
                <li>Select your organization from the dropdown</li>
                <li>Paste your npm access token</li>
                <li>Click Save</li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Step 3: Automatic Verification</h3>
              <p className="text-gray-600">
                When you save your token, GitAuto automatically verifies it by calling the npm
                registry. If the token is invalid, you&apos;ll receive an immediate error message.
                Once saved successfully, GitAuto will use this token automatically when generating
                tests for repositories under your organization.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Token Scope Requirements</h2>
          <p className="text-gray-600 mb-4">
            Your npm token needs the following minimum permissions:
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <strong>Packages and scopes: Read-only, All packages</strong> - Required to install
              all packages (including organization-scoped ones like{" "}
              <code className="bg-gray-200 px-1 rounded text-xs">@yourorg/package</code>). Use &quot;All
              packages&quot; to automatically include future packages.
            </li>
            <li>
              <strong>Organizations: No access</strong> - Not needed (this permission is only for
              managing organization settings/teams)
            </li>
            <li>
              <strong>Bypass two-factor authentication: Enabled</strong> - Required for automated
              CI/CD usage
            </li>
            <li>
              <strong>IP ranges: Not required</strong> - Leave empty for use from any IP
            </li>
          </ul>
          <p className="text-gray-600 mt-4">
            Write/Publish permissions are <strong>not required</strong> as GitAuto only installs
            packages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Security</h2>
          <p className="text-gray-600 mb-4">
            Your npm token is stored securely in our database. GitAuto uses it only during test
            generation to install dependencies. The token is:
          </p>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>Protected by database-level access controls</li>
            <li>Never exposed in logs or error messages</li>
            <li>Only accessible by your organization</li>
            <li>Used exclusively for npm package installation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Error when saving token</h3>
              <p className="text-gray-600 text-sm">
                If you receive an error when saving your npm token, the token is likely invalid or
                expired. GitAuto verifies tokens immediately by testing them against the npm
                registry. Generate a new token from npm settings and try again.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Token expired</h3>
              <p className="text-gray-600 text-sm">
                npm tokens cannot be refreshed or renewed. When your token expires, generate a new
                token from npm settings and update it in GitAuto. You&apos;ll see a validation error
                when trying to save an expired token.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Token scope issues</h3>
              <p className="text-gray-600 text-sm">
                Ensure your token has &quot;Read-only&quot; permission and &quot;All packages&quot;
                selected. Tokens with limited package scope may not work for all your private
                packages.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Different token per repository needed</h3>
              <p className="text-gray-600 text-sm">
                Currently, npm tokens are set at the organization level. If you need different
                tokens for different repositories, contact support.
              </p>
            </div>
          </div>
        </section>
      </div>

      <DocsContact
        title="Need Help with npm Integration?"
        description="Setting up private package access shouldn't be complicated. If you're running into issues with npm tokens or package installation, we're here to help!"
        callToAction="Contact us"
        linkText="and we'll get your integration working smoothly."
      />

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.INTEGRATIONS.CIRCLECI,
          title: "CircleCI Integration",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.CUSTOMIZATION.REPOSITORY_RULES,
          title: "Repository Rules",
        }}
      />
    </>
  );
}
