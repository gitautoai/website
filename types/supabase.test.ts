import type {
  Json,
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "./supabase";

describe("Supabase Types", () => {
  describe("Json Type", () => {
    it("should accept primitive JSON values", () => {
      const stringValue: Json = "test";
      const numberValue: Json = 42;
      const booleanValue: Json = true;
      const nullValue: Json = null;

      expect(typeof stringValue).toBe("string");
      expect(typeof numberValue).toBe("number");
      expect(typeof booleanValue).toBe("boolean");
      expect(nullValue).toBeNull();
    });

    it("should accept JSON objects and arrays", () => {
      const objectValue: Json = { key: "value", nested: { count: 1 } };
      const arrayValue: Json = [1, "two", { three: 3 }];

      expect(typeof objectValue).toBe("object");
      expect(Array.isArray(arrayValue)).toBe(true);
    });
  });

  describe("Database Structure", () => {
    it("should have public schema with expected tables", () => {
      type PublicSchema = Database["public"];
      type TableNames = keyof PublicSchema["Tables"];

      // Verify key tables exist in the type system
      const expectedTables: TableNames[] = [
        "repositories",
        "coverages",
        "installations",
        "issues",
        "users",
        "owners",
        "usage",
        "contacts",
        "oauth_tokens",
        "jira_github_links",
      ];

      // This test validates that the types are properly defined
      expectedTables.forEach(tableName => {
        expect(tableName).toBeDefined();
      });
    });
  });

  describe("Repositories Table Types", () => {
    it("should have correct Row type for repositories", () => {
      type RepositoryRow = Tables<"repositories">;

      const mockRepository: RepositoryRow = {
        id: 1,
        owner_id: 123,
        repo_id: 456,
        repo_name: "test-repo",
        created_at: "2023-01-01T00:00:00Z",
        created_by: "user:123",
        updated_at: "2023-01-01T00:00:00Z",
        updated_by: "user:123",
        target_branch: "main",
        trigger_on_review_comment: true,
        trigger_on_test_failure: true,
        trigger_on_commit: false,
        trigger_on_pr_change: false,
        trigger_on_merged: false,
        trigger_on_schedule: false,
        schedule_include_weekends: false,
        repo_rules: null,
        structured_rules: null,
        schedule_frequency: null,
        schedule_time: null,
        schedule_day_of_week: null,
        schedule_minute: null,
        use_screenshots: null,
        production_url: null,
        local_port: null,
        startup_commands: null,
        web_urls: null,
        file_paths: null,
        file_count: null,
        code_lines: null,
        comment_lines: null,
        blank_lines: null,
      };

      expect(mockRepository.owner_id).toBe(123);
      expect(mockRepository.repo_id).toBe(456);
      expect(mockRepository.trigger_on_review_comment).toBe(true);
    });

    it("should have correct Insert type for repositories", () => {
      type RepositoryInsert = TablesInsert<"repositories">;

      const mockInsert: RepositoryInsert = {
        owner_id: 123,
        repo_id: 456,
        repo_name: "test-repo",
        created_by: "user:123",
        target_branch: "main",
        // Optional fields can be omitted
      };

      expect(mockInsert.owner_id).toBe(123);
      expect(mockInsert.repo_id).toBe(456);
    });

    it("should have correct Update type for repositories", () => {
      type RepositoryUpdate = TablesUpdate<"repositories">;

      const mockUpdate: RepositoryUpdate = {
        trigger_on_schedule: true,
        schedule_time: "09:00:00+00",
        schedule_include_weekends: false,
        updated_by: "user:123",
        // All fields are optional in update
      };

      expect(mockUpdate.trigger_on_schedule).toBe(true);
      expect(mockUpdate.schedule_time).toBe("09:00:00+00");
    });
  });

  describe("Coverage Table Types", () => {
    it("should have correct Row type for coverages", () => {
      type CoverageRow = Tables<"coverages">;

      const mockCoverage: CoverageRow = {
        id: 1,
        owner_id: 123,
        repo_id: 456,
        full_path: "src/utils/helper.ts",
        level: "file",
        created_at: "2023-01-01T00:00:00Z",
        created_by: "user:123",
        updated_at: "2023-01-01T00:00:00Z",
        updated_by: "user:123",
        branch_name: "main",
        line_coverage: 85.5,
        function_coverage: 90.0,
        branch_coverage: 75.0,
        statement_coverage: null,
        path_coverage: null,
        file_size: null,
        package_name: null,
        primary_language: null,
        github_issue_url: null,
        is_excluded_from_testing: null,
        uncovered_lines: null,
        uncovered_functions: null,
        uncovered_branches: null,
      };

      expect(mockCoverage.line_coverage).toBe(85.5);
      expect(mockCoverage.function_coverage).toBe(90.0);
      expect(mockCoverage.full_path).toBe("src/utils/helper.ts");
    });
  });

  describe("Constants Export", () => {
    it("should export Constants object", () => {
      // Import the Constants to verify it exists
      const { Constants } = require("./supabase");
      
      expect(Constants).toBeDefined();
      expect(Constants.public).toBeDefined();
      expect(Constants.public.Enums).toBeDefined();
    });
  });

  describe("Type Utility Functions", () => {
    it("should properly type table operations", () => {
      // Test that the generic types work correctly
      type UserRow = Tables<"users">;
      type UserInsert = TablesInsert<"users">;
      type UserUpdate = TablesUpdate<"users">;

      // These should compile without errors
      const userRow: UserRow = {
        id: 1,
        user_id: 123,
        user_name: "testuser",
        user_rules: "default rules",
        created_at: "2023-01-01T00:00:00Z",
        created_by: null,
        email: null,
      };

      const userInsert: UserInsert = {
        user_id: 123,
        user_name: "testuser",
      };

      const userUpdate: UserUpdate = {
        user_rules: "updated rules",
      };

      expect(userRow.user_id).toBe(123);
      expect(userInsert.user_name).toBe("testuser");
      expect(userUpdate.user_rules).toBe("updated rules");
    });
  });
});