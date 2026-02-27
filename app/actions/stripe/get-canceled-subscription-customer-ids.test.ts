import { getCanceledSubscriptionCustomerIds } from "./get-canceled-subscription-customer-ids";

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

const makeSub = (
  customer: string,
  priceActive: boolean,
  unitAmount: number,
  canceledAt = 1700000000,
) => ({
  customer,
  canceled_at: canceledAt,
  items: { data: [{ price: { active: priceActive, unit_amount: unitAmount } }] },
});

describe("getCanceledSubscriptionCustomerIds", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns customer IDs with cancellation dates", async () => {
    mockList.mockReturnValue({
      [Symbol.asyncIterator]: async function* () {
        yield makeSub("cus_canceled", true, 100000, 1700000000);
        yield makeSub("cus_free", true, 0);
      },
    });

    const result = await getCanceledSubscriptionCustomerIds();

    expect(result).toBeInstanceOf(Map);
    expect(result.has("cus_canceled")).toBe(true);
    expect(result.has("cus_free")).toBe(false);
    expect(mockList).toHaveBeenCalledWith({ status: "canceled", limit: 100 });
  });

  it("returns empty map when no canceled subscriptions exist", async () => {
    mockList.mockReturnValue({
      [Symbol.asyncIterator]: async function* () {},
    });

    const result = await getCanceledSubscriptionCustomerIds();

    expect(result.size).toBe(0);
  });
});
