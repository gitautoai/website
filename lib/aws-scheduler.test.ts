import { SchedulerClient } from "@aws-sdk/client-scheduler";

// Mock the AWS SDK
jest.mock("@aws-sdk/client-scheduler");

const MockedSchedulerClient = SchedulerClient as jest.MockedClass<typeof SchedulerClient>;

describe("aws-scheduler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    delete process.env.AWS_REGION;
    delete process.env.AWS_ACCESS_KEY_ID;
    delete process.env.AWS_SECRET_ACCESS_KEY;
  });

  it("should create SchedulerClient with default region when AWS_REGION is not set", () => {
    // Re-import to trigger module initialization
    jest.resetModules();
    require("./aws-scheduler");

    expect(MockedSchedulerClient).toHaveBeenCalledWith({
      region: "us-east-1",
      credentials: {
        accessKeyId: undefined,
        secretAccessKey: undefined,
      },
    });
  });

  it("should create SchedulerClient with custom region when AWS_REGION is set", () => {
    process.env.AWS_REGION = "eu-west-1";
    process.env.AWS_ACCESS_KEY_ID = "test-access-key";
    process.env.AWS_SECRET_ACCESS_KEY = "test-secret-key";

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
    jest.resetModules();
    const { schedulerClient } = require("./aws-scheduler");
    
    expect(schedulerClient).toBeDefined();
    expect(schedulerClient).toBeInstanceOf(MockedSchedulerClient);
  });
});