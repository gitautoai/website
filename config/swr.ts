// Common SWR configuration options
export const swrOptions = {
  revalidateOnFocus: false,
  dedupingInterval: 300000,
  suspense: false,
  keepPreviousData: true,
};

// Extended options for specific use cases
export const extendedSwrOptions = {
  ...swrOptions,
  revalidateIfStale: false,
  revalidateOnMount: true,
  dedupingInterval: 600000,
};
