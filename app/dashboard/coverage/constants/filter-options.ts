import { Tables } from "@/types/supabase";

// Package filter options
export const createPackageOptions = (packageNames: string[]) => [
  { value: "", label: "All Packages" },
  ...packageNames.map((name) => ({ value: name, label: name })),
];

// Level filter options
export const createLevelOptions = (levels: Tables<"coverages">["level"][]) => [
  { value: "", label: "All Levels" },
  ...levels.map((level) => ({
    value: level,
    label: level.charAt(0).toUpperCase() + level.slice(1),
  })),
];

// Coverage filter options
export const COVERAGE_FILTER_OPTIONS = [
  { value: "all", label: "Show All" },
  { value: "hide", label: "Hide All 100%" },
] as const;

// Mobile metric options
export const MOBILE_METRIC_OPTIONS = [
  { value: "size", label: "File Size" },
  { value: "statement", label: "Statement Coverage" },
  { value: "function", label: "Function Coverage" },
  { value: "branch", label: "Branch Coverage" },
] as const;

// Parent issue options
export const createParentIssueOptions = (
  openIssues: Array<{ id: string; number: number; title: string }>
) => [
  { value: "", label: "No parent issue" },
  ...openIssues.map((issue) => ({
    value: issue.number.toString(),
    label: `#${issue.number} ${issue.title}`,
  })),
];

export const EXCLUSION_FILTER_OPTIONS = [
  { value: "", label: "All Files" },
  { value: "included", label: "Included Only" },
  { value: "excluded", label: "Excluded Only" },
];
