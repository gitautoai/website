const { RestliClient } = require("linkedin-api-client");

const gitautoUrn = "urn:li:organization:100932100";
const wesUrn = "urn:li:person:Nu-Ocwc81N"; // curl -X GET "https://api.linkedin.com/v2/me" -H "Authorization: Bearer YOUR_ACCESS_TOKEN" and get the "id" field

/**
 * @see https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2024-11&viewFallbackFrom=li-lms-unversioned&tabs=http
 */
async function postLinkedIn({ isBlog, postUrl, socialMediaPost, title }) {
  const restliClient = new RestliClient();
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;

  const message = isBlog ? "📝 New post" : "🚀 New release";
  const url = isBlog ? `${postUrl}?utm_source=linkedin&utm_medium=referral` : null;

  // Helper function for random delay between 5-15 seconds
  const getRandomDelay = () => Math.floor(Math.random() * 10000 + 5000);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Helper function to create a post
  const createPost = async (authorUrn) => {
    const entity = {
      author: authorUrn,
      commentary: `${message}: ${title}${socialMediaPost ? `\n\n${socialMediaPost}` : ""}`,
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
    // https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/advertising-targeting/version/article-ads-integrations?view=li-lms-2024-11&tabs=http#workflow
    if (url) {
      entity.content = {
        article: {
          source: url,
          title: title,
          description: socialMediaPost || `Check out our latest release on GitAuto!`,
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
