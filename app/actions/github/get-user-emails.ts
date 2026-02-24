"use server";

import { getOctokitForUser } from "@/app/api/github";

/**
 * Fetch the authenticated user's primary email via the GitHub API.
 * Requires the `user:email` OAuth scope.
 * https://docs.github.com/en/rest/users/emails#list-email-addresses-for-the-authenticated-user
 */
export const getUserPrimaryEmail = async (accessToken: string) => {
  try {
    const octokit = getOctokitForUser(accessToken);
    const { data: emails } = await octokit.users.listEmailsForAuthenticatedUser();
    const primary = emails.find((e) => e.primary && e.verified);
    return primary?.email ?? emails.find((e) => e.verified)?.email ?? null;
  } catch {
    return null;
  }
};
