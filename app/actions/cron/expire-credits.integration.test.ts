import { expireCredits } from "./expire-credits";
import { supabaseAdmin } from "@/lib/supabase/server";

describe("expireCredits integration", () => {
  const testOwnerId1 = Math.floor(Math.random() * 1000000) + 1000000; // Random ID between 1M-2M
  const testOwnerId2 = Math.floor(Math.random() * 1000000) + 2000000; // Random ID between 2M-3M

  beforeEach(async () => {
    // Clean up any existing test data
    await supabaseAdmin.from("credits").delete().in("owner_id", [testOwnerId1, testOwnerId2]);
    await supabaseAdmin.from("owners").delete().in("owner_id", [testOwnerId1, testOwnerId2]);

    // Create test owners
    await supabaseAdmin.from("owners").insert([
      {
        owner_id: testOwnerId1,
        owner_name: "test-owner-1",
        owner_type: "Organization",
        credit_balance_usd: 0,
        stripe_customer_id: `cus_test_${testOwnerId1}`,
      },
      {
        owner_id: testOwnerId2,
        owner_name: "test-owner-2",
        owner_type: "Organization",
        credit_balance_usd: 0,
        stripe_customer_id: `cus_test_${testOwnerId2}`,
      },
    ]);
  });

  afterEach(async () => {
    // Clean up test data
    await supabaseAdmin.from("credits").delete().in("owner_id", [testOwnerId1, testOwnerId2]);
    await supabaseAdmin.from("owners").delete().in("owner_id", [testOwnerId1, testOwnerId2]);
  });

  it("should expire credits and create expiration transactions", async () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Insert test expired credits using valid transaction_type
    const { error: insertError } = await supabaseAdmin.from("credits").insert([
      {
        owner_id: testOwnerId1,
        amount_usd: 5, // $5 (whole dollars)
        transaction_type: "purchase",
        expires_at: yesterday.toISOString(),
      },
      {
        owner_id: testOwnerId1,
        amount_usd: 4, // $4 (whole dollars)
        transaction_type: "purchase",
        expires_at: yesterday.toISOString(),
      },
    ]);

    expect(insertError).toBeNull();

    // Run expiration
    const result = await expireCredits();

    // Verify results include our test owner
    expect(result.expired).toBe(1);
    const ownerResult = result.owners.find((o) => o.ownerId === testOwnerId1);

    if (ownerResult) {
      expect(ownerResult.expiredAmount).toBe(9); // $5 + $4
      expect(ownerResult.creditCount).toBe(2);
    }

    // Verify expiration transaction was created (the negative amount one)
    const { data: expirationTransaction } = await supabaseAdmin
      .from("credits")
      .select("*")
      .eq("owner_id", testOwnerId1)
      .eq("transaction_type", "expiration")
      .eq("amount_usd", -8)
      .single();

    expect(expirationTransaction).toBeTruthy();
    expect(expirationTransaction?.amount_usd).toBe(-8); // Negative $8
    expect(expirationTransaction?.expires_at).toBeNull();

    // Verify original credits were marked as expired
    const { data: expiredCredits } = await supabaseAdmin
      .from("credits")
      .select("*")
      .eq("owner_id", testOwnerId1)
      .eq("transaction_type", "expiration")
      .neq("amount_usd", -8); // Not the expiration transaction itself

    expect(expiredCredits).toHaveLength(2);
    expiredCredits?.forEach((credit) => {
      expect(credit.transaction_type).toBe("expiration");
    });

    // Verify owner's credit balance was updated to 0 (8 - 8 = 0)
    const { data: owner } = await supabaseAdmin
      .from("owners")
      .select("credit_balance_usd")
      .eq("owner_id", testOwnerId1)
      .single();

    expect(owner?.credit_balance_usd).toBe(0);
  });

  it("should handle case with no expired credits gracefully", async () => {
    // Don't insert any expired credits
    const result = await expireCredits();

    expect(result).toEqual({
      expired: expect.any(Number),
      owners: expect.any(Array),
      totalExpired: expect.any(Number),
    });

    // Should not find our test owner in results
    const ownerResult = result.owners.find((o) => o.ownerId === testOwnerId1);
    expect(ownerResult).toBeUndefined();
  });

  it("should not expire credits that have not yet expired", async () => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Insert credit that expires tomorrow
    const { error: insertError } = await supabaseAdmin.from("credits").insert({
      owner_id: testOwnerId1,
      amount_usd: 10,
      transaction_type: "purchase",
      expires_at: tomorrow.toISOString(),
    });

    expect(insertError).toBeNull();

    // Run expiration
    const result = await expireCredits();

    // Should not find our test owner in expired results
    const ownerResult = result.owners.find((o) => o.ownerId === testOwnerId1);
    expect(ownerResult).toBeUndefined();

    // Credit should still be a purchase, not marked as expired
    const { data: credit } = await supabaseAdmin
      .from("credits")
      .select("*")
      .eq("owner_id", testOwnerId1)
      .single();

    expect(credit?.transaction_type).toBe("purchase");
  });

  it("should handle mixed expired and non-expired credits", async () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Insert mixed credits for one owner
    const { error: insertError } = await supabaseAdmin.from("credits").insert([
      {
        owner_id: testOwnerId1,
        amount_usd: 5,
        transaction_type: "purchase",
        expires_at: yesterday.toISOString(), // Expired
      },
      {
        owner_id: testOwnerId1,
        amount_usd: 3,
        transaction_type: "auto_reload",
        expires_at: tomorrow.toISOString(), // Not expired
      },
    ]);

    expect(insertError).toBeNull();

    const result = await expireCredits();

    const ownerResult = result.owners.find((o) => o.ownerId === testOwnerId1);
    expect(ownerResult?.expiredAmount).toBe(5); // Only $5 expired
    expect(ownerResult?.creditCount).toBe(1); // Only 1 credit expired

    // Non-expired credit should still be auto_reload
    const { data: nonExpiredCredit } = await supabaseAdmin
      .from("credits")
      .select("*")
      .eq("owner_id", testOwnerId1)
      .eq("amount_usd", 3)
      .single();

    expect(nonExpiredCredit?.transaction_type).toBe("auto_reload");

    // Verify owner's credit balance (3 non-expired - 5 expired = -2, but should be 3 since only 5 expired)
    const { data: owner } = await supabaseAdmin
      .from("owners")
      .select("credit_balance_usd")
      .eq("owner_id", testOwnerId1)
      .single();

    expect(owner?.credit_balance_usd).toBe(3); // Only the non-expired credit remains
  });

  it("should handle multiple owners with mixed yesterday and tomorrow credits", async () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Both owners have yesterday (expired) and tomorrow (non-expired) credits with unique amounts
    const { error: insertError } = await supabaseAdmin.from("credits").insert([
      // Owner 1: $12 expired, $14 non-expired
      {
        owner_id: testOwnerId1,
        amount_usd: 5, // Expired
        transaction_type: "purchase",
        expires_at: yesterday.toISOString(),
      },
      {
        owner_id: testOwnerId1,
        amount_usd: 7, // Expired
        transaction_type: "refund",
        expires_at: yesterday.toISOString(),
      },
      {
        owner_id: testOwnerId1,
        amount_usd: 8, // Non-expired
        transaction_type: "auto_reload",
        expires_at: tomorrow.toISOString(),
      },
      {
        owner_id: testOwnerId1,
        amount_usd: 6, // Non-expired
        transaction_type: "purchase",
        expires_at: tomorrow.toISOString(),
      },
      // Owner 2: $19 expired, $23 non-expired
      {
        owner_id: testOwnerId2,
        amount_usd: 9, // Expired
        transaction_type: "purchase",
        expires_at: yesterday.toISOString(),
      },
      {
        owner_id: testOwnerId2,
        amount_usd: 10, // Expired
        transaction_type: "auto_reload",
        expires_at: yesterday.toISOString(),
      },
      {
        owner_id: testOwnerId2,
        amount_usd: 11, // Non-expired
        transaction_type: "refund",
        expires_at: tomorrow.toISOString(),
      },
      {
        owner_id: testOwnerId2,
        amount_usd: 12, // Non-expired
        transaction_type: "purchase",
        expires_at: tomorrow.toISOString(),
      },
    ]);

    expect(insertError).toBeNull();

    const result = await expireCredits();

    expect(result.expired).toBe(2); // Exactly 2 owners processed

    const owner1Result = result.owners.find((o) => o.ownerId === testOwnerId1);
    const owner2Result = result.owners.find((o) => o.ownerId === testOwnerId2);

    expect(owner1Result?.expiredAmount).toBe(12); // $5 + $7
    expect(owner1Result?.creditCount).toBe(2);

    expect(owner2Result?.expiredAmount).toBe(19); // $9 + $10
    expect(owner2Result?.creditCount).toBe(2);

    expect(result.totalExpired).toBe(31); // Exactly $31 from our test data (12 + 19)

    // Verify non-expired credits remain unchanged
    const { data: nonExpiredCredits } = await supabaseAdmin
      .from("credits")
      .select("*")
      .in("owner_id", [testOwnerId1, testOwnerId2])
      .in("amount_usd", [6, 8, 11, 12]) // The non-expired amounts
      .neq("transaction_type", "expiration");

    expect(nonExpiredCredits).toHaveLength(4);
    nonExpiredCredits?.forEach((credit) => {
      expect(["auto_reload", "purchase", "refund"]).toContain(credit.transaction_type);
    });

    // Verify both owners' credit balances after expiration
    const { data: owner1 } = await supabaseAdmin
      .from("owners")
      .select("credit_balance_usd")
      .eq("owner_id", testOwnerId1)
      .single();

    const { data: owner2 } = await supabaseAdmin
      .from("owners")
      .select("credit_balance_usd")
      .eq("owner_id", testOwnerId2)
      .single();

    expect(owner1?.credit_balance_usd).toBe(14); // $8 + $6 non-expired credits
    expect(owner2?.credit_balance_usd).toBe(23); // $11 + $12 non-expired credits
  });
});
