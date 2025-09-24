import { isMigrationFile } from "./is-migration-file";

describe("isMigrationFile", () => {
  describe("with migration in filename", () => {
    it("should identify files with migration in filename", () => {
      expect(isMigrationFile("001_create_users_migration.py")).toBe(true);
      expect(isMigrationFile("add_column_migration.sql")).toBe(true);
      expect(isMigrationFile("user_migrate_v2.py")).toBe(true);
    });
  });

  describe("with migrations directory", () => {
    it("should identify files in migrations directories", () => {
      expect(isMigrationFile("db/migrations/001_create_tables.py")).toBe(true);
      expect(isMigrationFile("app/migrations/add_users.sql")).toBe(true);
      expect(isMigrationFile("src\\migrations\\schema_update.py")).toBe(true);
      expect(isMigrationFile("php/migration/CreateTbRoomSnapshotDownTest.php")).toBe(true);
    });
  });

  describe("with alembic", () => {
    it("should identify alembic-related files", () => {
      expect(isMigrationFile("alembic/versions/001_initial.py")).toBe(true);
      expect(isMigrationFile("migrations/alembic_env.py")).toBe(true);
    });
  });

  describe("with schema patterns", () => {
    it("should identify schema migration patterns", () => {
      expect(isMigrationFile("schema_migration_001.py")).toBe(true);
      expect(isMigrationFile("db_migration_helper.py")).toBe(true);
      expect(isMigrationFile("database_migration_runner.py")).toBe(true);
    });
  });

  describe("with regular files", () => {
    it("should reject regular non-migration files", () => {
      expect(isMigrationFile("user_model.py")).toBe(false);
      expect(isMigrationFile("api_handler.py")).toBe(false);
      expect(isMigrationFile("test_user.py")).toBe(false);
      expect(isMigrationFile("config.py")).toBe(false);
    });

    it("should reject utility files that contain migration words but are not migration files", () => {
      expect(isMigrationFile("utils/files/is_migration_file.py")).toBe(false); // Utility to detect migrations
      expect(isMigrationFile("utils/migration_helpers.py")).toBe(false); // Helper utilities
      expect(isMigrationFile("lib/migration_utils.py")).toBe(false); // Migration utilities
    });
  });

  describe("case insensitive", () => {
    it("should handle case insensitive matching", () => {
      expect(isMigrationFile("MIGRATION_001.PY")).toBe(true);
      expect(isMigrationFile("Schema_Migration.sql")).toBe(true);
      expect(isMigrationFile("DB/MIGRATIONS/init.py")).toBe(true);
    });
  });

  describe("invalid input", () => {
    it("should handle invalid input types", () => {
      expect(isMigrationFile(null as any)).toBe(false);
      expect(isMigrationFile(123 as any)).toBe(false);
      expect(isMigrationFile("")).toBe(false);
    });
  });
});
