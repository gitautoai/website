import { RELATIVE_URLS } from "@/config/urls";

const UTH = RELATIVE_URLS.DOCS.HOW_IT_WORKS;

interface NavItem {
  href: string;
  title: string;
  category: string;
}

// Ordered array of all How It Works pages for prev/next navigation
export const HOW_IT_WORKS_PAGES: NavItem[] = [
  // Context Enrichment
  {
    href: UTH.CONTEXT_ENRICHMENT.LINE_NUMBERS,
    title: "Line Numbers",
    category: "Context Enrichment",
  },
  {
    href: UTH.CONTEXT_ENRICHMENT.FULL_FILE_READS,
    title: "Full File Reads",
    category: "Context Enrichment",
  },
  {
    href: UTH.CONTEXT_ENRICHMENT.TEST_FILE_PRELOADING,
    title: "Test File Preloading",
    category: "Context Enrichment",
  },
  {
    href: UTH.CONTEXT_ENRICHMENT.TEST_NAMING_DETECTION,
    title: "Test Naming Detection",
    category: "Context Enrichment",
  },
  {
    href: UTH.CONTEXT_ENRICHMENT.ERROR_BASELINES,
    title: "Error Baselines",
    category: "Context Enrichment",
  },
  {
    href: UTH.CONTEXT_ENRICHMENT.CI_LOG_CLEANING,
    title: "CI Log Cleaning",
    category: "Context Enrichment",
  },
  {
    href: UTH.CONTEXT_ENRICHMENT.TRIGGER_SPECIFIC_PROMPTS,
    title: "Trigger-Specific Prompts",
    category: "Context Enrichment",
  },
  {
    href: UTH.CONTEXT_ENRICHMENT.CODING_STANDARDS,
    title: "Coding Standards",
    category: "Context Enrichment",
  },

  // Output Auto-Correction
  {
    href: UTH.OUTPUT_AUTO_CORRECTION.DIFF_HUNK_REPAIR,
    title: "Diff Hunk Repair",
    category: "Output Auto-Correction",
  },
  {
    href: UTH.OUTPUT_AUTO_CORRECTION.DIFF_PREFIX_REPAIR,
    title: "Diff Prefix Repair",
    category: "Output Auto-Correction",
  },
  {
    href: UTH.OUTPUT_AUTO_CORRECTION.TOOL_NAME_CORRECTION,
    title: "Tool Name Correction",
    category: "Output Auto-Correction",
  },
  {
    href: UTH.OUTPUT_AUTO_CORRECTION.TOOL_ARGUMENT_CORRECTION,
    title: "Tool Argument Correction",
    category: "Output Auto-Correction",
  },
  {
    href: UTH.OUTPUT_AUTO_CORRECTION.IMPORT_SORTING,
    title: "Import Sorting",
    category: "Output Auto-Correction",
  },
  {
    href: UTH.OUTPUT_AUTO_CORRECTION.TRAILING_SPACE_REMOVAL,
    title: "Trailing Space Removal",
    category: "Output Auto-Correction",
  },
  {
    href: UTH.OUTPUT_AUTO_CORRECTION.FINAL_NEWLINE,
    title: "Final Newline",
    category: "Output Auto-Correction",
  },
  {
    href: UTH.OUTPUT_AUTO_CORRECTION.LINE_ENDING_PRESERVATION,
    title: "Line Ending Preservation",
    category: "Output Auto-Correction",
  },
  {
    href: UTH.OUTPUT_AUTO_CORRECTION.SANITIZE_TOOL_ARGUMENTS,
    title: "Sanitize Tool Arguments",
    category: "Output Auto-Correction",
  },
  {
    href: UTH.OUTPUT_AUTO_CORRECTION.LINT_DISABLE_HEADERS,
    title: "Lint Disable Headers",
    category: "Output Auto-Correction",
  },

  // Quality Verification
  {
    href: UTH.QUALITY_VERIFICATION.FORMATTING,
    title: "Formatting",
    category: "Quality Verification",
  },
  { href: UTH.QUALITY_VERIFICATION.LINTING, title: "Linting", category: "Quality Verification" },
  {
    href: UTH.QUALITY_VERIFICATION.TYPE_CHECKING,
    title: "Type Checking",
    category: "Quality Verification",
  },
  {
    href: UTH.QUALITY_VERIFICATION.TEST_EXECUTION,
    title: "Test Execution",
    category: "Quality Verification",
  },
  {
    href: UTH.QUALITY_VERIFICATION.COVERAGE_ENFORCEMENT,
    title: "Coverage Enforcement",
    category: "Quality Verification",
  },
  {
    href: UTH.QUALITY_VERIFICATION.PHPUNIT_SUPPORT,
    title: "PHPUnit Support",
    category: "Quality Verification",
  },
  {
    href: UTH.QUALITY_VERIFICATION.PYTEST_SUPPORT,
    title: "pytest Support",
    category: "Quality Verification",
  },
  {
    href: UTH.QUALITY_VERIFICATION.SNAPSHOT_AUTO_UPDATE,
    title: "Snapshot Auto-Update",
    category: "Quality Verification",
  },
  {
    href: UTH.QUALITY_VERIFICATION.UNTESTABLE_DETECTION,
    title: "Untestable Detection",
    category: "Quality Verification",
  },
  {
    href: UTH.QUALITY_VERIFICATION.SHOULD_SKIP_DETECTION,
    title: "Should-Skip Detection",
    category: "Quality Verification",
  },
  {
    href: UTH.QUALITY_VERIFICATION.DEAD_CODE_REMOVAL,
    title: "Dead Code Removal",
    category: "Quality Verification",
  },
  {
    href: UTH.QUALITY_VERIFICATION.QUALITY_CHECK_SCORING,
    title: "Quality Check Scoring",
    category: "Quality Verification",
  },
  {
    href: UTH.QUALITY_VERIFICATION.QUALITY_CHECKLIST,
    title: "Quality Checklist",
    category: "Quality Verification",
  },

  // Safety Guardrails
  {
    href: UTH.SAFETY_GUARDRAILS.FILE_EDIT_RESTRICTIONS,
    title: "File Edit Restrictions",
    category: "Safety Guardrails",
  },
  {
    href: UTH.SAFETY_GUARDRAILS.TEMPERATURE_ZERO,
    title: "Temperature Zero",
    category: "Safety Guardrails",
  },
  {
    href: UTH.SAFETY_GUARDRAILS.PR_BRANCH_CHECKS,
    title: "PR/Branch Checks",
    category: "Safety Guardrails",
  },
  {
    href: UTH.SAFETY_GUARDRAILS.RACE_CONDITION_PREVENTION,
    title: "Race Condition Prevention",
    category: "Safety Guardrails",
  },
  {
    href: UTH.SAFETY_GUARDRAILS.BOT_LOOP_PREVENTION,
    title: "Bot Loop Prevention",
    category: "Safety Guardrails",
  },
  {
    href: UTH.SAFETY_GUARDRAILS.WEBHOOK_DEDUPLICATION,
    title: "Webhook Deduplication",
    category: "Safety Guardrails",
  },
  {
    href: UTH.SAFETY_GUARDRAILS.DUPLICATE_ERROR_HASHING,
    title: "Duplicate Error Hashing",
    category: "Safety Guardrails",
  },
  {
    href: UTH.SAFETY_GUARDRAILS.INFRASTRUCTURE_FAILURE_DETECTION,
    title: "Infrastructure Failure Detection",
    category: "Safety Guardrails",
  },
  {
    href: UTH.SAFETY_GUARDRAILS.STRICT_TOOL_SCHEMAS,
    title: "Strict Tool Schemas",
    category: "Safety Guardrails",
  },
  {
    href: UTH.SAFETY_GUARDRAILS.NO_CHANGE_DETECTION,
    title: "No-Change Detection",
    category: "Safety Guardrails",
  },

  // Token/Cost Management
  {
    href: UTH.TOKEN_COST_MANAGEMENT.TOKEN_TRIMMING,
    title: "Token Trimming",
    category: "Token/Cost Management",
  },
  {
    href: UTH.TOKEN_COST_MANAGEMENT.OUTDATED_DIFF_REMOVAL,
    title: "Outdated Diff Removal",
    category: "Token/Cost Management",
  },
  {
    href: UTH.TOKEN_COST_MANAGEMENT.STALE_FILE_REPLACEMENT,
    title: "Stale File Replacement",
    category: "Token/Cost Management",
  },
  {
    href: UTH.TOKEN_COST_MANAGEMENT.SKIP_CI_INTERMEDIATE,
    title: "Skip CI Intermediate",
    category: "Token/Cost Management",
  },
  {
    href: UTH.TOKEN_COST_MANAGEMENT.CI_LOG_DEDUP,
    title: "CI Log Deduplication",
    category: "Token/Cost Management",
  },
  {
    href: UTH.TOKEN_COST_MANAGEMENT.WEB_FETCH_SUMMARIZATION,
    title: "Web Fetch Summarization",
    category: "Token/Cost Management",
  },
  {
    href: UTH.TOKEN_COST_MANAGEMENT.CONTEXT_FORGETTING,
    title: "Context Forgetting",
    category: "Token/Cost Management",
  },
  {
    href: UTH.TOKEN_COST_MANAGEMENT.FILE_QUERY_ROUTING,
    title: "File Query Routing",
    category: "Token/Cost Management",
  },

  // Resilience & Recovery
  {
    href: UTH.RESILIENCE_RECOVERY.MODEL_FALLBACK,
    title: "Model Fallback",
    category: "Resilience & Recovery",
  },
  {
    href: UTH.RESILIENCE_RECOVERY.OVERLOAD_RETRY,
    title: "Overload Retry",
    category: "Resilience & Recovery",
  },
  {
    href: UTH.RESILIENCE_RECOVERY.FORCED_VERIFICATION,
    title: "Forced Verification",
    category: "Resilience & Recovery",
  },
  {
    href: UTH.RESILIENCE_RECOVERY.ERROR_FILES_EDITABLE,
    title: "Error Files Editable",
    category: "Resilience & Recovery",
  },

  // Hallucination Prevention
  {
    href: UTH.HALLUCINATION_PREVENTION.WEB_SEARCH,
    title: "Web Search",
    category: "Hallucination Prevention",
  },
  {
    href: UTH.HALLUCINATION_PREVENTION.URL_FETCHING,
    title: "URL Fetching",
    category: "Hallucination Prevention",
  },
  {
    href: UTH.HALLUCINATION_PREVENTION.ANTI_HALLUCINATION_PROMPTS,
    title: "Anti-Hallucination Prompts",
    category: "Hallucination Prevention",
  },
  {
    href: UTH.HALLUCINATION_PREVENTION.GITAUTO_MD_RESTRICTIONS,
    title: "GITAUTO.md Restrictions",
    category: "Hallucination Prevention",
  },
  {
    href: UTH.HALLUCINATION_PREVENTION.REVIEW_RESPONSE_GUARDRAILS,
    title: "Review Response Guardrails",
    category: "Hallucination Prevention",
  },
];

export const getNavigation = (currentHref: string) => {
  const index = HOW_IT_WORKS_PAGES.findIndex((p) => p.href === currentHref);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? HOW_IT_WORKS_PAGES[index - 1] : undefined,
    next: index < HOW_IT_WORKS_PAGES.length - 1 ? HOW_IT_WORKS_PAGES[index + 1] : undefined,
  };
};
