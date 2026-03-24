export const workflow = `name: Pytest Coverage

# Run on target branch (probably default branch like main) to track coverage history
on:
  push:
    branches:
      - main
    # Optional: Only run when relevant files change (customize as needed)
    paths:
      - '**/*.py'
      - requirements.txt
      - pyproject.toml
      - setup.cfg
  pull_request:
    branches:
      - main
    paths:
      - '**/*.py'
      - requirements.txt
      - pyproject.toml
      - setup.cfg
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

      - name: Set up Python
        uses: actions/setup-python@v6
        with:
          python-version: '3.x'
          
      - name: Install dependencies
        run: pip install pytest pytest-cov

      # PR: tests only, Push: tests with coverage
      - name: Run tests
        if: github.event_name == 'pull_request'
        run: python -m pytest

      - name: Run tests with coverage
        if: github.event_name == 'push'
        run: python -m pytest --cov --cov-report=lcov:coverage/lcov.info

      - name: Upload coverage reports
        if: github.event_name == 'push'
        uses: actions/upload-artifact@v6
        with:
          name: coverage-report
          path: coverage/lcov.info`;
