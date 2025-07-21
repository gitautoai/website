"use client";

import { useEffect, useState } from "react";
import { getCreditTransactions } from "@/app/actions/supabase/credits/get-credit-transactions";
import { Database } from "@/types/supabase";
import { formatDateTime } from "@/utils/format-date-time";

type CreditTransaction = Database["public"]["Tables"]["credits"]["Row"];

type CreditTransactionHistoryProps = {
  ownerId: number;
};

export default function CreditTransactionHistory({ ownerId }: CreditTransactionHistoryProps) {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getCreditTransactions(ownerId);
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [ownerId]);

  if (loading) {
    return <div className="bg-white rounded-lg shadow p-6">Loading transactions...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold my-0">Transaction History</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Expires
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatDateTime(transaction.created_at)}
                </td>
                <td className="px-6 py-4 text-sm">
                  {transaction.transaction_type === "purchase" && "Credit purchase via Stripe"}
                  {transaction.transaction_type === "usage" &&
                    `PR generation${transaction.usage_id ? ` (Usage #${transaction.usage_id})` : ""}`}
                  {transaction.transaction_type === "auto_reload" && "Auto-reload purchase"}
                  {transaction.transaction_type === "expiration" && "Credit expiration"}
                  {transaction.transaction_type === "refund" && "Refund"}
                  {transaction.transaction_type === "trial" && "Trial credits"}
                  {transaction.transaction_type === "grant" && "Granted credits"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      transaction.transaction_type === "purchase" ||
                      transaction.transaction_type === "trial" ||
                      transaction.transaction_type === "grant"
                        ? "bg-green-100 text-green-800"
                        : transaction.transaction_type === "usage" ||
                            transaction.transaction_type === "expiration"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {transaction.transaction_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {transaction.expires_at
                    ? formatDateTime(transaction.expires_at, { includeTime: false })
                    : "Never"}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                    transaction.amount_usd > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.amount_usd > 0 ? "+" : ""}${Math.abs(transaction.amount_usd)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
