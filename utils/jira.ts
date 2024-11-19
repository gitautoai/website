export async function getAtlassianResources(accessToken: string): Promise<any[]> {
  try {
    const response = await fetch('https://api.atlassian.com/oauth/token/accessible-resources', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Atlassian cloud ID');
    }

    const resources = await response.json();

    // Assuming the user has access to at least one resource, return the first cloud ID
    if (Array.isArray(resources) && resources.length > 0) {
      // return resources[0].id; // or handle multiple resources as needed
      return resources;
    }

    return [];
  } catch (error) {
    console.error('Error fetching Atlassian cloud ID:', error);
    return [];
  }
}
