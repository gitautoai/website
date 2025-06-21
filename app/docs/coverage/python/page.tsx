import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";
import { CodeBlock } from "../CodeBlock";
import { CommonConfiguration } from "../CommonConfiguration";
import { KeyRequirements } from "../KeyRequirements";
import { workflow } from "./code/workflow";

export default function PythonConfigurationPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Python Coverage</h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Framework Configuration</h2>
          <KeyRequirements />
          <p className="text-gray-600 mb-4">
            The most common approach for Python test coverage is using pytest with pytest-cov. These
            tools can generate coverage reports in LCOV format, which is compatible with
            GitAuto&apos;s coverage analysis.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-6 mb-3">Installation</h3>
            <CodeBlock code={`pip install pytest pytest-cov`} language="bash" filename="terminal" />
          </div>
        </section>

        <CommonConfiguration
          framework="Python"
          workflowCode={workflow}
          workflowFilename="python-coverage.yml"
          configPoints={[
            "Run tests with <code>--cov</code> and <code>--cov-report=lcov</code> flags",
            "Upload the report as an artifact named <code>coverage-report</code>",
            "Ensure the report is saved as <code>coverage/lcov.info</code>",
          ]}
        />
      </div>

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.COVERAGE.OVERVIEW,
          title: "Coverage Overview",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.GETTING_STARTED.DASHBOARD_TRIGGER,
          title: "Dashboard Trigger",
        }}
      />
    </>
  );
}
