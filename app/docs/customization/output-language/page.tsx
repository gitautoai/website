import Link from "next/link";
import { DocsContact } from "@/app/components/docs/DocsContact";
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { SUPPORTED_LANGUAGES } from "@/config/languages";
import { RELATIVE_URLS } from "@/config/urls";

export default function OutputLanguagePage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Output Language</h1>

      <div className="prose prose-lg max-w-none space-y-12">
        <section>
          <h2 className="text-3xl font-semibold mt-0 mb-6">Why Output Language?</h2>
          <p className="text-gray-700 mb-4">
            AI coding agents generate more PRs and review comments than ever. Human reviewers -
            especially non-English speakers - can become overwhelmed reading everything in English.
            Output Language lets you configure GitAuto to write code comments and GitHub comments in
            your team&apos;s native language, so reviewers can read faster and merge sooner.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mt-0 mb-6">What Changes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 pr-4 text-gray-900 font-semibold">Content</th>
                  <th className="py-3 pl-4 text-gray-900 font-semibold">Language Used</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4">Code comments in generated code</td>
                  <td className="py-3 pl-4">Your chosen language</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4">GitHub PR comments and review replies</td>
                  <td className="py-3 pl-4">Your chosen language</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4">PR title</td>
                  <td className="py-3 pl-4">English (always)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">PR body</td>
                  <td className="py-3 pl-4">English (always)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-600 text-sm mt-2">
            PR titles and bodies remain in English because they are constructed programmatically and
            contain links, mentions, and structured data.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mt-0 mb-6">How to Configure</h2>
          <ol className="list-decimal pl-6 space-y-3 text-gray-700">
            <li>
              Go to your{" "}
              <Link
                href={RELATIVE_URLS.SETTINGS.RULES}
                className="text-pink-600 hover:text-pink-700 underline"
              >
                Rules Settings
              </Link>
            </li>
            <li>Select the repository you want to configure</li>
            <li>Choose a language from the Language dropdown (next to Target Branch)</li>
            <li>The setting auto-saves immediately and applies to the next GitAuto task</li>
          </ol>
          <p className="text-gray-700 mt-4">
            The language is configured per repository. Different repositories can use different
            languages - useful when your team works across multiple projects with different
            audiences.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mt-0 mb-6">Supported Languages</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                className="px-3 py-2 bg-gray-50 rounded text-sm text-gray-700 flex justify-between"
              >
                <span>{lang.name}</span>
                <span className="text-gray-400">{lang.code}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-sm mt-4">
            Need a language not listed here?{" "}
            <Link
              href={RELATIVE_URLS.CONTACT}
              className="text-pink-600 hover:text-pink-700 underline"
            >
              Let us know
            </Link>{" "}
            and we can add it.
          </p>
        </section>

        <DocsContact
          title="Questions?"
          description="Need help configuring the output language for your repositories? We're happy to help."
          callToAction="Contact us"
          linkText="with your questions."
        />
      </div>

      <DocsNavigation
        previousLink={{
          href: RELATIVE_URLS.DOCS.CUSTOMIZATION.REPOSITORY_RULES,
          title: "Repository Rules",
        }}
        nextLink={{
          href: RELATIVE_URLS.DOCS.CUSTOMIZATION.GITAUTO_MD,
          title: "GITAUTO.md",
        }}
      />
    </div>
  );
}
