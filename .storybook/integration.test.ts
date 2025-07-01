/**
 * Integration tests for Storybook configuration
 * These tests verify that all configuration files work together correctly
 */

import mainConfig from "./main";
import previewConfig from "./preview";
const fs = require("fs");

describe("Storybook Configuration Integration", () => {
  describe("configuration compatibility", () => {
    it("should have compatible framework and addons", () => {
      const framework = mainConfig.framework.name;
      const addons = mainConfig.addons;
      
      // Verify that nextjs-vite framework is compatible with selected addons
      expect(framework).toBe("@storybook/nextjs-vite");
      
      // These addons should work well with nextjs-vite
      const compatibleAddons = [
        "@chromatic-com/storybook",
        "@storybook/addon-docs",
        "@storybook/addon-a11y",
        "@storybook/addon-vitest"
      ];
      
      compatibleAddons.forEach(addon => {
        expect(addons).toContain(addon);
      });
    });

    it("should have consistent accessibility configuration", () => {
      // Verify that a11y addon is included in main config
      expect(mainConfig.addons).toContain("@storybook/addon-a11y");
      
      // Verify that preview config has a11y parameters
      expect(previewConfig.parameters.a11y).toBeDefined();
      expect(previewConfig.parameters.a11y.test).toBe("todo");
    });

    it("should have vitest addon with proper setup", () => {
      // Verify vitest addon is included
      expect(mainConfig.addons).toContain("@storybook/addon-vitest");
      
      // Verify setup file exists (this is tested indirectly)
      expect(fs.existsSync(".storybook/vitest.setup.ts")).toBe(true);
    });
  });

  describe("file structure validation", () => {
    it("should have all required configuration files", () => {
      
      expect(fs.existsSync(".storybook/main.ts")).toBe(true);
      expect(fs.existsSync(".storybook/preview.ts")).toBe(true);
      expect(fs.existsSync(".storybook/vitest.setup.ts")).toBe(true);
    });
  });
});
