import type { Preview } from "@storybook/nextjs-vite";
import preview from "./preview";

describe(".storybook/preview.ts", () => {
  it("should export a valid Preview object", () => {
    expect(preview).toBeDefined();
    expect(typeof preview).toBe("object");
  });

  describe("parameters configuration", () => {
    it("should have parameters object", () => {
      expect(preview.parameters).toBeDefined();
      expect(typeof preview.parameters).toBe("object");
    });

    describe("controls configuration", () => {
      it("should have controls configuration", () => {
        expect(preview.parameters.controls).toBeDefined();
        expect(typeof preview.parameters.controls).toBe("object");
      });

      it("should have matchers for color and date", () => {
        const { matchers } = preview.parameters.controls;
        expect(matchers).toBeDefined();
        expect(typeof matchers).toBe("object");
      });

      it("should have color matcher pattern", () => {
        const { color } = preview.parameters.controls.matchers;
        expect(color).toBeDefined();
        expect(color).toBeInstanceOf(RegExp);
        expect(color.source).toBe("(background|color)$");
        expect(color.flags).toContain("i"); // case insensitive
      });

      it("should have date matcher pattern", () => {
        const { date } = preview.parameters.controls.matchers;
        expect(date).toBeDefined();
        expect(date).toBeInstanceOf(RegExp);
        expect(date.source).toBe("Date$");
        expect(date.flags).toContain("i"); // case insensitive
      });
    });

    describe("accessibility configuration", () => {
      it("should have a11y configuration", () => {
        expect(preview.parameters.a11y).toBeDefined();
        expect(typeof preview.parameters.a11y).toBe("object");
      });

      it("should have test mode set to 'todo'", () => {
        expect(preview.parameters.a11y.test).toBe("todo");
      });

      it("should use valid test mode", () => {
        const validModes = ["todo", "error", "off"];
        expect(validModes).toContain(preview.parameters.a11y.test);
      });
    });
  });

  describe("type safety", () => {
    it("should satisfy Preview type", () => {
      const typedPreview: Preview = preview;
      expect(typedPreview).toBe(preview);
    });
  });
});
