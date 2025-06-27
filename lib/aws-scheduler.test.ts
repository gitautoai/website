import { SchedulerClient } from "@aws-sdk/client-scheduler";
import { schedulerClient } from "./aws-scheduler";

// Mock the AWS SDK
jest.mock("@aws-sdk/client-scheduler");

const MockedSchedulerClient = SchedulerClient as jest.MockedClass<typeof SchedulerClient>;

describe("aws-scheduler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear environment variables
    delete process.env.AWS_REGION;
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
  });

  afterEach(() => {
    // Restore environment variables
    process.env.AWS_REGION = "us-west-1";
    process.env.AWS_ACCESS_KEY_ID = "test-access-key";
    process.env.AWS_SECRET_ACCESS_KEY = "test-secret-key";
  });

  it("should create SchedulerClient with default region when AWS_REGION is not set", () => {
    // Set required credentials
    process.env.AWS_ACCESS_KEY_ID = "test-access-key";
    process.env.AWS_SECRET_ACCESS_KEY = "test-secret-key";

    // Re-import to trigger module initialization
    jest.resetModules();
    require("./aws-scheduler");

    expect(MockedSchedulerClient).toHaveBeenCalledWith({
      region: "us-west-1", // Default region
      credentials: {
        accessKeyId: "test-access-key",
        secretAccessKey: "test-secret-key",
      },
    });
  });

  it("should create SchedulerClient with custom region when AWS_REGION is set", () => {
    process.env.AWS_REGION = "eu-west-1";
    process.env.AWS_ACCESS_KEY_ID = "test-access-key";
    process.env.AWS_SECRET_ACCESS_KEY = "test-secret-key";

    // Re-import to trigger module initialization
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
    expect(schedulerClient).toBeDefined();
    expect(schedulerClient).toBeInstanceOf(SchedulerClient);
  });

  // Note: Testing missing credentials would require mocking the module initialization
  // which is complex in Jest. In a real scenario, missing credentials would cause
  // runtime errors when AWS SDK methods are called, not during module initialization.
});