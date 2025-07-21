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

setup("create auth state for legacy user with subscription", async () => {
  const sessionData = {
    userId: 12345,
    user: {
      id: "12345",
      name: "Test Legacy User",
      email: "legacy@test.com",
      login: "legacy-user",
      userId: 12345,
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

setup("create auth state for legacy user without subscription", async () => {
  const sessionData = {
    userId: 12346,
    user: {
      id: "12346",
      name: "Test Legacy User No Sub",
      email: "legacy-no-sub@test.com",
      login: "legacy-user-no-sub",
      userId: 12346,
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
    path.join(authDir, "legacy-no-subscription.json"),
    JSON.stringify(authState, null, 2)
  );
});

setup("create auth state for regular user with credits", async () => {
  const sessionData = {
    userId: 12347,
    user: {
      id: "12347",
      name: "Test Regular User",
      email: "regular@test.com",
      login: "regular-user",
      userId: 12347,
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
    userId: 12348,
    user: {
      id: "12348",
      name: "Test Regular User No Credits",
      email: "regular-no-credits@test.com",
      login: "regular-user-no-credits",
      userId: 12348,
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
