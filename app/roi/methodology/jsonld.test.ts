import { methodologyJsonLd } from './jsonld';
import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

describe('methodologyJsonLd', () => {
  // ===== solitary =====

  it('should have the correct schema.org context and type', () => {
    // Verify that the JSON-LD object uses the correct schema.org context and is typed as a WebPage
    expect(methodologyJsonLd['@context']).toBe('https://schema.org');
    expect(methodologyJsonLd['@type']).toBe('WebPage');
  });

  it('should have the correct ID and URL', () => {
    // Verify that the @id and url properties are correctly derived from the ROI methodology absolute URL
    expect(methodologyJsonLd['@id']).toBe(`${ABSOLUTE_URLS.GITAUTO.ROI.METHODOLOGY}#webpage`);
    expect(methodologyJsonLd.url).toBe(ABSOLUTE_URLS.GITAUTO.ROI.METHODOLOGY);
  });

  it('should have the correct name and description', () => {
    // Verify that the name includes the product name and the description is correct
    expect(methodologyJsonLd.name).toBe(`${PRODUCT_NAME} ROI Methodology`);
    expect(methodologyJsonLd.description).toBe('How GitAuto calculates ROI for automated test generation with real-world examples');
  });

  it('should have the correct creator, audience, and image', () => {
    // Verify that the creator, audience, and image are correctly assigned from the shared constants
    expect(methodologyJsonLd.creator).toBe(CREATOR);
    expect(methodologyJsonLd.audience).toBe(AUDIENCE);
    expect(methodologyJsonLd.image).toBe(THUMBNAILS.PRICING);
  });
});
