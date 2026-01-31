import { getOwner } from "./get-owner";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("getOwner", () => {
  const mockFrom = supabaseAdmin.from as jest.MockedFunction<typeof supabaseAdmin.from>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("happy path", () => {
    it("should return owner when owner exists", async () => {
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

      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: mockOwner,
        error: null,
      });

      const mockEq = jest.fn().mockReturnValue({
        maybeSingle: mockMaybeSingle,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      mockFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await getOwner(123);

      expect(result).toEqual(mockOwner);
      expect(mockFrom).toHaveBeenCalledWith("owners");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockMaybeSingle).toHaveBeenCalledTimes(1);
    });

    it("should return owner with Organization type", async () => {
      const mockOwner = {
        owner_id: 456,
        owner_name: "test-org",
        owner_type: "Organization" as const,
        stripe_customer_id: "cus_test456",
        credit_balance_usd: 500,
        auto_reload_enabled: true,
        auto_reload_threshold_usd: 100,
        auto_reload_target_usd: 500,
        org_rules: "some rules",
        max_spending_limit_usd: 10000,
        created_at: "2024-01-01T00:00:00Z",
        created_by: "system",
        updated_at: "2024-01-02T00:00:00Z",
        updated_by: "admin",
      };

      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: mockOwner,
        error: null,
      });

      const mockEq = jest.fn().mockReturnValue({
        maybeSingle: mockMaybeSingle,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      mockFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await getOwner(456);

      expect(result).toEqual(mockOwner);
      expect(mockFrom).toHaveBeenCalledWith("owners");
      expect(mockEq).toHaveBeenCalledWith("owner_id", 456);
    });
  });

  describe("edge cases", () => {
    it("should return null when owner does not exist", async () => {
      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      const mockEq = jest.fn().mockReturnValue({
        maybeSingle: mockMaybeSingle,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      mockFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await getOwner(999);

      expect(result).toBeNull();
      expect(mockFrom).toHaveBeenCalledWith("owners");
      expect(mockEq).toHaveBeenCalledWith("owner_id", 999);
    });

    it("should handle very large owner IDs", async () => {
      const largeOwnerId = 999999999999;
      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      const mockEq = jest.fn().mockReturnValue({
        maybeSingle: mockMaybeSingle,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      mockFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await getOwner(largeOwnerId);

      expect(result).toBeNull();
      expect(mockEq).toHaveBeenCalledWith("owner_id", largeOwnerId);
    });
  });

  describe("error cases", () => {
    it("should throw error when supabase returns an error", async () => {
      const mockError = { message: "Database connection failed" };
      const mockMaybeSingle = jest.fn().mockResolvedValue({
        data: null,
        error: mockError,
      });

      const mockEq = jest.fn().mockReturnValue({
        maybeSingle: mockMaybeSingle,
      });

      const mockSelect = jest.fn().mockReturnValue({
        eq: mockEq,
      });

      mockFrom.mockReturnValue({
        select: mockSelect,
      } as any);

      await expect(getOwner(123)).rejects.toThrow("Failed to get owner: Database connection failed");
      expect(mockFrom).toHaveBeenCalledWith("owners");
    });
  });
});
