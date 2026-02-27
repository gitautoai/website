import { getAllOwnerIds } from "./get-all-owner-ids";

describe("getAllOwnerIds (integration)", () => {
  it("returns deduplicated owner IDs", async () => {
    const ids = await getAllOwnerIds();

    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) expect(id).toBeGreaterThan(0);

    // Verify deduplication
    expect(new Set(ids).size).toBe(ids.length);
  });
});
