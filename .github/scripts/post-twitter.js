const notifySlack = require("./notify-slack.js");
const randomDelay = require("./random-delay.js");
const { TwitterApi } = require("twitter-api-v2");

/**
 * Post tweet with retry logic for 403 errors
 */
async function postTweetWithRetry(client, text) {
  try {
    return await client.v2.tweet(text);
  } catch (error) {
    if (text.length > 280) {
      const truncated = text.substring(0, 277) + "...";
      return await client.v2.tweet(truncated);
    }
    throw error;
  }
}

/**
 * @see https://developer.x.com/en/docs/x-api/tweets/manage-tweets/api-reference/post-tweets
 */
async function postTwitter({ isBlog, blogPosts, gitautoPost, wesPost, title }) {
  // GitAuto company account
  const clientGitAuto = new TwitterApi({
    appKey: process.env.X_OAUTH1_CONSUMER_KEY_GITAUTO,
    appSecret: process.env.X_OAUTH1_CONSUMER_KEY_SECRET_GITAUTO,
    accessToken: process.env.X_OAUTH1_ACCESS_TOKEN_GITAUTO,
    accessSecret: process.env.X_OAUTH1_ACCESS_TOKEN_SECRET_GITAUTO,
  });

  // Wes personal account
  const clientWes = new TwitterApi({
    appKey: process.env.X_OAUTH1_CONSUMER_KEY_WES,
    appSecret: process.env.X_OAUTH1_CONSUMER_KEY_SECRET_WES,
    accessToken: process.env.X_OAUTH1_ACCESS_TOKEN_WES,
    accessSecret: process.env.X_OAUTH1_ACCESS_TOKEN_SECRET_WES,
  });

  // Build tweet text with optional URL
  const buildTweet = (text, url) => {
    let tweet = text;
    if (url) tweet += `\n\n${url}`;
    return tweet;
  };

  // For blog posts, post each one separately with title + URL
  if (isBlog && blogPosts.length > 0) {
    for (const post of blogPosts) {
      const url = `${post.url}?utm_source=x&utm_medium=referral`;
      const gitautoTweet = buildTweet(post.title, url);
      const wesTweet = buildTweet(post.title, url);

      const gitAutoTweetResult = await postTweetWithRetry(clientGitAuto, gitautoTweet);
      const wesTweetResult = await postTweetWithRetry(clientWes, wesTweet);

      await randomDelay();

      if (gitAutoTweetResult && wesTweetResult) {
        try {
          const userGitAuto = await clientGitAuto.v2.me();
          await clientGitAuto.v2.like(userGitAuto.data.id, wesTweetResult.data.id);
          const userWes = await clientWes.v2.me();
          await clientWes.v2.like(userWes.data.id, gitAutoTweetResult.data.id);
        } catch (error) {
          console.log("Failed to like tweets (free tier):", error.message);
        }
      }

      const links = [
        gitAutoTweetResult ? `https://x.com/gitautoai/status/${gitAutoTweetResult.data.id}` : null,
        wesTweetResult ? `https://x.com/hiroshinishio/status/${wesTweetResult.data.id}` : null,
      ]
        .filter(Boolean)
        .join(" and ");
      await notifySlack(`Posted to X! ${links}`);
      await randomDelay();
    }
    return;
  }

  // Non-blog: single post with custom social media text
  const gitautoTweet = gitautoPost || title;
  const wesTweet = wesPost || title;

  if (!gitautoTweet && !wesTweet) {
    console.log("No social media post content, skipping Twitter post");
    return;
  }

  // Post tweets
  // https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/v2.md#create-a-tweet
  const gitAutoTweetResult = await postTweetWithRetry(clientGitAuto, gitautoTweet);
  const wesTweetResult = await postTweetWithRetry(clientWes, wesTweet);

  await randomDelay();

  // Like each other's tweets (requires paid X API access)
  // https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/v2.md#like-a-tweet
  if (gitAutoTweetResult && wesTweetResult) {
    try {
      const userGitAuto = await clientGitAuto.v2.me();
      await clientGitAuto.v2.like(userGitAuto.data.id, wesTweetResult.data.id);
      const userWes = await clientWes.v2.me();
      await clientWes.v2.like(userWes.data.id, gitAutoTweetResult.data.id);
    } catch (error) {
      console.log("Failed to like tweets (free tier):", error.message);
    }
  }

  const links = [
    gitAutoTweetResult ? `https://x.com/gitautoai/status/${gitAutoTweetResult.data.id}` : null,
    wesTweetResult ? `https://x.com/hiroshinishio/status/${wesTweetResult.data.id}` : null,
  ]
    .filter(Boolean)
    .join(" and ");
  await notifySlack(`Posted to X! ${links}`);
}

module.exports = postTwitter;
