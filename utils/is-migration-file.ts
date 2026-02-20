/**
 * Check if a file is a migration file (same logic as gitauto schedule handler)
 */
export function isMigrationFile(filePath: string): boolean {
  if (!filePath || typeof filePath !== "string") return false;

  const filePathLower = filePath.toLowerCase();

  const migrationPatterns = [
    "migration",
    "migrate",
    "/migrations/",
    "\\migrations\\",
    "alembic",
    "schema_migration",
    "db_migration",
    "database_migration",
  ];

  // Check if any pattern matches
  const matches = migrationPatterns.some((pattern) => filePathLower.includes(pattern));

  if (!matches) return false;

  // Additional filtering to prevent false positives
  // Patterns that should NOT be considered migration files even if they match broad patterns
  const excludePatterns = [
    /is_migration_file/, // utils/files/is_migration_file.py - utility to detect migrations
    /migration_helpers/, // utils/migration_helpers.py - helper utilities (plural)
    /migration_utils/, // lib/migration_utils.py - utility files (plural)
  ];

  // If any exclude pattern matches, it's not a migration file
  if (excludePatterns.some((pattern) => pattern.test(filePathLower))) {
    return false;
  }

  return true;
}
