import { updateSpendingLimit } from "./update-spending-limit";
import { getOwner } from "./get-owner";
import { supabaseAdmin } from "@/lib/supabase/server";

jest.mock("@/lib/supabase/server");
jest.mock("./get-owner");

const mockGetOwner = getOwner as jest.MockedFunction<typeof getOwner>;
const mockSupabaseAdmin = supabaseAdmin as jest.Mocked<typeof supabaseAdmin>;

describe("updateSpendingLimit", () => {
  let mockUpdate: jest.Mock;
  let mockEq: jest.Mock;
  let mockSelect: jest.Mock;
  let mockSingle: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up the mock chain for supabase operations
    mockUpdate = jest.fn();
    mockEq = jest.fn();
    mockSelect = jest.fn();
    mockSingle = jest.fn();

    (mockSupabaseAdmin.from as jest.Mock) = jest.fn().mockReturnValue({
      update: mockUpdate,
    });
    mockUpdate.mockReturnValue({
      eq: mockEq,
    });
    mockEq.mockReturnValue({
      select: mockSelect,
    });
    mockSelect.mockReturnValue({
      single: mockSingle,
    });

    // Default successful DB update response
    mockSingle.mockResolvedValue({
      data: [
        {
          owner_id: 123,
          max_spending_limit_usd: 800,
          credit_balance_usd: 500,
        },
      ],
      error: null,
    });

    // Default successful getOwner response
    mockGetOwner.mockResolvedValue({
      owner_id: 123,
      max_spending_limit_usd: 800,
      credit_balance_usd: 500,
      stripe_customer_id: "cus_123",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      auto_reload_enabled: false,
      auto_reload_threshold_usd: 0,
      auto_reload_target_usd: 0,
      created_by: null,
      updated_by: null,
      owner_name: null,
      owner_type: "user",
      stripe_subscription_id: null,
      stripe_subscription_status: null,
    });
  });

  describe("when owner does not exist", () => {
    it("should return error when owner is not found", async () => {
      mockSingle.mockResolvedValue({
        data: [],
        error: null,
      });

      await expect(
        updateSpendingLimit({
          ownerId: 123,
          maxSpendingLimitUsd: 500,
        }),
      ).rejects.toThrow("Owner with ID 123 not found");

      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ max_spending_limit_usd: 500 });
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
    });
  });

  describe("when validation fails", () => {
    it("should return error when spending limit is null", async () => {
      mockGetOwner.mockResolvedValue({
        owner_id: 123,
        max_spending_limit_usd: null,
        credit_balance_usd: 500,
        stripe_customer_id: "cus_123",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        auto_reload_enabled: false,
        auto_reload_threshold_usd: 0,
        auto_reload_target_usd: 0,
        created_by: null,
        updated_by: null,
        owner_name: null,
        owner_type: "user",
        stripe_subscription_id: null,
        stripe_subscription_status: null,
      });

      const result = await updateSpendingLimit({
        ownerId: 123,
        maxSpendingLimitUsd: null,
      });

      expect(result).toEqual({
        error:
          "Spending limit cannot be null. Please provide a valid spending limit.",
      });
      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ max_spending_limit_usd: null });
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(mockGetOwner).toHaveBeenCalledWith({ ownerId: 123 });
    });

    it("should return error when spending limit is less than credit balance", async () => {
      mockGetOwner.mockResolvedValue({
        owner_id: 123,
        max_spending_limit_usd: 300,
        credit_balance_usd: 500,
        stripe_customer_id: "cus_123",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        auto_reload_enabled: false,
        auto_reload_threshold_usd: 0,
        auto_reload_target_usd: 0,
        created_by: null,
        updated_by: null,
        owner_name: null,
        owner_type: "user",
        stripe_subscription_id: null,
        stripe_subscription_status: null,
      });

      const result = await updateSpendingLimit({
        ownerId: 123,
        maxSpendingLimitUsd: 300,
      });

      expect(result).toEqual({
        error:
          "Spending limit ($300) cannot be less than current credit balance ($500)",
      });
      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ max_spending_limit_usd: 300 });
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(mockGetOwner).toHaveBeenCalledWith({ ownerId: 123 });
    });
  });

  describe("when update is successful", () => {
    it("should update spending limit successfully", async () => {
      const result = await updateSpendingLimit({
        ownerId: 123,
        maxSpendingLimitUsd: 800,
      });

      expect(result).toEqual({ success: true });
      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ max_spending_limit_usd: 800 });
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(mockGetOwner).toHaveBeenCalledWith({ ownerId: 123 });
    });

    it("should throw error when database update fails", async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: "Database error" },
      });

      await expect(
        updateSpendingLimit({
          ownerId: 123,
          maxSpendingLimitUsd: 800,
        }),
      ).rejects.toThrow("Failed to update spending limit: Database error");

      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ max_spending_limit_usd: 800 });
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
    });

    it("should throw error when no data is returned after update", async () => {
      mockSingle.mockResolvedValue({
        data: [],
        error: null,
      });

      await expect(
        updateSpendingLimit({
          ownerId: 123,
          maxSpendingLimitUsd: 800,
        }),
      ).rejects.toThrow("Owner with ID 123 not found");

      expect(mockSupabaseAdmin.from).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ max_spending_limit_usd: 800 });
      expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
    });
  });
});
