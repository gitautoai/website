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
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  transformIgnorePatterns: [
    // Allow next-auth, octokit and their dependencies to be transformed
    "/node_modules/(?!(next-auth|@next-auth|jose|openid-client|@octokit|octokit))/",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}", // Include all files in the app directory
    "!app/**/_*.{js,jsx,ts,tsx}", // Exclude files starting with _
    "!app/**/*.d.ts", // Exclude declaration files
    "!**/node_modules/**", // Exclude node_modules
  ],
  coverageReporters: ["text", "lcov"],
};

export default createJestConfig(customJestConfig);
