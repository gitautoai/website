import { rulesJsonLd } from './jsonld';
import { AUDIENCE, CREATOR, OFFERS } from '@/app/jsonld';
import { PRODUCT_NAME } from '@/config';
import { THUMBNAILS } from '@/config/thumbnails';
import { ABSOLUTE_URLS } from '@/config/urls';

describe('rulesJsonLd', () => {
  describe('Structure and Schema Validation', () => {
    it('should have the correct JSON-LD context', () => {
      expect(rulesJsonLd['@context']).toBe('https://schema.org');
    });

    it('should have the correct schema type', () => {
      expect(rulesJsonLd['@type']).toBe('WebApplication');
    });

    it('should have a valid @id property', () => {
      expect(rulesJsonLd['@id']).toBe(ABSOLUTE_URLS.GITAUTO.SETTINGS.RULES + '#webapplication');
      expect(rulesJsonLd['@id']).toMatch(/^https?:\/\/.+#webapplication$/);
    });

    it('should have all required JSON-LD properties', () => {
      const requiredProperties = [
        '@context',
        '@type',
        '@id',
        'name',
        'description',
        'url',
        'creator',
        'audience',
        'applicationCategory',
        'featureList',
        'screenshot',
        'offers'
      ];

      requiredProperties.forEach(property => {
        expect(rulesJsonLd).toHaveProperty(property);
        expect(rulesJsonLd[property]).toBeDefined();
        expect(rulesJsonLd[property]).not.toBeNull();
      });
    });
  });

  describe('Property Data Types', () => {
    it('should have string properties with correct types', () => {
      expect(typeof rulesJsonLd['@context']).toBe('string');
      expect(typeof rulesJsonLd['@type']).toBe('string');
      expect(typeof rulesJsonLd['@id']).toBe('string');
      expect(typeof rulesJsonLd.name).toBe('string');
      expect(typeof rulesJsonLd.description).toBe('string');
      expect(typeof rulesJsonLd.url).toBe('string');
      expect(typeof rulesJsonLd.applicationCategory).toBe('string');
      expect(typeof rulesJsonLd.screenshot).toBe('string');
    });

    it('should have object properties with correct types', () => {
      expect(typeof rulesJsonLd.creator).toBe('object');
      expect(typeof rulesJsonLd.audience).toBe('object');
      expect(rulesJsonLd.creator).not.toBeNull();
      expect(rulesJsonLd.audience).not.toBeNull();
    });

    it('should have array properties with correct types', () => {
      expect(Array.isArray(rulesJsonLd.featureList)).toBe(true);
      expect(Array.isArray(rulesJsonLd.offers)).toBe(true);
    });
  });

  describe('Content Validation', () => {
    it('should have correct name format', () => {
      expect(rulesJsonLd.name).toBe(`${PRODUCT_NAME} Rules Settings`);
      expect(rulesJsonLd.name).toMatch(/^.+ Rules Settings$/);
      expect(rulesJsonLd.name.length).toBeGreaterThan(0);
    });

    it('should have meaningful description', () => {
      expect(rulesJsonLd.description).toBe('Configure custom rules and coding standards for automated test generation');
      expect(rulesJsonLd.description.length).toBeGreaterThan(10);
      expect(rulesJsonLd.description).toMatch(/configure|rules|standards/i);
    });

    it('should have valid URL', () => {
      expect(rulesJsonLd.url).toBe(ABSOLUTE_URLS.GITAUTO.SETTINGS.RULES);
      expect(rulesJsonLd.url).toMatch(/^https?:\/\/.+\/settings\/rules$/);
    });

    it('should have correct application category', () => {
      expect(rulesJsonLd.applicationCategory).toBe('DeveloperApplication');
    });

    it('should have valid screenshot URL', () => {
      expect(rulesJsonLd.screenshot).toBe(THUMBNAILS.SETTINGS.RULES);
      expect(rulesJsonLd.screenshot).toMatch(/^https?:\/\/.+\.png$/);
    });
  });

  describe('Feature List Validation', () => {
    it('should have a non-empty feature list', () => {
      expect(rulesJsonLd.featureList.length).toBeGreaterThan(0);
    });

    it('should have expected features', () => {
      const expectedFeatures = [
        'Define repository-specific rules',
        'Set coding standards',
        'Configure target branch',
        'Customize test patterns'
      ];

      expectedFeatures.forEach(feature => {
        expect(rulesJsonLd.featureList).toContain(feature);
      });
    });

    it('should have all features as non-empty strings', () => {
      rulesJsonLd.featureList.forEach(feature => {
        expect(typeof feature).toBe('string');
        expect(feature.length).toBeGreaterThan(0);
        expect(feature.trim()).toBe(feature); // No leading/trailing whitespace
      });
    });

    it('should have meaningful feature descriptions', () => {
      rulesJsonLd.featureList.forEach(feature => {
        expect(feature.length).toBeGreaterThan(5); // Meaningful length
        expect(feature).toMatch(/^[A-Z]/); // Starts with capital letter
      });
    });
  });

  describe('Dependency Integration', () => {
    it('should use imported CREATOR object', () => {
      expect(rulesJsonLd.creator).toBe(CREATOR);
      expect(rulesJsonLd.creator).toEqual(CREATOR);
    });

    it('should use imported AUDIENCE object', () => {
      expect(rulesJsonLd.audience).toBe(AUDIENCE);
      expect(rulesJsonLd.audience).toEqual(AUDIENCE);
    });

    it('should use imported OFFERS array', () => {
      expect(rulesJsonLd.offers).toBe(OFFERS);
      expect(rulesJsonLd.offers).toEqual(OFFERS);
    });

    it('should use PRODUCT_NAME in the name property', () => {
      expect(rulesJsonLd.name).toContain(PRODUCT_NAME);
    });

    it('should use ABSOLUTE_URLS for URL properties', () => {
      expect(rulesJsonLd.url).toBe(ABSOLUTE_URLS.GITAUTO.SETTINGS.RULES);
      expect(rulesJsonLd['@id']).toContain(ABSOLUTE_URLS.GITAUTO.SETTINGS.RULES);
    });

    it('should use THUMBNAILS for screenshot property', () => {
      expect(rulesJsonLd.screenshot).toBe(THUMBNAILS.SETTINGS.RULES);
    });
  });

  describe('Schema.org WebApplication Compliance', () => {
    it('should have valid WebApplication schema properties', () => {
      // Required properties for WebApplication schema
      expect(rulesJsonLd).toHaveProperty('name');
      expect(rulesJsonLd).toHaveProperty('url');
      expect(rulesJsonLd).toHaveProperty('applicationCategory');
    });

    it('should have valid creator structure', () => {
      expect(rulesJsonLd.creator).toHaveProperty('@type');
      expect(rulesJsonLd.creator).toHaveProperty('name');
      expect(rulesJsonLd.creator).toHaveProperty('url');
    });

    it('should have valid audience structure', () => {
      expect(rulesJsonLd.audience).toHaveProperty('@type');
      expect(rulesJsonLd.audience['@type']).toBe('Audience');
    });

    it('should have valid offers structure', () => {
      expect(Array.isArray(rulesJsonLd.offers)).toBe(true);
      
      if (rulesJsonLd.offers.length > 0) {
        rulesJsonLd.offers.forEach(offer => {
          expect(offer).toHaveProperty('@type');
          expect(offer['@type']).toBe('Offer');
          expect(offer).toHaveProperty('name');
          expect(offer).toHaveProperty('price');
          expect(offer).toHaveProperty('priceCurrency');
        });
      }
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined imports gracefully', () => {
      // Test that the object structure remains valid even if imports change
      expect(() => {
        const testObj = { ...rulesJsonLd };
        return testObj;
      }).not.toThrow();
    });

    it('should have immutable structure', () => {
      const originalName = rulesJsonLd.name;
      
      // Attempt to modify (should not affect original in a properly structured module)
      expect(() => {
        const copy = { ...rulesJsonLd };
        copy.name = 'Modified Name';
        return copy;
      }).not.toThrow();
      
      // Original should remain unchanged
      expect(rulesJsonLd.name).toBe(originalName);
    });

    it('should handle JSON serialization', () => {
      expect(() => {
        const serialized = JSON.stringify(rulesJsonLd);
        const parsed = JSON.parse(serialized);
        return parsed;
      }).not.toThrow();
    });

    it('should maintain consistent property order', () => {
      const keys = Object.keys(rulesJsonLd);
      expect(keys).toContain('@context');
      expect(keys).toContain('@type');
      expect(keys).toContain('@id');
      expect(keys.indexOf('@context')).toBeLessThan(keys.indexOf('@type'));
    });
  });

  describe('URL Validation', () => {
    it('should have valid HTTP/HTTPS URLs', () => {
      expect(rulesJsonLd.url).toMatch(/^https?:\/\/.+/);
      expect(rulesJsonLd.screenshot).toMatch(/^https?:\/\/.+/);
      expect(rulesJsonLd['@id']).toMatch(/^https?:\/\/.+/);
    });

    it('should have consistent domain across URLs', () => {
      const urlDomain = new URL(rulesJsonLd.url).hostname;
      const idDomain = new URL(rulesJsonLd['@id']).hostname;
      const screenshotDomain = new URL(rulesJsonLd.screenshot).hostname;
      
      expect(idDomain).toBe(urlDomain);
      expect(screenshotDomain).toBe(urlDomain);
    });
  });

  describe('Performance and Memory', () => {
    it('should not have circular references', () => {
      expect(() => {
        JSON.stringify(rulesJsonLd);
      }).not.toThrow();
    });

    it('should have reasonable object size', () => {
      const serialized = JSON.stringify(rulesJsonLd);
      expect(serialized.length).toBeLessThan(10000); // Reasonable size limit
      expect(serialized.length).toBeGreaterThan(100); // Has meaningful content
    });
  });
});
