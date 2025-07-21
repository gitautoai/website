export interface PullRequestStats {
  total_prs: number;
  user_prs: number;
  total_issues: number;
  user_issues: number;
  total_merges: number;
  user_merges: number;
}


export interface UsageStats {
  all_time: PullRequestStats;
  this_month: PullRequestStats;
}
