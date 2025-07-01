import type { StorybookConfig } from "@storybook/nextjs-vite";
import config from "./main";

describe(".storybook/main.ts", () => {
  it("should export a valid StorybookConfig object", () => {
    expect(config).toBeDefined();
    expect(typeof config).toBe("object");
  });

  describe("stories configuration", () => {
    it("should have stories array with correct patterns", () => {
      expect(config.stories).toBeDefined();
      expect(Array.isArray(config.stories)).toBe(true);
      expect(config.stories).toHaveLength(2);
    });

    it("should include MDX files pattern", () => {
      expect(config.stories).toContain("../stories/**/*.mdx");
    });

    it("should include stories files pattern for multiple extensions", () => {
      expect(config.stories).toContain("../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)");
    });
  });

  describe("addons configuration", () => {
    it("should have addons array with required addons", () => {
      expect(config.addons).toBeDefined();
      expect(Array.isArray(config.addons)).toBe(true);
      expect(config.addons).toHaveLength(4);
    });

    it("should include Chromatic addon", () => {
      expect(config.addons).toContain("@chromatic-com/storybook");
    });

    it("should include docs addon", () => {
      expect(config.addons).toContain("@storybook/addon-docs");
    });

    it("should include accessibility addon", () => {
      expect(config.addons).toContain("@storybook/addon-a11y");
    });

    it("should include vitest addon", () => {
      expect(config.addons).toContain("@storybook/addon-vitest");
    });
  });

  describe("framework configuration", () => {
    it("should have framework configuration", () => {
      expect(config.framework).toBeDefined();
      expect(typeof config.framework).toBe("object");
    });

    it("should use nextjs-vite framework", () => {
      expect(config.framework.name).toBe("@storybook/nextjs-vite");
    });

    it("should have empty options object", () => {
      expect(config.framework.options).toBeDefined();
      expect(typeof config.framework.options).toBe("object");
      expect(Object.keys(config.framework.options)).toHaveLength(0);
    });
  });

  describe("staticDirs configuration", () => {
    it("should have staticDirs array", () => {
      expect(config.staticDirs).toBeDefined();
      expect(Array.isArray(config.staticDirs)).toBe(true);
      expect(config.staticDirs).toHaveLength(1);
    });

    it("should include public directory", () => {
      expect(config.staticDirs).toContain("../public");
    });
  });

  describe("type safety", () => {
    it("should satisfy StorybookConfig type", () => {
      // This test ensures the config object matches the expected TypeScript interface
      const typedConfig: StorybookConfig = config;
      expect(typedConfig).toBe(config);
    });

    it("should have all required properties", () => {
      expect(config).toHaveProperty("stories");
      expect(config).toHaveProperty("addons");
      expect(config).toHaveProperty("framework");
      expect(config).toHaveProperty("staticDirs");
    });
  });
});
