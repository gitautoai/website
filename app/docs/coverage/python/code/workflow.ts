export const workflow = `name: Pytest Coverage

on:
  push:
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.x'
          
      - name: Install dependencies
        run: pip install pytest pytest-cov
          
      - name: Run tests with coverage
        run: python -m pytest --cov --cov-report=lcov:coverage/lcov.info
          
      - name: Upload coverage reports
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/lcov.info`;
