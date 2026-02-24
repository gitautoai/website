"use server";

import { getActiveSubscriptionCustomerIds } from "@/app/actions/stripe/get-active-subscription-customer-ids";
import { getSentEmails } from "@/app/actions/supabase/email-sends/get-sent-emails";
import { supabaseAdmin } from "@/lib/supabase/server";

export interface BatchQueryResults {
  owners: {
    owner_id: number;
    created_by: string | null;
    credit_balance_usd: number | null;
    stripe_customer_id: string | null;
    auto_reload_enabled: boolean;
  }[];
  sentEmails: Record<number, Set<string>>;
  repos: { owner_id: number; repo_name: string; trigger_on_schedule: boolean }[];
  purchaseOwnerIds: number[];
  usageRows: {
    owner_id: number;
    trigger: string;
    owner_name: string;
    repo_name: string;
    pr_number: number | null;
    is_merged: boolean;
  }[];
  activeSubCustomerIds: Set<string>;
  users: {
    user_id: number;
    email: string | null;
    user_name: string;
    display_name: string | null;
  }[];
  totalCoverageRows: {
    owner_id: number | null;
    statement_coverage: number | null;
    coverage_date: string | null;
  }[];
  repoCoverageRows: {
    owner_id: number;
    repo_name: string;
    lines_total: number;
    lines_covered: number;
    created_at: string;
  }[];
  globalRepoCoverageRows: {
    owner_id: number;
    repo_name: string;
    lines_total: number;
    lines_covered: number;
    created_at: string;
  }[];
}

export const fetchBatchData = async (ownerIds: number[]): Promise<BatchQueryResults> => {
  // Round 1: Fetch owners, sent emails, repos, credits, usage, subscriptions
  const [ownersResult, sentEmails, reposResult, creditsResult, usageResult, activeSubCustomerIds] =
    await Promise.all([
      supabaseAdmin
        .from("owners")
        .select("owner_id, created_by, credit_balance_usd, stripe_customer_id, auto_reload_enabled")
        .in("owner_id", ownerIds),
      getSentEmails(ownerIds),
      supabaseAdmin
        .from("repositories")
        .select("owner_id, repo_name, trigger_on_schedule")
        .in("owner_id", ownerIds),
      supabaseAdmin
        .from("credits")
        .select("owner_id, transaction_type")
        .in("owner_id", ownerIds)
        .in("transaction_type", ["purchase", "auto_reload"]),
      supabaseAdmin
        .from("usage")
        .select("owner_id, trigger, owner_name, repo_name, pr_number, is_merged")
        .in("owner_id", ownerIds)
        .not("pr_number", "is", null)
        .gt("pr_number", 0),
      getActiveSubscriptionCustomerIds(),
    ]);

  if (ownersResult.error) throw new Error(`Failed to fetch owners: ${ownersResult.error.message}`);
  if (reposResult.error) throw new Error(`Failed to fetch repos: ${reposResult.error.message}`);
  if (creditsResult.error)
    throw new Error(`Failed to fetch credits: ${creditsResult.error.message}`);
  if (usageResult.error) throw new Error(`Failed to fetch usage: ${usageResult.error.message}`);

  // Extract user IDs from owner created_by ("user_id:user_name" format)
  const userIds: number[] = [];
  for (const owner of ownersResult.data || []) {
    if (!owner.created_by) continue;
    const userId = parseInt(owner.created_by.split(":")[0], 10);
    if (!isNaN(userId)) userIds.push(userId);
  }
  const uniqueUserIds = [...new Set(userIds)];

  // Round 2: Fetch users (depends on owner data) and coverage data
  const [usersResult, totalCovResult, repoCovResult, globalRepoCovResult] = await Promise.all([
    uniqueUserIds.length > 0
      ? supabaseAdmin
          .from("users")
          .select("user_id, email, user_name, display_name")
          .in("user_id", uniqueUserIds)
          .not("email", "is", null)
      : Promise.resolve({ data: [], error: null }),
    supabaseAdmin
      .from("total_repo_coverage")
      .select("owner_id, statement_coverage, coverage_date")
      .in("owner_id", ownerIds)
      .not("statement_coverage", "is", null)
      .order("coverage_date", { ascending: false }),
    supabaseAdmin
      .from("repo_coverage")
      .select("owner_id, repo_name, lines_total, lines_covered, created_at")
      .in("owner_id", ownerIds)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("repo_coverage")
      .select("owner_id, repo_name, lines_total, lines_covered, created_at")
      .gt("lines_total", 0)
      .order("created_at", { ascending: false }),
  ]);

  if (usersResult.error) throw new Error(`Failed to fetch users: ${usersResult.error.message}`);
  if (totalCovResult.error)
    throw new Error(`Failed to fetch total coverage: ${totalCovResult.error.message}`);
  if (repoCovResult.error)
    throw new Error(`Failed to fetch repo coverage: ${repoCovResult.error.message}`);
  if (globalRepoCovResult.error)
    throw new Error(`Failed to fetch global repo coverage: ${globalRepoCovResult.error.message}`);

  return {
    owners: ownersResult.data || [],
    sentEmails,
    repos: reposResult.data || [],
    purchaseOwnerIds: (creditsResult.data || []).map((c) => c.owner_id),
    usageRows: usageResult.data || [],
    activeSubCustomerIds,
    users: usersResult.data || [],
    totalCoverageRows: totalCovResult.data || [],
    repoCoverageRows: repoCovResult.data || [],
    globalRepoCoverageRows: globalRepoCovResult.data || [],
  };
};
