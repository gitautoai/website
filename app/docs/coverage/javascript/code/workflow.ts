export const workflow = `name: Test Coverage

# Run on target branch (probably default branch like main) to track coverage history
on:
  push:
    branches:
      - main
    # Optional: Only run when relevant files change (customize as needed)
    paths:
      - '**/*.js'
      - '**/*.ts'
      - package.json
      - package-lock.json
  pull_request:
    branches:
      - main
    paths:
      - '**/*.js'
      - '**/*.ts'
      - package.json
      - package-lock.json
      - '!.github/workflows/**'
  workflow_dispatch:

# Auto-cancel outdated runs on the same branch
concurrency:
  group: \${{ github.workflow }}-\${{ github.head_ref || github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: "22"

      - name: Install dependencies
        run: npm ci

      # PR: tests only, Push: tests with coverage
      - name: Run tests
        if: github.event_name == 'pull_request'
        run: npm test

      - name: Run tests with coverage
        if: github.event_name == 'push'
        run: npm test -- --coverage

      - name: Upload coverage report
        if: github.event_name == 'push'
        uses: actions/upload-artifact@v6
        with:
          name: coverage-report
          path: coverage/lcov.info`;
