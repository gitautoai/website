export interface HistoricalStats {
  total_issues: number;
  total_prs: number;
  total_merges: number;
}

export interface LivePRStats {
  total_open_prs: number;
  total_passing_prs: number;
}

export interface PullRequestStats extends HistoricalStats, LivePRStats {}

export interface UsageStats {
  all_time: PullRequestStats;
  this_month: PullRequestStats;
}
