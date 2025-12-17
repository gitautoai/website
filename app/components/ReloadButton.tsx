import SpinnerIcon from "./SpinnerIcon";

interface ReloadButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function ReloadButton({ onClick, isLoading, disabled = false }: ReloadButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className="text-pink-600 hover:text-pink-700 disabled:opacity-50 font-light"
      title="Reload this repository"
    >
      {isLoading ? <SpinnerIcon /> : "↻"}
    </button>
  );
}
