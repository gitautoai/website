import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";
import { CodeBlock } from "../CodeBlock";
import { CommonConfiguration } from "../CommonConfiguration";
import { KeyRequirements } from "../KeyRequirements";
import { buildGradle, pomXml } from "./code/maven-config";
import { workflow } from "./code/workflow";

export default function JavaConfigurationPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Java Coverage</h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Framework Configuration</h2>
          <KeyRequirements />
          <p className="text-gray-600 mb-4">
            JaCoCo is the most popular code coverage tool for Java projects. It integrates
            seamlessly with Maven and Gradle, generating coverage reports in XML format that can be
            converted to LCOV for GitAuto compatibility.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-6 mb-3">Maven Configuration</h3>
            <CodeBlock code={pomXml} language="xml" filename="pom.xml" />

            <h3 className="text-xl font-semibold mt-8 mb-3">Gradle Configuration</h3>
            <CodeBlock code={buildGradle} language="groovy" filename="build.gradle" />
          </div>
        </section>

        <CommonConfiguration
          framework="Java"
          workflowCode={workflow}
          workflowFilename="java-coverage.yml"
          configPoints={[
            <span key="1">Configure JaCoCo plugin in Maven or Gradle</span>,
            <span key="2">Generate XML coverage reports</span>,
            <span key="3">Convert JaCoCo XML to LCOV format using a conversion tool</span>,
            <span key="4">
              Upload the report as an artifact - name must be either{" "}
              <code className="bg-yellow-100 px-1">coverage-report</code> or end with{" "}
              <code className="bg-yellow-100 px-1">lcov.info</code>
            </span>,
            <span key="5">
              Ensure the artifact contains{" "}
              <code className="bg-yellow-100 px-1">coverage/lcov.info</code> file
            </span>,
          ]}
        />
      </div>

      <DocsContact
        title="JaCoCo Giving You Trouble?"
        description="Java coverage can be complex with build tool configurations, multi-module projects, and classpath issues. Whether JaCoCo reports are missing, Maven is acting up, or CI is failing, we've got your back!"
        callToAction="Contact us"
        linkText="and let's sort out your Java coverage!"
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
