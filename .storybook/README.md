# Storybook Configuration Tests

This directory contains the Storybook configuration and its corresponding unit tests.

## Files

- `main.ts` - Main Storybook configuration file
- `main.test.ts` - Unit tests for the main configuration
- `preview.ts` - Storybook preview configuration
- `preview.test.ts` - Unit tests for the preview configuration
- `vitest.setup.test.ts` - Unit tests for the Vitest setup configuration
- `vitest.setup.ts` - Vitest setup for Storybook tests
- `integration.test.ts` - Integration tests for all configuration files

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

### Preview Configuration Tests (`preview.test.ts`)
- Tests Storybook preview parameters
- Validates controls configuration for color and date matchers
- Verifies accessibility (a11y) configuration
- Ensures proper test mode settings

### Vitest Setup Tests (`vitest.setup.test.ts`)
- Validates module imports for setup file
- Tests integration with a11y addon
- Verifies setProjectAnnotations configuration
- Ensures proper setup file structure

### Integration Tests (`integration.test.ts`)
- Tests compatibility between main and preview configurations
- Verifies framework and addon compatibility
- Validates consistent accessibility configuration across files
- Ensures all required configuration files exist

## Running Tests

Run the tests using Jest: `npm test`
