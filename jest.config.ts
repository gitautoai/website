import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Specify the path to the Next.js application to read next.config.js and .env files
  dir: "./",
});

// Custom Jest configuration
const customJestConfig: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/e2e/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",

    // isows is a WebSocket library used by @supabase/realtime-js (part of @supabase/supabase-js)
    // The library ships with both ESM and CommonJS versions
    // Jest runs in Node.js and has issues with ES modules, causing "Cannot use import statement outside a module" errors
    // These mappings force Jest to use the CommonJS version (_cjs) instead of the ESM version (_esm)
    // Without these mappings, all tests that import Supabase will fail
    "^isows/(.*)$": "<rootDir>/node_modules/isows/_cjs/$1",
    "^isows$": "<rootDir>/node_modules/isows/_cjs/index.js",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  transformIgnorePatterns: [
    // Transform all necessary ES modules
    "/node_modules/(?!(next-auth|@next-auth|jose|openid-client|@supabase|supabase-js|isows|@octokit))/",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/_*.{js,jsx,ts,tsx}", // Next.js private files
    "!**/*.d.ts", // Type declaration files
    "!**/*.test.{js,jsx,ts,tsx}", // Test files
    "!**/*.spec.{js,jsx,ts,tsx}", // Spec files
    "!**/node_modules/**",
    "!.next/**", // Next.js build output
    "!coverage/**", // Coverage output
    "!e2e/**", // E2E tests (Playwright)
    "!.storybook/**", // Storybook config
    "!stories/**", // Storybook stories
    "!styles/**", // Tailwind config
    "!types/**", // Type definitions
  ],
  coverageReporters: ["text", "lcov"],
};

export default createJestConfig(customJestConfig);
