import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { getNavigation } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

export default function CiLogCleaningPage() {
  const { prev, next } = getNavigation(
    RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.CI_LOG_CLEANING,
  );
  return (
    <>
      <h1 className="text-4xl font-bold mb-8">CI Log Cleaning</h1>

      <div className="space-y-12">
        <section>
          <p className="text-gray-600 mb-4">
            GitAuto runs a multi-stage pipeline to clean CI logs before feeding them to the model.
            The pipeline removes non-diagnostic output from test runners, deduplicates repetitive
            linter warnings, strips ANSI escape codes, and reduces log verbosity. A 10,000-line raw
            log might shrink to 200 lines of actionable information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why This Exists</h2>
          <p className="text-gray-600 mb-4">
            Raw CI logs are extraordinarily noisy. They contain ANSI color codes (
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">\x1b[31m</code> sequences),
            thousands of lines of passing test output, the same linter warning repeated for every
            file, progress bars, download indicators, and framework boilerplate. Cleaning the logs
            first means the model receives a focused signal: just the errors, relevant warnings, and
            failure context. This dramatically improves fix accuracy and reduces the number of
            iterations needed to resolve CI failures.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Why Models Struggle With Raw Logs</h2>
          <p className="text-gray-600 mb-4">
            A 10,000-line log full of ANSI codes, progress bars, and passing test output fills the
            context window with noise, leaving less room for useful information. The real failure
            might be on line 8,743, but the model has to process thousands of irrelevant tokens to
            reach it. Worse, repetitive patterns (the same linter warning 50 times) mislead the
            model into over-prioritizing the repeated issue - it has no way to distinguish 50
            identical warnings from 50 distinct problems. Benchmarks evaluate models on clean,
            pre-processed inputs, so models receive no training signal for extracting signal from
            noisy logs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p className="text-gray-600 mb-4">The cleaning pipeline has 4 stages:</p>
          <ol className="list-decimal pl-8 text-gray-600 space-y-3 mb-4">
            <li>
              <strong>Test runner noise removal</strong> - strips non-diagnostic output like
              warnings summaries, passed test listings, progress indicators, and timing details,
              keeping only failure summaries and stack traces.
            </li>
            <li>
              <strong>Linter warning deduplication</strong> - when the same lint rule fires on 50
              files, the log keeps one example and a count instead of repeating the full warning 50
              times.
            </li>
            <li>
              <strong>ANSI code stripping</strong> - removes all terminal escape sequences so the
              model sees clean text instead of interleaved control characters.
            </li>
            <li>
              <strong>Verbosity reduction</strong> - collapses repetitive output patterns like
              dependency installation logs, download progress bars, and framework boilerplate into
              compact summaries.
            </li>
          </ol>
          <p className="text-gray-600 mb-4">
            Each stage runs sequentially, and the pipeline is extensible for new CI systems and
            frameworks.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Related Features</h2>
          <ul className="list-disc pl-8 text-gray-600 space-y-2">
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.ERROR_BASELINES}
                className="text-pink-600 hover:underline"
              >
                Error Baselines
              </Link>{" "}
              - separates pre-existing errors from new ones, another denoising technique
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.TOKEN_TRIMMING}
                className="text-pink-600 hover:underline"
              >
                Token Trimming
              </Link>{" "}
              - manages overall context window size after logs are cleaned
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
