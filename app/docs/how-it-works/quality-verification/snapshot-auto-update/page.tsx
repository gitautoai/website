import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function SnapshotAutoUpdatePage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.SNAPSHOT_AUTO_UPDATE,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Snapshot Auto-Update</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto automatically updates snapshots when generating or modifying tests that use
            snapshot assertions. When a snapshot mismatch is detected during test execution, GitAuto
            reruns the tests with the update flag (e.g., Jest&apos;s{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">--updateSnapshot</code>) to
            create or update the snapshot files.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            New Snapshot Tests Always Fail on First Run
          </h2>
          <p className="text-gray-600 mb-4">
            New or modified tests that use{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">toMatchSnapshot()</code> or{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              toMatchInlineSnapshot()
            </code>{" "}
            always fail on their first run because the snapshot file does not exist yet. Snapshots
            are created by running the test and recording the output. But in GitAuto&apos;s
            pipeline, this means every snapshot test would report as a failure, triggering
            unnecessary correction iterations.
          </p>
          <p className="text-gray-600 mb-4">
            Auto-updating snapshots prevents these false failures. When GitAuto generates a new test
            that uses snapshots, it detects the &quot;snapshot mismatch&quot; error pattern and
            automatically creates the baseline snapshot, allowing the test to pass on subsequent
            runs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Can&apos;t Handle Snapshots</h2>
          <p className="text-gray-600 mb-4">
            Snapshot testing is a chicken-and-egg problem: the snapshot file is created by running
            the test, but the test can&apos;t pass without the snapshot file. Models can write{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              expect(component).toMatchSnapshot()
            </code>{" "}
            but they can&apos;t create the actual snapshot file - that requires executing the test.
            Without application-layer support to run the test with{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">--updateSnapshot</code>,
            every new snapshot test would fail on first run. Snapshot testing requires runtime
            execution to create the baseline, and no training or benchmark simulates this workflow,
            so models have no learned strategy for handling the create-then-compare lifecycle.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            During test execution, if the test runner reports a snapshot mismatch or missing
            snapshot error, GitAuto detects this specific failure pattern in the test output. It
            then reruns the failing test with the update flag (e.g., Jest&apos;s{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">--updateSnapshot</code> or{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">-u</code>), which tells the
            runner to create or overwrite the snapshot file with the current output.
          </p>
          <p className="text-gray-600 mb-4">
            The updated snapshot file is then included in the PR commit alongside the test file.
            This ensures the PR is self-contained - reviewers can see both the test and its expected
            output in a single diff.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.TEST_EXECUTION}
                className="text-pink-600 hover:underline"
              >
                Test Execution
              </Link>{" "}
              - the test runner that detects snapshot mismatches
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.COVERAGE_ENFORCEMENT}
                className="text-pink-600 hover:underline"
              >
                Coverage Enforcement
              </Link>{" "}
              - measures coverage after snapshots are updated and tests pass
            </li>
          </ul>
        </section>
      </div>

      <DocsContact />

      <DocsNavigation
        previousLink={prev ? { href: prev.href, title: prev.title } : undefined}
        nextLink={next ? { href: next.href, title: next.title } : undefined}
      />
    </>
  );
}
