type FormFieldProps = {
  label: string;
  type?: "text" | "email";
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
};

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  disabled = false,
  required = false,
}: FormFieldProps) {
  const inputId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`mt-1 pl-2 block w-full rounded-md border border-gray-300 h-10 ${
          disabled
            ? "border-gray-300 bg-gray-100 cursor-not-allowed"
            : required && !value
            ? "border-pink-300 focus:border-pink-500"
            : "border-gray-300 focus:border-purple-500"
        }`}
      />
    </div>
  );
}
