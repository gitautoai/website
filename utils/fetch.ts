export const fetchWithTiming = async (url: string, options: RequestInit) => {
  const startTime = performance.now();
  console.log(`Starting request to ${url}...`);

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to fetch ${url}`);
    }

    const data = await response.json();
    const endTime = performance.now();
    console.log(`Request to ${url} completed in ${(endTime - startTime).toFixed(0)}ms`);
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
};
