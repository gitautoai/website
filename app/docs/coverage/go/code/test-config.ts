export const testExample = `package calculator

import "testing"

func TestAdd(t *testing.T) {
    result := Add(2, 3)
    if result != 5 {
        t.Errorf("Add(2, 3) = %d; want 5", result)
    }
}

func TestSubtract(t *testing.T) {
    result := Subtract(5, 3)
    if result != 2 {
        t.Errorf("Subtract(5, 3) = %d; want 2", result)
    }
}`;

export const makefileExample = `# Makefile

.PHONY: test coverage

test:
\tgo test -v ./...

coverage:
\tgo test -v -coverprofile=coverage/coverage.out ./...
\tgo tool cover -html=coverage/coverage.out -o coverage/coverage.html

coverage-lcov:
\tgo test -v -coverprofile=coverage/coverage.out ./...
\tgo install github.com/jandelgado/gcov2lcov@latest
\tgcov2lcov -infile=coverage/coverage.out -outfile=coverage/lcov.info`;
