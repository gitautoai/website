import fs from "fs";
import path from "path";
import AWS from "aws-sdk";

/**
 * @typedef {Object} GitHubContext
 * @property {Object} payload
 * @property {Object} payload.pull_request
 * @property {number} payload.pull_request.number
 * @property {Object} repo
 * @property {string} repo.owner
 * @property {string} repo.repo
 */

/**
 * @typedef {Object} GitHub
 * @property {Object} rest
 * @property {Object} rest.issues
 * @property {Function} rest.issues.listComments
 * @property {Function} rest.issues.deleteComment
 * @property {Function} rest.issues.createComment
 */

/**
 * Compare screenshots between main and branch, posting the results as PR comments
 * @param {Object} params
 * @param {GitHub} params.github - GitHub API client
 * @param {GitHubContext} params.context - GitHub Action context
 */
export async function compareScreenshots({ github, context }) {
  try {
    // Get all comments for the pull request
    const comments = await github.rest.issues.listComments({
      issue_number: context.payload.pull_request.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
    });

    // Delete previous comments created by this workflow
    for (const comment of comments.data) {
      if (comment.body.includes("Before (main) | After (this branch)")) {
        await github.rest.issues.deleteComment({
          owner: context.repo.owner,
          repo: context.repo.repo,
          comment_id: comment.id,
        });
      }
    }

    const mainDir = "main-screenshots/";
    const branchDir = "branch-screenshots/";

    const mainFiles = fs.readdirSync(mainDir).filter((file) => file.endsWith(".png"));
    const branchFiles = fs.readdirSync(branchDir).filter((file) => file.endsWith(".png"));

    // Initialize S3 client
    // https://us-east-1.console.aws.amazon.com/iam/home?region=us-west-1#/users/details/github-actions?section=security_credentials
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    for (let i = 0; i < mainFiles.length; i++) {
      const mainFile = mainFiles[i];
      const branchFile = branchFiles[i];
      const routePath = decodeURIComponent(mainFile.replace(".png", ""));

      // Read the image files directly without using sharp
      const mainImageBuffer = fs.readFileSync(path.join(mainDir, mainFile));
      const branchImageBuffer = fs.readFileSync(path.join(branchDir, branchFile));

      // Upload images to S3 (as PNG)
      // https://us-west-1.console.aws.amazon.com/s3/buckets?region=us-west-1
      const mainImageUpload = await s3
        .upload({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `screenshots/main/${mainFile}`,
          Body: mainImageBuffer,
          ContentType: "image/png",
        })
        .promise();

      const branchImageUpload = await s3
        .upload({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `screenshots/branch/${branchFile}`,
          Body: branchImageBuffer,
          ContentType: "image/png",
        })
        .promise();

      const body = `${routePath}\n\n| Before (main) | After (this branch) |\n|--------------|---------------------|\n| <img src="${mainImageUpload.Location}" width="400"/> | <img src="${branchImageUpload.Location}" width="400"/> |`;

      await github.rest.issues.createComment({
        issue_number: context.payload.pull_request.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: body,
      });
    }
  } catch (error) {
    console.error(error);
  }
}
