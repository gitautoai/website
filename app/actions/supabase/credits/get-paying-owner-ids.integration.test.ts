import { getPayingOwnerIds } from "./get-paying-owner-ids";

describe("getPayingOwnerIds (integration)", () => {
  it("returns owner IDs for known paying owners", async () => {
    // owner_id 499237 has purchased credits in dev
    const results = await getPayingOwnerIds([499237]);

    expect(results).toContain(499237);
  });

  it("returns empty for non-existent owner IDs", async () => {
    const results = await getPayingOwnerIds([999999999]);

    expect(results).toEqual([]);
  });
});
