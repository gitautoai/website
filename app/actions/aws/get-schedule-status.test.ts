import { getScheduleStatus } from "./get-schedule-status";

const mockSend = jest.fn();

jest.mock("@/lib/aws-scheduler", () => ({
  schedulerClient: {
    send: (...args: unknown[]) => mockSend(...args),
  },
}));

jest.mock("@/utils/get-schedule-name", () => ({
  getScheduleName: (ownerId: number, repoId: number) =>
    "gitauto-repo-" + String(ownerId) + "-" + String(repoId),
}));

describe("getScheduleStatus", () => {
  const ownerId = 123;
  const repoId = 456;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns true when the schedule state is ENABLED", async () => {
    mockSend.mockResolvedValue({ State: "ENABLED" });

    const result = await getScheduleStatus(ownerId, repoId);

    expect(result).toBe(true);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("returns false when the schedule state is DISABLED", async () => {
    mockSend.mockResolvedValue({ State: "DISABLED" });

    const result = await getScheduleStatus(ownerId, repoId);

    expect(result).toBe(false);
  });

  it("returns false when the schedule state is undefined", async () => {
    mockSend.mockResolvedValue({});

    const result = await getScheduleStatus(ownerId, repoId);

    expect(result).toBe(false);
  });

  it("returns false when ResourceNotFoundException is thrown", async () => {
    const error = new Error("Schedule not found");
    error.name = "ResourceNotFoundException";
    mockSend.mockRejectedValue(error);

    const result = await getScheduleStatus(ownerId, repoId);

    expect(result).toBe(false);
  });

  it("re-throws non-ResourceNotFoundException errors", async () => {
    const error = new Error("Internal server error");
    error.name = "InternalServerException";
    mockSend.mockRejectedValue(error);

    await expect(getScheduleStatus(ownerId, repoId)).rejects.toThrow(
      "Internal server error"
    );
  });

  it("re-throws non-Error objects", async () => {
    mockSend.mockRejectedValue("some string error");

    await expect(getScheduleStatus(ownerId, repoId)).rejects.toBe(
      "some string error"
    );
  });
});
