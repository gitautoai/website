"use client";

import { useState, useEffect } from "react";
import { CREDIT_PRICING } from "@/config/pricing";
import { updateAutoReloadSettings } from "@/app/actions/supabase/owners/update-auto-reload-settings";
import { getOwner } from "@/app/actions/supabase/owners/get-owner";
import { useAccountContext } from "@/app/components/contexts/Account";

export default function AutoReloadSettings() {
  const { currentOwnerId: ownerId, userId, userName } = useAccountContext();
  const [enabled, setEnabled] = useState(false);
  const [threshold, setThreshold] = useState(CREDIT_PRICING.AUTO_RELOAD.DEFAULT_TRIGGER_USD);
  const [target, setTarget] = useState(CREDIT_PRICING.AUTO_RELOAD.DEFAULT_TARGET_USD);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOwnerSettings = async () => {
      if (!ownerId) return;

      setLoading(true);
      try {
        const owner = await getOwner(ownerId);
        if (owner) {
          setEnabled(owner.auto_reload_enabled);
          setThreshold(owner.auto_reload_threshold_usd);
          setTarget(owner.auto_reload_target_usd);
        }
      } catch (error) {
        console.error("Error fetching auto-reload settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerSettings();
  }, [ownerId]);

  const handleSave = async (newEnabled?: boolean, newThreshold?: number, newTarget?: number) => {
    if (!ownerId) return;

    setSaving(true);
    try {
      await updateAutoReloadSettings({
        ownerId,
        enabled: newEnabled !== undefined ? newEnabled : enabled,
        thresholdUsd: newThreshold !== undefined ? newThreshold : threshold,
        amountUsd: newTarget !== undefined ? newTarget : target,
        updatedBy: `${userId}:${userName}`,
      });
      console.log("Auto-reload settings saved successfully");
    } catch (error) {
      console.error("Error saving auto-reload settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleChange = async (newEnabled: boolean) => {
    if (!ownerId) return;

    setEnabled(newEnabled);

    // Save silently in background without showing loading state
    updateAutoReloadSettings({
      ownerId,
      enabled: newEnabled,
      thresholdUsd: threshold,
      amountUsd: target,
      updatedBy: `${userId}:${userName}`,
    }).catch((error) => {
      console.error("Error saving auto-reload toggle:", error);
      // Revert toggle on error
      setEnabled(!newEnabled);
    });
  };

  const handleThresholdChange = (newThreshold: number) => {
    setThreshold(newThreshold);
  };

  const handleTargetChange = (newTarget: number) => {
    setTarget(newTarget);
  };

  return (
    <div
      className="bg-white rounded-lg shadow p-6 flex flex-col"
      data-testid="auto-reload-settings"
      data-loading={loading}
      data-owner-id={ownerId}
      data-enabled={enabled}
    >
      <h2 className="text-lg font-semibold mt-0 mb-4">Auto-Reload Settings</h2>

      <div className="space-y-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Enable Auto-Reload</label>
          <button
            type="button"
            onClick={() => handleToggleChange(!enabled)}
            disabled={loading || !ownerId}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
              enabled ? "bg-pink-600" : "bg-gray-200"
            } ${loading || !ownerId ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${!enabled ? "text-gray-400" : ""}`}>
            When credit balance reaches:
          </label>
          <div className="relative">
            <span
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${!enabled ? "text-gray-400" : "text-gray-500"}`}
            >
              $
            </span>
            <input
              type="number"
              value={threshold}
              onChange={(e) => handleThresholdChange(Number(e.target.value))}
              min={0}
              disabled={!enabled || loading || !ownerId}
              className={`pl-8 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                !enabled || loading || !ownerId
                  ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                  : "border-gray-300"
              }`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${!enabled ? "text-gray-400" : ""}`}>
            Bring credit balance back up to:
          </label>
          <div className="relative">
            <span
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${!enabled ? "text-gray-400" : "text-gray-500"}`}
            >
              $
            </span>
            <input
              type="number"
              value={target}
              onChange={(e) => handleTargetChange(Number(e.target.value))}
              min={10}
              disabled={!enabled || loading || !ownerId}
              className={`pl-8 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                !enabled || loading || !ownerId
                  ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                  : "border-gray-300"
              }`}
            />
          </div>
        </div>

        <div className="flex-1"></div>
        <button
          onClick={() => handleSave()}
          disabled={saving || !enabled || loading || !ownerId}
          className="w-full py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 mt-auto"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
