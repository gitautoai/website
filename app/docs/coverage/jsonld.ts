import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Comprehensive guide to setting up test coverage reporting for GitAuto. Learn how to configure LCOV coverage reports for JavaScript, Python, Flutter and other frameworks to enable automated test generation.";

const PROGRAMMING_LANGUAGES = ["JavaScript", "TypeScript", "Python", "Dart", "Flutter", "Node.js"];

/**
 * @see https://schema.org/TechArticle
 */
export const coverageDocsJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.OVERVIEW + "#techarticle",
  name: `${PRODUCT_NAME} Coverage Documentation - Setup Guide for All Frameworks`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.OVERVIEW,
  creator: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "Thing",
    name: "Test Coverage Configuration",
    description: "Setting up LCOV coverage reporting for automated test generation",
  },
  articleSection: "Documentation",
  genre: "Technical Documentation",
  keywords: [
    "test coverage",
    "LCOV format",
    "coverage report",
    "GitHub Actions",
    "automated testing",
    "unit test generation",
    "Jest coverage",
    "pytest coverage",
    "Flutter coverage",
    "JavaScript testing",
    "Python testing",
    "TypeScript testing",
  ],
  educationalLevel: "Intermediate",
  learningResourceType: "Tutorial",
  teaches: [
    "How to configure LCOV coverage reports",
    "Setting up GitHub Actions artifacts",
    "Configuring Jest for coverage reporting",
    "Setting up pytest with coverage.py",
    "Flutter test coverage configuration",
    "Understanding GitAuto coverage requirements",
  ],
  programmingLanguage: PROGRAMMING_LANGUAGES,
  runtimePlatform: "GitHub Actions",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "All",
  browserRequirements: "Modern web browser with JavaScript enabled",
  screenshot: {
    "@type": "ImageObject",
    url: THUMBNAILS.DOCS.COVERAGE.INDEX,
    description:
      "GitAuto Coverage Documentation interface showing setup guides for different frameworks",
  },
  mainEntity: {
    "@type": "HowTo",
    name: "How to Setup Coverage Reporting for GitAuto",
    description:
      "Step-by-step guide to configure test coverage reporting for automated test generation",
    totalTime: "PT15M",
    supply: [
      {
        "@type": "HowToSupply",
        name: "GitHub Repository",
        description: "Repository with existing code and tests",
      },
      {
        "@type": "HowToSupply",
        name: "GitHub Actions Workflow",
        description: "CI/CD pipeline for running tests",
      },
    ],
    tool: [
      {
        "@type": "HowToTool",
        name: "Testing Framework",
        description: "Jest, pytest, Flutter test, or other framework that supports LCOV",
      },
      {
        "@type": "HowToTool",
        name: "Coverage Tool",
        description: "Coverage.js, coverage.py, or built-in framework coverage",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        name: "Configure Coverage Generation",
        text: "Set up your testing framework to generate LCOV format coverage reports",
      },
      {
        "@type": "HowToStep",
        name: "Save Coverage Report",
        text: "Ensure coverage report is saved as coverage/lcov.info",
      },
      {
        "@type": "HowToStep",
        name: "Upload as Artifact",
        text: "Upload the coverage report as GitHub Actions artifact named 'coverage-report'",
      },
      {
        "@type": "HowToStep",
        name: "Enable GitAuto",
        text: "GitAuto will automatically detect and analyze the coverage reports",
      },
    ],
  },
  mentions: [
    {
      "@type": "SoftwareApplication",
      name: "Jest",
      description: "JavaScript testing framework with built-in coverage",
    },
    {
      "@type": "SoftwareApplication",
      name: "pytest",
      description: "Python testing framework with coverage.py integration",
    },
    {
      "@type": "SoftwareApplication",
      name: "Flutter Test",
      description: "Flutter's built-in testing framework with coverage support",
    },
    {
      "@type": "SoftwareApplication",
      name: "GitHub Actions",
      description: "CI/CD platform for automated testing and coverage reporting",
    },
  ],
  hasPart: [
    {
      "@type": "TechArticle",
      name: "JavaScript/TypeScript Coverage Setup",
      url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.JAVASCRIPT,
      description: "Detailed guide for Jest, Vitest, and other JavaScript testing frameworks",
    },
    {
      "@type": "TechArticle",
      name: "Python Coverage Setup",
      url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.PYTHON,
      description: "Comprehensive guide for pytest and other Python testing frameworks",
    },
    {
      "@type": "TechArticle",
      name: "Flutter Coverage Setup",
      url: ABSOLUTE_URLS.GITAUTO.DOCS.COVERAGE.FLUTTER,
      description: "Step-by-step guide for Flutter's built-in test framework",
    },
  ],
  isPartOf: {
    "@type": "WebSite",
    name: `${PRODUCT_NAME} Documentation`,
    url: ABSOLUTE_URLS.GITAUTO.INDEX,
    description: "Complete documentation for GitAuto QA automation platform",
  },
  publisher: CREATOR,
  datePublished: "2025-06-17",
  dateModified: new Date().toISOString().split("T")[0],
  inLanguage: "en",
  offers: OFFERS,
};
