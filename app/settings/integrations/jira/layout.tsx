import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { jiraIntegrationJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Jira Integration - Connect GitAuto with Atlassian Jira`,
  description: `Connect Jira sites with GitHub repositories to trigger GitAuto from Jira issues. Link Jira projects to GitHub repos for automated testing.`,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.INTEGRATIONS.JIRA,
  images: [{ url: THUMBNAILS.SETTINGS.INTEGRATIONS.JIRA, alt: `${PRODUCT_NAME} Jira Integration` }],
  keywords: [
    "GitAuto Jira integration",
    "Atlassian Jira connection",
    "GitHub Jira integration",
    "automated issue tracking",
    "test generation workflow",
  ],
});

export default function JiraIntegrationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={jiraIntegrationJsonLd} />
      {children}
    </>
  );
}
