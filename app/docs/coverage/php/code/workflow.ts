export const workflow = `name: PHPUnit Coverage

# Run on target branch (probably default branch like main) to track coverage history
on:
  push:
    branches:
      - main
    # Optional: Only run when relevant files change (customize as needed)
    paths:
      - '**/*.php'
      - composer.json
      - composer.lock
      - phpunit.xml
  pull_request:
    branches:
      - main
    paths:
      - '**/*.php'
      - composer.json
      - composer.lock
      - phpunit.xml
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

      # Use Xdebug for comprehensive coverage (line, branch, path)
      # PCOV is faster but only supports line coverage
      - name: Set up PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          coverage: xdebug

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress

      # PR: tests only, Push: tests with coverage
      # For generic PHP: runs 'phpunit' which reads phpunit.xml
      # For Laravel: runs 'php artisan test' which internally calls PHPUnit
      - name: Run tests
        if: github.event_name == 'pull_request'
        run: composer test

      # Both generate coverage because phpunit.xml configures it
      - name: Run tests with coverage
        if: github.event_name == 'push'
        run: composer test

      # Most popular Clover-to-LCOV conversion tool
      - name: Convert Clover to LCOV format
        if: github.event_name == 'push'
        uses: andstor/clover2lcov-action@v1
        with:
          src: coverage/clover.xml
          dst: coverage/lcov.info

      - name: Upload coverage reports
        if: github.event_name == 'push'
        uses: actions/upload-artifact@v6
        with:
          name: coverage-report
          path: coverage/lcov.info`;
