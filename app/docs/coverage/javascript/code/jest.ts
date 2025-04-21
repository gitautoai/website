export const packageJson = `{
  "scripts": {
    "test": "jest"
  }
}`;

export const jestConfig = `/** @type {import('jest').Config} */
module.exports = {
  collectCoverage: true,
  coverageReporters: ["lcov"],
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**"
  ]
}`;
