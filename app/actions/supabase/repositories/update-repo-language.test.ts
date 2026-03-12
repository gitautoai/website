import { updateRepoLanguage } from "./update-repo-language";

jest.mock("@/lib/supabase/server", () => ({
  supabaseAdmin: {
    from: jest.fn(),
  },
}));

describe("updateRepoLanguage", () => {
  let mockFrom: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockEq1: jest.Mock;
  let mockEq2: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    const { supabaseAdmin } = jest.requireMock("@/lib/supabase/server");

    mockEq2 = jest.fn().mockResolvedValue({ error: null });
    mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
    mockUpdate = jest.fn().mockReturnValue({ eq: mockEq1 });
    mockFrom = jest.fn().mockReturnValue({ update: mockUpdate });

    supabaseAdmin.from = mockFrom;
  });

  it("should update language for the given repo", async () => {
    await updateRepoLanguage(123, 456, "ja");

    expect(mockFrom).toHaveBeenCalledWith("repositories");
    expect(mockUpdate).toHaveBeenCalledWith({ preferred_language: "ja" });
    expect(mockEq1).toHaveBeenCalledWith("owner_id", 123);
    expect(mockEq2).toHaveBeenCalledWith("repo_id", 456);
  });

  it("should throw when database returns error", async () => {
    mockEq2.mockResolvedValue({ error: { message: "Database error" } });

    await expect(updateRepoLanguage(123, 456, "fr")).rejects.toEqual({
      message: "Database error",
    });

    expect(mockFrom).toHaveBeenCalledWith("repositories");
    expect(mockUpdate).toHaveBeenCalledWith({ preferred_language: "fr" });
  });

  it("should handle different language codes", async () => {
    const languages = ["en", "ja", "zh", "zh-TW", "ko", "fr", "de", "es"];

    for (const lang of languages) {
      jest.clearAllMocks();

      const { supabaseAdmin } = jest.requireMock("@/lib/supabase/server");
      mockEq2 = jest.fn().mockResolvedValue({ error: null });
      mockEq1 = jest.fn().mockReturnValue({ eq: mockEq2 });
      mockUpdate = jest.fn().mockReturnValue({ eq: mockEq1 });
      mockFrom = jest.fn().mockReturnValue({ update: mockUpdate });
      supabaseAdmin.from = mockFrom;

      await updateRepoLanguage(123, 456, lang);
      expect(mockUpdate).toHaveBeenCalledWith({ preferred_language: lang });
    }
  });
});
