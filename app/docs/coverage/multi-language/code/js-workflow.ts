export const jsWorkflow = `name: JavaScript Tests

on:
  push:
    branches: [main]
    paths: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx']
  pull_request:
    branches: [main]
    paths: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      # PR: tests only, Push: tests with coverage
      - name: Run tests
        if: github.event_name == 'pull_request'
        run: npm test

      - name: Run tests with coverage
        if: github.event_name == 'push'
        run: npm test -- --coverage








      - name: Upload coverage
        if: github.event_name == 'push'
        uses: actions/upload-artifact@v6
        with:
          name: js-coverage
          path: coverage/lcov.info
`;
