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

  describe("configuration validation", () => {
    it("should have valid story patterns that match expected file types", () => {
      const storyPatterns = config.stories;
      
      // Test that patterns are strings
      storyPatterns.forEach(pattern => {
        expect(typeof pattern).toBe("string");
      });

      // Test that patterns start with relative path
      storyPatterns.forEach(pattern => {
        expect(pattern.startsWith("../")).toBe(true);
      });
    });

    it("should have valid addon names", () => {
      const addons = config.addons;
      
      addons.forEach(addon => {
        expect(typeof addon).toBe("string");
        expect(addon.startsWith("@")).toBe(true); // All addons should be scoped packages
      });
    });

    it("should have framework name that matches expected pattern", () => {
      expect(config.framework.name).toMatch(/^@storybook\//);
    });

    it("should have staticDirs pointing to valid relative paths", () => {
      const staticDirs = config.staticDirs;
      
      staticDirs.forEach(dir => {
        expect(typeof dir).toBe("string");
        expect(dir.startsWith("../")).toBe(true);
      });
    });
  });

  describe("integration with project structure", () => {
    it("should reference stories directory that exists relative to .storybook", () => {
      // The pattern "../stories/**/*" should point to a stories directory at project root
      expect(config.stories.some(pattern => pattern.includes("../stories/"))).toBe(true);
    });

    it("should reference public directory that exists relative to .storybook", () => {
      expect(config.staticDirs).toContain("../public");
    });
  });

  describe("addon compatibility", () => {
    it("should include addons that are compatible with nextjs-vite framework", () => {
      const expectedAddons = [
        "@chromatic-com/storybook",
        "@storybook/addon-docs", 
        "@storybook/addon-a11y",
        "@storybook/addon-vitest"
      ];
      
      expectedAddons.forEach(addon => {
        expect(config.addons).toContain(addon);
      });
    });

    it("should not include conflicting addons", () => {
      // These addons might conflict with nextjs-vite
      const conflictingAddons = [
        "@storybook/addon-webpack5-compiler-babel",
        "@storybook/addon-webpack5-compiler-swc"
      ];
      
      conflictingAddons.forEach(addon => {
        expect(config.addons).not.toContain(addon);
      });
    });
  });

  describe("story file patterns", () => {
    it("should match MDX documentation files", () => {
      const mdxPattern = "../stories/**/*.mdx";
      expect(config.stories).toContain(mdxPattern);
    });

    it("should match JavaScript story files", () => {
      const jsPattern = "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)";
      expect(config.stories).toContain(jsPattern);
      
      // Verify the pattern supports multiple extensions
      expect(jsPattern).toMatch(/js\|jsx\|mjs\|ts\|tsx/);
    });

    it("should use glob patterns for recursive directory matching", () => {
      config.stories.forEach(pattern => {
        expect(pattern).toMatch(/\*\*/); // Should contain ** for recursive matching
      });
    });
  });

  describe("static assets configuration", () => {
    it("should serve static files from public directory", () => {
      expect(config.staticDirs).toContain("../public");
    });

    it("should use relative paths for static directories", () => {
      config.staticDirs.forEach(dir => {
        expect(dir).toMatch(/^\.\.\/[^/]+$/); // Should be relative path like "../public"
      });
    });
  });
});