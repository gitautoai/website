import { getAllOwnerIds } from "@/app/actions/supabase/installations/get-all-owner-ids";
import { getOwnerIdsHadPr } from "./get-owner-ids-had-pr";

describe("getOwnerIdsHadPr (integration)", () => {
  it("returns a Map of owner IDs to PR counts", async () => {
    const ownerIds = await getAllOwnerIds();
    const result = await getOwnerIdsHadPr(ownerIds);

    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBeGreaterThan(0);
    for (const [id, count] of result) {
      expect(ownerIds).toContain(id);
      expect(count).toBeGreaterThan(0);
    }
  });
});
