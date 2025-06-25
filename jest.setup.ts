import "@testing-library/jest-dom";

// Mock Octokit to avoid ES module issues
jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    rest: {
      git: {
        getTree: jest.fn(),
      },
    },
  })),
}));

// Suppress console.error for cleaner test output
global.console.error = jest.fn();