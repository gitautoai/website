/**
 * Tests for the Vitest setup file
 * Note: This file tests the setup configuration rather than executing the setup itself
 */

describe(".storybook/vitest.setup.ts", () => {
  it("should import required modules", () => {
    // Test that the setup file can be imported without errors
    expect(() => {
      require("./vitest.setup");
    }).not.toThrow();
  });

  describe("module imports", () => {
    let setupModule: any;

    beforeAll(() => {
      // Mock the dependencies to avoid side effects during testing
      jest.mock("@storybook/addon-a11y/preview", () => ({}), { virtual: true });
      jest.mock("@storybook/nextjs-vite", () => ({
        setProjectAnnotations: jest.fn(),
      }), { virtual: true });
      jest.mock("./preview", () => ({}), { virtual: true });
    });

    it("should import a11y addon annotations", () => {
      // Verify that the a11y addon is being imported
      const fs = require("fs");
      const setupContent = fs.readFileSync(".storybook/vitest.setup.ts", "utf8");
      expect(setupContent).toContain("@storybook/addon-a11y/preview");
    });

    it("should import setProjectAnnotations from nextjs-vite", () => {
      const fs = require("fs");
      const setupContent = fs.readFileSync(".storybook/vitest.setup.ts", "utf8");
      expect(setupContent).toContain("@storybook/nextjs-vite");
      expect(setupContent).toContain("setProjectAnnotations");
    });

    it("should import local preview configuration", () => {
      const fs = require("fs");
      const setupContent = fs.readFileSync(".storybook/vitest.setup.ts", "utf8");
      expect(setupContent).toContain("./preview");
    });
  });

  describe("setup configuration", () => {
    it("should call setProjectAnnotations with correct parameters", () => {
      const fs = require("fs");
      const setupContent = fs.readFileSync(".storybook/vitest.setup.ts", "utf8");
      
      // Verify that setProjectAnnotations is called with an array containing both annotations
      expect(setupContent).toContain("setProjectAnnotations([a11yAddonAnnotations, projectAnnotations])");
    });
  });
});
