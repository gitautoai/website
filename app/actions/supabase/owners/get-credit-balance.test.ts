import { getCreditBalance } from "./get-credit-balance";
import { getOwner } from "./get-owner";

jest.mock("./get-owner");

describe("getCreditBalance", () => {
  const mockGetOwner = getOwner as jest.MockedFunction<typeof getOwner>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("happy path", () => {
    it("should return credit balance when owner exists with balance", async () => {
      const mockOwner = {
        owner_id: 123,
        owner_name: "test-owner",
        owner_type: "User" as const,
        stripe_customer_id: "cus_test123",
        credit_balance_usd: 100.5,
        auto_reload_enabled: false,
        auto_reload_threshold_usd: 10,
        auto_reload_target_usd: 50,
        org_rules: "",
        max_spending_limit_usd: null,
        created_by: null,
        updated_by: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      mockGetOwner.mockResolvedValue(mockOwner);

      const result = await getCreditBalance(123);

      expect(result).toBe(100.5);
      expect(mockGetOwner).toHaveBeenCalledWith(123);
      expect(mockGetOwner).toHaveBeenCalledTimes(1);
    });

    it("should return 0 when owner exists with zero balance", async () => {
      const mockOwner = {
        owner_id: 456,
        owner_name: "test-owner-2",
        owner_type: "Organization" as const,
        stripe_customer_id: "cus_test456",
        credit_balance_usd: 0,
        auto_reload_enabled: true,
        auto_reload_threshold_usd: 20,
        auto_reload_target_usd: 100,
        org_rules: "",
        max_spending_limit_usd: 5000,
        created_by: null,
        updated_by: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      mockGetOwner.mockResolvedValue(mockOwner);

      const result = await getCreditBalance(456);

      expect(result).toBe(0);
      expect(mockGetOwner).toHaveBeenCalledWith(456);
    });
  });

  describe("edge cases", () => {
    it("should return 0 when owner does not exist", async () => {
      mockGetOwner.mockResolvedValue(null);

      const result = await getCreditBalance(999);

      expect(result).toBe(0);
      expect(mockGetOwner).toHaveBeenCalledWith(999);
    });

    it("should return 0 when credit_balance_usd is undefined (edge case)", async () => {
      const mockOwner = {
        owner_id: 789,
        owner_name: "test-owner-3",
        owner_type: "User" as const,
        stripe_customer_id: "cus_test789",
        credit_balance_usd: undefined as any,
        auto_reload_enabled: false,
        auto_reload_threshold_usd: 10,
        auto_reload_target_usd: 50,
        org_rules: "",
        max_spending_limit_usd: null,
        created_by: null,
        updated_by: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      };

      mockGetOwner.mockResolvedValue(mockOwner);

      const result = await getCreditBalance(789);

      expect(result).toBe(0);
      expect(mockGetOwner).toHaveBeenCalledWith(789);
    });
  });

  describe("error cases", () => {
    it("should propagate error when getOwner throws", async () => {
      const mockError = new Error("Database connection failed");
      mockGetOwner.mockRejectedValue(mockError);

      await expect(getCreditBalance(123)).rejects.toThrow("Database connection failed");
      expect(mockGetOwner).toHaveBeenCalledWith(123);
    });
  });
});
