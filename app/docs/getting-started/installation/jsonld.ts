import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Complete step-by-step installation guide for GitAuto. Learn how to install the GitHub App, configure repository access, and start automating unit test generation in minutes.";

/**
 * @see https://schema.org/HowTo
 */
export const installationJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.INSTALLATION + "#howto",
  name: `How to Install ${PRODUCT_NAME} - Complete Setup Guide`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.INSTALLATION,
  creator: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "Thing",
    name: "GitAuto Installation Process",
    description: "Installing and configuring GitAuto for automated unit test generation",
  },
  keywords: [
    "GitAuto installation",
    "GitHub App setup",
    "automated testing setup",
    "unit test automation",
    "repository configuration",
    "GitHub marketplace",
    "CI/CD integration",
    "test generation setup",
  ],
  totalTime: "PT5M",
  supply: [
    {
      "@type": "HowToSupply",
      name: "GitHub Account",
      description: "Active GitHub account with repository access",
    },
    {
      "@type": "HowToSupply",
      name: "Repository Access",
      description: "Admin or write access to the repositories you want to configure",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      name: "Install GitAuto GitHub App",
      text: "Visit the GitHub Marketplace and install GitAuto to your organization or selected repositories",
      url: ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO,
      image: {
        "@type": "ImageObject",
        url: `${ABSOLUTE_URLS.GITAUTO.INDEX}/docs/install-github-app.png`,
        description:
          "Screenshot of the GitHub App installation page showing repository selection options",
      },
    },
    {
      "@type": "HowToStep",
      name: "Configure Repository Access",
      text: "Select which repositories you want GitAuto to have access to. You can choose all repositories or select specific ones",
      image: {
        "@type": "ImageObject",
        url: `${ABSOLUTE_URLS.GITAUTO.INDEX}/docs/configure-repo-access.png`,
        description: "Screenshot showing how to configure repository access for GitAuto",
      },
    },
  ],
  result: {
    "@type": "Thing",
    name: "GitAuto Installation Complete",
    description:
      "GitAuto is now installed and ready to generate automated unit tests for your repositories",
  },
  mainEntity: {
    "@type": "SoftwareApplication",
    name: PRODUCT_NAME,
    description: "Automated unit test generation for GitHub repositories",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    offers: OFFERS,
  },
  screenshot: {
    "@type": "ImageObject",
    url: THUMBNAILS.DOCS.GETTING_STARTED.INSTALLATION,
    description: "GitAuto installation documentation showing step-by-step setup process",
  },
  educationalLevel: "Beginner",
  learningResourceType: "Tutorial",
  teaches: [
    "How to install GitAuto GitHub App",
    "Configuring repository access permissions",
    "Setting up automated test generation",
    "Understanding GitAuto workflow integration",
  ],
  isPartOf: {
    "@type": "Course",
    name: "GitAuto Getting Started Guide",
    description: "Complete guide to getting started with GitAuto automated testing",
    provider: CREATOR,
  },
  publisher: CREATOR,
  datePublished: "2025-06-17",
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en",
};
