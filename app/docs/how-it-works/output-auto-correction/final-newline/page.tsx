import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function FinalNewlinePage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.FINAL_NEWLINE,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Final Newline</h1>
      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto ensures every file ends with exactly one newline character. Missing final
            newlines violate the POSIX standard, trigger git diff warnings, and cause linter errors
            in many projects.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            The POSIX standard defines a text file as a sequence of lines, each ending with a
            newline. When a file does not end with a newline, git shows the warning &quot;No newline
            at end of file&quot; in diffs, and many linters (ESLint, Prettier, editorconfig) flag it
            as an error. The model sometimes omits the final newline, and sometimes adds multiple
            trailing newlines. Both cases trigger failures that waste agent iterations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Get Final Newlines Wrong</h2>
          <p className="text-gray-600 mb-4">
            Models have no reliable sense of &quot;the file is done now, add exactly one
            newline.&quot; The end of generation is controlled by a stop token, not by the model
            deliberately choosing to end with a newline. Whether the output ends with zero, one, or
            two newlines is essentially random. Same as trailing spaces - benchmarks normalize
            whitespace, so final newline handling is invisible during evaluation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            Before writing a file, GitAuto strips all trailing newlines from the content and then
            appends exactly one newline character. This guarantees the file ends with a single{" "}
            <code>\n</code> regardless of how many (or how few) the model included. The operation is
            applied to all text files and runs after trailing space removal to avoid interaction
            issues.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TRAILING_SPACE_REMOVAL}
                className="text-pink-600 hover:underline"
              >
                Trailing Space Removal
              </Link>{" "}
              - Strips whitespace from line endings before final newline is applied
            </li>
            <li>
              <Link
                href={
                  RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.LINE_ENDING_PRESERVATION
                }
                className="text-pink-600 hover:underline"
              >
                Line Ending Preservation
              </Link>{" "}
              - Preserves LF vs CRLF style after the final newline is ensured
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
