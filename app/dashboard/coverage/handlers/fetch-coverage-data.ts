import { getCoverage } from "@/app/actions/supabase/coverage/get-coverage";
import { Tables } from "@/types/supabase";

/**
 * Handle fetching coverage data from Supabase
 */
export async function fetchCoverageData(
  currentOwnerId: number | null,
  currentRepoId: number | null,
  setCoverageData: (data: Tables<"coverages">[]) => void,
  setPackageNames: (names: string[]) => void,
  setError: (error: string | null) => void,
  setIsLoading: (loading: boolean) => void,
  options: { silent?: boolean } = {},
): Promise<Tables<"coverages">[]> {
  const { silent = false } = options;

  if (!currentOwnerId || !currentRepoId) {
    if (!silent) setIsLoading(false);
    return [];
  }

  try {
    if (!silent) {
      setError(null);
      setIsLoading(true);
    }

    // First, get existing data from Supabase
    const data = await getCoverage(currentOwnerId, currentRepoId);
    setCoverageData(data);

    // Extract unique package names and levels for filters
    const packagesSet = new Set<string>();
    const levelsSet = new Set<string>();

    data.forEach((item) => {
      if (item.package_name) packagesSet.add(item.package_name);
      if (item.level) levelsSet.add(item.level);
    });
    setPackageNames(Array.from(packagesSet));

    return data;
  } catch (error) {
    if (!silent) setError("Failed to load coverage data");
    console.error("Error loading coverage data:", error);
    return [];
  } finally {
    if (!silent) setIsLoading(false);
  }
}
