import fs from "fs/promises";
import path from "path";
import { test as setup } from "@playwright/test";
import { insertCredits } from "@/app/actions/supabase/credits/insert-credits";
import { supabaseAdmin } from "@/lib/supabase/server";
import { createTestCustomer } from "../helpers/create-test-customer";

/**
 * Creates mock auth state files for E2E tests
 * Simulates NextAuth.js session cookies for authenticated users
 *
 * This file is automatically executed by Playwright's setup project (testMatch: /.*\.setup\.ts/)
 * and runs before all E2E tests to create the .auth/*.json files that tests reference via storageState
 */

const authDir = path.join(process.cwd(), "e2e", ".auth");

// Store customer IDs for cleanup
const customerIds: string[] = [];

// Ensure auth directory exists
setup.beforeAll(async () => {
  await fs.mkdir(authDir, { recursive: true });

  // Write all test IDs to a file so tests can use them
  await fs.writeFile(path.join(authDir, "test-ids.json"), JSON.stringify(TEST_IDS, null, 2));

  // Set up User installations for test users
  // For User type: owner_id = user_id
  const userId = TEST_IDS.regularWithCredits.userId;

  // Clean up any existing records
  await supabaseAdmin.from("credits").delete().eq("owner_id", userId);
  await supabaseAdmin.from("installations").delete().eq("owner_id", userId);
  await supabaseAdmin.from("owners").delete().eq("owner_id", userId);

  // Create a real Stripe customer for testing
  const customerResult = await createTestCustomer({
    owner_id: userId.toString(),
  });

  if (!customerResult.success || !customerResult.customerId) {
    throw new Error("Failed to create test customer in setup");
  }

  customerIds.push(customerResult.customerId);

  // Create owner record - User type with real Stripe customer ID
  await supabaseAdmin.from("owners").upsert({
    owner_id: userId,
    owner_name: "regular-test-user",
    owner_type: "User",
    stripe_customer_id: customerResult.customerId,
    credit_balance_usd: 0,
    auto_reload_enabled: false,
    auto_reload_threshold_usd: 10,
    auto_reload_target_usd: 50,
    org_rules: "",
  });

  // Create installation record - User type
  const { error: installError } = await supabaseAdmin.from("installations").upsert({
    installation_id: TEST_IDS.regularWithCredits.installationId,
    owner_id: userId,
    owner_type: "User",
    owner_name: "regular-test-user",
    uninstalled_at: null,
  });
  if (installError) {
    console.error("[AUTH SETUP] Error creating installation:", installError);
  }

  // Add initial credits
  await insertCredits({
    owner_id: userId,
    amount_usd: 100,
    transaction_type: "purchase",
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Set up legacy user with subscription
  const legacyUserId = TEST_IDS.legacyWithSubscription.userId;

  // Clean up any existing records
  await supabaseAdmin.from("credits").delete().eq("owner_id", legacyUserId);
  await supabaseAdmin.from("installations").delete().eq("owner_id", legacyUserId);
  await supabaseAdmin.from("owners").delete().eq("owner_id", legacyUserId);

  // Create Stripe customer with subscription for legacy user
  const legacyCustomerResult = await createTestCustomer(
    { owner_id: legacyUserId.toString() },
    { createSubscription: true }
  );

  if (!legacyCustomerResult.success || !legacyCustomerResult.customerId) {
    throw new Error("Failed to create legacy test customer with subscription");
  }

  customerIds.push(legacyCustomerResult.customerId);

  // Create owner record for legacy user
  await supabaseAdmin.from("owners").upsert({
    owner_id: legacyUserId,
    owner_type: "Organization",
    owner_name: "legacy-test-org",
    stripe_customer_id: legacyCustomerResult.customerId,
    credit_balance_usd: 0,
    auto_reload_enabled: false,
    auto_reload_threshold_usd: 5,
    auto_reload_target_usd: 50,
    org_rules: "",
  });

  // Create installation record for legacy user
  await supabaseAdmin.from("installations").upsert({
    installation_id: TEST_IDS.legacyWithSubscription.installationId,
    owner_id: legacyUserId,
    owner_type: "Organization",
    owner_name: "legacy-test-org",
    uninstalled_at: null,
  });
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
