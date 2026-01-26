export const workflow = `name: JaCoCo Coverage

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

      - name: Set up JDK
        uses: actions/setup-java@v5
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Cache Maven packages
        uses: actions/cache@v5
        with:
          path: ~/.m2
          key: \${{ runner.os }}-m2-\${{ hashFiles('**/pom.xml') }}
          restore-keys: \${{ runner.os }}-m2

      - name: Run tests with coverage
        run: mvn clean test jacoco:report

      - name: Convert JaCoCo XML to Cobertura format
        run: |
          curl -o cover2cover.py https://raw.githubusercontent.com/rix0rrr/cover2cover/master/cover2cover.py
          python3 cover2cover.py target/site/jacoco/jacoco.xml src/main/java/ > target/site/cobertura.xml

      - name: Convert Cobertura to LCOV format
        run: |
          pip install lcov_cobertura
          mkdir -p coverage
          python3 -m lcov_cobertura target/site/cobertura.xml --output coverage/lcov.info --demangle

      - name: Upload coverage reports
        uses: actions/upload-artifact@v6
        with:
          name: coverage-report
          path: coverage/lcov.info`;
