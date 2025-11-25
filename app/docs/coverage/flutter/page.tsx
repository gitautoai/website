import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { DocsContact } from "@/app/components/docs/DocsContact";
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
            <span key="1">
              Run tests with <code className="bg-yellow-100 px-1">--coverage</code> flag
            </span>,
            <span key="2">
              Upload the report as an artifact named{" "}
              <code className="bg-yellow-100 px-1">coverage-report</code>
            </span>,
            <span key="3">
              Ensure the report is saved as{" "}
              <code className="bg-yellow-100 px-1">coverage/lcov.info</code>
            </span>,
          ]}
        />
      </div>

      <DocsContact
        title="Flutter Coverage Acting Weird?"
        description="Flutter testing can be surprisingly finicky! Whether your coverage reports are missing, GitHub Actions are timing out, or the lcov.info file is nowhere to be found, we've been there."
        callToAction="Contact us"
        linkText="and let's get your Flutter tests flying!"
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
