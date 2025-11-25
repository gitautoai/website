import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";
import { CodeBlock } from "../CodeBlock";
import { CommonConfiguration } from "../CommonConfiguration";
import { KeyRequirements } from "../KeyRequirements";
import { makefileExample, testExample } from "./code/test-config";
import { workflow } from "./code/workflow";

export default function GoConfigurationPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Go Coverage</h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Framework Configuration</h2>
          <KeyRequirements />
          <p className="text-gray-600 mb-4">
            Go has built-in support for test coverage with the{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">go test</code> command. By default, Go
            generates coverage reports in its own format, but you can easily convert them to LCOV
            format using the gcov2lcov tool.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-6 mb-3">Test Example</h3>
            <CodeBlock code={testExample} language="go" filename="calculator_test.go" />

            <h3 className="text-xl font-semibold mt-6 mb-3">Makefile (Optional)</h3>
            <CodeBlock code={makefileExample} language="makefile" filename="Makefile" />
          </div>
        </section>

        <CommonConfiguration
          framework="Go"
          workflowCode={workflow}
          workflowFilename="go-coverage.yml"
          configPoints={[
            <span key="1">
              Run tests with <code className="bg-yellow-100 px-1">-coverprofile</code> flag to
              generate coverage data
            </span>,
            <span key="2">
              Install and use <code className="bg-yellow-100 px-1">gcov2lcov</code> to convert Go
              coverage to LCOV format
            </span>,
            <span key="3">
              Upload the report as an artifact - name must be either{" "}
              <code className="bg-yellow-100 px-1">coverage-report</code> or end with{" "}
              <code className="bg-yellow-100 px-1">lcov.info</code>
            </span>,
            <span key="4">
              Ensure the artifact contains{" "}
              <code className="bg-yellow-100 px-1">coverage/lcov.info</code> file
            </span>,
          ]}
        />
      </div>

      <DocsContact
        title="Go Coverage Confusion?"
        description="Go testing is straightforward, but coverage configuration can be tricky! Whether you're dealing with module paths, coverage gaps, or CI/CD setup issues, we're here to help!"
        callToAction="Contact us"
        linkText="and let's get your Go tests covered!"
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
