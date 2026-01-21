const { TwitterApi } = require("twitter-api-v2");

/**
 * Post tweet with retry logic for 403 errors
 */
async function postTweetWithRetry(client, message, title, url, socialMediaPost) {
  let tweet = socialMediaPost
    ? `${message}: ${title} ${url}\n\n${socialMediaPost}`
    : `${message}: ${title} ${url}`;

  try {
    return await client.v2.tweet(tweet);
  } catch (error) {
    if (error.code === 403 && socialMediaPost) {
      // Fit as much content as possible
      const baseLength = `${message}: ${title} ${url}\n\n`.length;
      const maxLength = 280 - baseLength - 3; // 3 for "..."
      if (maxLength > 10) {
        tweet = `${message}: ${title} ${url}\n\n${socialMediaPost.substring(0, maxLength)}...`;
      } else {
        tweet = `${message}: ${title} ${url}`;
      }
      return await client.v2.tweet(tweet);
    }
    throw error;
  }
}

/**
 * @see https://developer.x.com/en/docs/x-api/tweets/manage-tweets/api-reference/post-tweets
 */
async function postTwitter({ context, isBlog, postUrl }) {
  // GitAuto company account
  const clientGitAuto = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  // Wes personal account
  const clientWes = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY_WES,
    appSecret: process.env.TWITTER_API_SECRET_WES,
    accessToken: process.env.TWITTER_ACCESS_TOKEN_WES,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET_WES,
  });

  const message = isBlog ? "📝 New post" : "🚀 New release";
  const url = `${postUrl}?utm_source=x&utm_medium=referral`;
  const title = context.payload.pull_request.title;
  const prBody = context.payload.pull_request.body || "";
  const socialMediaPost = prBody.match(/## Social Media Post\s*\n([\s\S]*?)(?=\n##|$)/)?.[1]?.trim() || "";

  // Non-paid account, we can only post 280 characters. Paid account can post 250,000 characters.
  const combinedText = socialMediaPost ? `${title} ${url}\n\n${socialMediaPost}` : `${title} ${url}`;
  const tweet = `${message}: ${combinedText}`;

  // Senders have to be in the community
  // https://x.com/hnishio0105/communities
  const communityIds = [
    "1670204079619055616", // AI Agents
    "1493446837214187523", // Build in Public
    "1699807431709041070", // Software Engineering
    "1471580197908586507", // Startup Community
    "1498737511241158657", // Startup founders & friends
  ];

  // Post tweets and get their IDs
  // https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/v2.md#create-a-tweet
  const gitAutoTweet = await postTweetWithRetry(clientGitAuto, message, title, url, socialMediaPost);
  const wesTweet = await postTweetWithRetry(clientWes, message, title, url, socialMediaPost);

  // https://docs.x.com/x-api/posts/creation-of-a-post
  // const communityTweets = await Promise.all(
  //   communityIds.map(async (communityId) => {
  //     const response = await fetch("https://api.x.com/2/tweets", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN_WES}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ text: tweet, community_id: communityId }),
  //     });

  //     if (!response.ok) {
  //       console.error(`Failed to post to community ${communityId}:`, await response.json());
  //       return null;
  //     }

  //     return await response.json();
  //   })
  // );

  // Wait for a random amount of time
  const getRandomDelay = () => Math.floor(Math.random() * 55000 + 5000);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await sleep(getRandomDelay());

  // Like each other's tweets
  // https://github.com/PLhery/node-twitter-api-v2/blob/master/doc/v2.md#like-a-tweet
  const userGitAuto = await clientGitAuto.v2.me();
  await clientGitAuto.v2.like(userGitAuto.data.id, wesTweet.data.id);
  const userWes = await clientWes.v2.me();
  await clientWes.v2.like(userWes.data.id, gitAutoTweet.data.id);
  // await Promise.all(communityTweets.map((tweet) => clientWes.v2.like(tweet.data.id)));
}

module.exports = postTwitter;
