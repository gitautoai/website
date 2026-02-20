import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { actionsJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Action Settings - Configure Pull Request Actions`,
  description: `Configure GitAuto PR action settings. Set up auto-merge behavior, merge methods, and control how GitAuto handles pull requests after creation.`,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.ACTIONS,
  images: [{ url: THUMBNAILS.SETTINGS.ACTIONS, alt: `${PRODUCT_NAME} Action Settings` }],
  keywords: [
    "GitAuto action settings",
    "auto-merge",
    "merge methods",
    "PR automation",
    "pull request actions",
  ],
});

export default function ActionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={actionsJsonLd} />
      {children}
    </>
  );
}
