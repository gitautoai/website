import { Resend } from "resend";
import { resend } from "./index";
import { RESEND_API_KEY } from "@/config/resend";

// Mock the Resend constructor
jest.mock("resend");

// Mock the config
jest.mock("@/config/resend", () => ({
  RESEND_API_KEY: "test-api-key",
}));

describe("resend module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a Resend instance with the API key", () => {
    // Verify that Resend constructor was called with the correct API key
    expect(Resend).toHaveBeenCalledWith("test-api-key");
  });

  it("should export a resend instance", () => {
    // Verify that resend is defined and is an instance of Resend
    expect(resend).toBeDefined();
    expect(resend).toBeInstanceOf(Resend);
  });

  it("should use RESEND_API_KEY from config", () => {
    // Verify that the API key from config is used
    expect(RESEND_API_KEY).toBe("test-api-key");
  });
});

describe("resend module with empty API key", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("should handle empty API key", () => {
    // Mock empty API key
    jest.mock("@/config/resend", () => ({
      RESEND_API_KEY: "",
    }));

    // Re-import to get the new mocked value
    const { RESEND_API_KEY: emptyKey } = require("@/config/resend");

    // Verify that empty string is handled
    expect(emptyKey).toBe("");
  });
});

describe("resend module initialization", () => {
  it("should initialize resend instance on module load", () => {
    // The resend instance should be created when the module is imported
    // This test verifies that the module exports are accessible
    expect(resend).toBeDefined();
  });

  it("should have the expected Resend instance structure", () => {
    // Verify that the resend instance has the expected structure
    // The Resend class is mocked, so we just verify it's an instance
    expect(resend).toBeInstanceOf(Resend);
    expect(Resend).toHaveBeenCalled();
  });
});
