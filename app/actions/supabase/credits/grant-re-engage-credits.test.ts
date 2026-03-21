import { FREE_CREDITS_AMOUNT_USD } from "@/config/pricing";
import { grantReEngageCredits } from "./grant-re-engage-credits";
import { insertCredits } from "./insert-credits";

jest.mock("./insert-credits");
const mockInsertCredits = jest.mocked(insertCredits);

beforeEach(() => jest.clearAllMocks());

describe("grantReEngageCredits", () => {
  it("should grant top-up credits when balance is zero", async () => {
    await grantReEngageCredits(123, "test-owner", 0);

    expect(mockInsertCredits).toHaveBeenCalledWith({
      owner_id: 123,
      amount_usd: FREE_CREDITS_AMOUNT_USD,
      transaction_type: "salvage",
      expires_at: expect.any(String),
    });
  });

  it("should grant partial top-up when balance is below free amount", async () => {
    await grantReEngageCredits(123, "test-owner", 7);

    expect(mockInsertCredits).toHaveBeenCalledWith({
      owner_id: 123,
      amount_usd: FREE_CREDITS_AMOUNT_USD - 7,
      transaction_type: "salvage",
      expires_at: expect.any(String),
    });
  });

  it("should not grant credits when balance equals free amount", async () => {
    await grantReEngageCredits(123, "test-owner", FREE_CREDITS_AMOUNT_USD);

    expect(mockInsertCredits).not.toHaveBeenCalled();
  });

  it("should not grant credits when balance exceeds free amount", async () => {
    await grantReEngageCredits(123, "test-owner", FREE_CREDITS_AMOUNT_USD + 10);

    expect(mockInsertCredits).not.toHaveBeenCalled();
  });

  it("should set expiry to 1 year from now", async () => {
    const before = Date.now();
    await grantReEngageCredits(123, "test-owner", 0);
    const after = Date.now();

    const expiresAt = new Date(
      mockInsertCredits.mock.calls[0][0].expires_at!,
    ).getTime();
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    expect(expiresAt).toBeGreaterThanOrEqual(before + oneYear);
    expect(expiresAt).toBeLessThanOrEqual(after + oneYear);
  });

  it("should not throw when insertCredits fails", async () => {
    mockInsertCredits.mockRejectedValueOnce(new Error("DB error"));

    await expect(
      grantReEngageCredits(123, "test-owner", 0),
    ).resolves.not.toThrow();
  });
});
