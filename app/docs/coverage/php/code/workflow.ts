export const workflow = `name: PHPUnit Coverage

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
      - uses: actions/checkout@v4

      # Use Xdebug for comprehensive coverage (line, branch, path)
      # PCOV is faster but only supports line coverage
      - name: Set up PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          coverage: xdebug

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress

      - name: Run tests with coverage
        run: composer run test:coverage

      # Most popular Clover-to-LCOV conversion tool
      - name: Convert Clover to LCOV format
        uses: andstor/clover2lcov@v1
        with:
          clover-file: coverage/clover.xml
          lcov-file: coverage/lcov.info

      - name: Upload coverage reports
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/lcov.info`;
