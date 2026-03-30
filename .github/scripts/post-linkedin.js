const { RestliClient } = require("linkedin-api-client");
const notifySlack = require("./notify-slack.js");
const randomDelay = require("./random-delay.js");

const gitautoUrn = "urn:li:organization:100932100";
const wesUrn = "urn:li:person:Nu-Ocwc81N"; // curl -X GET "https://api.linkedin.com/v2/me" -H "Authorization: Bearer YOUR_ACCESS_TOKEN" and get the "id" field

// https://learn.microsoft.com/en-us/linkedin/shared/authentication/programmatic-refresh-tokens
async function refreshAccessToken() {
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

/**
 * @see https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2024-11&viewFallbackFrom=li-lms-unversioned&tabs=http
 */
async function postLinkedIn({ isBlog, blogPosts, gitautoPost, wesPost, title }) {
  const restliClient = new RestliClient();
  let accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  let tokenRefreshed = false;

  // Helper function to create a post, with automatic token refresh on 401
  // https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/advertising-targeting/version/article-ads-integrations?view=li-lms-2024-11&tabs=http#workflow
  const createPost = async (authorUrn, text, url, postTitle) => {
    const entity = {
      author: authorUrn,
      commentary: text,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    };

    // Include article preview for blog posts
    if (url) {
      entity.content = {
        article: {
          source: url,
          title: postTitle,
          description: text || `Check out our latest release on GitAuto!`,
        },
      };
    }

    try {
      return await restliClient.create({
        resourcePath: "/posts",
        entity,
        accessToken,
      });
    } catch (error) {
      // Refresh token once on 401 and retry
      if (error.status === 401 && !tokenRefreshed) {
        console.log("Access token expired, refreshing...");
        accessToken = await refreshAccessToken();
        tokenRefreshed = true;
        return restliClient.create({
          resourcePath: "/posts",
          entity,
          accessToken,
        });
      }
      throw error;
    }
  };

  // Helper function to like a post
  // https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/reactions-api?view=li-lms-2024-11&tabs=http
  const likePost = async (actorUrn, postUrn) => {
    await restliClient.create({
      resourcePath: "/reactions",
      entity: { root: postUrn, reactionType: "LIKE" },
      queryParams: { actor: actorUrn },
      accessToken,
    });
  };

  // For blog posts, post each one separately with title + URL
  if (isBlog && blogPosts.length > 0) {
    for (const post of blogPosts) {
      const url = `${post.url}?utm_source=linkedin&utm_medium=referral`;

      const gitautoResult = await createPost(gitautoUrn, post.title, url, post.title);
      const gitautoPostUrn = gitautoResult.headers["x-restli-id"];
      const wesResult = await createPost(wesUrn, post.title, url, post.title);
      const wesPostUrn = wesResult.headers["x-restli-id"];

      if (gitautoPostUrn && wesPostUrn) {
        await randomDelay();
        await likePost(gitautoUrn, wesPostUrn);
        await likePost(wesUrn, gitautoPostUrn);
      }

      const links = [
        gitautoPostUrn
          ? `https://www.linkedin.com/feed/update/urn:li:activity:${gitautoPostUrn}`
          : null,
        wesPostUrn ? `https://www.linkedin.com/feed/update/urn:li:activity:${wesPostUrn}` : null,
      ]
        .filter(Boolean)
        .join(" and ");
      await notifySlack(`Posted to LinkedIn! ${links}`);
      await randomDelay();
    }
    return;
  }

  // Non-blog: single post
  const gitautoText = gitautoPost || title;
  const wesText = wesPost || title;

  if (!gitautoText && !wesText) {
    console.log("No social media post content, skipping LinkedIn post");
    return;
  }

  // Post from both accounts with different content
  const gitautoResult = await createPost(gitautoUrn, gitautoText, null, title);
  const gitautoPostUrn = gitautoResult.headers["x-restli-id"];
  const wesResult = await createPost(wesUrn, wesText, null, title);
  const wesPostUrn = wesResult.headers["x-restli-id"];

  // Wait and like each other's posts
  if (gitautoPostUrn && wesPostUrn) {
    await randomDelay();
    await likePost(gitautoUrn, wesPostUrn);
    await likePost(wesUrn, gitautoPostUrn);
  }

  const links = [
    gitautoPostUrn
      ? `https://www.linkedin.com/feed/update/urn:li:activity:${gitautoPostUrn}`
      : null,
    wesPostUrn ? `https://www.linkedin.com/feed/update/urn:li:activity:${wesPostUrn}` : null,
  ]
    .filter(Boolean)
    .join(" and ");
  await notifySlack(`Posted to LinkedIn! ${links}`);
}

module.exports = postLinkedIn;
