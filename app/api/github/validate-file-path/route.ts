import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

// Cache Octokit instances
const octokitCache = new Map();

export async function POST(request: Request) {
  const startTime = performance.now();

  try {
    const { owner, repo, path } = await request.json();

    if (!owner || !repo || !path) {
      return NextResponse.json({ error: "Owner, repo, and path are required" }, { status: 400 });
    }

    const appId = process.env.GITHUB_APP_ID;
    const privateKey = process.env.GITHUB_PRIVATE_KEY;

    if (!appId || !privateKey) {
      console.error("GitHub app credentials are not set");
      return NextResponse.json({ error: "GitHub app credentials are not set" }, { status: 500 });
    }

    // Get installation ID for the owner
    const appOctokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId,
        privateKey,
        type: "app",
      },
    });

    // Find the installation ID for this owner
    const { data: installations } = await appOctokit.apps.listInstallations();
    const installation = installations.find(
      (inst) => inst.account?.login?.toLowerCase() === owner.toLowerCase(),
    );

    if (!installation) {
      return NextResponse.json({ error: "Installation not found for owner" }, { status: 404 });
    }

    const installationId = installation.id;

    // Get an authenticated Octokit instance for this installation
    const cacheKey = `octokit-${installationId}`;
    let octokit = octokitCache.get(cacheKey);

    if (!octokit) {
      octokit = new Octokit({
        authStrategy: createAppAuth,
        auth: { appId, privateKey, installationId },
      });
      octokitCache.set(cacheKey, octokit);
    }

    try {
      // Try to get the file content to check if it exists
      await octokit.repos.getContent({
        owner,
        repo,
        path,
      });

      // If we get here, the file exists
      return NextResponse.json({ exists: true });
    } catch (error) {
      // Check if the error is because the file doesn't exist
      if (error && typeof error === "object" && "status" in error && error.status === 404) {
        return NextResponse.json({ exists: false }, { status: 404 });
      }

      // Some other error occurred
      console.error(`Error checking file existence:`, error);
      return NextResponse.json({ error: "Failed to check file existence" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error validating file path:", error);
    return NextResponse.json({ error: "Failed to validate file path" }, { status: 500 });
  } finally {
    const endTime = performance.now();
    console.log(`validate-file-path execution time: ${endTime - startTime}ms`);
  }
}
