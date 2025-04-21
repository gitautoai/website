export const packageJson = `{
  "scripts": {
    "test": "vitest run --coverage"
  }
}`;

export const vitestConfig = `/// <reference types="vitest" />
import { defineConfig } from 'vite'

// https://vitest.dev/guide/coverage.html#coverage-setup
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['lcov'],
    },
  },
})`;
