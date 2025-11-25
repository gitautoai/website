import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { RELATIVE_URLS } from "@/config/urls";
import { CodeBlock } from "../CodeBlock";
import { CommonConfiguration } from "../CommonConfiguration";
import { KeyRequirements } from "../KeyRequirements";
import { packageJson as jestPackageJson, jestConfig } from "./code/jest";
import { packageJson as vitestPackageJson, vitestConfig } from "./code/vitest";
import { workflow } from "./code/workflow";

export default function JavaScriptConfigurationPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">JavaScript / TypeScript Coverage</h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Framework Configuration</h2>
          <p className="text-gray-600 mb-4">
            Any JavaScript / TypeScript test framework that can generate LCOV reports is supported.
            While we provide examples for Jest and Vitest below, you can use any framework of your
            choice (Mocha, AVA, Jasmine, etc.) as long as it generates coverage reports in LCOV
            format.
          </p>

          <KeyRequirements />

          <h3 className="text-xl font-semibold mt-6 mb-3">Jest</h3>
          <div className="space-y-4">
            <CodeBlock code={jestPackageJson} language="json" filename="package.json" />
            <CodeBlock code={jestConfig} language="javascript" filename="jest.config.js" />
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-3">Vitest</h3>
          <div className="space-y-4">
            <CodeBlock code={vitestPackageJson} language="json" filename="package.json" />
            <CodeBlock code={vitestConfig} language="typescript" filename="vitest.config.ts" />
          </div>
        </section>

        <CommonConfiguration
          framework="JavaScript / TypeScript"
          workflowCode={workflow}
          workflowFilename="coverage.yml"
          configPoints={[
            <span key="1">Configure your test framework to generate LCOV reports</span>,
            <span key="2">
              Upload the report as an artifact - name must be either{" "}
              <code className="bg-yellow-100 px-1">coverage-report</code> or end with{" "}
              <code className="bg-yellow-100 px-1">lcov.info</code>
            </span>,
            <span key="3">
              Ensure the artifact contains{" "}
              <code className="bg-yellow-100 px-1">coverage/lcov.info</code> file
            </span>,
          ]}
        />
      </div>

      <DocsContact
        title="Jest Acting Up Again?"
        description="JavaScript testing can be a maze of configurations! Whether Jest is being stubborn, Vitest is throwing mysterious errors, or your GitHub Actions are failing silently, we've probably seen it before."
        callToAction="Contact us"
        linkText="and let's solve this JavaScript puzzle!"
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
