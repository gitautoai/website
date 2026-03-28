type ToggleSwitchProps = {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  title?: string;
};

export default function ToggleSwitch({ checked, disabled, onChange, title }: ToggleSwitchProps) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      title={title}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? "bg-pink-600" : "bg-gray-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
