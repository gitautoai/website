/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { solutionJsonLd } from "./jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { AUDIENCE, CREATOR } from "@/app/jsonld";

describe("solutionJsonLd", () => {
  // ===== sociable =====
  // Verify that the JSON-LD object for the solution page is correctly constructed with expected schema.org types and config values
  it("should have the correct schema.org structure and values", () => {
    // Verify the basic structure and static values
    expect(solutionJsonLd["@context"]).toBe("https://schema.org");
    expect(solutionJsonLd["@type"]).toBe("WebPage");
    expect(solutionJsonLd.description).toBe(
      "The complete workflow GitAuto automates: detect untested files, write tests, open PRs, run CI, fix failures, address reviews, and iterate daily."
    );

    // Verify values derived from config
    expect(solutionJsonLd.name).toBe(`${PRODUCT_NAME} Solution`);
    expect(solutionJsonLd.url).toBe(ABSOLUTE_URLS.GITAUTO.SOLUTION);
    expect(solutionJsonLd["@id"]).toBe(`${ABSOLUTE_URLS.GITAUTO.SOLUTION}#webpage`);
    expect(solutionJsonLd.creator).toBe(CREATOR);
    expect(solutionJsonLd.audience).toBe(AUDIENCE);
    expect(solutionJsonLd.image).toBe(THUMBNAILS.PRICING);
  });
});
