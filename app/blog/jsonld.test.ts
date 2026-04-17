import { blogJsonLd } from "./jsonld";
import { PRODUCT_NAME } from "@/config";
import { KEYWORDS } from "@/config/keywords";
import { ABSOLUTE_URLS } from "@/config/urls";
import { AUDIENCE, CREATOR } from "@/app/jsonld";

describe("blogJsonLd", () => {
  // ===== sociable =====
  test("should have the correct structure and values based on current config", () => {
    // Verify basic schema.org properties
    expect(blogJsonLd["@context"]).toBe("https://schema.org");
    expect(blogJsonLd["@type"]).toBe("Blog");

    // Verify dynamic values from config
    expect(blogJsonLd["@id"]).toBe(`${ABSOLUTE_URLS.GITAUTO.BLOG}#blog`);
    expect(blogJsonLd.name).toBe(`${PRODUCT_NAME} Blog`);
    expect(blogJsonLd.url).toBe(ABSOLUTE_URLS.GITAUTO.BLOG);
    expect(blogJsonLd.creator).toBe(CREATOR);
    expect(blogJsonLd.audience).toBe(AUDIENCE);
    expect(blogJsonLd.keywords).toBe(KEYWORDS);

    // Verify static description
    expect(blogJsonLd.description).toBe(
      "Insights on automated testing, unit test generation, and software development best practices"
    );
  });

  // ===== solitary =====
  describe("solitary", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    test("should correctly assemble the object using provided dependencies", async () => {
      // Mock dependencies before requiring the module
      jest.doMock("@/config", () => ({
        PRODUCT_NAME: "MockProduct",
      }));
      jest.doMock("@/config/keywords", () => ({
        KEYWORDS: ["mock", "keywords"],
      }));
      jest.doMock("@/config/urls", () => ({
        ABSOLUTE_URLS: {
          GITAUTO: {
            BLOG: "https://mock.ai/blog",
          },
        },
      }));
      jest.doMock("@/app/jsonld", () => ({
        AUDIENCE: { "@type": "Audience", audienceType: "MockAudience" },
        CREATOR: { "@type": "Organization", name: "MockCreator" },
      }));

      const { blogJsonLd: mockedBlogJsonLd } = await import("./jsonld");

      // Verify that the object is constructed using the mocked values
      expect(mockedBlogJsonLd.name).toBe("MockProduct Blog");
      expect(mockedBlogJsonLd.url).toBe("https://mock.ai/blog");
      expect(mockedBlogJsonLd["@id"]).toBe("https://mock.ai/blog#blog");
      expect(mockedBlogJsonLd.keywords).toEqual(["mock", "keywords"]);
      expect(mockedBlogJsonLd.audience).toEqual({ "@type": "Audience", audienceType: "MockAudience" });
      expect(mockedBlogJsonLd.creator).toEqual({ "@type": "Organization", name: "MockCreator" });
    });
  });
});
