# Storybook Configuration Tests

This directory contains the Storybook configuration and its corresponding unit tests.

## Files

- `main.ts` - Main Storybook configuration file
- `main.test.ts` - Unit tests for the main configuration
- `preview.ts` - Storybook preview configuration
- `vitest.setup.ts` - Vitest setup for Storybook tests

## Test Coverage

The `main.test.ts` file provides comprehensive test coverage for the Storybook configuration including:

### Configuration Structure Tests
- Validates the exported configuration object structure
- Ensures all required properties are present
- Verifies TypeScript type safety

### Stories Configuration Tests
- Tests story file patterns for MDX and story files
- Validates glob patterns for recursive directory matching
- Ensures proper file extension support (js, jsx, mjs, ts, tsx)

### Addons Configuration Tests
- Verifies all required addons are included:
  - `@chromatic-com/storybook` - Visual testing
  - `@storybook/addon-docs` - Documentation
  - `@storybook/addon-a11y` - Accessibility testing
  - `@storybook/addon-vitest` - Vitest integration
- Checks addon compatibility with nextjs-vite framework
- Ensures no conflicting addons are present

### Framework Configuration Tests
- Validates the use of `@storybook/nextjs-vite` framework
- Tests framework options configuration

### Static Assets Tests
- Verifies static directory configuration
- Tests relative path usage for assets

## Running Tests

Run the tests using Jest: `npm test`
