interface SpinnerIconProps {
  color?: "blue" | "pink";
}

const SpinnerIcon = ({ color = "blue" }: SpinnerIconProps) => {
  const colorClass = color === "pink" ? "border-pink-500" : "border-blue-500";

  return (
    <div
      className={`w-6 h-6 border-2 ${colorClass} border-t-transparent rounded-full animate-spin flex-shrink-0`}
    ></div>
  );
};

export default SpinnerIcon;
