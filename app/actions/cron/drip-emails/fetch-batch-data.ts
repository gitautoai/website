"use server";

import { checkReplies } from "@/app/actions/gmail/check-replies";
import { getActiveSubscriptionCustomerIds } from "@/app/actions/stripe/get-active-subscription-customer-ids";
import { getCanceledSubscriptionCustomerIds } from "@/app/actions/stripe/get-canceled-subscription-customer-ids";
import { getPayingOwnerIds } from "@/app/actions/supabase/credits/get-paying-owner-ids";
import { getSentEmails } from "@/app/actions/supabase/email-sends/get-sent-emails";
import { markReplied } from "@/app/actions/supabase/email-sends/mark-replied";
import { getActiveInstallations } from "@/app/actions/supabase/installations/get-active-installations";
import { getAllOwnerIds } from "@/app/actions/supabase/installations/get-all-owner-ids";
import { getUninstalledInstallations } from "@/app/actions/supabase/installations/get-uninstalled-installations";
import { getOwners } from "@/app/actions/supabase/owners/get-owners";
import { getUsageByOwnerIds } from "@/app/actions/supabase/usage/get-usage-by-owner-ids";
import { getUsersByIds } from "@/app/actions/supabase/users/get-users-by-ids";
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
    created_at: string;
  }[];
  activeSubCustomerIds: Set<string>;
  canceledSubCustomerIds: Map<string, string>;
  users: {
    user_id: number;
    email: string | null;
    user_name: string;
    display_name: string | null;
    display_name_override: string | null;
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
  repliedOwnerIds: Set<number>;
}

export interface AllDripData {
  activeInstallations: Awaited<ReturnType<typeof getActiveInstallations>>;
  data: BatchQueryResults;
  uninstalled: Awaited<ReturnType<typeof getUninstalledInstallations>>;
}

/** Fetch all data needed for the drip email cron job in one place. */
export const fetchAllDripData = async (): Promise<AllDripData> => {
  // Fetch installations and owner IDs in parallel
  const [activeInstallations, uninstalled, allOwnerIds] = await Promise.all([
    getActiveInstallations(),
    getUninstalledInstallations(),
    getAllOwnerIds(),
  ]);

  if (allOwnerIds.length === 0) return { activeInstallations, data: emptyBatchData(), uninstalled };

  // Round 1: Fetch owners, sent emails, repos, credits, usage, subscriptions
  const round1Start = Date.now();
  const [
    owners,
    sentEmails,
    reposResult,
    purchaseOwnerIds,
    usageRows,
    activeSubCustomerIds,
    canceledSubCustomerIds,
  ] = await Promise.all([
    getOwners(allOwnerIds),
    getSentEmails(allOwnerIds),
    supabaseAdmin
      .from("repositories")
      .select("owner_id, repo_name, trigger_on_schedule")
      .in("owner_id", allOwnerIds),
    getPayingOwnerIds(allOwnerIds),
    getUsageByOwnerIds(allOwnerIds),
    getActiveSubscriptionCustomerIds(),
    getCanceledSubscriptionCustomerIds(),
  ]);

  console.log(
    `[drip] Round 1 done in ${Date.now() - round1Start}ms: owners=${owners.length} repos=${reposResult.data?.length} usage=${usageRows.length}`,
  );

  if (reposResult.error) throw new Error(`Failed to fetch repos: ${reposResult.error.message}`);

  // Extract user IDs from owner created_by ("user_id:user_name" format)
  const userIds: number[] = [];
  for (const owner of owners) {
    if (!owner.created_by) continue;
    const userId = parseInt(owner.created_by.split(":")[0], 10);
    if (!isNaN(userId)) userIds.push(userId);
  }
  const uniqueUserIds = [...new Set(userIds)];

  // Round 2: Fetch users (depends on owner data) and coverage data
  const round2Start = Date.now();
  const [users, totalCovResult, repoCovResult, globalRepoCovResult] = await Promise.all([
    getUsersByIds(uniqueUserIds),
    supabaseAdmin
      .from("total_repo_coverage")
      .select("owner_id, statement_coverage, coverage_date")
      .in("owner_id", allOwnerIds)
      .not("statement_coverage", "is", null)
      .order("coverage_date", { ascending: false }),
    supabaseAdmin
      .from("repo_coverage")
      .select("owner_id, repo_name, lines_total, lines_covered, created_at")
      .in("owner_id", allOwnerIds)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("repo_coverage")
      .select("owner_id, repo_name, lines_total, lines_covered, created_at")
      .gt("lines_total", 0)
      .order("created_at", { ascending: false }),
  ]);

  console.log(
    `[drip] Round 2 done in ${Date.now() - round2Start}ms: users=${users.length} totalCov=${totalCovResult.data?.length} repoCov=${repoCovResult.data?.length} globalRepoCov=${globalRepoCovResult.data?.length}`,
  );

  if (totalCovResult.error)
    throw new Error(`Failed to fetch total coverage: ${totalCovResult.error.message}`);
  if (repoCovResult.error)
    throw new Error(`Failed to fetch repo coverage: ${repoCovResult.error.message}`);
  if (globalRepoCovResult.error)
    throw new Error(`Failed to fetch global repo coverage: ${globalRepoCovResult.error.message}`);

  // Round 3: Check Gmail for replies and persist
  const round3Start = Date.now();
  const emailToOwnerIds: Record<string, number[]> = {};
  for (const owner of owners) {
    if (!owner.created_by) continue;
    const userId = parseInt(owner.created_by.split(":")[0], 10);
    if (isNaN(userId)) continue;
    const user = users.find((u) => u.user_id === userId);
    if (!user?.email) continue;
    if (!emailToOwnerIds[user.email]) emailToOwnerIds[user.email] = [];
    emailToOwnerIds[user.email].push(owner.owner_id);
  }

  const uniqueEmails = Object.keys(emailToOwnerIds);
  const repliedEmails = await checkReplies(uniqueEmails);
  const repliedOwnerIds = new Set<number>();
  const markEntries: { ownerId: number; repliedAt: string }[] = [];
  for (const [email, repliedAt] of repliedEmails) {
    for (const ownerId of emailToOwnerIds[email]) {
      repliedOwnerIds.add(ownerId);
      markEntries.push({ ownerId, repliedAt });
    }
  }

  if (markEntries.length > 0) await markReplied(markEntries);

  console.log(
    `[drip] Round 3 done in ${Date.now() - round3Start}ms: checked ${uniqueEmails.length} emails, ${repliedOwnerIds.size} replied`,
  );

  const data: BatchQueryResults = {
    owners,
    sentEmails,
    repos: reposResult.data || [],
    purchaseOwnerIds,
    usageRows,
    activeSubCustomerIds,
    canceledSubCustomerIds,
    users,
    totalCoverageRows: totalCovResult.data || [],
    repoCoverageRows: repoCovResult.data || [],
    globalRepoCoverageRows: globalRepoCovResult.data || [],
    repliedOwnerIds,
  };

  return { activeInstallations, data, uninstalled };
};

const emptyBatchData = (): BatchQueryResults => ({
  owners: [],
  sentEmails: {},
  repos: [],
  purchaseOwnerIds: [],
  usageRows: [],
  activeSubCustomerIds: new Set(),
  canceledSubCustomerIds: new Map(),
  users: [],
  totalCoverageRows: [],
  repoCoverageRows: [],
  globalRepoCoverageRows: [],
  repliedOwnerIds: new Set(),
});
