export const workflow = `name: Flutter Coverage

# Run on target branch (probably default branch like main) to track coverage history
on:
  push:
    branches:
      - main
    # Optional: Only run when relevant files change (customize as needed)
    paths:
      - '**/*.dart'
      - pubspec.yaml
      - pubspec.lock
  pull_request:
    branches:
      - main
    paths:
      - '**/*.dart'
      - pubspec.yaml
      - pubspec.lock
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

      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          channel: "stable"

      - name: Install dependencies
        run: flutter pub get

      # PR: tests only, Push: tests with coverage
      - name: Run tests
        if: github.event_name == 'pull_request'
        run: flutter test

      - name: Run tests with coverage
        if: github.event_name == 'push'
        run: flutter test --coverage

      - name: Upload coverage report
        if: github.event_name == 'push'
        uses: actions/upload-artifact@v6
        with:
          name: coverage-report
          path: coverage/lcov.info`;
