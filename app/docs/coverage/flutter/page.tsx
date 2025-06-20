import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";
import { CodeBlock } from "../CodeBlock";
import { CommonConfiguration } from "../CommonConfiguration";
import { KeyRequirements } from "../KeyRequirements";
import { pubspecYaml } from "./code/config";
import { workflow } from "./code/workflow";

export default function FlutterConfigurationPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Flutter Coverage</h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Framework Configuration</h2>
          <KeyRequirements />
          <p className="text-gray-600 mb-4">
            Flutter&apos;s built-in test framework can generate LCOV coverage reports.
          </p>

          <CodeBlock code={pubspecYaml} language="yaml" filename="pubspec.yaml" />
        </section>

        <CommonConfiguration
          framework="Flutter"
          workflowCode={workflow}
          workflowFilename="flutter-coverage.yml"
          configPoints={[
            "Run tests with <code>--coverage</code> flag",
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
