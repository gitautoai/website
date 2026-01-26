import Link from "next/link";
import { RELATIVE_URLS } from "@/config/urls";

export function MultiLanguageLink() {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mt-8 mb-8">
      <p className="text-gray-700">
        <strong>Using multiple languages?</strong> If your repository has multiple programming
        languages (the docs use PHP + JavaScript as an example, but any combination works), see our{" "}
        <Link
          href={RELATIVE_URLS.DOCS.COVERAGE.MULTI_LANGUAGE}
          className="text-pink-600 hover:text-pink-700 underline"
        >
          Multi-Language Coverage
        </Link>{" "}
        guide for setting up coverage across all languages.
      </p>
    </div>
  );
}
