import "@testing-library/jest-dom";

// Mock environment variables for Supabase
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

// Mock AWS environment variables
process.env.AWS_REGION = "us-east-1";
process.env.AWS_ACCESS_KEY_ID = "test-access-key-id";
process.env.AWS_SECRET_ACCESS_KEY = "test-secret-access-key";
process.env.AWS_SCHEDULE_GROUP_NAME = "test-group";
process.env.AWS_LAMBDA_FUNCTION_ARN = "arn:aws:lambda:us-east-1:123456789012:function:test-function";
process.env.AWS_EVENTBRIDGE_SCHEDULER_ROLE_ARN = "arn:aws:iam::123456789012:role/test-role";

// Mock Slack environment variables
process.env.SLACK_WEBHOOK_URL = "https://hooks.slack.com/test-webhook";

// Mock Sentry environment variables
process.env.NEXT_PUBLIC_SENTRY_DSN = "https://test@sentry.io/test";

// Mock Node environment
process.env.NODE_ENV = "test";