import { Config } from "jest";
import { createJestConfig } from "next/jest";

const customJestConfig: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@/app/(.*)$": "<rootDir>/app/$1",
    "^@/components/(.*)$": "<rootDir>/app/components/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
    "^@/styles/(.*)$": "<rootDir>/styles/$1",
    "^@/utils/(.*)$": "<rootDir>/utils/$1",
    "^@/config/(.*)$": "<rootDir>/config/$1",
    "^@/types/(.*)$": "<rootDir>/types/$1",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  transformIgnorePatterns: [
    // Allow next-auth, octokit and their dependencies to be transformed
    "/node_modules/(?!(next-auth|@next-auth|jose|openid-client|@octokit))/",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "utils/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageReporters: ["text", "lcov"],
};

export default createJestConfig(customJestConfig);