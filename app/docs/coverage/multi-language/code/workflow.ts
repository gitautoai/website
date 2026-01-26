export const workflow = `name: Multi-Language Coverage

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  php-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - name: Set up PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          coverage: xdebug

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress

      - name: Run tests with coverage
        run: composer test

      - name: Convert Clover to LCOV format
        uses: andstor/clover2lcov-action@v1
        with:
          src: coverage/clover.xml
          dst: coverage/lcov.info

      - name: Upload PHP coverage
        uses: actions/upload-artifact@v6
        with:
          name: php-coverage
          path: coverage/lcov.info

  js-tests:
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

      - name: Run tests with coverage
        run: npm test -- --coverage

      - name: Upload JS coverage
        uses: actions/upload-artifact@v6
        with:
          name: js-coverage
          path: coverage/lcov.info`;
