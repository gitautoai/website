import type {
  BaseSettings,
  RulesSettings,
  ReferenceSettings,
  ScreenshotSettings,
  TriggerSettings,
  Settings,
} from "./types";

describe("Settings Types", () => {
  describe("BaseSettings", () => {
    it("should accept valid BaseSettings object", () => {
      const validBaseSettings: BaseSettings = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        githubUserId: "12345",
        githubUserName: "johndoe",
        githubUserEmail: "john.doe@github.com",
        jiraUserId: "jira123",
        jiraUserName: "john.doe",
        jiraUserEmail: "john.doe@company.com",
      };

      // Type assertion to ensure the object matches the type
      expect(validBaseSettings).toBeDefined();
      expect(typeof validBaseSettings.firstName).toBe("string");
      expect(typeof validBaseSettings.lastName).toBe("string");
      expect(typeof validBaseSettings.email).toBe("string");
    });
  });

  describe("RulesSettings", () => {
    it("should accept valid RulesSettings object", () => {
      const validRulesSettings: RulesSettings = {
        repoRules: "Always write comprehensive tests",
        targetBranch: "main",
        structuredRules: {} as any, // Mock structured rules
      };

      expect(validRulesSettings).toBeDefined();
      expect(typeof validRulesSettings.repoRules).toBe("string");
      expect(typeof validRulesSettings.targetBranch).toBe("string");
    });
  });

  describe("ReferenceSettings", () => {
    it("should accept valid ReferenceSettings object", () => {
      const validReferenceSettings: ReferenceSettings = {
        webUrls: ["https://example.com", "https://docs.example.com"],
        filePaths: ["src/utils", "src/components"],
      };

      expect(validReferenceSettings).toBeDefined();
      expect(Array.isArray(validReferenceSettings.webUrls)).toBe(true);
      expect(Array.isArray(validReferenceSettings.filePaths)).toBe(true);
    });

    it("should accept empty arrays", () => {
      const emptyReferenceSettings: ReferenceSettings = {
        webUrls: [],
        filePaths: [],
      };

      expect(emptyReferenceSettings).toBeDefined();
      expect(emptyReferenceSettings.webUrls).toHaveLength(0);
      expect(emptyReferenceSettings.filePaths).toHaveLength(0);
    });
  });

  describe("ScreenshotSettings", () => {
    it("should accept valid ScreenshotSettings object", () => {
      const validScreenshotSettings: ScreenshotSettings = {
        useScreenshots: true,
        productionUrl: "https://production.example.com",
        localPort: 3000,
        startupCommands: ["npm install", "npm run build", "npm start"],
      };

      expect(validScreenshotSettings).toBeDefined();
      expect(typeof validScreenshotSettings.useScreenshots).toBe("boolean");
      expect(typeof validScreenshotSettings.productionUrl).toBe("string");
      expect(typeof validScreenshotSettings.localPort).toBe("number");
      expect(Array.isArray(validScreenshotSettings.startupCommands)).toBe(true);
    });

    it("should accept disabled screenshots with empty values", () => {
      const disabledScreenshotSettings: ScreenshotSettings = {
        useScreenshots: false,
        productionUrl: "",
        localPort: 8080,
        startupCommands: [],
      };

      expect(disabledScreenshotSettings).toBeDefined();
      expect(disabledScreenshotSettings.useScreenshots).toBe(false);
    });
  });

  describe("TriggerSettings", () => {
    it("should accept valid TriggerSettings object", () => {
      const validTriggerSettings: TriggerSettings = {
        triggerOnReviewComment: true,
        triggerOnTestFailure: false,
        triggerOnCommit: true,
        triggerOnPrChange: false,
        triggerOnMerged: true,
        triggerOnSchedule: true,
        scheduleTime: "09:30",
        scheduleIncludeWeekends: false,
      };

      expect(validTriggerSettings).toBeDefined();
      expect(typeof validTriggerSettings.triggerOnReviewComment).toBe("boolean");
      expect(typeof validTriggerSettings.scheduleTime).toBe("string");
      expect(validTriggerSettings.scheduleTime).toMatch(/^\d{2}:\d{2}$/);
    });

    it("should accept different schedule time formats", () => {
      const scheduleTimeFormats = ["00:00", "12:30", "23:59"];
      
      scheduleTimeFormats.forEach(time => {
        const triggerSettings: TriggerSettings = {
          triggerOnReviewComment: true,
          triggerOnTestFailure: true,
          triggerOnCommit: false,
          triggerOnPrChange: false,
          triggerOnMerged: false,
          triggerOnSchedule: true,
          scheduleTime: time,
          scheduleIncludeWeekends: true,
        };

        expect(triggerSettings.scheduleTime).toBe(time);
      });
    });
  });

  describe("Settings Union Type", () => {
    it("should accept any of the settings types", () => {
      const rulesSettings: Settings = {
        repoRules: "Test rules",
        targetBranch: "main",
        structuredRules: {} as any,
      };

      const triggerSettings: Settings = {
        triggerOnReviewComment: true,
        triggerOnTestFailure: true,
        triggerOnCommit: false,
        triggerOnPrChange: false,
        triggerOnMerged: false,
        triggerOnSchedule: false,
        scheduleTime: "09:00",
        scheduleIncludeWeekends: false,
      };

      expect(rulesSettings).toBeDefined();
      expect(triggerSettings).toBeDefined();
    });
  });
});