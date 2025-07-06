// Third-party imports
import Image from "next/image";
import Link from "next/link";

// Local imports
import { DocsNavigation } from "@/app/components/docs/DocsNavigation";
import { ABSOLUTE_URLS, RELATIVE_URLS } from "@/config/urls";

export default function GettingStartedPage() {
  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Installing GitAuto</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <p className="text-lg text-gray-700">
          GitAuto helps engineering teams automatically create unit tests for their code without
          assigning human developers to the task.
        </p>

        <div className="space-y-12">
          {/* Installation */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                1
              </div>
              <h2 className="text-xl font-semibold my-4">Install the GitAuto GitHub App</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/install-github-app.png"
                alt="Screenshot of the GitHub App installation page showing repository selection options"
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              Visit the GitHub Marketplace and install GitAuto to your organization or selected
              repositories.
            </p>
            <div className="mt-4">
              <Link
                href={ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO}
                className="inline-block bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Install GitAuto GitHub App
              </Link>
            </div>
          </div>

          {/* Configuration */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-pink-600 text-white rounded-full w-7 h-7 flex items-center justify-center font-medium mr-3">
                2
              </div>
              <h2 className="text-xl font-semibold my-4">Configure repository access</h2>
            </div>
            <div className="mb-5">
              <Image
                src="/docs/configure-repo-access.png"
                alt="Screenshot showing how to configure repository access for GitAuto"
                width={700}
                height={400}
                className="w-full"
              />
            </div>
            <p>
              Select which repositories you want GitAuto to have access to. You can choose all
              repositories or select specific ones.
            </p>
          </div>
        </div>
      </div>

      <DocsNavigation
        nextLink={{
          href: RELATIVE_URLS.DOCS.TRIGGERS.OVERVIEW,
          title: "Triggers Overview",
        }}
      />
    </div>
  );
}
