export const fetchWithTiming = async <T>(url: string, options: RequestInit): Promise<T> => {
  const startTime = performance.now();

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch ${url}`);
    }

    const data = await response.json();
    const endTime = performance.now();
    const executionTime = Number((endTime - startTime).toFixed(0));
    if (executionTime > 1000) {
      console.log(`Request to ${url} completed in ${executionTime}ms`);
    }
    return data as T;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};
