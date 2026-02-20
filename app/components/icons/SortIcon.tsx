interface SortIconProps {
  direction: "asc" | "desc";
}

const SortIcon = ({ direction }: SortIconProps) => (
  <span className="ml-1 text-gray-400">{direction === "asc" ? "↑" : "↓"}</span>
);

export default SortIcon;
