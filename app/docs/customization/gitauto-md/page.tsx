import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { CodeBlock } from "@/app/docs/coverage/CodeBlock";
import { RELATIVE_URLS } from "@/config/urls";

export default function GitAutoMdPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">GITAUTO.md</h1>

      <div className="prose prose-lg max-w-none space-y-12">
        <section>
          <h2 className="text-3xl font-semibold mt-0 mb-6">What is GITAUTO.md?</h2>
          <p className="text-gray-700 mb-4">
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">GITAUTO.md</code> is a file
            at the root of your repository where GitAuto persists reusable learnings. Think of it
            like <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">CLAUDE.md</code> for
            Claude Code - a place where project-specific rules accumulate over time.
          </p>
          <p className="text-gray-700">
            GitAuto reads this file at the start of every task and updates it when it learns
            something reusable from reviewer feedback, CI failures, or other signals.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mt-0 mb-6">How It Works</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Reading</h3>
              <p className="text-gray-700">
                Every time GitAuto starts working on a task (from any trigger - review comments,
                test failures, schedule, or dashboard), it reads{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">GITAUTO.md</code> from
                your repo root and loads it as high-priority context. These rules override other
                settings when there is a conflict.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-3">Writing</h3>
              <p className="text-gray-700 mb-4">
                GitAuto automatically creates or updates{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">GITAUTO.md</code> when
                it encounters reusable patterns. For example:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  A reviewer says &quot;use test helpers from our shared utilities&quot; - GitAuto
                  fixes the PR and adds the rule to GITAUTO.md so it never makes that mistake again
                </li>
                <li>
                  A CI failure reveals that a column is integer, not string - GitAuto fixes the test
                  and records the type convention
                </li>
                <li>
                  While working on any task, GitAuto discovers a repo-specific pattern (e.g., the
                  repo always uses a specific test helper, or a particular naming convention) and
                  records it for future tasks
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-3">Manual Editing</h3>
              <p className="text-gray-700">
                You can also manually create or edit{" "}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">GITAUTO.md</code> to add
                rules. Since it lives in your repo, it is version-controlled and visible to your
                entire team.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mt-0 mb-6">Example</h2>
          <p className="text-gray-700 mb-4">
            Here is what a{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">GITAUTO.md</code> might look
            like after a few feedback cycles:
          </p>

          <CodeBlock
            code={`# GITAUTO.md

## Testing
- Use shared test helpers in tests/helpers/ for creating test data
- status column is integer (0=draft, 1=published), not string
- Always test both success and error paths for API calls

## Code Style
- Always use early returns in controller methods
- Use Path objects instead of string concatenation for file paths

## Build
- Run \`npm run build\` before \`npm test\` - tests depend on compiled output
- MONGO_URI env var is required for integration tests`}
            language="markdown"
            filename="GITAUTO.md (at repo root)"
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mt-0 mb-6">
            How It Complements{" "}
            <Link
              href={RELATIVE_URLS.DOCS.CUSTOMIZATION.REPOSITORY_RULES}
              className="text-pink-600 hover:text-pink-700 underline"
            >
              Repository Rules
            </Link>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 pr-4 text-gray-900 font-semibold"></th>
                  <th className="py-3 px-4 text-gray-900 font-semibold">
                    Repository Rules (Web UI)
                  </th>
                  <th className="py-3 pl-4 text-gray-900 font-semibold">GITAUTO.md</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium">Who edits</td>
                  <td className="py-3 px-4">Users only - GitAuto never modifies these</td>
                  <td className="py-3 pl-4">Both users and GitAuto</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium">How configured</td>
                  <td className="py-3 px-4">Manually via settings page</td>
                  <td className="py-3 pl-4">Automatically by GitAuto + manual edits</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium">Where stored</td>
                  <td className="py-3 px-4">GitAuto database</td>
                  <td className="py-3 pl-4">In your repo (git-managed, version-controlled)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium">Visibility</td>
                  <td className="py-3 px-4">GitAuto settings page</td>
                  <td className="py-3 pl-4">Visible to your entire team in the repo</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 font-medium">Best for</td>
                  <td className="py-3 px-4">
                    Rules you define upfront (structured options + free-form)
                  </td>
                  <td className="py-3 pl-4">Rules learned from feedback over time</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium">Priority</td>
                  <td className="py-3 px-4">Applied first</td>
                  <td className="py-3 pl-4">Highest priority (overrides when conflicting)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mt-0 mb-6">Format Guidelines</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              Use markdown headers (
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">##</code>) to group rules
              by topic (Testing, Code Style, Architecture, Build, etc.)
            </li>
            <li>Keep each rule to one line when possible</li>
            <li>Focus on reusable patterns, not one-off fixes for specific files</li>
            <li>GitAuto will not duplicate rules that already exist in the file</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mt-0 mb-6">Getting Started</h2>
          <p className="text-gray-700 mb-4">
            You do not need to create{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">GITAUTO.md</code> manually.
            GitAuto will create it automatically the first time it learns a reusable rule from
            feedback. However, you can create one upfront if you already know your repo-specific
            conventions.
          </p>
          <p className="text-gray-700">
            Over time, as your team reviews GitAuto&apos;s PRs and provides feedback, the file will
            grow into a comprehensive set of repo-specific rules - making each subsequent task more
            accurate.
          </p>
        </section>

        <DocsContact
          title="Questions?"
          description="Want to know more about how GITAUTO.md works or need help setting it up? We're happy to help."
          callToAction="Contact us"
          linkText="with your questions."
        />
      </div>

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.CUSTOMIZATION.REPOSITORY_RULES,
          title: "Repository Rules",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.INTEGRATIONS.CIRCLECI,
          title: "CircleCI Integration",
        }}
      />
    </div>
  );
}
