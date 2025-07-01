/**
 * Tests for the Vitest setup file
 * Note: This file tests the setup configuration rather than executing the setup itself
 */

const fs = require("fs");

describe(".storybook/vitest.setup.ts", () => {
  let setupContent: string;

  beforeAll(() => {
    // Read the setup file content for testing
    const setupPath = path.join(__dirname, "vitest.setup.ts");
    setupContent = fs.readFileSync(setupPath, "utf8");
  });

  describe("file structure", () => {
    it("should exist", () => {
      const setupPath = path.join(__dirname, "vitest.setup.ts");
      expect(fs.existsSync(setupPath)).toBe(true);
    });

    it("should be a TypeScript file", () => {
      expect(setupContent).toBeDefined();
      expect(typeof setupContent).toBe("string");
      expect(setupContent.length).toBeGreaterThan(0);
    });
  });

  describe("module imports", () => {
    it("should import a11y addon annotations", () => {
      expect(setupContent).toContain("@storybook/addon-a11y/preview");
      expect(setupContent).toMatch(/import.*a11yAddonAnnotations.*from.*@storybook\/addon-a11y\/preview/);
    });

    it("should import setProjectAnnotations from nextjs-vite", () => {
      expect(setupContent).toContain("@storybook/nextjs-vite");
      expect(setupContent).toContain("setProjectAnnotations");
      expect(setupContent).toMatch(/import.*setProjectAnnotations.*from.*@storybook\/nextjs-vite/);
    });

    it("should import local preview configuration", () => {
      expect(setupContent).toContain("./preview");
      expect(setupContent).toMatch(/import.*projectAnnotations.*from.*\.\/preview/);
    });
  });

  describe("setup configuration", () => {
    it("should call setProjectAnnotations with correct parameters", () => {
      // Verify that setProjectAnnotations is called with an array containing both annotations
      expect(setupContent).toContain("setProjectAnnotations([a11yAddonAnnotations, projectAnnotations])");
    });

    it("should have proper import structure", () => {
      // Check that imports are properly structured
      const lines = setupContent.split('\n');
      const importLines = lines.filter(line => line.trim().startsWith('import'));
      
      expect(importLines).toHaveLength(3);
      expect(importLines[0]).toMatch(/import \* as a11yAddonAnnotations from/);
      expect(importLines[1]).toMatch(/import.*setProjectAnnotations.*from/);
      expect(importLines[2]).toMatch(/import \* as projectAnnotations from/);
    });

    it("should have comments explaining the setup", () => {
      expect(setupContent).toContain("This is an important step");
      expect(setupContent).toContain("More info at:");
      expect(setupContent).toContain("storybook.js.org");
    });
  });

  describe("configuration validation", () => {
    it("should use correct variable names", () => {
      expect(setupContent).toContain("a11yAddonAnnotations");
      expect(setupContent).toContain("projectAnnotations");
    });

    it("should pass annotations in correct order", () => {
      // a11y annotations should come first, then project annotations
      const setProjectAnnotationsMatch = setupContent.match(/setProjectAnnotations\(\[(.*?)\]\)/);
      expect(setProjectAnnotationsMatch).toBeTruthy();
      
      if (setProjectAnnotationsMatch) {
        const params = setProjectAnnotationsMatch[1];
        expect(params).toContain("a11yAddonAnnotations, projectAnnotations");
      }
    });
  });
});
