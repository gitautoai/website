const { RestliClient } = require("linkedin-api-client");

/**
 * @see https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2024-11&viewFallbackFrom=li-lms-unversioned&tabs=http
 */
async function postLinkedIn({ context, isBlog, postUrl }) {
  const restliClient = new RestliClient();

  const message = isBlog ? "📝 New blog post" : "🚀 New release";
  const url = `${postUrl}?utm_source=linkedin&utm_medium=referral`;

  await restliClient.create({
    resourcePath: "/posts",
    entity: {
      author: "urn:li:organization:100932100",
      commentary: `${message}: ${context.payload.pull_request.title}`,
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
          title: context.payload.pull_request.title,
          description: `Check out our latest release on GitAuto!`,
        },
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    },
    accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
  });
}

module.exports = postLinkedIn;
