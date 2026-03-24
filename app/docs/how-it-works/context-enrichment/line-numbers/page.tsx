import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function LineNumbersPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.LINE_NUMBERS,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Line Numbers</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto formats every file it reads with right-aligned line numbers inside code fences.
            Each line is prefixed with its number using the format{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">
              {"{line_num:>width}:{line}"}
            </code>
            , producing output like:
          </p>
          <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm overflow-x-auto">
            {`  1:import React from 'react'
  2:
  3:export const App = () => (
  4:  <div>Hello</div>
  5:)`}
          </pre>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Without explicit line numbers, the model describes changes like &quot;replace the import
            statement&quot; instead of &quot;replace line 1.&quot; When a file has multiple
            similar-looking lines - duplicate imports, repeated patterns, or common variable names -
            the model frequently targets the wrong location, producing broken diffs. Pre-computed
            line numbers give the model an unambiguous coordinate system so it never has to count.
            Diffs become precise: &quot;at line 47, replace this with that.&quot; The right-alignment
            ensures consistent formatting regardless of file length - a 9-line file and a 999-line
            file both produce clean, readable output.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Can&apos;t Count Lines</h2>
          <p className="text-gray-600 mb-4">
            Models don&apos;t see text line-by-line - they process chunks of tokens, where a single
            token might span part of a line or multiple short lines. Counting to &quot;line 47&quot;
            in a 200-line file requires tracking position across dozens of tokens, and the error rate
            grows with file length. Tokenization turns source code into subword pieces that have no
            alignment with newline characters, so the concept of &quot;line number&quot; doesn&apos;t
            exist natively in how the model represents text. The model has to count from the top of
            the file to figure out where it is - and it routinely miscounts, especially in longer
            files where the accumulated error compounds with each line.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">
            When GitAuto reads a file from the repository, it calculates the width needed for the
            largest line number, then pads every line number to that width. A 50-line file uses
            2-character padding; a 500-line file uses 3. The colon separator between the number and
            the content makes it unambiguous where the line number ends and the code begins.
          </p>
          <p className="text-gray-600 mb-4">
            This formatting is applied before the file content enters the model&apos;s context
            window, so the model always sees numbered lines and can reference them in its tool calls
            for creating or modifying files.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.FULL_FILE_READS}
                className="text-pink-600 hover:underline"
              >
                Full File Reads
              </Link>{" "}
              - ensures entire files are loaded so line numbers cover all content
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.DIFF_HUNK_REPAIR}
                className="text-pink-600 hover:underline"
              >
                Diff Hunk Repair
              </Link>{" "}
              - fixes diffs when line references are slightly off
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
