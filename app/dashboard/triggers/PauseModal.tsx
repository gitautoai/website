import type { ReactNode } from "react";

type PauseModalProps = {
  title: string;
  description?: string;
  children?: ReactNode;
  start: string;
  end: string;
  reason: string;
  error?: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitLabel: string;
};

export default function PauseModal({
  title,
  description,
  children,
  start,
  end,
  reason,
  error,
  onStartChange,
  onEndChange,
  onReasonChange,
  onSubmit,
  onClose,
  submitLabel,
}: PauseModalProps) {
  const today = new Date().toISOString().split("T")[0];
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold my-0">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              &times;
            </button>
          </div>

          {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}

          <div className="space-y-6">
            {children}

            <div className={children ? "border-t pt-4" : ""}>
              {children && (
                <label className="block text-sm font-medium mb-3">Add pause period</label>
              )}
              <div className="space-y-4">
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Start</label>
                    <input
                      type="date"
                      value={start}
                      min={today}
                      onChange={(e) => onStartChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <span className="text-gray-400 mt-6">~</span>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">End</label>
                    <input
                      type="date"
                      value={end}
                      min={start || today}
                      onChange={(e) => onEndChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Reason (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Holiday break, Sprint freeze"
                    value={reason}
                    onChange={(e) => onReasonChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    maxLength={100}
                  />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={onSubmit}
                    disabled={!start || !end}
                    className={`flex-1 py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 ${
                      !start || !end ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {submitLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
