import { upsertRepository } from "./upsert-repository";
import { supabaseAdmin } from "@/lib/supabase/server";

describe("upsertRepository integration", () => {
  const testOwnerId = Math.floor(Math.random() * 1000000) + 400000;
  const testRepoId = Math.floor(Math.random() * 1000000) + 900000;
  const testRepoName = `test-repo-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const testUserId = Math.floor(Math.random() * 100000) + 10000;
  const testUserName = `test-user-${Math.random().toString(36).substring(7)}`;

  beforeEach(async () => {
    // Clean up any existing data
    await supabaseAdmin
      .from("repositories")
      .delete()
      .match({ owner_id: testOwnerId, repo_id: testRepoId });
    await supabaseAdmin.from("owners").delete().eq("owner_id", testOwnerId);

    // Create test owner (required for foreign key constraint)
    await supabaseAdmin.from("owners").insert({
      owner_id: testOwnerId,
      owner_name: "test-owner",
      owner_type: "User",
      stripe_customer_id: `test_customer_${testOwnerId}`,
    });
  });

  afterEach(async () => {
    // Clean up test data
    await supabaseAdmin
      .from("repositories")
      .delete()
      .match({ owner_id: testOwnerId, repo_id: testRepoId });
    await supabaseAdmin.from("owners").delete().eq("owner_id", testOwnerId);
  });

  describe("insert scenarios", () => {
    it("should insert new repository when it doesn't exist", async () => {
      await upsertRepository(testOwnerId, testRepoId, testRepoName, testUserId, testUserName);

      const { data, error } = await supabaseAdmin
        .from("repositories")
        .select("*")
        .match({ owner_id: testOwnerId, repo_id: testRepoId })
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data?.owner_id).toBe(testOwnerId);
      expect(data?.repo_id).toBe(testRepoId);
      expect(data?.repo_name).toBe(testRepoName);
      expect(data?.created_by).toBe(`${testUserId}:${testUserName}`);
      expect(data?.updated_by).toBe(`${testUserId}:${testUserName}`);
    });

    it("should insert repository with additional fields", async () => {
      await upsertRepository(testOwnerId, testRepoId, testRepoName, testUserId, testUserName, {
        repo_rules: "Test rules",
        target_branch: "main",
        use_screenshots: true,
      });

      const { data, error } = await supabaseAdmin
        .from("repositories")
        .select("*")
        .match({ owner_id: testOwnerId, repo_id: testRepoId })
        .single();

      expect(error).toBeNull();
      expect(data?.repo_rules).toBe("Test rules");
      expect(data?.target_branch).toBe("main");
      expect(data?.use_screenshots).toBe(true);
    });
  });

  describe("update scenarios", () => {
    beforeEach(async () => {
      // Insert initial repository
      await supabaseAdmin.from("repositories").insert({
        owner_id: testOwnerId,
        repo_id: testRepoId,
        repo_name: testRepoName,
        created_by: `${testUserId}:${testUserName}`,
        updated_by: `${testUserId}:${testUserName}`,
        repo_rules: "Initial rules",
      });
    });

    it("should update existing repository", async () => {
      await upsertRepository(testOwnerId, testRepoId, testRepoName, testUserId, testUserName, {
        repo_rules: "Updated rules",
        target_branch: "develop",
      });

      const { data, error } = await supabaseAdmin
        .from("repositories")
        .select("*")
        .match({ owner_id: testOwnerId, repo_id: testRepoId })
        .single();

      expect(error).toBeNull();
      expect(data?.repo_rules).toBe("Updated rules");
      expect(data?.target_branch).toBe("develop");
      expect(data?.updated_by).toBe(`${testUserId}:${testUserName}`);
    });

    it("should update only specified fields without affecting others", async () => {
      await upsertRepository(testOwnerId, testRepoId, testRepoName, testUserId, testUserName, {
        target_branch: "main",
      });

      const { data, error } = await supabaseAdmin
        .from("repositories")
        .select("*")
        .match({ owner_id: testOwnerId, repo_id: testRepoId })
        .single();

      expect(error).toBeNull();
      expect(data?.repo_rules).toBe("Initial rules"); // Should remain unchanged
      expect(data?.target_branch).toBe("main"); // Should be updated
    });
  });
});
