export interface JiraSite {
  id: string; // 798fbbf4-f086-4ae1-a265-acfa9e9c6da6
  url: string; // https://gitauto.atlassian.net
  name: string; // gitauto
  scopes: string[]; // ["read:jira-work"]
  avatarUrl: string; // https://site-admin-avatar-cdn.prod.public.atl-paas.net/avatars/240/site.png
}

export interface JiraProject {
  id: string; // 10002
  key: string; // GITAUTO
  name: string; // GitAuto
  isPrivate: boolean; // false
}

export interface JiraSiteWithProjects extends JiraSite {
  projects: JiraProject[];
}

const JIRA_API_URL = "https://api.atlassian.com";
const createHeaders = (accessToken: string) => ({
  Authorization: `Bearer ${accessToken}`,
  Accept: "application/json",
});

/**
 * Get Jira sites for the authenticated user
 * @see https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/#3-1-get-the-cloudid-for-your-site
 */
export const getSites = async (accessToken: string) => {
  try {
    const url = `${JIRA_API_URL}/oauth/token/accessible-resources`;
    const response = await fetch(url, { headers: createHeaders(accessToken) });
    if (!response.ok) throw new Error(`Failed to fetch sites: ${response.statusText}`);
    const sites: JiraSite[] = await response.json();
    // console.log("sites: ", sites);
    return sites;
  } catch (error) {
    console.error("Error getting Jira sites:", error);
    throw error;
  }
};

/**
 * Get projects for a specific site that the user has access to
 * @see https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-projects/#api-rest-api-3-project-search-get
 */
export const getProjects = async (accessToken: string, siteId: string): Promise<JiraProject[]> => {
  try {
    const projects: JiraProject[] = [];
    let startAt = 0;
    const maxResults = 50;

    while (true) {
      const query = new URLSearchParams({
        status: "live",
        startAt: startAt.toString(),
        maxResults: maxResults.toString(),
      });

      const url = `${JIRA_API_URL}/ex/jira/${siteId}/rest/api/3/project/search?${query}`;
      const response = await fetch(url, { headers: createHeaders(accessToken) });
      if (!response.ok) throw new Error(`Failed to fetch projects: ${response.statusText}`);

      const data = await response.json();
      projects.push(...data.values);
      if (data.isLast || data.values.length < maxResults) break;
      startAt += maxResults;
    }

    // console.log("projects: ", projects);
    return projects;
  } catch (error) {
    console.error(`Error getting Jira projects for site ${siteId}:`, error);
    throw error;
  }
};

export const getUserJiraAccess = async (accessToken: string) => {
  const sites = await getSites(accessToken);
  const settledResults = await Promise.allSettled(
    sites.map(async (site) => ({
      ...site,
      projects: await getProjects(accessToken, site.id),
    }))
  );

  // Filter out rejected promises and collect successful results
  const sitesWithProjects: JiraSiteWithProjects[] = settledResults
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  // console.log("sitesWithProjects: ", sitesWithProjects);
  return sitesWithProjects;
};
