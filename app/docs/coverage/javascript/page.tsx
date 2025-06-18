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
            Any JavaScript/TypeScript test framework that can generate LCOV reports is supported.
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
          framework="JavaScript/TypeScript"
          workflowCode={workflow}
          workflowFilename="coverage.yml"
          configPoints={[
            "Configure your test framework to generate LCOV reports",
            "Upload the report as an artifact named <code>coverage-report</code>",
            "Ensure the report is saved as <code>coverage/lcov.info</code>",
          ]}
        />
      </div>
    </>
  );
}
