export const workflow = `name: RSpec Coverage

# Run on target branch (probably default branch like main) to track coverage history
on:
  push:
    branches:
      - main
    # Optional: Only run when relevant files change (customize as needed)
    paths:
      - '**/*.rb'
      - Gemfile
      - Gemfile.lock
  pull_request:
    branches:
      - main
    paths:
      - '**/*.rb'
      - Gemfile
      - Gemfile.lock
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

      - name: Set up Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true

      - name: Install dependencies
        run: bundle install

      # PR: tests only, Push: tests with coverage
      - name: Run tests
        if: github.event_name == 'pull_request'
        run: bundle exec rspec

      - name: Run tests with coverage
        if: github.event_name == 'push'
        run: bundle exec rspec
        env:
          COVERAGE: true

      - name: Upload coverage reports
        if: github.event_name == 'push'
        uses: actions/upload-artifact@v6
        with:
          name: coverage-report
          path: coverage/lcov.info`;
