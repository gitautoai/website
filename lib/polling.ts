/**
 * Poll a function until it returns truthy or timeout is reached.
 * @param fn - Async function to poll. Should return truthy when done.
 * @param options - Polling options
 * @returns true if fn returned truthy, false if timed out or aborted
 */
export const pollUntil = async <T>(
  fn: () => Promise<T>,
  options: {
    intervalMs?: number;
    timeoutMs?: number;
    signal?: AbortSignal;
  } = {},
): Promise<boolean> => {
  const { intervalMs = 10_000, timeoutMs = 180_000, signal } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    if (signal?.aborted) return false;
    const result = await fn();
    if (result) return true;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  return false;
};
