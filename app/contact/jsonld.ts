import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

/**
 * @see https://schema.org/ContactPage
 */
export const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": ABSOLUTE_URLS.GITAUTO.CONTACT + "#contactpage",
  name: `Contact ${PRODUCT_NAME}`,
  description: "Get in touch with GitAuto to discuss your automated testing needs and challenges",
  url: ABSOLUTE_URLS.GITAUTO.CONTACT,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.CONTACT,
  mainEntity: {
    "@type": "Organization",
    "@id": ABSOLUTE_URLS.GITAUTO.INDEX + "#organization",
    name: PRODUCT_NAME,
    url: ABSOLUTE_URLS.GITAUTO.INDEX,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      availableLanguage: ["English", "Japanese"],
      areaServed: "Worldwide",
    },
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: ABSOLUTE_URLS.GITAUTO.INDEX,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact",
        item: ABSOLUTE_URLS.GITAUTO.CONTACT,
      },
    ],
  },
};
