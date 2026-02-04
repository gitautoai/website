import { getAllActionSettings } from "./get-all-action-settings";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

const { supabaseAdmin } = require("@/lib/supabase/server");

describe("getAllActionSettings", () => {
  let mockSelect: jest.Mock;
  let mockEq: jest.Mock;
  let mockOrder: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockOrder = jest.fn();
    mockEq = jest.fn(() => ({
      order: mockOrder,
    }));
    mockSelect = jest.fn(() => ({
      eq: mockEq,
    }));

    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    });
  });

  it("should throw an error when ownerId is missing", async () => {
    await expect(getAllActionSettings(0)).rejects.toThrow(
      "Missing required parameter: ownerId"
    );

    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  it("should throw an error when ownerId is null", async () => {
    await expect(getAllActionSettings(null as any)).rejects.toThrow(
      "Missing required parameter: ownerId"
    );

    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  it("should throw an error when ownerId is undefined", async () => {
    await expect(getAllActionSettings(undefined as any)).rejects.toThrow(
      "Missing required parameter: ownerId"
    );

    expect(supabaseAdmin.from).not.toHaveBeenCalled();
  });

  it("should throw an error when Supabase returns an error", async () => {
    const mockError = new Error("Database error");
    mockOrder.mockResolvedValue({
      data: null,
      error: mockError,
    });

    await expect(getAllActionSettings(123)).rejects.toThrow("Database error");

    expect(supabaseAdmin.from).toHaveBeenCalledWith("repository_features");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
    expect(mockOrder).toHaveBeenCalledWith("repo_name");
  });

  it("should return an empty array when data is null", async () => {
    mockOrder.mockResolvedValue({
      data: null,
      error: null,
    });

    const result = await getAllActionSettings(123);

    expect(result).toEqual([]);
    expect(supabaseAdmin.from).toHaveBeenCalledWith("repository_features");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
    expect(mockOrder).toHaveBeenCalledWith("repo_name");
  });

  it("should return settings when data is available", async () => {
    const mockSettings = [
      { id: 1, owner_id: 123, repo_name: "repo-a", feature: "auto-merge" },
      { id: 2, owner_id: 123, repo_name: "repo-b", feature: "auto-review" },
    ];

    mockOrder.mockResolvedValue({
      data: mockSettings,
      error: null,
    });

    const result = await getAllActionSettings(123);

    expect(result).toEqual(mockSettings);
    expect(supabaseAdmin.from).toHaveBeenCalledWith("repository_features");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
    expect(mockOrder).toHaveBeenCalledWith("repo_name");
  });
});
