"use server";

import { getOwner } from "./get-owner";
import { getCreditTransactions } from "../credits/get-credit-transactions";

export async function validateAutoReloadSpendingLimit({
  ownerId,
  requestedAmountUsd,
}: {
  ownerId: number;
  requestedAmountUsd: number;
}) {
  const owner = await getOwner(ownerId);
  
  if (!owner || !owner.max_spending_limit_usd) {
    // No spending limit set, allow full purchase
    return { 
      allowed: true, 
      adjustedAmountUsd: requestedAmountUsd,
      reason: "No spending limit set"
    };
  }

  // Get current month's spending (purchases and auto_reload only)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const transactions = await getCreditTransactions(ownerId);
  
  // Calculate this month's spending (positive purchases and auto_reload only)
  const monthlySpending = transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.created_at);
      return (
        transactionDate >= startOfMonth &&
        (transaction.transaction_type === "purchase" || transaction.transaction_type === "auto_reload") &&
        transaction.amount_usd > 0
      );
    })
    .reduce((total, transaction) => total + transaction.amount_usd, 0);

  const remainingLimit = owner.max_spending_limit_usd - monthlySpending;

  // If already at or over limit, skip auto-reload
  if (remainingLimit <= 0) {
    return {
      allowed: false,
      adjustedAmountUsd: 0,
      currentMonthlySpending: monthlySpending,
      spendingLimit: owner.max_spending_limit_usd,
      remainingLimit: 0,
      reason: "Monthly spending limit already reached"
    };
  }

  // If requested amount exceeds remaining limit, adjust to remaining amount
  const adjustedAmountUsd = Math.min(requestedAmountUsd, remainingLimit);

  return {
    allowed: true,
    adjustedAmountUsd,
    currentMonthlySpending: monthlySpending,
    spendingLimit: owner.max_spending_limit_usd,
    remainingLimit,
    isAdjusted: adjustedAmountUsd < requestedAmountUsd,
    reason: adjustedAmountUsd < requestedAmountUsd 
      ? `Amount adjusted to fit within spending limit`
      : "Within spending limit"
  };
}