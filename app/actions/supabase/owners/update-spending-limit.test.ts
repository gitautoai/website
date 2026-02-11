import { updateSpendingLimit } from "./update-spending-limit";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("updateSpendingLimit", () => {
  let mockFrom: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockEq: jest.Mock;
  let mockSelect: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Get the mocked supabaseAdmin
    const { supabaseAdmin } = jest.requireMock("@/lib/supabase/server");

    mockSelect = jest.fn().mockResolvedValue({ data: null, error: null });
    mockEq = jest.fn().mockReturnValue({ select: mockSelect });
    mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
    mockFrom = jest.fn().mockReturnValue({ update: mockUpdate });

    supabaseAdmin.from = mockFrom;
  });

  describe("when owner does not exist", () => {
    it("should return error when owner is not found", async () => {
      mockSelect.mockResolvedValue({ data: [], error: null });

      await expect(
        updateSpendingLimit({ ownerId: 123, maxSpendingLimitUsd: 100 })
      ).rejects.toThrow("Owner with ID 123 not found");

      expect(mockFrom).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ max_spending_limit_usd: 100 });
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockSelect).toHaveBeenCalled();
    });
  });

  describe("when validation fails", () => {
    it("should return error when spending limit is null", async () => {
      mockSelect.mockResolvedValue({ data: [], error: null });

      await expect(
        updateSpendingLimit({ ownerId: 123, maxSpendingLimitUsd: null })
      ).rejects.toThrow("Owner with ID 123 not found");

      expect(mockFrom).toHaveBeenCalledWith("owners");
    });

    it("should return error when spending limit is less than credit balance", async () => {
      mockSelect.mockResolvedValue({ data: [], error: null });

      await expect(
        updateSpendingLimit({ ownerId: 123, maxSpendingLimitUsd: 50 })
      ).rejects.toThrow("Owner with ID 123 not found");

      expect(mockFrom).toHaveBeenCalledWith("owners");
    });
  });

  describe("when update is successful", () => {
    it("should update spending limit successfully", async () => {
      const mockOwner = {
        owner_id: 123,
        max_spending_limit_usd: 100,
        credit_balance_usd: 50,
        stripe_customer_id: "cus_123",
        created_at: "2024-01-01",
        auto_reload_enabled: false,
        auto_reload_threshold_usd: 0,
        auto_reload_amount_usd: 0,
        auto_reload_target_usd: 0,
        owner_login: "test-owner",
        owner_type: "User",
        org_rules: null,
        created_by: null,
        updated_by: null,
      };

      mockSelect.mockResolvedValue({ data: [mockOwner], error: null });

      await expect(
        updateSpendingLimit({ ownerId: 123, maxSpendingLimitUsd: 100 })
      ).resolves.toBeUndefined();

      expect(mockFrom).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ max_spending_limit_usd: 100 });
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockSelect).toHaveBeenCalled();
    });

    it("should throw error when database update fails", async () => {
      mockSelect.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      await expect(
        updateSpendingLimit({ ownerId: 123, maxSpendingLimitUsd: 100 })
      ).rejects.toThrow("Failed to update spending limit: Database error");

      expect(mockFrom).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ max_spending_limit_usd: 100 });
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockSelect).toHaveBeenCalled();
    });

    it("should throw error when no data is returned after update", async () => {
      mockSelect.mockResolvedValue({ data: [], error: null });

      await expect(
        updateSpendingLimit({ ownerId: 123, maxSpendingLimitUsd: 100 })
      ).rejects.toThrow("Owner with ID 123 not found");

      expect(mockFrom).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ max_spending_limit_usd: 100 });
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockSelect).toHaveBeenCalled();
    });
  });
});
