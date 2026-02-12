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

      - name: Run tests with coverage
        run: |
          mkdir -p coverage
          go test -v -coverprofile=coverage/coverage.out ./...

      - name: Convert to LCOV format
        run: |
          go install github.com/jandelgado/gcov2lcov@latest
          gcov2lcov -infile=coverage/coverage.out -outfile=coverage/lcov.info

      - name: Upload coverage reports
        uses: actions/upload-artifact@v6
        with:
          name: coverage-report
          path: coverage/lcov.info`;
