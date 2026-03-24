import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function NoChangeDetectionPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.NO_CHANGE_DETECTION,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">No-Change Detection</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            After applying a diff or writing a file, GitAuto compares the result to the original
            content. If the file is identical after the edit (no actual changes), the commit is
            skipped to avoid creating noise in the PR.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            The model sometimes generates diffs that look different but produce identical output.
            For example, it might reformat already-formatted code, rewrite an import that is already
            correct, or apply a &quot;fix&quot; that changes nothing. Committing these no-ops
            creates noise in the PR - empty commits that trigger CI runs, clutter the commit
            history, and confuse reviewers who expect each commit to contain meaningful changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Why Models Claim Changes They Didn&apos;t Make
          </h2>
          <p className="text-gray-600 mb-4">
            Models can go through the motions of generating diffs and tool calls without actually
            changing any file content. This happens when the model produces a diff that matches the
            existing content exactly, or when a tool call fails silently. The model reports
            &quot;I&apos;ve made the changes&quot; based on having generated the output, not on
            verifying the file actually changed on disk. Training rewards producing output - a model
            that generates a diff and says &quot;done&quot; gets positive feedback regardless of
            whether the diff actually changed anything. Self-verification is not a trained behavior.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            After applying each file edit, GitAuto runs a content comparison between the file before
            and after the edit. If the content is byte-for-byte identical, the edit is discarded and
            no commit is created for that change. When all edits in an iteration produce no changes,
            the entire iteration is treated as a no-op, and the agent is informed that its changes
            had no effect so it can try a different approach.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.DUPLICATE_ERROR_HASHING}
                className="text-pink-600 hover:underline"
              >
                Duplicate Error Hashing
              </Link>{" "}
              - detects when repeated fixes produce the same error
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
