import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { HOW_IT_WORKS_PAGES } from "@/app/docs/how-it-works/navigation";
import { RELATIVE_URLS } from "@/config/urls";

const categories = [
  {
    title: "Context Enrichment",
    description:
      "How GitAuto gathers the right context before generating tests - reading full files, detecting naming conventions, cleaning CI logs, and loading existing test examples.",
  },
  {
    title: "Output Auto-Correction",
    description:
      "Post-processing steps that fix common model output issues - repairing diff hunks, correcting tool names, sorting imports, and preserving line endings.",
  },
  {
    title: "Quality Verification",
    description:
      "Checks that run before committing generated code - formatting, linting, type checking, test execution, coverage enforcement, and dead code removal.",
  },
  {
    title: "Safety Guardrails",
    description:
      "Protections that prevent unintended side effects - file edit restrictions, race condition prevention, bot loop detection, and webhook deduplication.",
  },
  {
    title: "Token/Cost Management",
    description:
      "Optimizations that reduce token usage and CI costs - trimming context windows, deduplicating CI logs, removing stale file reads, and skipping intermediate CI runs.",
  },
  {
    title: "Resilience & Recovery",
    description:
      "How GitAuto handles failures gracefully - model fallback, overload retry with exponential backoff, forced verification, and dynamic edit permissions.",
  },
  {
    title: "Hallucination Prevention",
    description:
      "Techniques that keep generated code grounded in reality - web search for fact checking, URL fetching, anti-hallucination prompts, and review response guardrails.",
  },
];

export default function HowItWorksOverviewPage() {
  const grouped = categories.map((cat) => ({
    ...cat,
    items: HOW_IT_WORKS_PAGES.filter((p) => p.category === cat.title),
  }));

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">How It Works</h1>

      <div className="prose prose-lg max-w-none space-y-12">
        <p className="text-lg text-gray-700">
          GitAuto uses 50+ techniques across 7 categories to generate high-quality unit tests. Each
          technique solves a specific failure mode we encountered in production - from hallucinated
          imports to broken diffs to runaway CI costs.
        </p>

        <div className="space-y-10">
          {grouped.map((cat) => (
            <div key={cat.title}>
              <h2 className="text-2xl font-semibold mt-0 mb-2">{cat.title}</h2>
              <p className="text-gray-600 mb-4">{cat.description}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cat.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-pink-600 hover:text-pink-700 text-sm"
                    >
                      {item.title} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <DocsContact />

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.INTEGRATIONS.NPM,
          title: "npm Integration",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.LINE_NUMBERS,
          title: "Line Numbers",
        }}
      />
    </div>
  );
}
