import { getAllOwnerIds } from "@/app/actions/supabase/installations/get-all-owner-ids";
import { getOwnerIdsHadSubscription } from "./get-owner-ids-had-subscription";

jest.setTimeout(60000);

describe("getOwnerIdsHadSubscription (integration)", () => {
  it("returns a Set of owner IDs that had canceled subscriptions", async () => {
    const ownerIds = await getAllOwnerIds();
    const result = await getOwnerIdsHadSubscription(ownerIds);

    expect(result).toBeInstanceOf(Set);
    for (const id of result) expect(ownerIds).toContain(id);
  });
});
