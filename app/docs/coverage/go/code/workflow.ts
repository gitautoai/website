export const workflow = `name: Go Coverage

# Run on target branch (probably default branch like main) to track coverage history
on:
  push:
    branches:
      - main
    # Optional: Only run when relevant files change (customize as needed)
    paths:
      - '**/*.go'
      - go.mod
      - go.sum
  pull_request:
    branches:
      - main
    paths:
      - '**/*.go'
      - go.mod
      - go.sum
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

      - name: Set up Go
        uses: actions/setup-go@v5
        with:
          go-version: 'stable'
          check-latest: true

      - name: Install dependencies
        run: go mod download

      # PR: tests only, Push: tests with coverage
      - name: Run tests
        if: github.event_name == 'pull_request'
        run: go test -v ./...

      - name: Run tests with coverage
        if: github.event_name == 'push'
        run: |
          mkdir -p coverage
          go test -v -coverprofile=coverage/coverage.out ./...

      - name: Convert to LCOV format
        if: github.event_name == 'push'
        run: |
          go install github.com/jandelgado/gcov2lcov@latest
          gcov2lcov -infile=coverage/coverage.out -outfile=coverage/lcov.info

      - name: Upload coverage reports
        if: github.event_name == 'push'
        uses: actions/upload-artifact@v6
        with:
          name: coverage-report
          path: coverage/lcov.info`;
