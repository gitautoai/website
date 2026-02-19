/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { getScheduleStatus } from "./get-schedule-status";
import { schedulerClient } from "@/lib/aws-scheduler";

jest.mock("@/lib/aws-scheduler", () => ({
  schedulerClient: { send: jest.fn() },
}));

jest.mock("@/utils/get-schedule-name", () => ({
  getScheduleName: jest.fn().mockReturnValue("gitauto-repo-123-456"),
}));

const mockSend = schedulerClient.send as jest.Mock;

describe("getScheduleStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns true when the schedule state is ENABLED", async () => {
    mockSend.mockResolvedValueOnce({ State: "ENABLED" });
    const result = await getScheduleStatus(123, 456);
    expect(result).toBe(true);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("returns false when the schedule state is DISABLED", async () => {
    mockSend.mockResolvedValueOnce({ State: "DISABLED" });
    const result = await getScheduleStatus(123, 456);
    expect(result).toBe(false);
  });

  it("returns false when the schedule state is undefined", async () => {
    mockSend.mockResolvedValueOnce({});
    const result = await getScheduleStatus(123, 456);
    expect(result).toBe(false);
  });

  it("returns false when ResourceNotFoundException is thrown", async () => {
    const error = new Error("Schedule not found");
    error.name = "ResourceNotFoundException";
    mockSend.mockRejectedValueOnce(error);
    const result = await getScheduleStatus(123, 456);
    expect(result).toBe(false);
  });

  it("re-throws non-ResourceNotFoundException errors", async () => {
    const error = new Error("Internal server error");
    error.name = "InternalServerException";
    mockSend.mockRejectedValueOnce(error);
    await expect(getScheduleStatus(123, 456)).rejects.toThrow("Internal server error");
  });

  it("re-throws when caught value is not an Error instance", async () => {
    mockSend.mockRejectedValueOnce("some string error");
    await expect(getScheduleStatus(123, 456)).rejects.toBe("some string error");
  });
});
