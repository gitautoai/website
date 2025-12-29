import { getAllActionSettings } from "./get-all-action-settings";
import { supabaseAdmin } from "@/lib/supabase/server";

describe("getAllActionSettings integration", () => {
  const testOwnerId = Math.floor(Math.random() * 1000000) + 600000;
  const testOwnerName = `test-owner-${Math.random().toString(36).substring(7)}`;
  const testRepo1Id = Math.floor(Math.random() * 1000000) + 900000;
  const testRepo1Name = `test-repo-a-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const testRepo2Id = Math.floor(Math.random() * 1000000) + 900000;
  const testRepo2Name = `test-repo-z-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const testUserId = Math.floor(Math.random() * 100000) + 10000;
  const testUserName = `test-user-${Math.random().toString(36).substring(7)}`;

  beforeEach(async () => {
    // Clean up any existing data
    await supabaseAdmin.from("repository_features").delete().eq("owner_id", testOwnerId);
    await supabaseAdmin.from("repositories").delete().eq("owner_id", testOwnerId);
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
    await supabaseAdmin.from("repository_features").delete().eq("owner_id", testOwnerId);
    await supabaseAdmin.from("repositories").delete().eq("owner_id", testOwnerId);
    await supabaseAdmin.from("owners").delete().eq("owner_id", testOwnerId);
  });

  describe("empty state", () => {
    it("should return empty array when no settings exist", async () => {
      const result = await getAllActionSettings(testOwnerId);

      expect(result).toEqual([]);
    });
  });

  describe("with data", () => {
    beforeEach(async () => {
      // Create test repositories
      await supabaseAdmin.from("repositories").insert([
        {
          owner_id: testOwnerId,
          repo_id: testRepo1Id,
          repo_name: testRepo1Name,
          created_by: `${testUserId}:${testUserName}`,
          updated_by: `${testUserId}:${testUserName}`,
        },
        {
          owner_id: testOwnerId,
          repo_id: testRepo2Id,
          repo_name: testRepo2Name,
          created_by: `${testUserId}:${testUserName}`,
          updated_by: `${testUserId}:${testUserName}`,
        },
      ]);

      // Create test features
      await supabaseAdmin.from("repository_features").insert([
        {
          owner_id: testOwnerId,
          owner_name: testOwnerName,
          repo_id: testRepo1Id,
          repo_name: testRepo1Name,
          auto_merge: true,
          auto_merge_only_test_files: false,
          merge_method: "squash",
          created_by: `${testUserId}:${testUserName}`,
          updated_by: `${testUserId}:${testUserName}`,
        },
        {
          owner_id: testOwnerId,
          owner_name: testOwnerName,
          repo_id: testRepo2Id,
          repo_name: testRepo2Name,
          auto_merge: false,
          auto_merge_only_test_files: true,
          merge_method: "merge",
          created_by: `${testUserId}:${testUserName}`,
          updated_by: `${testUserId}:${testUserName}`,
        },
      ]);
    });

    it("should return all settings for owner", async () => {
      const result = await getAllActionSettings(testOwnerId);

      expect(result).toHaveLength(2);
      expect(result[0].repo_id).toBeDefined();
      expect(result[1].repo_id).toBeDefined();
    });

    it("should order results by repo_name", async () => {
      const result = await getAllActionSettings(testOwnerId);

      expect(result).toHaveLength(2);
      // Results should be ordered alphabetically by repo_name
      expect(result[0].repo_name <= result[1].repo_name).toBe(true);
    });

    it("should return correct feature settings", async () => {
      const result = await getAllActionSettings(testOwnerId);

      const repo1Settings = result.find((r) => r.repo_id === testRepo1Id);
      const repo2Settings = result.find((r) => r.repo_id === testRepo2Id);

      expect(repo1Settings?.auto_merge).toBe(true);
      expect(repo1Settings?.auto_merge_only_test_files).toBe(false);
      expect(repo1Settings?.merge_method).toBe("squash");

      expect(repo2Settings?.auto_merge).toBe(false);
      expect(repo2Settings?.auto_merge_only_test_files).toBe(true);
      expect(repo2Settings?.merge_method).toBe("merge");
    });

    it("should not return settings from other owners", async () => {
      const otherOwnerId = testOwnerId + 1;
      const otherRepoId = testRepo1Id + 10000;

      // Create another owner with settings
      await supabaseAdmin.from("owners").insert({
        owner_id: otherOwnerId,
        owner_name: `other-owner-${Math.random().toString(36).substring(7)}`,
        owner_type: "User",
        stripe_customer_id: `test_customer_${otherOwnerId}`,
      });

      await supabaseAdmin.from("repositories").insert({
        owner_id: otherOwnerId,
        repo_id: otherRepoId,
        repo_name: `other-repo-${Date.now()}`,
        created_by: `${testUserId}:${testUserName}`,
        updated_by: `${testUserId}:${testUserName}`,
      });

      await supabaseAdmin.from("repository_features").insert({
        owner_id: otherOwnerId,
        owner_name: "other-owner",
        repo_id: otherRepoId,
        repo_name: "other-repo",
        auto_merge: true,
        auto_merge_only_test_files: true,
        merge_method: "rebase",
        created_by: `${testUserId}:${testUserName}`,
        updated_by: `${testUserId}:${testUserName}`,
      });

      const result = await getAllActionSettings(testOwnerId);

      // Should only return settings for testOwnerId
      expect(result).toHaveLength(2);
      expect(result.every((r) => r.owner_id === testOwnerId)).toBe(true);
      expect(result.every((r) => r.repo_id !== otherRepoId)).toBe(true);

      // Clean up
      await supabaseAdmin.from("repository_features").delete().eq("owner_id", otherOwnerId);
      await supabaseAdmin.from("repositories").delete().eq("owner_id", otherOwnerId);
      await supabaseAdmin.from("owners").delete().eq("owner_id", otherOwnerId);
    });
  });

  describe("error scenarios", () => {
    it("should throw error when ownerId is missing", async () => {
      await expect(getAllActionSettings(0)).rejects.toThrow("Missing required parameter: ownerId");
    });
  });
});
