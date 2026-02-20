// Common SWR configuration options
export const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 300000,
  suspense: false,
  keepPreviousData: false,
} as const;

// Extended options for specific use cases
export const extendedSwrOptions = {
  ...swrOptions,
  revalidateIfStale: false,
  revalidateOnMount: true,
  dedupingInterval: 600000,
} as const;
