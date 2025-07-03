import { Tables } from "@/types/supabase";

export function generateDummyData(): Tables<"repo_coverage">[] {
  const data: Tables<"repo_coverage">[] = [];
  const today = new Date();

  // 3 months, 2 data points per week (total 24 points)
  for (let i = 0; i < 24; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (23 - i) * 3.5); // 3.5 days apart (2 points per week)

    let statementCoverage: number;
    let functionCoverage: number;
    let branchCoverage: number;

    if (i < 8) {
      // First month: 0% to 90% in a gradual zigzag pattern
      const baseProgress = (i / 8) * 90;
      const zigzag = Math.sin(i * 0.8) * 8; // Zigzag pattern
      statementCoverage = Math.max(0, Math.min(90, baseProgress + zigzag));
      functionCoverage = Math.max(0, Math.min(88, statementCoverage - 2 + Math.sin(i * 0.6) * 5));
      branchCoverage = Math.max(0, Math.min(85, statementCoverage - 5 + Math.sin(i * 1.2) * 6));
    } else {
      // Last 2 months: maintain 90-95% range with gradual changes
      const baseLevel = 92;
      const variation = Math.sin((i - 8) * 0.3) * 3 + Math.sin((i - 8) * 0.1) * 2;
      statementCoverage = Math.max(88, Math.min(96, baseLevel + variation));
      functionCoverage = Math.max(
        86,
        Math.min(94, statementCoverage - 2 + Math.sin((i - 8) * 0.4) * 2)
      );
      branchCoverage = Math.max(
        84,
        Math.min(92, statementCoverage - 4 + Math.sin((i - 8) * 0.6) * 3)
      );
    }

    data.push({
      id: i + 1,
      owner_id: 1,
      owner_name: "demo-user",
      repo_id: 1,
      repo_name: "demo-repo",
      branch_name: i % 6 === 0 ? "feature/improve-tests" : "main",
      statement_coverage: Math.round(statementCoverage * 100) / 100,
      line_coverage: Math.round(statementCoverage * 100) / 100,
      function_coverage: Math.round(functionCoverage * 100) / 100,
      branch_coverage: Math.round(branchCoverage * 100) / 100,
      primary_language: "TypeScript",
      created_at: date.toISOString(),
      created_by: "demo-system",
    });
  }

  return data;
}
