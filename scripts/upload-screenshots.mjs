import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

    // Initialize S3 client (v3 syntax)
    const s3Client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });

    for (let i = 0; i < mainFiles.length; i++) {
      const mainFile = mainFiles[i];
      const branchFile = branchFiles[i];
      const routePath = mainFile.replace(".png", "");
      const mainImageBuffer = fs.readFileSync(path.join(mainDir, mainFile));
      const branchImageBuffer = fs.readFileSync(path.join(branchDir, branchFile));

      // Upload images to S3 using v3 syntax
      await Promise.all(
        [
          ["main", mainFile, mainImageBuffer],
          ["branch", branchFile, branchImageBuffer],
        ].map(([folder, file, buffer]) =>
          s3Client.send(
            new PutObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: `screenshots/${folder}/${file}`,
              Body: buffer,
              ContentType: "image/png",
            })
          )
        )
      );

      // Construct S3 URLs manually since v3 doesn't return Location
      const baseUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
      const mainImageUrl = `${baseUrl}/screenshots/main/${mainFile}`;
      const branchImageUrl = `${baseUrl}/screenshots/branch/${branchFile}`;

      // Log URLs for debugging
      console.log(`Main Image URL: ${mainImageUrl}`);
      console.log(`Branch Image URL: ${branchImageUrl}`);

      const body = `${routePath}\n\n| Before (main) | After (this branch) |\n|--------------|---------------------|\n| <img src="${mainImageUrl}" width="400" referrerpolicy="no-referrer"/> | <img src="${branchImageUrl}" width="400" referrerpolicy="no-referrer"/> |`;

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
