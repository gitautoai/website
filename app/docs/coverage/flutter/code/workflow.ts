export const workflow = `name: Flutter Coverage

# Run on target branch (probably default branch like main) to track coverage history
on:
  push:
    branches:
      - main
  workflow_dispatch:

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

      - name: Run tests with coverage
        run: flutter test --coverage

      - name: Upload coverage report
        if: always()
        uses: actions/upload-artifact@v6
        with:
          name: coverage-report
          path: coverage/lcov.info`;
