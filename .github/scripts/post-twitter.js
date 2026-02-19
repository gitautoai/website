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
async function postTwitter({ isBlog, postUrl, gitautoPost, wesPost, title }) {
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

  const url = isBlog ? `${postUrl}?utm_source=x&utm_medium=referral` : null;

  // Build tweet text for each account
  const buildTweet = (post) => {
    let tweet = post || title;
    if (url) tweet += `\n\n${url}`;
    return tweet;
  };

  const gitautoTweet = gitautoPost ? buildTweet(gitautoPost) : buildTweet(title);
  const wesTweet = wesPost ? buildTweet(wesPost) : buildTweet(title);

  if (!gitautoTweet && !wesTweet) {
    console.log("No social media post content, skipping Twitter post");
    return;
  }

  // Post tweets
  // https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/v2.md#create-a-tweet
  const gitAutoTweetResult = await postTweetWithRetry(clientGitAuto, gitautoTweet);
  const wesTweetResult = await postTweetWithRetry(clientWes, wesTweet);

  // Wait for a random amount of time
  const getRandomDelay = () => Math.floor(Math.random() * 55000 + 5000);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await sleep(getRandomDelay());

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

  // Send to Slack webhook
  const links = [
    gitAutoTweetResult ? `https://x.com/gitautoai/status/${gitAutoTweetResult.data.id}` : null,
    wesTweetResult ? `https://x.com/hiroshinishio/status/${wesTweetResult.data.id}` : null,
  ].filter(Boolean).join(" and ");
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ msg: `Posted to X! ${links}` }),
  });
}

module.exports = postTwitter;
