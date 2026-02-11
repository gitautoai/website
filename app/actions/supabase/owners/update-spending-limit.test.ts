import { updateSpendingLimit } from "./update-spending-limit";
import validateSpendingLimit from "./validate-spending-limit";
import { supabase } from "@/utils/supabase/client";

jest.mock("./validate-spending-limit");
jest.mock("@/utils/supabase/client", () => ({
  supabase: {
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

    mockSelect = jest.fn().mockResolvedValue({ data: null, error: null });
    mockEq = jest.fn().mockReturnValue({ select: mockSelect });
    mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });
    mockFrom = jest.fn().mockReturnValue({ update: mockUpdate });

    (supabase.from as jest.Mock) = mockFrom;
    (validateSpendingLimit as jest.Mock).mockResolvedValue(undefined);
  });

  describe("when owner does not exist", () => {
    it("should return error when owner is not found", async () => {
      mockSelect.mockResolvedValue({ data: [], error: null });

      await expect(updateSpendingLimit({ ownerId: 123, spendingLimit: 100 })).rejects.toThrow(
        "Owner with ID 123 not found"
      );

      expect(validateSpendingLimit).toHaveBeenCalledWith({ ownerId: 123, spendingLimit: 100 });
      expect(mockFrom).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ max_spending_limit_usd: 100 });
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockSelect).toHaveBeenCalled();
    });
  });

  describe("when validation fails", () => {
    it("should return error when spending limit is null", async () => {
      (validateSpendingLimit as jest.Mock).mockRejectedValueOnce(
        new Error("Spending limit cannot be null")
      );

      await expect(updateSpendingLimit({ ownerId: 123, spendingLimit: null })).rejects.toThrow(
        "Spending limit cannot be null"
      );

      expect(validateSpendingLimit).toHaveBeenCalledWith({ ownerId: 123, spendingLimit: null });
      expect(mockFrom).not.toHaveBeenCalled();
    });

    it("should return error when spending limit is less than credit balance", async () => {
      (validateSpendingLimit as jest.Mock).mockRejectedValueOnce(
        new Error("Spending limit must be greater than or equal to credit balance")
      );

      await expect(updateSpendingLimit({ ownerId: 123, spendingLimit: 50 })).rejects.toThrow(
        "Spending limit must be greater than or equal to credit balance"
      );

      expect(validateSpendingLimit).toHaveBeenCalledWith({ ownerId: 123, spendingLimit: 50 });
      expect(mockFrom).not.toHaveBeenCalled();
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
        updateSpendingLimit({ ownerId: 123, spendingLimit: 100 })
      ).resolves.toBeUndefined();

      expect(validateSpendingLimit).toHaveBeenCalledWith({ ownerId: 123, spendingLimit: 100 });
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

      await expect(updateSpendingLimit({ ownerId: 123, spendingLimit: 100 })).rejects.toThrow(
        "Failed to update spending limit: Database error"
      );

      expect(validateSpendingLimit).toHaveBeenCalledWith({ ownerId: 123, spendingLimit: 100 });
      expect(mockFrom).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ max_spending_limit_usd: 100 });
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockSelect).toHaveBeenCalled();
    });

    it("should throw error when no data is returned after update", async () => {
      mockSelect.mockResolvedValue({ data: [], error: null });

      await expect(updateSpendingLimit({ ownerId: 123, spendingLimit: 100 })).rejects.toThrow(
        "Owner with ID 123 not found"
      );

      expect(validateSpendingLimit).toHaveBeenCalledWith({ ownerId: 123, spendingLimit: 100 });
      expect(mockFrom).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ max_spending_limit_usd: 100 });
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockSelect).toHaveBeenCalled();
    });
  });
});
