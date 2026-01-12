// Load environment variables FIRST before imports that use them (e.g. Supabase)
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local file specifically for local development tests
// CI environments should set these variables directly
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// Polyfill fetch for Jest environment using node-fetch
// Node.js 18+ has native fetch, but Jest doesn't expose it to tests
global.fetch = require("node-fetch");

// Import jest-dom AFTER environment setup because it extends Jest's expect global
// which is only available in setupFilesAfterEnv, not setupFiles
import "@testing-library/jest-dom";

// Suppress console output during tests to keep test output clean
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};
