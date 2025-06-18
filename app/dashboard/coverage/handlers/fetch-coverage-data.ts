import { getCoverage } from "@/app/actions/supabase/get-coverage";
import { CoverageData } from "@/app/dashboard/coverage/types";

/**
 * Handle fetching coverage data from Supabase
 */
export async function fetchCoverageData(
  currentOwnerId: number | null,
  currentRepoId: number | null,
  setCoverageData: (data: CoverageData[]) => void,
  setPackageNames: (names: string[]) => void,
  setError: (error: string | null) => void,
  setIsLoading: (loading: boolean) => void
): Promise<CoverageData[]> {
  if (!currentOwnerId || !currentRepoId) {
    setIsLoading(false);
    return [];
  }

  try {
    setError(null);
    setIsLoading(true);

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
    setError("Failed to load coverage data");
    console.error("Error loading coverage data:", error);
    return [];
  } finally {
    setIsLoading(false);
  }
}
