interface LegendItem {
  name: string;
  shortName: string;
  color: string;
}

const COVERAGE_LEGEND_ITEMS: LegendItem[] = [
  { name: "Statement Coverage", shortName: "Statement", color: "#8884d8" },
  { name: "Function Coverage", shortName: "Function", color: "#82ca9d" },
  { name: "Branch Coverage", shortName: "Branch", color: "#ffc658" },
];

const LegendIcon = ({ color }: { color: string }) => (
  <svg
    className="recharts-surface"
    width="14"
    height="14"
    viewBox="0 0 32 32"
    style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }}
  >
    <path
      strokeWidth="4"
      fill="none"
      stroke={color}
      d="M0,16h10.666666666666666A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16H32M21.333333333333332,16A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16"
    />
  </svg>
);

export default function ChartLegend() {
  return (
    <ul
      className="recharts-default-legend flex flex-wrap justify-center gap-x-3 gap-y-1"
      style={{ padding: 0, margin: 0 }}
    >
      {COVERAGE_LEGEND_ITEMS.map((item) => (
        <li key={item.name} className="recharts-legend-item flex items-center">
          <LegendIcon color={item.color} />
          <span
            className="recharts-legend-item-text text-xs md:text-sm md:hidden"
            style={{ color: item.color }}
          >
            {item.shortName}
          </span>
          <span
            className="recharts-legend-item-text text-sm hidden md:inline"
            style={{ color: item.color }}
          >
            {item.name}
          </span>
        </li>
      ))}
    </ul>
  );
}
