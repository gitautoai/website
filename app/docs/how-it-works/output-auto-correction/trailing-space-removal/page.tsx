import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function TrailingSpaceRemovalPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TRAILING_SPACE_REMOVAL,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Trailing Space Removal</h1>
      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto strips trailing whitespace from every line of generated code before committing.
            The model inconsistently adds trailing spaces, and leaving them in triggers linting
            warnings and creates unnecessary diff noise in code review.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Trailing whitespace is invisible but causes real problems. Most linters flag it as a
            warning or error. Code reviewers see extra changes in diffs that are just whitespace.
            Pre-commit hooks in many repositories reject commits with trailing spaces. The model
            adds trailing spaces unpredictably, sometimes on blank lines within code blocks,
            sometimes at the end of comments. Manually fixing these wastes agent iterations on
            something that should never be an issue.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Add Trailing Spaces</h2>
          <p className="text-gray-600 mb-4">
            Models generate tokens one at a time, and a space token is always a high-probability
            prediction after most code tokens. Whether a space falls before or after a newline is a
            subtle distinction that rarely affects correctness, so the model has weak incentive to
            get it right. Benchmarks strip whitespace before comparison, so trailing spaces are
            invisible during evaluation. Models receive no training signal to avoid them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            Before writing any file to the repository, GitAuto runs a simple pass over every line,
            stripping any trailing spaces and tabs. This is applied universally to all generated
            code regardless of language. The operation is fast (single regex per line) and has no
            risk of changing code behavior since trailing whitespace is never semantically
            meaningful.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.FINAL_NEWLINE}
                className="text-pink-600 hover:underline"
              >
                Final Newline
              </Link>{" "}
              - Ensures files end with exactly one newline
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.IMPORT_SORTING}
                className="text-pink-600 hover:underline"
              >
                Import Sorting
              </Link>{" "}
              - Another pre-commit formatting correction
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
