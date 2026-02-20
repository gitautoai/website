import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { RELATIVE_URLS } from "@/config/urls";
import { CodeBlock } from "../CodeBlock";
import { CommonConfiguration } from "../CommonConfiguration";
import { KeyRequirements } from "../KeyRequirements";
import { MultiLanguageLink } from "../MultiLanguageLink";
import { gemfile, specHelper } from "./code/simplecov-config";
import { workflow } from "./code/workflow";

export default function RubyConfigurationPage() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Ruby Coverage</h1>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Framework Configuration</h2>
          <KeyRequirements />
          <p className="text-gray-600 mb-4">
            RSpec is the most popular testing framework for Ruby, and SimpleCov is the standard tool
            for measuring code coverage. With the simplecov-lcov formatter, you can easily generate
            LCOV reports compatible with GitAuto.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mt-6 mb-3">Installation</h3>
            <CodeBlock code={gemfile} language="ruby" filename="Gemfile" />

            <h3 className="text-xl font-semibold mt-6 mb-3">SimpleCov Configuration</h3>
            <CodeBlock code={specHelper} language="ruby" filename="spec/spec_helper.rb" />
          </div>
        </section>

        <CommonConfiguration
          framework="Ruby"
          workflowCode={workflow}
          workflowFilename="ruby-coverage.yml"
          configPoints={[
            <span key="1">Install SimpleCov and simplecov-lcov gems</span>,
            <span key="2">Configure SimpleCov to generate LCOV format reports</span>,
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

      <MultiLanguageLink />

      <DocsContact
        title="RSpec Coverage Issues?"
        description="Ruby testing can be challenging with gem conflicts, load order issues, and coverage gaps. Whether SimpleCov isn't running, coverage is inaccurate, or your CI is failing, we're here to help!"
        callToAction="Contact us"
        linkText="and let's get your Ruby tests shining!"
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
