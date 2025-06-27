import { SchedulerClient } from "@aws-sdk/client-scheduler";

// Mock the AWS SDK
jest.mock("@aws-sdk/client-scheduler");

const MockedSchedulerClient = SchedulerClient as jest.MockedClass<typeof SchedulerClient>;

describe("aws-scheduler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create SchedulerClient with default region when AWS_REGION is not set", () => {
    // Clear AWS_REGION to test default behavior
    const originalRegion = process.env.AWS_REGION;
    delete process.env.AWS_REGION;
    
    // Set required credentials
    process.env.AWS_ACCESS_KEY_ID = "test-access-key";
    process.env.AWS_SECRET_ACCESS_KEY = "test-secret-key";

    // Clear module cache and re-import
    jest.resetModules();
    require("./aws-scheduler");

    expect(MockedSchedulerClient).toHaveBeenCalledWith({
      region: "us-west-1", // Default region
      credentials: {
        accessKeyId: "test-access-key",
        secretAccessKey: "test-secret-key",
      },
    });

    // Restore original value
    if (originalRegion) process.env.AWS_REGION = originalRegion;
  });

  it("should create SchedulerClient with custom region when AWS_REGION is set", () => {
    process.env.AWS_REGION = "eu-west-1";
    process.env.AWS_ACCESS_KEY_ID = "test-access-key";
    process.env.AWS_SECRET_ACCESS_KEY = "test-secret-key";

    // Clear module cache and re-import
    jest.resetModules();
    require("./aws-scheduler");

    expect(MockedSchedulerClient).toHaveBeenCalledWith({
      region: "eu-west-1",
      credentials: {
        accessKeyId: "test-access-key",
        secretAccessKey: "test-secret-key",
      },
    });
  });

  it("should export schedulerClient instance", () => {
    const { schedulerClient } = require("./aws-scheduler");
    expect(schedulerClient).toBeDefined();
    expect(schedulerClient).toBeInstanceOf(SchedulerClient);
  });
});