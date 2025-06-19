type FormFieldProps = {
  label: string;
  name: string;
  type?: "text" | "email" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  className?: string;
  children?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  selectedValue?: string;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
};

export default function FormField({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  options,
  rows = 3,
  className = "",
  children,
  onChange,
  selectedValue = "",
  otherValue = "",
  onOtherChange,
}: FormFieldProps) {
  const baseInputClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-transparent";

  // Generate shorter placeholder for "other" inputs
  const getOtherPlaceholder = (fieldName: string) => {
    if (fieldName.toLowerCase().includes("coverage")) return "Please specify";

    return `Specify ${fieldName.toLowerCase()}...`;
  };

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && "*"}
      </label>

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          required={required}
          rows={rows}
          placeholder={placeholder}
          className={baseInputClasses}
        />
      ) : type === "select" ? (
        <div className="space-y-3">
          <select
            id={name}
            name={name}
            required={required}
            onChange={onChange}
            className={baseInputClasses}
          >
            <option value="">
              {label.toLowerCase().includes("coverage") ? "--" : `Select ${label.toLowerCase()}`}
            </option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            {children}
          </select>

          {selectedValue === "other" && (
            <input
              type="text"
              name={`${name}Other`}
              placeholder={getOtherPlaceholder(label)}
              value={otherValue}
              onChange={(e) => onOtherChange?.(e.target.value)}
              className={baseInputClasses}
            />
          )}
        </div>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          required={required}
          placeholder={placeholder}
          className={baseInputClasses}
        />
      )}
    </div>
  );
}
