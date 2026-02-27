import { getAllOwnerIds } from "@/app/actions/supabase/installations/get-all-owner-ids";
import { getOwnerIdsWithActiveSubscription } from "./get-owner-ids-with-active-subscription";

jest.setTimeout(60000);

describe("getOwnerIdsWithActiveSubscription (integration)", () => {
  it("returns a Set of owner IDs with active subscriptions", async () => {
    const ownerIds = await getAllOwnerIds();
    const result = await getOwnerIdsWithActiveSubscription(ownerIds);

    expect(result).toBeInstanceOf(Set);
    for (const id of result) expect(ownerIds).toContain(id);
  });
});
