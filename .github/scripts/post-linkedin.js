const { RestliClient } = require("linkedin-api-client");

const gitautoUrn = "urn:li:organization:100932100";
const wesUrn = "urn:li:person:Nu-Ocwc81N"; // curl -X GET "https://api.linkedin.com/v2/me" -H "Authorization: Bearer YOUR_ACCESS_TOKEN" and get the "id" field

/**
 * @see https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2024-11&viewFallbackFrom=li-lms-unversioned&tabs=http
 */
async function postLinkedIn({ context, isBlog, postUrl }) {
  const restliClient = new RestliClient();
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

  const message = isBlog ? "📝 New post" : "🚀 New release";
  const url = `${postUrl}?utm_source=linkedin&utm_medium=referral`;
  const title = context.payload.pull_request.title;
  const prBody = context.payload.pull_request.body || "";
  const socialMediaPost = prBody.match(/## Social Media Post\s*\n([\s\S]*?)(?=\n##|$)/)?.[1]?.trim() || "";

  // Helper function for random delay between 5-15 seconds
  const getRandomDelay = () => Math.floor(Math.random() * 10000 + 5000);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Helper function to create a post
  const createPost = async (authorUrn) => {
    return restliClient.create({
      resourcePath: "/posts",
      entity: {
        author: authorUrn,
        commentary: `${message}: ${title}${socialMediaPost ? `\n\n${socialMediaPost}` : ""}`,
        visibility: "PUBLIC",
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },

        // https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/advertising-targeting/version/article-ads-integrations?view=li-lms-2024-11&tabs=http#workflow
        content: {
          article: {
            source: url,
            title: title,
            description: socialMediaPost || `Check out our latest release on GitAuto!`,
          },
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      },
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

  // Post from both accounts
  const gitautoPost = await createPost(gitautoUrn);
  const gitautoPostUrn = gitautoPost.headers["x-restli-id"];
  const wesPost = await createPost(wesUrn);
  const wesPostUrn = wesPost.headers["x-restli-id"];

  // Wait and like each other's posts
  await sleep(getRandomDelay());
  await likePost(gitautoUrn, wesPostUrn);
  await likePost(wesUrn, gitautoPostUrn);
}

module.exports = postLinkedIn;
