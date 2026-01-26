import Link from "next/link";
import { RELATIVE_URLS } from "@/config/urls";

interface MultiLanguageChartInfoProps {
  linkTo: "charts" | "multi-language";
}

export const MultiLanguageChartInfo = ({ linkTo }: MultiLanguageChartInfoProps) => (
  <section>
    <h2 className="text-2xl font-semibold mb-4 text-left">
      {linkTo === "charts" ? "Chart Visualization" : "Multi-Language Repositories"}
    </h2>
    <p className="text-gray-600 mb-4">
      {linkTo === "charts"
        ? "The Coverage Charts page handles multi-language repositories with separate charts:"
        : "For repositories with multiple programming languages, the charts display coverage separately for each language:"}
    </p>
    <ul className="list-disc list-outside space-y-2 text-gray-600 mb-6 ml-5">
      <li>
        <strong>Per-language charts:</strong> Each language gets its own chart (e.g., &quot;my-repo
        (PHP)&quot; and &quot;my-repo (JavaScript)&quot;)
      </li>
      <li>
        <strong>Total coverage:</strong> The &quot;Total Coverage&quot; chart aggregates all
        languages across all repos using weighted averages based on lines of code
      </li>
      <li>
        <strong>Single-language repos:</strong> Repos with only one language show without the
        language suffix
      </li>
    </ul>
    <p className="text-gray-600">
      See{" "}
      <Link
        href={
          linkTo === "charts"
            ? RELATIVE_URLS.DOCS.COVERAGE.CHARTS
            : RELATIVE_URLS.DOCS.COVERAGE.MULTI_LANGUAGE
        }
        className="text-pink-600 hover:text-pink-700 underline"
      >
        {linkTo === "charts" ? "Coverage Charts" : "Multi-Language Coverage"}
      </Link>{" "}
      {linkTo === "charts"
        ? "for more details on interpreting your coverage data."
        : "for setup instructions."}
    </p>
  </section>
);
