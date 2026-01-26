import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { RELATIVE_URLS } from "@/config/urls";
import { CodeBlock } from "../CodeBlock";
import { CommonConfiguration } from "../CommonConfiguration";
import { KeyRequirements } from "../KeyRequirements";
import { MultiLanguageLink } from "../MultiLanguageLink";
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
            <span key="1">
              Run tests with <code className="bg-yellow-100 px-1">--cov</code> and{" "}
              <code className="bg-yellow-100 px-1">--cov-report=lcov</code> flags
            </span>,
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

      <MultiLanguageLink />

      <DocsContact
        title="pytest-cov Giving You Headaches?"
        description="Python testing should be simple, but sometimes it feels like you're fighting with import paths, virtual environments, and mysterious coverage gaps. We get it - let's fix this together!"
        callToAction="Contact us"
        linkText="and make Python testing fun again!"
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
