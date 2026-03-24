import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function LineEndingPreservationPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.LINE_ENDING_PRESERVATION,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Line Ending Preservation</h1>
      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto detects the original line ending style (LF vs CRLF) of each file and preserves
            it in the output. Without this, modifying a CRLF file with LF output creates a diff
            where every single line appears changed, even though no actual code changed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Windows repositories often use CRLF (<code>\r\n</code>) line endings, while Unix/Mac
            repositories use LF (<code>\n</code>). The model always outputs LF. When GitAuto writes
            the model&apos;s output to a CRLF file, every line in the diff shows as changed because
            the line endings differ. This creates massive, unreadable pull requests that are
            impossible to review. The actual code changes get buried under hundreds of
            whitespace-only changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Always Output LF</h2>
          <p className="text-gray-600 mb-4">
            Model training data and tokenizers are normalized to LF (<code>\n</code>). The model has
            no concept of CRLF (<code>\r\n</code>) as distinct from LF - they are both &quot;end of
            line&quot; in the model&apos;s view. Even if the input file uses CRLF, the model
            generates LF because that is what its tokenizer produces. Training data is preprocessed
            and normalized to LF before training, so the model has never seen CRLF during training
            and cannot reproduce what it has never encountered.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            Before modifying a file, GitAuto reads the original content and checks whether it
            contains CRLF line endings. If the original file used CRLF, the output is converted from
            LF to CRLF before writing. If the original used LF, no conversion is needed. This
            detection happens per-file, so a repository with mixed line endings is handled
            correctly.
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
              - Ensures exactly one newline at EOF before line ending conversion
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TRAILING_SPACE_REMOVAL}
                className="text-pink-600 hover:underline"
              >
                Trailing Space Removal
              </Link>{" "}
              - Strips whitespace before line ending preservation runs
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
