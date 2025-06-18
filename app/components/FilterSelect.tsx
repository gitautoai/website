interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options:
    | readonly { readonly value: string; readonly label: string }[]
    | Array<{ value: string; label: string }>;
  disabled?: boolean;
  className?: string;
}

export default function FilterSelect({
  label,
  value,
  onChange,
  options,
  disabled = false,
  className = "w-full md:w-48",
}: FilterSelectProps) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`p-2 border rounded-md ${className}`}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
