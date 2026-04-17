import { getOwnerIdsWithActiveSubscription } from "./get-owner-ids-with-active-subscription";
import { getActiveSubscriptionCustomerIds } from "./get-active-subscription-customer-ids";
import { getOwners } from "@/app/actions/supabase/owners/get-owners";
import { supabaseAdmin } from "@/lib/supabase/server";
import stripe from "@/lib/stripe";

jest.mock("./get-active-subscription-customer-ids");
jest.mock("@/app/actions/supabase/owners/get-owners");
jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    in: jest.fn(),
  },
}));
jest.mock("@/lib/stripe", () => ({
  __esModule: true,
  default: {
    subscriptions: {
      list: jest.fn(),
    },
  },
}));

const mockGetActiveSubscriptionCustomerIds = getActiveSubscriptionCustomerIds as jest.Mock;
const mockGetOwners = getOwners as jest.Mock;
const mockSupabaseAdmin = supabaseAdmin as any;
const mockStripe = stripe as any;

describe("getOwnerIdsWithActiveSubscription", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== solitary =====
  describe("solitary", () => {
    it("returns an empty set when ownerIds is empty", async () => {
      // Verify that if no owner IDs are provided, it returns an empty set immediately without calling dependencies
      const result = await getOwnerIdsWithActiveSubscription([]);
      expect(result).toEqual(new Set());
      expect(mockGetOwners).not.toHaveBeenCalled();
      expect(mockGetActiveSubscriptionCustomerIds).not.toHaveBeenCalled();
    });

    it("throws when ownerIds is null or undefined", async () => {
      // Verify that null or undefined ownerIds cause a crash (as expected for this implementation)
      // This documents the current behavior and ensures it's handled/known
      await expect(getOwnerIdsWithActiveSubscription(null as any)).rejects.toThrow();
      await expect(getOwnerIdsWithActiveSubscription(undefined as any)).rejects.toThrow();
    });

    it("handles malformed input arrays gracefully", async () => {
      // Verify that non-number elements in the array don't cause unexpected crashes
      // and are handled by the underlying getOwners call
      mockGetOwners.mockResolvedValue([]);
      mockGetActiveSubscriptionCustomerIds.mockResolvedValue(new Set());

      const result = await getOwnerIdsWithActiveSubscription(["not-a-number" as any, { id: 1 } as any]);
      expect(result).toEqual(new Set());
    });

    it("throws when getOwners fails", async () => {
      // Verify that errors from getOwners are propagated
      mockGetOwners.mockRejectedValue(new Error("DB Error"));
      await expect(getOwnerIdsWithActiveSubscription([1])).rejects.toThrow("DB Error");
    });

    it("throws when getActiveSubscriptionCustomerIds fails", async () => {
      // Verify that errors from getActiveSubscriptionCustomerIds are propagated
      mockGetOwners.mockResolvedValue([{ owner_id: 1, stripe_customer_id: "cus_1" }]);
      mockGetActiveSubscriptionCustomerIds.mockRejectedValue(new Error("Stripe Error"));
      await expect(getOwnerIdsWithActiveSubscription([1])).rejects.toThrow("Stripe Error");
    });

    it("returns an empty set when no owners are found", async () => {
      // Verify that if no owners are returned from DB, the result is an empty set
      mockGetOwners.mockResolvedValue([]);
      mockGetActiveSubscriptionCustomerIds.mockResolvedValue(new Set(["cus_1"]));

      const result = await getOwnerIdsWithActiveSubscription([1]);
      expect(result).toEqual(new Set());
    });

    it("returns an empty set when owners have no stripe customer IDs", async () => {
      // Verify that owners without stripe_customer_id are ignored
      mockGetOwners.mockResolvedValue([
        { owner_id: 1, stripe_customer_id: null },
        { owner_id: 2, stripe_customer_id: undefined },
      ]);
      mockGetActiveSubscriptionCustomerIds.mockResolvedValue(new Set(["cus_1"]));

      const result = await getOwnerIdsWithActiveSubscription([1, 2]);
      expect(result).toEqual(new Set());
    });

    it("returns an empty set when stripe customer IDs are not active", async () => {
      // Verify that owners with stripe IDs that are not in the active set are ignored
      mockGetOwners.mockResolvedValue([
        { owner_id: 1, stripe_customer_id: "cus_inactive" },
      ]);
      mockGetActiveSubscriptionCustomerIds.mockResolvedValue(new Set(["cus_active"]));

      const result = await getOwnerIdsWithActiveSubscription([1]);
      expect(result).toEqual(new Set());
    });

    it("returns owner IDs for owners with active subscriptions", async () => {
      // Verify that owners with active stripe customer IDs are included in the result
      mockGetOwners.mockResolvedValue([
        { owner_id: 1, stripe_customer_id: "cus_active" },
      ]);
      mockGetActiveSubscriptionCustomerIds.mockResolvedValue(new Set(["cus_active"]));

      const result = await getOwnerIdsWithActiveSubscription([1]);
      expect(result).toEqual(new Set([1]));
    });

    it("correctly filters a mix of owners", async () => {
      // Verify complex scenario with multiple owners and different subscription statuses
      mockGetOwners.mockResolvedValue([
        { owner_id: 1, stripe_customer_id: "cus_active_1" }, // Active
        { owner_id: 2, stripe_customer_id: "cus_active_2" }, // Active
        { owner_id: 3, stripe_customer_id: "cus_inactive" }, // Inactive
        { owner_id: 4, stripe_customer_id: null },           // No Stripe ID
      ]);
      mockGetActiveSubscriptionCustomerIds.mockResolvedValue(new Set(["cus_active_1", "cus_active_2"]));

      const result = await getOwnerIdsWithActiveSubscription([1, 2, 3, 4]);
      expect(result).toEqual(new Set([1, 2]));
    });

    it("avoids N+1 queries by calling dependencies once", async () => {
      // Verify that getOwners and getActiveSubscriptionCustomerIds are called exactly once
      // regardless of the number of ownerIds provided.
      mockGetOwners.mockResolvedValue([]);
      mockGetActiveSubscriptionCustomerIds.mockResolvedValue(new Set());

      await getOwnerIdsWithActiveSubscription([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(mockGetOwners).toHaveBeenCalledTimes(1);
      expect(mockGetActiveSubscriptionCustomerIds).toHaveBeenCalledTimes(1);
    });
  });

  // ===== sociable =====
  describe("sociable", () => {
    it("works with real collaborators", async () => {
      // Use real implementations of collaborators
      mockGetOwners.mockImplementation(jest.requireActual("@/app/actions/supabase/owners/get-owners").getOwners);
      mockGetActiveSubscriptionCustomerIds.mockImplementation(jest.requireActual("./get-active-subscription-customer-ids").getActiveSubscriptionCustomerIds);

      // Mock Supabase response
      mockSupabaseAdmin.from().select().in.mockResolvedValue({
        data: [
          { owner_id: 1, stripe_customer_id: "cus_active" },
          { owner_id: 2, stripe_customer_id: "cus_inactive" },
        ],
        error: null,
      });

      // Mock Stripe response
      mockStripe.subscriptions.list.mockReturnValue({
        [Symbol.asyncIterator]: async function* () {
          yield {
            customer: "cus_active",
            items: { data: [{ price: { active: true, unit_amount: 1000 } }] },
          };
          yield {
            customer: "cus_inactive",
            items: { data: [{ price: { active: false, unit_amount: 1000 } }] },
          };
        },
      });

      const result = await getOwnerIdsWithActiveSubscription([1, 2]);
      expect(result).toEqual(new Set([1]));
    });
  });
});
