import "@testing-library/jest-dom";
// Mock environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
process.env.AWS_REGION = "us-west-1";
process.env.AWS_ACCESS_KEY_ID = "test-access-key";
process.env.AWS_SECRET_ACCESS_KEY = "test-secret-key";
process.env.AWS_SCHEDULE_GROUP_NAME = "test-group";
process.env.AWS_LAMBDA_FUNCTION_ARN = "arn:aws:lambda:us-west-1:123456789012:function:test";
process.env.AWS_EVENTBRIDGE_SCHEDULER_ROLE_ARN = "arn:aws:iam::123456789012:role/test-role";
process.env.SLACK_WEBHOOK_URL = "https://hooks.slack.com/test";
process.env.NEXT_PUBLIC_PRODUCT_ID = "test-product";
process.env.NODE_ENV = "test";

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
