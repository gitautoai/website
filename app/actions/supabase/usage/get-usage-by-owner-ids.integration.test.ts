import { getUsageByOwnerIds } from "./get-usage-by-owner-ids";

describe("getUsageByOwnerIds (integration)", () => {
  it("returns usage rows with PR data for known owners", async () => {
    // gitautoai (owner_id 159883862) has usage with PRs
    const results = await getUsageByOwnerIds([159883862]);

    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(r.owner_id).toBe(159883862);
      expect(r.pr_number).toBeGreaterThan(0);
    }
  });

  it("returns empty for non-existent owner IDs", async () => {
    const results = await getUsageByOwnerIds([999999999]);

    expect(results).toEqual([]);
  });
});
