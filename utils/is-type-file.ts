/**
 * Type file patterns with real examples
 */
const TYPE_FILE_PATTERNS = [
  // TypeScript declaration files
  /\.d\.ts$/, // next-auth.d.ts, css.d.ts, prismjs.d.ts

  // Type-only directories
  /\/types\//, // types/supabase.ts, types/github.ts
  /^types\//, // types/account.ts (root level types directory)

  // Common type file names
  /(^|\/)types\.ts$/, // app/settings/types.ts, app/dashboard/coverage/types.ts
  /(^|\/)type\.ts$/, // single type definition files
  /Types\.ts$/, // TypeScript convention
  /Type\.ts$/, // singular type files

  // Interface files
  /\/interfaces\//, // interfaces directory
  /^interfaces\//, // root level interfaces directory
  /\/interface\.ts$/, // interface.ts files
  /Interface\.ts$/, // Interface.ts files

  // Schema files (often contain only type definitions)
  /\/schema\.ts$/, // schema.ts files
  /Schema\.ts$/, // Schema.ts files
  /\/schemas\//, // schemas directory
  /^schemas\//, // root level schemas directory

  // GraphQL type files
  /\.graphql$/, // GraphQL schema files
  /\.gql$/, // GraphQL files
  /\/graphql\/.*\.ts$/, // TypeScript files in graphql directories

  // Protocol buffer files
  /\.proto$/, // Protocol buffer definition files

  // Other type definition patterns
  /\.types\.ts$/, // api.types.ts, user.types.ts
  /\.type\.ts$/, // user.type.ts, api.type.ts
];

/**
 * Check if a file path matches type file patterns
 */
export function isTypeFile(filePath: string): boolean {
  return TYPE_FILE_PATTERNS.some((pattern) => pattern.test(filePath));
}