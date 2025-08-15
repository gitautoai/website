"use server";

import { Octokit } from "@octokit/rest";

/**
 * Get owner IDs (user + organizations) from GitHub API
 */
export async function getOwnerIds(userId: number, accessToken: string) {
  // Handle test environment with mock data
  if (process.env.NODE_ENV === "test" && accessToken === "test-access-token") {
    console.log(`[TEST MODE] Using mock owner IDs for user ${userId}`);
    return [userId]; // In test mode, just return the user ID
  }

  try {
    // Use GitHub API to get organizations the user belongs to
    const octokit = new Octokit({ auth: accessToken });

    // Get user's organizations
    const { data: orgs } = await octokit.orgs.listForAuthenticatedUser();

    // Combine user's own ID with organization IDs
    const ownerIds = [userId, ...orgs.map((org) => org.id)];
    return ownerIds;
  } catch (error: any) {
    // If GitHub API call fails, log error and continue with just userId
    console.error(`GitHub API error for user ${userId}:`, error.message);
    return [userId]; // Fallback to just user ID
  }
}
