export const phpWorkflow = `name: PHP Tests

on:
  push:
    branches: [main]
    paths: ['**/*.php']
  pull_request:
    branches: [main]
    paths: ['**/*.php']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          coverage: xdebug

      - name: Install dependencies
        run: composer install

      # PR: tests only, Push: tests with coverage
      - name: Run tests
        if: github.event_name == 'pull_request'
        run: vendor/bin/phpunit

      - name: Run tests with coverage
        if: github.event_name == 'push'
        run: vendor/bin/phpunit --coverage-clover coverage/clover.xml

      - name: Convert to LCOV
        if: github.event_name == 'push'
        uses: andstor/clover2lcov-action@v1
        with:
          src: coverage/clover.xml
          dst: coverage/lcov.info

      - name: Upload coverage
        if: github.event_name == 'push'
        uses: actions/upload-artifact@v6
        with:
          name: php-coverage
          path: coverage/lcov.info
`;
