import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";
import { CodeBlock } from "../CodeBlock";
import { CommonConfiguration } from "../CommonConfiguration";
import { KeyRequirements } from "../KeyRequirements";
import { composerJson, composerJsonLaravel, phpunitConfig } from "./code/phpunit-config";
import { workflow } from "./code/workflow";

export default function PHPConfigurationPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">PHP Coverage</h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Framework Configuration (All Projects)</h2>
          <KeyRequirements />
          <p className="text-gray-600 mb-4">
            PHPUnit is the most widely used testing framework for PHP and supports generating
            coverage reports in various formats. While PHPUnit generates Clover XML format by
            default, you can convert it to LCOV format for GitAuto compatibility.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-6 mb-3">Composer Configuration (Generic PHP Projects)</h3>
            <CodeBlock code={composerJson} language="json" filename="composer.json" />

            <h3 className="text-xl font-semibold mt-6 mb-3">Composer Configuration (Laravel Projects)</h3>
            <p className="text-gray-600 mb-4">
              If you&apos;re using Laravel, use this composer.json configuration instead:
            </p>
            <CodeBlock code={composerJsonLaravel} language="json" filename="composer.json" />

            <h3 className="text-xl font-semibold mt-6 mb-3">PHPUnit Configuration (All Projects)</h3>
            <p className="text-gray-600 mb-4">
              This configuration applies to both generic PHP and Laravel projects:
            </p>
            <CodeBlock code={phpunitConfig} language="xml" filename="phpunit.xml" />
          </div>
        </section>

        <CommonConfiguration
          framework="PHP"
          workflowCode={workflow}
          workflowFilename="php-coverage.yml"
          configPoints={[
            <span key="1">Configure PHPUnit to generate Clover XML coverage reports (All Projects)</span>,
            <span key="2">Set up Xdebug or PCOV for code coverage (All Projects)</span>,
            <span key="3">
              Upload the report as an artifact named{" "}
              <code className="bg-yellow-100 px-1">coverage-report</code> (All Projects)
            </span>,
            <span key="4">
              Ensure the report is saved as{" "}
              <code className="bg-yellow-100 px-1">coverage/lcov.info</code> (All Projects)
            </span>,
          ]}
        />
      </div>

      <DocsContact
        title="PHPUnit Coverage Mysteries?"
        description="PHP coverage can be tricky with Xdebug, memory limits, and configuration quirks. Whether PHPUnit is running slow, coverage is incomplete, or GitHub Actions are failing, we're here to help!"
        callToAction="Contact us"
        linkText="and let's debug this together!"
      />

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.COVERAGE.OVERVIEW,
          title: "Coverage Overview",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.COVERAGE.CHARTS,
          title: "Coverage Charts",
        }}
      />
    </>
  );
}
