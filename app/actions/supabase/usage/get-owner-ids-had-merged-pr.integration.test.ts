import { getAllOwnerIds } from "@/app/actions/supabase/installations/get-all-owner-ids";
import { getOwnerIdsHadMergedPr } from "./get-owner-ids-had-merged-pr";

describe("getOwnerIdsHadMergedPr (integration)", () => {
  it("returns a Map of owner IDs to merged PR counts", async () => {
    const ownerIds = await getAllOwnerIds();
    const result = await getOwnerIdsHadMergedPr(ownerIds);

    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBeGreaterThan(0);
    for (const [id, count] of result) {
      expect(ownerIds).toContain(id);
      expect(count).toBeGreaterThan(0);
    }
  });
});
