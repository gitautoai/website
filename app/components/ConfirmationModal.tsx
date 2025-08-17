interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: "danger" | "default";
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = "default",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center z-50" onClick={onCancel}>
      <div className="relative bg-white rounded-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-4 py-2 text-white rounded hover:opacity-90 disabled:opacity-50 ${
                  variant === "danger" ? "bg-red-600" : "bg-pink-600"
                }`}
              >
                {isLoading ? "Loading..." : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}