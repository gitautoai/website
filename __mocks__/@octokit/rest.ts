export const Octokit = jest.fn().mockImplementation(() => ({
  rest: {
    git: {
      getTree: jest.fn(),
    },
  },
}));