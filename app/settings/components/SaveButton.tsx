import React from "react";

interface SaveButtonProps {
  onClick: () => void;
  isSaving: boolean;
  disabled?: boolean;
  className?: string;
}

export default function SaveButton({
  onClick,
  isSaving,
  disabled = false,
  className = "",
}: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isSaving || disabled}
      className={`bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isSaving ? (
        <span className="flex items-center">
          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Saving...
        </span>
      ) : (
        "Save Settings"
      )}
    </button>
  );
}
