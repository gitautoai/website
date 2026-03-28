import { ReactNode } from "react";

type TriggerToggleProps = {
  title: string;
  description: string | ReactNode;
  isEnabled: boolean;
  isDisabled?: boolean;
  onToggle: () => void;
};

export default function TriggerToggle({
  title,
  description,
  isEnabled,
  isDisabled = false,
  onToggle,
}: TriggerToggleProps) {
  return (
    <div className="flex items-center py-2 rounded-lg">
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          isEnabled ? "bg-pink-600" : "bg-gray-300"
        }`}
        disabled={isDisabled}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            isEnabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <div className="ml-4 flex-1">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </div>
  );
}
