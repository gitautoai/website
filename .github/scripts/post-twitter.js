const { TwitterApi } = require("twitter-api-v2");

/**
 * @see https://developer.x.com/en/docs/x-api/tweets/manage-tweets/api-reference/post-tweets
 */
async function postTwitter({ context, isBlog, postUrl }) {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  const message = isBlog ? "📝 New blog post" : "🚀 New release";
  const url = `${postUrl}?utm_source=x&utm_medium=referral`;
  const tweet = `${message}: ${context.payload.pull_request.title}\n\n${url}`;
  await client.v2.tweet(tweet);
}

module.exports = postTwitter;
