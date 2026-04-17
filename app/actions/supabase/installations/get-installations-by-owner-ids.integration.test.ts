import { getInstallationsByOwnerIds } from "./get-installations-by-owner-ids";
import { getAllOwnerIds } from "./get-all-owner-ids";

describe("getInstallationsByOwnerIds (integration)", () => {
  // ===== integration =====

  it("returns installations for a subset of owner IDs", async () => {
    const allIds = await getAllOwnerIds();

    if (allIds.length === 0) {
      // If DB is empty, we can't test positive case, but we can test empty array
      const result = await getInstallationsByOwnerIds([]);
      expect(result).toEqual([]);
      return;
    }

    const subsetIds = allIds.slice(0, 5);
    const installations = await getInstallationsByOwnerIds(subsetIds);

    expect(Array.isArray(installations)).toBe(true);

    for (const inst of installations) {
      expect(subsetIds).toContain(inst.owner_id);
      expect(inst.uninstalled_at).toBeNull();
    }
  });

  it("returns empty array for non-existent owner IDs", async () => {
    // Use IDs that are unlikely to exist (e.g., very large numbers)
    const nonExistentIds = [99999999, 88888888];
    const installations = await getInstallationsByOwnerIds(nonExistentIds);

    expect(installations).toEqual([]);
  });
});
