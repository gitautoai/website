// https://learn.microsoft.com/en-us/linkedin/shared/authentication/programmatic-refresh-tokens
async function refreshLinkedInToken() {
  const refreshToken = process.env.LINKEDIN_REFRESH_TOKEN;
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!refreshToken || !clientId || !clientSecret) {
    throw new Error(
      "Missing LINKEDIN_REFRESH_TOKEN, LINKEDIN_CLIENT_ID, or LINKEDIN_CLIENT_SECRET",
    );
  }

  const response = await fetch(
    "https://www.linkedin.com/oauth/v2/accessToken",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LinkedIn token refresh failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  console.log("Refreshed LinkedIn access token");
  return data.access_token;
}

module.exports = refreshLinkedInToken;
