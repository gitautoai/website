import { getOwner } from "./get-owner";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("getOwner", () => {
  const mockFrom = supabaseAdmin.from as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("happy path", () => {
    it("should return owner data when owner exists", async () => {
      const mockOwner = {
        owner_id: 123,
        owner_name: "test-owner",
        owner_type: "User",
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

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: mockOwner, error: null }),
          }),
        }),
      });

      const result = await getOwner(123);

      expect(mockFrom).toHaveBeenCalledWith("owners");
      expect(result).toEqual(mockOwner);
    });

    it("should return owner with Organization type", async () => {
      const mockOwner = {
        owner_id: 456,
        owner_name: "test-org",
        owner_type: "Organization",
        stripe_customer_id: "cus_test456",
        credit_balance_usd: 500,
        auto_reload_enabled: true,
        auto_reload_threshold_usd: 20,
        auto_reload_target_usd: 100,
        org_rules: "some rules",
        max_spending_limit_usd: 5000,
        created_at: "2024-01-01T00:00:00Z",
        created_by: "system",
        updated_at: "2024-01-02T00:00:00Z",
        updated_by: "admin",
      };

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: mockOwner, error: null }),
          }),
        }),
      });

      const result = await getOwner(456);

      expect(mockFrom).toHaveBeenCalledWith("owners");
      expect(result).toEqual(mockOwner);
    });

    it("should return owner with zero balance", async () => {
      const mockOwner = {
        owner_id: 789,
        owner_name: "test-owner-zero",
        owner_type: "User",
        stripe_customer_id: "cus_test789",
        credit_balance_usd: 0,
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

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: mockOwner, error: null }),
          }),
        }),
      });

      const result = await getOwner(789);

      expect(result).toEqual(mockOwner);
      expect(result?.credit_balance_usd).toBe(0);
    });
  });

  describe("edge cases", () => {
    it("should return null when owner does not exist", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });

      const result = await getOwner(999);

      expect(mockFrom).toHaveBeenCalledWith("owners");
      expect(result).toBeNull();
    });

    it("should handle negative owner IDs", async () => {
      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });

      const result = await getOwner(-1);

      expect(mockFrom).toHaveBeenCalledWith("owners");
      expect(result).toBeNull();
    });

    it("should handle very large owner IDs", async () => {
      const largeOwnerId = 999999999999;

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });

      const result = await getOwner(largeOwnerId);

      expect(mockFrom).toHaveBeenCalledWith("owners");
      expect(result).toBeNull();
    });

    it("should handle owner with all optional fields populated", async () => {
      const mockOwner = {
        owner_id: 111,
        owner_name: "test-owner-full",
        owner_type: "Organization",
        stripe_customer_id: "cus_test111",
        credit_balance_usd: 999.99,
        auto_reload_enabled: true,
        auto_reload_threshold_usd: 100,
        auto_reload_target_usd: 500,
        org_rules: "detailed rules",
        max_spending_limit_usd: 10000,
        created_at: "2024-01-01T00:00:00Z",
        created_by: "admin",
        updated_at: "2024-01-02T00:00:00Z",
        updated_by: "system",
      };

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: mockOwner, error: null }),
          }),
        }),
      });

      const result = await getOwner(111);

      expect(result).toEqual(mockOwner);
    });

    it("should handle owner with empty string fields", async () => {
      const mockOwner = {
        owner_id: 222,
        owner_name: "",
        owner_type: "User",
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

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: mockOwner, error: null }),
          }),
        }),
      });

      const result = await getOwner(222);

      expect(result).toEqual(mockOwner);
    });
  });

  describe("error cases", () => {
    it("should throw error when database query fails", async () => {
      const mockError = { message: "Database connection failed" };

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      });

      await expect(getOwner(123)).rejects.toThrow("Failed to get owner: Database connection failed");
      expect(mockFrom).toHaveBeenCalledWith("owners");
    });

    it("should throw error with network error message", async () => {
      const mockError = { message: "Network timeout" };

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      });

      await expect(getOwner(456)).rejects.toThrow("Failed to get owner: Network timeout");
    });

    it("should throw error with permission denied message", async () => {
      const mockError = { message: "Permission denied" };

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      });

      await expect(getOwner(789)).rejects.toThrow("Failed to get owner: Permission denied");
    });

    it("should throw error with table not found message", async () => {
      const mockError = { message: "relation \"owners\" does not exist" };

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: null, error: mockError }),
          }),
        }),
      });

      await expect(getOwner(999)).rejects.toThrow('Failed to get owner: relation "owners" does not exist');
    });
  });

  describe("corner cases", () => {
    it("should handle owner with very large credit balance", async () => {
      const mockOwner = {
        owner_id: 333,
        owner_name: "test-owner-rich",
        owner_type: "Organization",
        stripe_customer_id: "cus_test333",
        credit_balance_usd: 999999.99,
        auto_reload_enabled: true,
        auto_reload_threshold_usd: 1000,
        auto_reload_target_usd: 5000,
        org_rules: "",
        max_spending_limit_usd: 1000000,
        created_at: "2024-01-01T00:00:00Z",
        created_by: null,
        updated_at: "2024-01-01T00:00:00Z",
        updated_by: null,
      };

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: mockOwner, error: null }),
          }),
        }),
      });

      const result = await getOwner(333);

      expect(result).toEqual(mockOwner);
      expect(result?.credit_balance_usd).toBe(999999.99);
    });

    it("should handle owner with small decimal balance", async () => {
      const mockOwner = {
        owner_id: 444,
        owner_name: "test-owner-small",
        owner_type: "User",
        stripe_customer_id: "cus_test444",
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

      mockFrom.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({ data: mockOwner, error: null }),
          }),
        }),
      });

      const result = await getOwner(444);

      expect(result).toEqual(mockOwner);
      expect(result?.credit_balance_usd).toBe(0.01);
    });

    it("should verify correct query parameters are used", async () => {
      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
        }),
      });

      const mockEq = jest.fn().mockReturnValue({
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
      });

      mockFrom.mockReturnValue({
        select: mockSelect,
      });

      mockSelect.mockReturnValue({
        eq: mockEq,
      });

      await getOwner(555);

      expect(mockFrom).toHaveBeenCalledWith("owners");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("owner_id", 555);
    });
  });
});
