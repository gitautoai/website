import { test as setup } from "@playwright/test";
import fs from "fs/promises";
import path from "path";

/**
 * Creates mock auth state files for E2E tests
 * Simulates NextAuth.js session cookies for authenticated users
 *
 * This file is automatically executed by Playwright's setup project (testMatch: /.*\.setup\.ts/)
 * and runs before all E2E tests to create the .auth/*.json files that tests reference via storageState
 */

const authDir = path.join(process.cwd(), "e2e", ".auth");

// Ensure auth directory exists
setup.beforeAll(async () => {
  await fs.mkdir(authDir, { recursive: true });

  // Write all test IDs to a file so tests can use them
  await fs.writeFile(path.join(authDir, "test-ids.json"), JSON.stringify(TEST_IDS, null, 2));
});

// Helper function to create NextAuth session cookies
const createNextAuthCookies = (sessionData: any) => {
  // Create a simplified NextAuth session token
  const sessionToken = `${sessionData.userId}.${Date.now()}.test`;

  return [
    {
      name: "next-auth.session-token",
      value: sessionToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
    {
      name: "next-auth.csrf-token",
      value: "test-csrf-token",
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ];
};

// Generate random test IDs to avoid conflicts
export const TEST_IDS = {
  legacyWithSubscription: {
    userId: Math.floor(Math.random() * 1000000) + 20000000,
    ownerId: Math.floor(Math.random() * 1000000) + 30000000,
    installationId: Math.floor(Math.random() * 1000000) + 40000000,
  },
  regularWithCredits: {
    userId: Math.floor(Math.random() * 1000000) + 22000000,
    ownerId: Math.floor(Math.random() * 1000000) + 32000000,
    installationId: Math.floor(Math.random() * 1000000) + 42000000,
  },
  regularNoCredits: {
    userId: Math.floor(Math.random() * 1000000) + 23000000,
    ownerId: Math.floor(Math.random() * 1000000) + 33000000,
    installationId: Math.floor(Math.random() * 1000000) + 43000000,
  },
};

setup("create auth state for legacy user with subscription", async () => {
  const sessionData = {
    userId: TEST_IDS.legacyWithSubscription.userId,
    user: {
      id: TEST_IDS.legacyWithSubscription.userId.toString(),
      name: "Test Legacy User",
      email: "legacy@test.com",
      login: "legacy-user",
      userId: TEST_IDS.legacyWithSubscription.userId,
    },
    jwtToken: "test-jwt-token",
    accessToken: "test-access-token",
  };

  const authState = {
    cookies: createNextAuthCookies(sessionData),
    origins: [
      {
        origin: "http://localhost:4000",
        localStorage: [],
      },
    ],
  };

  await fs.writeFile(
    path.join(authDir, "legacy-with-subscription.json"),
    JSON.stringify(authState, null, 2)
  );
});

setup("create auth state for regular user with credits", async () => {
  const sessionData = {
    userId: TEST_IDS.regularWithCredits.userId,
    user: {
      id: TEST_IDS.regularWithCredits.userId.toString(),
      name: "Test Regular User",
      email: "regular@test.com",
      login: "regular-user",
      userId: TEST_IDS.regularWithCredits.userId,
    },
    jwtToken: "test-jwt-token",
    accessToken: "test-access-token",
  };

  const authState = {
    cookies: createNextAuthCookies(sessionData),
    origins: [
      {
        origin: "http://localhost:4000",
        localStorage: [],
      },
    ],
  };

  await fs.writeFile(
    path.join(authDir, "regular-with-credits.json"),
    JSON.stringify(authState, null, 2)
  );
});

setup("create auth state for regular user without credits", async () => {
  const sessionData = {
    userId: TEST_IDS.regularNoCredits.userId,
    user: {
      id: TEST_IDS.regularNoCredits.userId.toString(),
      name: "Test Regular User No Credits",
      email: "regular-no-credits@test.com",
      login: "regular-user-no-credits",
      userId: TEST_IDS.regularNoCredits.userId,
    },
    jwtToken: "test-jwt-token",
    accessToken: "test-access-token",
  };

  const authState = {
    cookies: createNextAuthCookies(sessionData),
    origins: [
      {
        origin: "http://localhost:4000",
        localStorage: [],
      },
    ],
  };

  await fs.writeFile(
    path.join(authDir, "regular-no-credits.json"),
    JSON.stringify(authState, null, 2)
  );
});
