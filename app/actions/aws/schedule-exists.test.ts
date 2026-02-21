import { scheduleExists } from "./schedule-exists";
import { schedulerClient } from "@/lib/aws-scheduler";

jest.mock("@/lib/aws-scheduler", () => ({
  schedulerClient: { send: jest.fn() },
}));

jest.mock("@/utils/get-schedule-name", () => ({
  getScheduleName: jest.fn().mockReturnValue("gitauto-repo-123-456"),
}));

const mockSend = schedulerClient.send as jest.Mock;

describe("scheduleExists", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns true when the schedule exists and is ENABLED", async () => {
    mockSend.mockResolvedValueOnce({ State: "ENABLED" });
    const result = await scheduleExists(123, 456);
    expect(result).toBe(true);
  });

  it("returns true when the schedule exists and is DISABLED", async () => {
    mockSend.mockResolvedValueOnce({ State: "DISABLED" });
    const result = await scheduleExists(123, 456);
    expect(result).toBe(true);
  });

  it("returns false when ResourceNotFoundException is thrown", async () => {
    const error = new Error("Schedule not found");
    error.name = "ResourceNotFoundException";
    mockSend.mockRejectedValueOnce(error);
    const result = await scheduleExists(123, 456);
    expect(result).toBe(false);
  });

  it("re-throws non-ResourceNotFoundException errors", async () => {
    const error = new Error("Internal server error");
    error.name = "InternalServerException";
    mockSend.mockRejectedValueOnce(error);
    await expect(scheduleExists(123, 456)).rejects.toThrow("Internal server error");
  });

  it("re-throws when caught value is not an Error instance", async () => {
    mockSend.mockRejectedValueOnce("some string error");
    await expect(scheduleExists(123, 456)).rejects.toBe("some string error");
  });
});
