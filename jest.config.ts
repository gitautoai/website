import type { Config } from "jest";
import { createJestConfig } from "next/jest";

const customJestConfig: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testEnvironment: "jsdom",
  modulePathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
  ],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  transformIgnorePatterns: [
    // Allow ES modules and specific packages to be transformed
    "node_modules/(?!(@octokit|octokit|@next-auth|next-auth|jose|openid-client|universal-user-agent|before-after-hook|deprecation)/)"
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "utils/**/*.{js,jsx,ts,tsx}",
    "!app/**/*.d.ts",
    "!app/**/types.ts",
    "!app/**/type.ts",
    "!app/**/*.stories.{js,jsx,ts,tsx}",
    "!app/**/_*.{js,jsx,ts,tsx}",
  ],
  coverageReporters: ["text", "lcov"],
};

export default createJestConfig(customJestConfig);