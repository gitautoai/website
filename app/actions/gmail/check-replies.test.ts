import { checkReplies } from "./check-replies";

// Mock refreshAccessToken
jest.mock("./refresh-access-token", () => ({
  refreshAccessToken: jest.fn(),
}));

import { refreshAccessToken } from "./refresh-access-token";

const mockRefresh = refreshAccessToken as jest.MockedFunction<typeof refreshAccessToken>;

beforeEach(() => {
  jest.resetAllMocks();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

it("returns empty map when no emails provided", async () => {
  const result = await checkReplies([]);
  expect(result.size).toBe(0);
  expect(mockRefresh).not.toHaveBeenCalled();
});

it("returns empty map when access token is unavailable", async () => {
  mockRefresh.mockResolvedValue(null);
  const result = await checkReplies(["alice@example.com"]);
  expect(result.size).toBe(0);
});

it("returns emails with their reply timestamps", async () => {
  mockRefresh.mockResolvedValue("test-token");
  const replyTimestamp = "1709000000000"; // epoch ms
  (global.fetch as jest.Mock)
    // First email: list returns a message
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ messages: [{ id: "msg1" }], resultSizeEstimate: 1 }),
    })
    // First email: message fetch returns internalDate
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ internalDate: replyTimestamp }),
    })
    // Second email: list returns no messages
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ resultSizeEstimate: 0 }),
    });

  const result = await checkReplies(["replied@example.com", "silent@example.com"]);
  expect(result.size).toBe(1);
  expect(result.has("replied@example.com")).toBe(true);
  expect(result.get("replied@example.com")).toBe(new Date(Number(replyTimestamp)).toISOString());
  expect(global.fetch).toHaveBeenCalledTimes(3);
});

it("skips emails that fail the list API call", async () => {
  mockRefresh.mockResolvedValue("test-token");
  (global.fetch as jest.Mock)
    .mockResolvedValueOnce({ ok: false, status: 500 })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ messages: [{ id: "msg2" }], resultSizeEstimate: 1 }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ internalDate: "1709000000000" }),
    });

  const result = await checkReplies(["fail@example.com", "ok@example.com"]);
  expect(result.size).toBe(1);
  expect(result.has("ok@example.com")).toBe(true);
});

it("skips emails when message fetch fails", async () => {
  mockRefresh.mockResolvedValue("test-token");
  (global.fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ messages: [{ id: "msg1" }], resultSizeEstimate: 1 }),
    })
    .mockResolvedValueOnce({ ok: false, status: 500 });

  const result = await checkReplies(["fail@example.com"]);
  expect(result.size).toBe(0);
});
