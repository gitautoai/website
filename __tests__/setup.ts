// Global test setup for AWS SDK mocks and environment variables

// Mock environment variables for Supabase
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

// Mock environment variables for AWS
process.env.AWS_REGION = "us-east-1";
process.env.AWS_ACCESS_KEY_ID = "test-access-key";
process.env.AWS_SECRET_ACCESS_KEY = "test-secret-key";
process.env.AWS_SCHEDULE_GROUP_NAME = "test-group";
process.env.AWS_LAMBDA_FUNCTION_ARN = "arn:aws:lambda:us-east-1:123456789012:function:test-function";
process.env.AWS_EVENTBRIDGE_SCHEDULER_ROLE_ARN = "arn:aws:iam::123456789012:role/test-role";

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
};

// This file is a setup file, not a test file
