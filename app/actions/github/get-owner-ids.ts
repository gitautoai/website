"use server";

import { Octokit } from "@octokit/rest";

import { isAdmin } from "@/utils/is-admin";

/**
 * Get owner IDs (user + organizations) from GitHub API
 * For admin users, includes additional specific owner IDs
 */
export async function getOwnerIds(userId: number, accessToken: string) {
  // Handle E2E test environment with mock data
  // Note: NODE_ENV check removed because Next.js hardcodes it to "development" at build time
  if (accessToken === "test-access-token") {
    return [userId]; // In test mode, just return the user ID
  }

  // Admin users can view additional specific organizations
  // To get owner ID: curl -s https://api.github.com/users/USERNAME | jq '.id'
  const ADMIN_VISIBLE_OWNERS: Record<number, string> = {
    28540514: "Foxquilt",
    253508792: "DashFin-FarDb",
  };
  const ADDITIONAL_OWNER_IDS = isAdmin(userId) ? Object.keys(ADMIN_VISIBLE_OWNERS).map(Number) : [];

  try {
    // Use GitHub API to get organizations the user belongs to
    const octokit = new Octokit({ auth: accessToken });

    // Get user's organizations
    const { data: orgs } = await octokit.orgs.listForAuthenticatedUser();

    // Combine user's own ID with organization IDs (and additional owner IDs for admin)
    return [userId, ...orgs.map((org) => org.id), ...ADDITIONAL_OWNER_IDS];
  } catch (error) {
    // If GitHub API call fails, log error and continue with just userId
    console.error(`GitHub API error for user ${userId}:`, error instanceof Error ? error.message : "Unknown error");
    return [userId, ...ADDITIONAL_OWNER_IDS]; // Fallback to user ID (+ additional owners for admin)
  }
}
