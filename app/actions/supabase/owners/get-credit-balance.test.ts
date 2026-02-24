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
        created_at: "2024-01-01T00:00:00Z",
        created_by: null,
        updated_at: "2024-01-01T00:00:00Z",
        updated_by: null,
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
        created_at: "2024-01-01T00:00:00Z",
        created_by: null,
        updated_at: "2024-01-01T00:00:00Z",
        updated_by: null,
      };

      mockGetOwner.mockResolvedValue(mockOwner);

      const result = await getCreditBalance(456);

      expect(result).toBe(0);
      expect(mockGetOwner).toHaveBeenCalledWith(456);
    });

    it("should return positive balance for large amounts", async () => {
      const mockOwner = {
        owner_id: 789,
        owner_name: "test-owner-3",
        owner_type: "User" as const,
        stripe_customer_id: "cus_test789",
        credit_balance_usd: 9999.99,
        auto_reload_enabled: false,
        auto_reload_threshold_usd: 10,
        auto_reload_target_usd: 50,
        org_rules: "",
        max_spending_limit_usd: null,
        created_at: "2024-01-01T00:00:00Z",
        created_by: null,
        updated_at: "2024-01-01T00:00:00Z",
        updated_by: null,
      };

      mockGetOwner.mockResolvedValue(mockOwner);

      const result = await getCreditBalance(789);

      expect(result).toBe(9999.99);
      expect(mockGetOwner).toHaveBeenCalledWith(789);
    });
  });

  describe("edge cases", () => {
    it("should return 0 when owner does not exist (null)", async () => {
      mockGetOwner.mockResolvedValue(null);

      const result = await getCreditBalance(999);

      expect(result).toBe(0);
      expect(mockGetOwner).toHaveBeenCalledWith(999);
    });

    it("should handle negative owner IDs", async () => {
      mockGetOwner.mockResolvedValue(null);

      const result = await getCreditBalance(-1);

      expect(result).toBe(0);
      expect(mockGetOwner).toHaveBeenCalledWith(-1);
    });

    it("should handle very large owner IDs", async () => {
      const largeOwnerId = 999999999999;
      mockGetOwner.mockResolvedValue(null);

      const result = await getCreditBalance(largeOwnerId);

      expect(result).toBe(0);
      expect(mockGetOwner).toHaveBeenCalledWith(largeOwnerId);
    });

    it("should handle small decimal balances", async () => {
      const mockOwner = {
        owner_id: 111,
        owner_name: "test-owner-small",
        owner_type: "User" as const,
        stripe_customer_id: "cus_test111",
        credit_balance_usd: 0.01,
        auto_reload_enabled: false,
        auto_reload_threshold_usd: 10,
        auto_reload_target_usd: 50,
        org_rules: "",
        max_spending_limit_usd: null,
        created_at: "2024-01-01T00:00:00Z",
        created_by: null,
        updated_at: "2024-01-01T00:00:00Z",
        updated_by: null,
      };

      mockGetOwner.mockResolvedValue(mockOwner);

      const result = await getCreditBalance(111);

      expect(result).toBe(0.01);
      expect(mockGetOwner).toHaveBeenCalledWith(111);
    });
  });

  describe("error cases", () => {
    it("should propagate error when getOwner throws", async () => {
      const mockError = new Error("Database connection failed");
      mockGetOwner.mockRejectedValue(mockError);

      await expect(getCreditBalance(123)).rejects.toThrow("Database connection failed");
      expect(mockGetOwner).toHaveBeenCalledWith(123);
    });

    it("should propagate error when getOwner throws generic error", async () => {
      const mockError = new Error("Failed to get owner: Network error");
      mockGetOwner.mockRejectedValue(mockError);

      await expect(getCreditBalance(456)).rejects.toThrow("Failed to get owner: Network error");
      expect(mockGetOwner).toHaveBeenCalledWith(456);
    });
  });

  describe("corner cases", () => {
    it("should handle owner with all optional fields set", async () => {
      const mockOwner = {
        owner_id: 222,
        owner_name: "test-owner-full",
        owner_type: "Organization" as const,
        stripe_customer_id: "cus_test222",
        credit_balance_usd: 250.75,
        auto_reload_enabled: true,
        auto_reload_threshold_usd: 50,
        auto_reload_target_usd: 200,
        org_rules: "some rules",
        max_spending_limit_usd: 10000,
        created_at: "2024-01-01T00:00:00Z",
        created_by: "system",
        updated_at: "2024-01-02T00:00:00Z",
        updated_by: "admin",
      };

      mockGetOwner.mockResolvedValue(mockOwner);

      const result = await getCreditBalance(222);

      expect(result).toBe(250.75);
      expect(mockGetOwner).toHaveBeenCalledWith(222);
    });

    it("should handle owner with empty string fields", async () => {
      const mockOwner = {
        owner_id: 333,
        owner_name: "",
        owner_type: "User" as const,
        stripe_customer_id: "",
        credit_balance_usd: 50,
        auto_reload_enabled: false,
        auto_reload_threshold_usd: 10,
        auto_reload_target_usd: 50,
        org_rules: "",
        max_spending_limit_usd: null,
        created_at: "2024-01-01T00:00:00Z",
        created_by: null,
        updated_at: "2024-01-01T00:00:00Z",
        updated_by: null,
      };

      mockGetOwner.mockResolvedValue(mockOwner);

      const result = await getCreditBalance(333);

      expect(result).toBe(50);
      expect(mockGetOwner).toHaveBeenCalledWith(333);
    });
  });
});
