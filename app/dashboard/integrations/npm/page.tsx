"use client";

import { useState, useEffect } from "react";
import { deleteNpmToken } from "@/app/actions/supabase/npm-tokens/delete-token";
import { getNpmToken } from "@/app/actions/supabase/npm-tokens/get-token";
import { saveNpmToken } from "@/app/actions/supabase/npm-tokens/save-token";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import { useAccountContext } from "@/app/components/contexts/Account";
import { EyeIcon, EyeSlashIcon } from "@/app/components/icons/EyeIcon";
import { TrashIcon } from "@/app/components/icons/TrashIcon";
import { RELATIVE_URLS } from "@/config/urls";
import Link from "next/link";
import RepositorySelector from "../../components/RepositorySelector";
import SaveButton from "../../components/SaveButton";

export default function NpmPage() {
  const { currentOwnerId, currentOwnerName, userId, userName } = useAccountContext();
  const [token, setToken] = useState("");
  const [hasExistingToken, setHasExistingToken] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!currentOwnerId) return;

    getNpmToken(currentOwnerId)
      .then((data) => setHasExistingToken(!!data))
      .catch(console.error);
  }, [currentOwnerId]);

  const handleSave = async () => {
    if (!currentOwnerId || !userId) {
      setMessage({ type: "error", text: "Please select an organization" });
      return;
    }

    if (!token.trim()) {
      setMessage({ type: "error", text: "Please enter an npm token" });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await saveNpmToken(currentOwnerId, token.trim(), userId, userName);

      setMessage({ type: "success", text: "npm token saved" });
      setHasExistingToken(true);
      setToken("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save token";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!currentOwnerId) return;

    setIsSaving(true);
    setShowDeleteModal(false);
    try {
      await deleteNpmToken(currentOwnerId);
      setMessage({ type: "success", text: "Token deleted" });
      setHasExistingToken(false);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete token" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-6">npm Integration</h1>
          <p className="text-gray-600 mt-2">
            Connect npm to access private packages during test generation.{" "}
            <Link
              href={RELATIVE_URLS.DOCS.INTEGRATIONS.NPM}
              className="text-pink-600 hover:underline"
            >
              Learn more →
            </Link>
          </p>
        </div>

        <RepositorySelector ownerOnly />

        <div className="bg-white rounded-lg border p-6">
          {hasExistingToken ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded">
                <span className="text-green-800">✓ npm connected for {currentOwnerName}</span>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isSaving}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  title="Remove npm token"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Replace token</label>
                  <div className="relative">
                    <input
                      type={showToken ? "text" : "password"}
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Enter new npm token"
                      className="w-full px-3 py-2 pr-10 border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showToken ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!token.trim()} />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Access Token</label>
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter your npm token"
                    className="w-full px-3 py-2 pr-10 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showToken ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
                <a
                  href="https://www.npmjs.com/settings/~/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-pink-600 hover:underline mt-1 inline-block"
                >
                  Generate token →
                </a>
              </div>

              <SaveButton onClick={handleSave} isSaving={isSaving} disabled={!token.trim()} />
            </div>
          )}

          {message && (
            <div
              className={`mt-4 p-3 rounded text-sm ${
                message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Remove npm Token"
        message={`Are you sure you want to remove the npm token for ${currentOwnerName}? This action cannot be undone.`}
        confirmText="Remove"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isSaving}
        variant="danger"
      />
    </>
  );
}
