const { RestliClient } = require("linkedin-api-client");

const gitautoUrn = "urn:li:organization:100932100";
const wesUrn = "urn:li:person:Nu-Ocwc81N"; // curl -X GET "https://api.linkedin.com/v2/me" -H "Authorization: Bearer YOUR_ACCESS_TOKEN" and get the "id" field

/**
 * @see https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2024-11&viewFallbackFrom=li-lms-unversioned&tabs=http
 */
async function postLinkedIn({ isBlog, postUrl, gitautoPost, wesPost, title }) {
  const restliClient = new RestliClient();
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

  const url = isBlog ? `${postUrl}?utm_source=linkedin&utm_medium=referral` : null;

  // Helper function for random delay between 5-15 seconds
  const getRandomDelay = () => Math.floor(Math.random() * 10000 + 5000);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Helper function to create a post
  // https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/advertising-targeting/version/article-ads-integrations?view=li-lms-2024-11&tabs=http#workflow
  const createPost = async (authorUrn, text) => {
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

    // Include article preview only for blog posts
    if (url) {
      entity.content = {
        article: {
          source: url,
          title: title,
          description: text || `Check out our latest release on GitAuto!`,
        },
      };
    }

    return restliClient.create({
      resourcePath: "/posts",
      entity,
      accessToken,
    });
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

  const gitautoText = gitautoPost || title;
  const wesText = wesPost || title;

  if (!gitautoText && !wesText) {
    console.log("No social media post content, skipping LinkedIn post");
    return;
  }

  // Post from both accounts with different content
  const gitautoResult = await createPost(gitautoUrn, gitautoText);
  const gitautoPostUrn = gitautoResult.headers["x-restli-id"];
  const wesResult = await createPost(wesUrn, wesText);
  const wesPostUrn = wesResult.headers["x-restli-id"];

  // Wait and like each other's posts
  if (gitautoPostUrn && wesPostUrn) {
    await sleep(getRandomDelay());
    await likePost(gitautoUrn, wesPostUrn);
    await likePost(wesUrn, gitautoPostUrn);
  }

  // Send the post links to Slack webhook
  if (process.env.SLACK_WEBHOOK_URL) {
    const links = [
      gitautoPostUrn ? `https://www.linkedin.com/feed/update/urn:li:activity:${gitautoPostUrn}` : null,
      wesPostUrn ? `https://www.linkedin.com/feed/update/urn:li:activity:${wesPostUrn}` : null,
    ].filter(Boolean).join(" and ");
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ msg: `Posted to LinkedIn! ${links}` }),
    });
  } else {
    console.log("SLACK_WEBHOOK_URL not set, skipping Slack notification");
  }
}

module.exports = postLinkedIn;
