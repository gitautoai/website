import { updateSpendingLimit } from "./update-spending-limit";
import { getOwner } from "./get-owner";
import { validateSpendingLimit } from "./validate-spending-limit";
import { createClient } from "@/lib/supabase/server";

jest.mock("./get-owner");
jest.mock("./validate-spending-limit");
jest.mock("@/lib/supabase/server");

const mockGetOwner = getOwner as jest.MockedFunction<typeof getOwner>;
const mockValidateSpendingLimit = validateSpendingLimit as jest.MockedFunction<
  typeof validateSpendingLimit
>;
const mockCreateClient = createClient as jest.MockedFunction<
  typeof createClient
>;

describe("updateSpendingLimit", () => {
  const mockSupabaseClient = {
    from: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateClient.mockResolvedValue(mockSupabaseClient as any);
  });

  describe("when owner does not exist", () => {
    it("should return error when owner is not found", async () => {
      mockGetOwner.mockResolvedValue({
        success: false,
        error: "Owner not found",
      });

      const result = await updateSpendingLimit({
        owner: "nonexistent-owner",
        spendingLimit: 100,
      });

      expect(result).toEqual({
        success: false,
        error: "Owner not found",
      });
      expect(mockGetOwner).toHaveBeenCalledWith({ owner: "nonexistent-owner" });
      expect(mockValidateSpendingLimit).not.toHaveBeenCalled();
      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });
  });

  describe("when validation fails", () => {
    it("should return error when spending limit validation fails", async () => {
      mockGetOwner.mockResolvedValue({
        success: true,
        data: {
          owner: "test-owner",
          credit_balance: 500,
          spending_limit: 200,
        },
      });

      mockValidateSpendingLimit.mockResolvedValue({
        success: false,
        error: "Invalid spending limit",
      });

      const result = await updateSpendingLimit({
        owner: "test-owner",
        spendingLimit: -50,
      });

      expect(result).toEqual({
        success: false,
        error: "Invalid spending limit",
      });
      expect(mockGetOwner).toHaveBeenCalledWith({ owner: "test-owner" });
      expect(mockValidateSpendingLimit).toHaveBeenCalledWith({
        owner: "test-owner",
        spendingLimit: -50,
      });
      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });
  });

  describe("when update is successful", () => {
    it("should update spending limit successfully", async () => {
      const mockOwnerData = {
        owner: "test-owner",
        credit_balance: 500,
        spending_limit: 200,
      };

      mockGetOwner.mockResolvedValue({
        success: true,
        data: mockOwnerData,
      });

      mockValidateSpendingLimit.mockResolvedValue({
        success: true,
      });

      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: { ...mockOwnerData, spending_limit: 300 },
          error: null,
        }),
      });

      mockSupabaseClient.from.mockReturnValue({
        update: mockUpdate,
      } as any);

      const result = await updateSpendingLimit({
        owner: "test-owner",
        spendingLimit: 300,
      });

      expect(result).toEqual({ success: true });
      expect(mockGetOwner).toHaveBeenCalledWith({ owner: "test-owner" });
      expect(mockValidateSpendingLimit).toHaveBeenCalledWith({
        owner: "test-owner",
        spendingLimit: 300,
      });
      expect(mockSupabaseClient.from).toHaveBeenCalledWith("owners");
      expect(mockUpdate).toHaveBeenCalledWith({ spending_limit: 300 });
    });

    it("should handle database update errors", async () => {
      mockGetOwner.mockResolvedValue({
        success: true,
        data: {
          owner: "test-owner",
          credit_balance: 500,
          spending_limit: 200,
        },
      });

      mockValidateSpendingLimit.mockResolvedValue({
        success: true,
      });

      const result = await updateSpendingLimit({
        owner: "test-owner",
        spendingLimit: 300,
      });

      expect(result).toEqual({ success: true });
    });
  });
});
