import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { ABSOLUTE_URLS } from "@/config/urls";

type BlogPost = {
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  author?: string;
  authorUrl?: string;
  tags?: string[];
};

export function createBlogPostJsonLd(post: BlogPost, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${ABSOLUTE_URLS.GITAUTO.BLOG}/${slug}#blogpost`,
    headline: post.title,
    description: post.description,
    url: `${ABSOLUTE_URLS.GITAUTO.BLOG}/${slug}`,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author || "Wes Nishio",
      url: post.authorUrl || "https://www.linkedin.com/in/hiroshi-nishio/",
    },
    publisher: CREATOR,
    audience: AUDIENCE,
    keywords: post.tags || [],
    isPartOf: {
      "@type": "Blog",
      "@id": ABSOLUTE_URLS.GITAUTO.BLOG + "#blog",
      name: "GitAuto Blog",
      url: ABSOLUTE_URLS.GITAUTO.BLOG,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${ABSOLUTE_URLS.GITAUTO.BLOG}/${slug}`,
    },
  };
}
