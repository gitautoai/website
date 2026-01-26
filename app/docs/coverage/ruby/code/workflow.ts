export const workflow = `name: RSpec Coverage

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

      - name: Set up Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true

      - name: Install dependencies
        run: bundle install

      - name: Run tests with coverage
        run: bundle exec rspec
        env:
          COVERAGE: true

      - name: Upload coverage reports
        uses: actions/upload-artifact@v6
        with:
          name: coverage-report
          path: coverage/lcov.info`;
