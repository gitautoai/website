// https://www.npmjs.com/package/next-sitemap
const { NEXT_PUBLIC_SITE_URL } = require('@/config');
module.exports = {
  siteUrl: NEXT_PUBLIC_SITE_URL,
  generateRobotsTxt: true,
  // Additional configurations as needed
};
