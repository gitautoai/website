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
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  transformIgnorePatterns: [
    // Allow next-auth and its dependencies to be transformed
    "/node_modules/(?!(next-auth|@next-auth|jose|openid-client))/",
  ],
};

export default createJestConfig(customJestConfig);
