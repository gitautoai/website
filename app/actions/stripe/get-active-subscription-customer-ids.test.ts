import { getActiveSubscriptionCustomerIds } from "./get-active-subscription-customer-ids";

jest.mock("@/lib/stripe", () => ({
  __esModule: true,
  default: {
    subscriptions: {
      list: jest.fn(),
    },
  },
}));

import stripe from "@/lib/stripe";

const mockList = stripe.subscriptions.list as jest.Mock;

const makeSub = (customer: string, priceActive: boolean, unitAmount: number) => ({
  customer,
  items: { data: [{ price: { active: priceActive, unit_amount: unitAmount } }] },
});

describe("getActiveSubscriptionCustomerIds", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns customer IDs with active paid subscriptions", async () => {
    mockList.mockReturnValue({
      [Symbol.asyncIterator]: async function* () {
        yield makeSub("cus_paid", true, 100000);
        yield makeSub("cus_free", true, 0);
      },
    });

    const result = await getActiveSubscriptionCustomerIds();

    expect(result).toEqual(new Set(["cus_paid"]));
  });

  it("excludes subscriptions with inactive prices", async () => {
    mockList.mockReturnValue({
      [Symbol.asyncIterator]: async function* () {
        yield makeSub("cus_inactive_price", false, 100000);
      },
    });

    const result = await getActiveSubscriptionCustomerIds();

    expect(result.size).toBe(0);
  });

  it("returns empty set when no subscriptions exist", async () => {
    mockList.mockReturnValue({
      [Symbol.asyncIterator]: async function* () {},
    });

    const result = await getActiveSubscriptionCustomerIds();

    expect(result.size).toBe(0);
  });

  it("deduplicates customers with multiple paid subscriptions", async () => {
    mockList.mockReturnValue({
      [Symbol.asyncIterator]: async function* () {
        yield makeSub("cus_same", true, 50000);
        yield makeSub("cus_same", true, 100000);
      },
    });

    const result = await getActiveSubscriptionCustomerIds();

    expect(result).toEqual(new Set(["cus_same"]));
    expect(result.size).toBe(1);
  });
});
