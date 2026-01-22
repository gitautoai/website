"use client";

import { CodeBlock } from "./CodeBlock";

interface CommonConfiguration {
  framework: string;
  workflowCode: string;
  workflowFilename: string;
  configPoints: React.ReactNode[];
  setupCode?: {
    filename: string;
    language: string;
    code: string;
  }[];
}

export function CommonConfiguration({
  framework,
  workflowCode,
  workflowFilename,
  configPoints,
  setupCode,
}: CommonConfiguration) {
  return (
    <div className="space-y-12">
      {setupCode && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Framework Configuration</h2>
          <p className="text-gray-600 mb-4">
            Configure {framework} to generate LCOV coverage reports:
          </p>
          {setupCode.map((code, index) => (
            <CodeBlock
              key={index}
              code={code.code}
              language={code.language}
              filename={code.filename}
            />
          ))}
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-left">Setting Up GitHub Actions</h2>
        <p className="text-gray-600 mb-4">
          Create a workflow file in{" "}
          <code className="bg-gray-100 px-2 py-1 rounded">.github/workflows/</code> directory. The
          filename can be anything you prefer (e.g.{" "}
          <code className="bg-gray-100 px-2 py-1 rounded">{workflowFilename}</code>). Add the
          following content to your workflow file:
        </p>
        <CodeBlock code={workflowCode} language="yaml" filename={workflowFilename} />
        <div className="bg-yellow-50 p-4 rounded-lg mb-6 mt-4">
          <h3 className="text-lg font-medium text-yellow-950 mb-2">Key Configuration Points</h3>
          <ul className="list-disc list-outside space-y-1 text-yellow-800 ml-5">
            {configPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-left">Viewing Coverage Reports</h2>
        <p className="text-gray-600 mb-4">
          After your workflow runs successfully, GitAuto automatically processes the coverage
          reports and displays them in the Coverage Dashboard. GitAuto only saves coverage data
          when the workflow runs on your target branch (configurable in your repository&apos;s{" "}
          <a href="/dashboard/settings/rules" className="text-pink-600 hover:underline">
            Rules page
          </a>
          , defaults to your repository&apos;s default branch, e.g.,{" "}
          <code className="bg-gray-100 px-1 rounded">main</code> or{" "}
          <code className="bg-gray-100 px-1 rounded">master</code>). This typically happens when:
        </p>
        <ul className="list-disc list-outside space-y-2 text-gray-600 mb-6 ml-5">
          <li>You merge a pull request to your target branch</li>
          <li>You push directly to your target branch</li>
          <li>You manually trigger the workflow</li>
        </ul>
      </section>

      <div className="bg-gray-50 p-4 rounded-lg mt-4">
        <p className="text-gray-700">
          <strong>About LCOV:</strong> LCOV (Linux Code Coverage) is a standard format for code
          coverage data. It&apos;s pronounced &quot;el-cov&quot; and is widely supported by various
          tools and services.
        </p>
      </div>
    </div>
  );
}
