const { RestliClient } = require("linkedin-api-client");

const gitautoUrn = "urn:li:organization:100932100";
const wesUrn = "urn:li:member:915150628"; // Go to profile page and console then search for "urn:li:member:"

/**
 * @see https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2024-11&viewFallbackFrom=li-lms-unversioned&tabs=http
 */
async function postLinkedIn({ context, isBlog, postUrl }) {
  const restliClient = new RestliClient();
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

  const message = isBlog ? "📝 New post" : "🚀 New release";
  const url = `${postUrl}?utm_source=linkedin&utm_medium=referral`;
  const title = context.payload.pull_request.title;
  const description = context.payload.pull_request.body || "";

  // Helper function for random delay between 5-15 seconds
  const getRandomDelay = () => Math.floor(Math.random() * 10000 + 5000);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Helper function to create a post
  const createPost = async (authorUrn) => {
    return restliClient.create({
      resourcePath: "/posts",
      entity: {
        author: authorUrn,
        commentary: `${message}: ${title}${description ? `\n\n${description}` : ""}`,
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
            description: description || `Check out our latest release on GitAuto!`,
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
  const gitautoPostUrn = `urn:li:share:${gitautoPost.id}`;
  const wesPost = await createPost(wesUrn);
  const wesPostUrn = `urn:li:share:${wesPost.id}`;

  // Wait and like each other's posts
  await sleep(getRandomDelay());
  await likePost(gitautoUrn, wesPostUrn);
  await likePost(wesUrn, gitautoPostUrn);
}

module.exports = postLinkedIn;
