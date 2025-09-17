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
    "/node_modules/(?!(next-auth|@next-auth|jose|openid-client|@supabase|supabase-js|isows))/",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}", // Include all files in the app directory
    "utils/**/*.{js,jsx,ts,tsx}", // Include all files in the utils directory
    "!app/**/_*.{js,jsx,ts,tsx}", // Exclude files starting with _
    "!app/**/*.d.ts", // Exclude declaration files
    "!utils/**/_*.{js,jsx,ts,tsx}", // Exclude files starting with _
    "!utils/**/*.d.ts", // Exclude declaration files
    "!**/node_modules/**", // Exclude node_modules
  ],
  coverageReporters: ["text", "lcov"],
};

export default createJestConfig(customJestConfig);
