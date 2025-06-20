// Third-party imports
import Link from "next/link";
import { usePostHog } from "posthog-js/react";

// Local imports
import { useAccountContext } from "@/app/components/contexts/Account";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS, RELATIVE_URLS } from "@/config/urls";

export default function HowToGetStarted() {
  const posthog = usePostHog();
  const { currentOwnerType, currentOwnerName, currentInstallationId } = useAccountContext();

  // If installed, generate URL based on current Org/User
  const getManageReposUrl = () => {
    if (currentOwnerType === "Organization" && currentOwnerName)
      return `https://github.com/organizations/${currentOwnerName}/settings/installations/${currentInstallationId}`;
    return ABSOLUTE_URLS.GITHUB.INSTALLED_APPS + "/" + currentInstallationId;
  };

  const steps = [
    {
      title: `Install ${PRODUCT_NAME}`,
      description: "Simple one-click installation process that takes less than 2 minutes",
      ctaText: "Install Now",
      ctaLink: ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO,
      ctaAction: () => {
        posthog.capture("$click", {
          $event_type: "github_app_install",
          $current_url: window.location.href,
        });
      },
    },
    {
      title: "Select repositories",
      description: "Choose which repositories to test - you can change this anytime",
      ctaText: "Manage Repositories",
      ctaLink: getManageReposUrl(),
    },
    {
      title: "Free to start",
      description: "No payment method required to get started with the free plan",
      ctaText: "Learn More",
      ctaLink: RELATIVE_URLS.DOCS.GETTING_STARTED.INSTALLATION,
    },
    {
      title: "You're all set!",
      description: "GitAuto will automatically create pull requests with tests",
      ctaText: "Learn More",
      ctaLink: RELATIVE_URLS.DOCS.GETTING_STARTED.ISSUE_CHECKBOX_TRIGGER,
    },
  ];

  return (
    <section
      id="how-to-get-started"
      className="w-full max-w-5xl mx-auto py-20 px-4"
      aria-label="How to Get Started section"
    >
      <h2 className="text-2xl md:text-4xl font-bold mb-12 text-center">How to Get Started</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-lg shadow-md p-6 flex flex-col items-start border border-gray-100 hover:shadow-lg transition-shadow h-full"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold mr-3">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
            </div>

            <p className="text-gray-600 mb-4">{step.description}</p>

            {step.ctaText && step.ctaLink && (
              <Link
                href={step.ctaLink}
                target={step.ctaLink.startsWith("http") ? "_blank" : "_self"}
                onClick={step.ctaAction}
                className="mt-auto inline-flex items-center text-pink-600 font-medium hover:text-pink-800"
              >
                {step.ctaText}
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
