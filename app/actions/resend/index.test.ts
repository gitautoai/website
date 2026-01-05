import { Resend } from "resend";
import { RESEND_API_KEY } from "@/config/resend";

// Mock Resend class
jest.mock("resend");

// Mock the config
jest.mock("@/config/resend");

describe("app/actions/resend/index", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should import and export resend instance", async () => {
    // Dynamically import the module to ensure it's loaded
    const module = await import("./index");

    expect(module.resend).toBeDefined();
  });

  it("should create Resend instance with API key from config", async () => {
    const module = await import("./index");

    expect(Resend).toHaveBeenCalled();
    expect(module.resend).toBeDefined();
  });

  it("should use RESEND_API_KEY from config", async () => {
    const module = await import("./index");

    expect(module.resend).toBeDefined();
    // The module should have been initialized with the API key
    expect(Resend).toHaveBeenCalledWith(RESEND_API_KEY);
  });
});
