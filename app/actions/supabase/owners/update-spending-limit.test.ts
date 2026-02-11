import { updateSpendingLimit } from "./update-spending-limit";
import { getOwner } from "./get-owner";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("./get-owner");
jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

const mockGetOwner = getOwner as jest.MockedFunction<typeof getOwner>;
const mockSupabaseAdmin = supabaseAdmin as jest.Mocked<typeof supabaseAdmin>;

describe("updateSpendingLimit", () => {
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockEq.mockReturnValue({ select: mockSelect });
    mockUpdate.mockReturnValue({ eq: mockEq });
    (mockSupabaseAdmin.from as jest.Mock).mockReturnValue({
      update: mockUpdate,
    });
  });

  describe("when owner does not exist", () => {
    it("should return error when owner is not found", async () => {
      mockGetOwner.mockResolvedValue(null);

      const result = await updateSpendingLimit({
        ownerId: 123,
        maxSpendingLimitUsd: 100,
      });

      expect(result).toEqual({
        success: false,
        error: "Owner not found",
      });
      expect(mockGetOwner).toHaveBeenCalledWith({ ownerId: 123 });
      expect(mockSupabaseAdmin.from).not.toHaveBeenCalled();
    });
  });

  describe("when validation fails", () => {
    it("should return error when spending limit is null", async () => {
      mockGetOwner.mockResolvedValue({
        auto_reload_enabled: false,
        auto_reload_target_usd: 0,
        auto_reload_threshold_usd: 0,
        created_at: "2024-01-01",
        created_by: "system",
        credit_balance_usd: 500,
        max_spending_limit_usd: 1000,
        org_rules: "",
        owner_id: 123,
        owner_name: "test-owner",
        owner_type: "User",
        stripe_customer_id: "cus_123",
        updated_at: "2024-01-01",
        updated_by: "system",
      });

      const result = await updateSpendingLimit({
        ownerId: 123,
        maxSpendingLimitUsd: null,
      });

      expect(result).toEqual({
        success: false,
        error: "Spending limit is required",
      });
      expect(mockGetOwner).toHaveBeenCalledWith({ ownerId: 123 });
      expect(mockSupabaseAdmin.from).not.toHaveBeenCalled();
    });

    it("should return error when spending limit is less than credit balance", async () => {
      mockGetOwner.mockResolvedValue({
        auto_reload_enabled: false,
        auto_reload_target_usd: 0,
        auto_reload_threshold_usd: 0,
        created_at: "2024-01-01",
        created_by: "system",
        credit_balance_usd: 500,
        max_spending_limit_usd: 1000,
        org_rules: "",
        owner_id: 123,
        owner_name: "test-owner",
        owner_type: "User",
        stripe_customer_id: "cus_123",
        updated_at: "2024-01-01",
        updated_by: "system",
      });

      const result = await updateSpendingLimit({
        ownerId: 123,
        maxSpendingLimitUsd: 100,
      });

      expect(result).toEqual({
        success: false,
        error: "Spending limit must be greater than or equal to credit balance",
      });
      expect(mockGetOwner).toHaveBeenCalledWith({ ownerId: 123 });
      expect(mockSupabaseAdmin.from).not.toHaveBeenCalled();
    });
  });

  describe("when update is successful", () => {
    it("should update spending limit successfully", async () => {
      const mockOwnerData = {
        auto_reload_enabled: false,
        auto_reload_target_usd: 0,
        auto_reload_threshold_usd: 0,
        created_at: "2024-01-01",
        created_by: "system",
        credit_balance_usd: 500,
        max_spending_limit_usd: 1000,
        org_rules: "",
        owner_id: 123,
        owner_name: "test-owner",
        owner_type: "User" as const,
        stripe_customer_id: "cus_123",
        updated_at: "2024-01-01",
        updated_by: "system",
      };

      mockGetOwner.mockResolvedValue(mockOwnerData);
      mockSelect.mockResolvedValue({
        data: [{ ...mockOwnerData, max_spending_limit_usd: 800 }],
        error: null,
      });

      const result = await updateSpendingLimit({
        ownerId: 123,
        maxSpendingLimitUsd: 800,
      });

      expect(result).toEqual({ success: true });
      expect(mockGetOwner).toHaveBeenCalledWith({ ownerId: 123 });
      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ max_spending_limit_usd: 800 });
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockSelect).toHaveBeenCalled();
    });

    it("should throw error when database update fails", async () => {
      const mockOwnerData = {
        auto_reload_enabled: false,
        auto_reload_target_usd: 0,
        auto_reload_threshold_usd: 0,
        created_at: "2024-01-01",
        created_by: "system",
        credit_balance_usd: 500,
        max_spending_limit_usd: 1000,
        org_rules: "",
        owner_id: 123,
        owner_name: "test-owner",
        owner_type: "User" as const,
        stripe_customer_id: "cus_123",
        updated_at: "2024-01-01",
        updated_by: "system",
      };

      mockGetOwner.mockResolvedValue(mockOwnerData);
      mockSelect.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      await expect(
        updateSpendingLimit({
          ownerId: 123,
          maxSpendingLimitUsd: 800,
        }),
      ).rejects.toThrow("Failed to update spending limit: Database error");

      expect(mockGetOwner).toHaveBeenCalledWith({ ownerId: 123 });
      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ max_spending_limit_usd: 800 });
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockSelect).toHaveBeenCalled();
    });

    it("should throw error when no data is returned after update", async () => {
      const mockOwnerData = {
        auto_reload_enabled: false,
        auto_reload_target_usd: 0,
        auto_reload_threshold_usd: 0,
        created_at: "2024-01-01",
        created_by: "system",
        credit_balance_usd: 500,
        max_spending_limit_usd: 1000,
        org_rules: "",
        owner_id: 123,
        owner_name: "test-owner",
        owner_type: "User" as const,
        stripe_customer_id: "cus_123",
        updated_at: "2024-01-01",
        updated_by: "system",
      };

      mockGetOwner.mockResolvedValue(mockOwnerData);
      mockSelect.mockResolvedValue({
        data: [],
        error: null,
      });

      await expect(
        updateSpendingLimit({
          ownerId: 123,
          maxSpendingLimitUsd: 800,
        }),
      ).rejects.toThrow("Owner with ID 123 not found");

      expect(mockGetOwner).toHaveBeenCalledWith({ ownerId: 123 });
      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ max_spending_limit_usd: 800 });
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockSelect).toHaveBeenCalled();
    });
  });
});
