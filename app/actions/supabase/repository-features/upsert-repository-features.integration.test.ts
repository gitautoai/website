import { upsertRepositoryFeatures } from "./upsert-repository-features";
import { supabaseAdmin } from "@/lib/supabase/server";

describe("upsertRepositoryFeatures integration", () => {
  const testOwnerId = Math.floor(Math.random() * 1000000) + 500000;
  const testOwnerName = `test-owner-${Math.random().toString(36).substring(7)}`;
  const testRepoId = Math.floor(Math.random() * 1000000) + 900000;
  const testRepoName = `test-repo-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const testUserId = Math.floor(Math.random() * 100000) + 10000;
  const testUserName = `test-user-${Math.random().toString(36).substring(7)}`;

  beforeEach(async () => {
    // Clean up any existing data
    await supabaseAdmin
      .from("repository_features")
      .delete()
      .match({ owner_id: testOwnerId, repo_id: testRepoId });
    await supabaseAdmin
      .from("repositories")
      .delete()
      .match({ owner_id: testOwnerId, repo_id: testRepoId });
    await supabaseAdmin.from("owners").delete().eq("owner_id", testOwnerId);

    // Create test owner (required for foreign key constraint)
    await supabaseAdmin.from("owners").insert({
      owner_id: testOwnerId,
      owner_name: testOwnerName,
      owner_type: "User",
      stripe_customer_id: `test_customer_${testOwnerId}`,
    });
  });

  afterEach(async () => {
    // Clean up test data
    await supabaseAdmin
      .from("repository_features")
      .delete()
      .match({ owner_id: testOwnerId, repo_id: testRepoId });
    await supabaseAdmin
      .from("repositories")
      .delete()
      .match({ owner_id: testOwnerId, repo_id: testRepoId });
    await supabaseAdmin.from("owners").delete().eq("owner_id", testOwnerId);
  });

  describe("insert scenarios", () => {
    it("should create repository and insert features when repository doesn't exist", async () => {
      await upsertRepositoryFeatures(
        testOwnerId,
        testOwnerName,
        testRepoId,
        testRepoName,
        testUserId,
        testUserName,
        {
          auto_merge: true,
          auto_merge_only_test_files: false,
          merge_method: "squash",
        }
      );

      // Check repository was created
      const { data: repoData, error: repoError } = await supabaseAdmin
        .from("repositories")
        .select("*")
        .match({ owner_id: testOwnerId, repo_id: testRepoId })
        .single();

      expect(repoError).toBeNull();
      expect(repoData).toBeDefined();
      expect(repoData?.repo_name).toBe(testRepoName);

      // Check features were inserted
      const { data: featuresData, error: featuresError } = await supabaseAdmin
        .from("repository_features")
        .select("*")
        .match({ owner_id: testOwnerId, repo_id: testRepoId })
        .single();

      expect(featuresError).toBeNull();
      expect(featuresData).toBeDefined();
      expect(featuresData?.auto_merge).toBe(true);
      expect(featuresData?.auto_merge_only_test_files).toBe(false);
      expect(featuresData?.merge_method).toBe("squash");
      expect(featuresData?.created_by).toBe(`${testUserId}:${testUserName}`);
      expect(featuresData?.updated_by).toBe(`${testUserId}:${testUserName}`);
    });

    it("should insert features when repository already exists", async () => {
      // Pre-create repository
      await supabaseAdmin.from("repositories").insert({
        owner_id: testOwnerId,
        repo_id: testRepoId,
        repo_name: testRepoName,
        created_by: `${testUserId}:${testUserName}`,
        updated_by: `${testUserId}:${testUserName}`,
      });

      await upsertRepositoryFeatures(
        testOwnerId,
        testOwnerName,
        testRepoId,
        testRepoName,
        testUserId,
        testUserName,
        {
          auto_merge: false,
          auto_merge_only_test_files: true,
          merge_method: "merge",
        }
      );

      const { data, error } = await supabaseAdmin
        .from("repository_features")
        .select("*")
        .match({ owner_id: testOwnerId, repo_id: testRepoId })
        .single();

      expect(error).toBeNull();
      expect(data?.auto_merge).toBe(false);
      expect(data?.auto_merge_only_test_files).toBe(true);
      expect(data?.merge_method).toBe("merge");
    });
  });

  describe("update scenarios", () => {
    beforeEach(async () => {
      // Pre-create repository and features
      await supabaseAdmin.from("repositories").insert({
        owner_id: testOwnerId,
        repo_id: testRepoId,
        repo_name: testRepoName,
        created_by: `${testUserId}:${testUserName}`,
        updated_by: `${testUserId}:${testUserName}`,
      });

      await supabaseAdmin.from("repository_features").insert({
        owner_id: testOwnerId,
        owner_name: testOwnerName,
        repo_id: testRepoId,
        repo_name: testRepoName,
        auto_merge: false,
        auto_merge_only_test_files: true,
        merge_method: "merge",
        created_by: `${testUserId}:${testUserName}`,
        updated_by: `${testUserId}:${testUserName}`,
      });
    });

    it("should update existing features", async () => {
      await upsertRepositoryFeatures(
        testOwnerId,
        testOwnerName,
        testRepoId,
        testRepoName,
        testUserId,
        testUserName,
        {
          auto_merge: true,
          auto_merge_only_test_files: false,
          merge_method: "squash",
        }
      );

      const { data, error } = await supabaseAdmin
        .from("repository_features")
        .select("*")
        .match({ owner_id: testOwnerId, repo_id: testRepoId })
        .single();

      expect(error).toBeNull();
      expect(data?.auto_merge).toBe(true);
      expect(data?.auto_merge_only_test_files).toBe(false);
      expect(data?.merge_method).toBe("squash");
      expect(data?.updated_by).toBe(`${testUserId}:${testUserName}`);
    });

    it("should handle multiple upserts correctly", async () => {
      // First update
      await upsertRepositoryFeatures(
        testOwnerId,
        testOwnerName,
        testRepoId,
        testRepoName,
        testUserId,
        testUserName,
        {
          auto_merge: true,
          auto_merge_only_test_files: false,
          merge_method: "rebase",
        }
      );

      // Second update
      await upsertRepositoryFeatures(
        testOwnerId,
        testOwnerName,
        testRepoId,
        testRepoName,
        testUserId,
        testUserName,
        {
          auto_merge: false,
          auto_merge_only_test_files: true,
          merge_method: "squash",
        }
      );

      const { data, error } = await supabaseAdmin
        .from("repository_features")
        .select("*")
        .match({ owner_id: testOwnerId, repo_id: testRepoId })
        .single();

      expect(error).toBeNull();
      expect(data?.auto_merge).toBe(false);
      expect(data?.auto_merge_only_test_files).toBe(true);
      expect(data?.merge_method).toBe("squash");

      // Verify only one record exists
      const { data: allData } = await supabaseAdmin
        .from("repository_features")
        .select("*")
        .match({ owner_id: testOwnerId, repo_id: testRepoId });

      expect(allData?.length).toBe(1);
    });
  });

  describe("foreign key constraint protection", () => {
    it("should handle missing repository by creating it first", async () => {
      // Don't pre-create repository - this simulates the WEBSITE-33 error scenario
      await upsertRepositoryFeatures(
        testOwnerId,
        testOwnerName,
        testRepoId,
        testRepoName,
        testUserId,
        testUserName,
        {
          auto_merge: true,
          auto_merge_only_test_files: true,
          merge_method: "merge",
        }
      );

      // Verify both repository and features were created
      const { data: repoData } = await supabaseAdmin
        .from("repositories")
        .select("*")
        .match({ owner_id: testOwnerId, repo_id: testRepoId })
        .single();

      const { data: featuresData } = await supabaseAdmin
        .from("repository_features")
        .select("*")
        .match({ owner_id: testOwnerId, repo_id: testRepoId })
        .single();

      expect(repoData).toBeDefined();
      expect(featuresData).toBeDefined();
    });
  });
});
