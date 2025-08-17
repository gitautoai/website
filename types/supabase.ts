export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      circleci_tokens: {
        Row: {
          created_at: string
          created_by: string
          id: string
          owner_id: number
          token: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          owner_id: number
          token: string
          updated_at?: string
          updated_by: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          owner_id?: number
          token?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          additional_info: string | null
          company_url: string
          created_at: string | null
          current_coverage: string
          current_coverage_other: string | null
          email: string
          first_name: string
          id: number
          job_description: string
          job_title: string
          last_name: string
          minimum_coverage: string
          minimum_coverage_other: string | null
          target_coverage: string
          target_coverage_other: string | null
          team_size: string
          team_size_other: string | null
          testing_challenges: string | null
          updated_at: string | null
          user_id: number | null
          user_name: string | null
        }
        Insert: {
          additional_info?: string | null
          company_url: string
          created_at?: string | null
          current_coverage: string
          current_coverage_other?: string | null
          email: string
          first_name: string
          id?: number
          job_description: string
          job_title: string
          last_name: string
          minimum_coverage: string
          minimum_coverage_other?: string | null
          target_coverage: string
          target_coverage_other?: string | null
          team_size: string
          team_size_other?: string | null
          testing_challenges?: string | null
          updated_at?: string | null
          user_id?: number | null
          user_name?: string | null
        }
        Update: {
          additional_info?: string | null
          company_url?: string
          created_at?: string | null
          current_coverage?: string
          current_coverage_other?: string | null
          email?: string
          first_name?: string
          id?: number
          job_description?: string
          job_title?: string
          last_name?: string
          minimum_coverage?: string
          minimum_coverage_other?: string | null
          target_coverage?: string
          target_coverage_other?: string | null
          team_size?: string
          team_size_other?: string | null
          testing_challenges?: string | null
          updated_at?: string | null
          user_id?: number | null
          user_name?: string | null
        }
        Relationships: []
      }
      coverages: {
        Row: {
          branch_coverage: number | null
          branch_name: string
          created_at: string
          created_by: string
          file_size: number | null
          full_path: string
          function_coverage: number | null
          github_issue_url: string | null
          id: number
          is_excluded_from_testing: boolean | null
          level: string
          line_coverage: number | null
          owner_id: number
          package_name: string | null
          path_coverage: number | null
          primary_language: string | null
          repo_id: number
          statement_coverage: number | null
          uncovered_branches: string | null
          uncovered_functions: string | null
          uncovered_lines: string | null
          updated_at: string
          updated_by: string
        }
        Insert: {
          branch_coverage?: number | null
          branch_name?: string
          created_at?: string
          created_by: string
          file_size?: number | null
          full_path: string
          function_coverage?: number | null
          github_issue_url?: string | null
          id?: number
          is_excluded_from_testing?: boolean | null
          level: string
          line_coverage?: number | null
          owner_id: number
          package_name?: string | null
          path_coverage?: number | null
          primary_language?: string | null
          repo_id: number
          statement_coverage?: number | null
          uncovered_branches?: string | null
          uncovered_functions?: string | null
          uncovered_lines?: string | null
          updated_at?: string
          updated_by: string
        }
        Update: {
          branch_coverage?: number | null
          branch_name?: string
          created_at?: string
          created_by?: string
          file_size?: number | null
          full_path?: string
          function_coverage?: number | null
          github_issue_url?: string | null
          id?: number
          is_excluded_from_testing?: boolean | null
          level?: string
          line_coverage?: number | null
          owner_id?: number
          package_name?: string | null
          path_coverage?: number | null
          primary_language?: string | null
          repo_id?: number
          statement_coverage?: number | null
          uncovered_branches?: string | null
          uncovered_functions?: string | null
          uncovered_lines?: string | null
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "coverages_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["owner_id"]
          },
        ]
      }
      credits: {
        Row: {
          amount_usd: number
          created_at: string
          expires_at: string | null
          id: number
          owner_id: number
          stripe_payment_intent_id: string | null
          transaction_type: string
          usage_id: number | null
        }
        Insert: {
          amount_usd: number
          created_at?: string
          expires_at?: string | null
          id?: number
          owner_id: number
          stripe_payment_intent_id?: string | null
          transaction_type: string
          usage_id?: number | null
        }
        Update: {
          amount_usd?: number
          created_at?: string
          expires_at?: string | null
          id?: number
          owner_id?: number
          stripe_payment_intent_id?: string | null
          transaction_type?: string
          usage_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "credits_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["owner_id"]
          },
          {
            foreignKeyName: "credits_usage_id_fkey"
            columns: ["usage_id"]
            isOneToOne: false
            referencedRelation: "usage"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_usage_id_fkey"
            columns: ["usage_id"]
            isOneToOne: false
            referencedRelation: "usage_with_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      installations: {
        Row: {
          created_at: string
          created_by: string | null
          installation_id: number
          owner_id: number
          owner_name: string
          owner_type: string
          uninstalled_at: string | null
          uninstalled_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          installation_id: number
          owner_id?: number
          owner_name: string
          owner_type?: string
          uninstalled_at?: string | null
          uninstalled_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          installation_id?: number
          owner_id?: number
          owner_name?: string
          owner_type?: string
          uninstalled_at?: string | null
          uninstalled_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_owners_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["owner_id"]
          },
        ]
      }
      issues: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          installation_id: number
          issue_number: number
          merged: boolean
          owner_id: number
          owner_name: string
          owner_type: string
          repo_id: number
          repo_name: string
          run_id: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          installation_id: number
          issue_number?: number
          merged?: boolean
          owner_id?: number
          owner_name?: string
          owner_type?: string
          repo_id?: number
          repo_name?: string
          run_id?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          installation_id?: number
          issue_number?: number
          merged?: boolean
          owner_id?: number
          owner_name?: string
          owner_type?: string
          repo_id?: number
          repo_name?: string
          run_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_issues_installation_id_fkey"
            columns: ["installation_id"]
            isOneToOne: false
            referencedRelation: "installations"
            referencedColumns: ["installation_id"]
          },
        ]
      }
      jira_github_links: {
        Row: {
          created_at: string | null
          created_by: number
          github_owner_id: number
          github_owner_name: string
          github_repo_id: number
          github_repo_name: string
          id: number
          jira_project_id: number
          jira_project_name: string
          jira_site_id: string
          jira_site_name: string
          updated_at: string | null
          updated_by: number | null
        }
        Insert: {
          created_at?: string | null
          created_by: number
          github_owner_id: number
          github_owner_name: string
          github_repo_id: number
          github_repo_name: string
          id?: number
          jira_project_id: number
          jira_project_name: string
          jira_site_id: string
          jira_site_name: string
          updated_at?: string | null
          updated_by?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: number
          github_owner_id?: number
          github_owner_name?: string
          github_repo_id?: number
          github_repo_name?: string
          id?: number
          jira_project_id?: number
          jira_project_name?: string
          jira_site_id?: string
          jira_site_name?: string
          updated_at?: string | null
          updated_by?: number | null
        }
        Relationships: []
      }
      oauth_tokens: {
        Row: {
          access_token: string
          created_at: string
          created_by: number
          expires_at: string
          id: number
          refresh_token: string | null
          scope: string
          service_name: string
          updated_at: string
          updated_by: number | null
          user_id: number
        }
        Insert: {
          access_token: string
          created_at?: string
          created_by: number
          expires_at: string
          id?: number
          refresh_token?: string | null
          scope: string
          service_name: string
          updated_at?: string
          updated_by?: number | null
          user_id: number
        }
        Update: {
          access_token?: string
          created_at?: string
          created_by?: number
          expires_at?: string
          id?: number
          refresh_token?: string | null
          scope?: string
          service_name?: string
          updated_at?: string
          updated_by?: number | null
          user_id?: number
        }
        Relationships: []
      }
      owners: {
        Row: {
          auto_reload_enabled: boolean
          auto_reload_target_usd: number
          auto_reload_threshold_usd: number
          created_at: string
          created_by: string | null
          credit_balance_usd: number
          max_spending_limit_usd: number | null
          org_rules: string
          owner_id: number
          owner_name: string
          owner_type: string
          stripe_customer_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          auto_reload_enabled?: boolean
          auto_reload_target_usd?: number
          auto_reload_threshold_usd?: number
          created_at?: string
          created_by?: string | null
          credit_balance_usd?: number
          max_spending_limit_usd?: number | null
          org_rules?: string
          owner_id: number
          owner_name?: string
          owner_type?: string
          stripe_customer_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          auto_reload_enabled?: boolean
          auto_reload_target_usd?: number
          auto_reload_threshold_usd?: number
          created_at?: string
          created_by?: string | null
          credit_balance_usd?: number
          max_spending_limit_usd?: number | null
          org_rules?: string
          owner_id?: number
          owner_name?: string
          owner_type?: string
          stripe_customer_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      repo_coverage: {
        Row: {
          branch_coverage: number
          branch_name: string
          created_at: string
          created_by: string
          function_coverage: number
          id: number
          line_coverage: number
          owner_id: number
          owner_name: string
          primary_language: string | null
          repo_id: number
          repo_name: string
          statement_coverage: number
        }
        Insert: {
          branch_coverage?: number
          branch_name: string
          created_at?: string
          created_by: string
          function_coverage?: number
          id?: number
          line_coverage?: number
          owner_id: number
          owner_name: string
          primary_language?: string | null
          repo_id: number
          repo_name: string
          statement_coverage?: number
        }
        Update: {
          branch_coverage?: number
          branch_name?: string
          created_at?: string
          created_by?: string
          function_coverage?: number
          id?: number
          line_coverage?: number
          owner_id?: number
          owner_name?: string
          primary_language?: string | null
          repo_id?: number
          repo_name?: string
          statement_coverage?: number
        }
        Relationships: []
      }
      repositories: {
        Row: {
          blank_lines: number
          code_lines: number
          comment_lines: number
          created_at: string
          created_by: string
          file_count: number
          file_paths: string[] | null
          id: number
          local_port: number | null
          owner_id: number
          production_url: string | null
          repo_id: number
          repo_name: string
          repo_rules: string | null
          schedule_day_of_week: string | null
          schedule_execution_count: number
          schedule_frequency: string | null
          schedule_include_weekends: boolean
          schedule_interval_minutes: number
          schedule_minute: number | null
          schedule_time: string | null
          startup_commands: string[] | null
          structured_rules: Json | null
          target_branch: string
          trigger_on_commit: boolean
          trigger_on_merged: boolean
          trigger_on_pr_change: boolean
          trigger_on_review_comment: boolean
          trigger_on_schedule: boolean
          trigger_on_test_failure: boolean
          updated_at: string
          updated_by: string
          use_screenshots: boolean | null
          web_urls: string[] | null
        }
        Insert: {
          blank_lines?: number
          code_lines?: number
          comment_lines?: number
          created_at?: string
          created_by: string
          file_count?: number
          file_paths?: string[] | null
          id?: number
          local_port?: number | null
          owner_id: number
          production_url?: string | null
          repo_id: number
          repo_name: string
          repo_rules?: string | null
          schedule_day_of_week?: string | null
          schedule_execution_count?: number
          schedule_frequency?: string | null
          schedule_include_weekends?: boolean
          schedule_interval_minutes?: number
          schedule_minute?: number | null
          schedule_time?: string | null
          startup_commands?: string[] | null
          structured_rules?: Json | null
          target_branch?: string
          trigger_on_commit?: boolean
          trigger_on_merged?: boolean
          trigger_on_pr_change?: boolean
          trigger_on_review_comment?: boolean
          trigger_on_schedule?: boolean
          trigger_on_test_failure?: boolean
          updated_at?: string
          updated_by: string
          use_screenshots?: boolean | null
          web_urls?: string[] | null
        }
        Update: {
          blank_lines?: number
          code_lines?: number
          comment_lines?: number
          created_at?: string
          created_by?: string
          file_count?: number
          file_paths?: string[] | null
          id?: number
          local_port?: number | null
          owner_id?: number
          production_url?: string | null
          repo_id?: number
          repo_name?: string
          repo_rules?: string | null
          schedule_day_of_week?: string | null
          schedule_execution_count?: number
          schedule_frequency?: string | null
          schedule_include_weekends?: boolean
          schedule_interval_minutes?: number
          schedule_minute?: number | null
          schedule_time?: string | null
          startup_commands?: string[] | null
          structured_rules?: Json | null
          target_branch?: string
          trigger_on_commit?: boolean
          trigger_on_merged?: boolean
          trigger_on_pr_change?: boolean
          trigger_on_review_comment?: boolean
          trigger_on_schedule?: boolean
          trigger_on_test_failure?: boolean
          updated_at?: string
          updated_by?: string
          use_screenshots?: boolean | null
          web_urls?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "repositories_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "owners"
            referencedColumns: ["owner_id"]
          },
        ]
      }
      usage: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          installation_id: number
          is_completed: boolean
          is_merged: boolean
          is_test_passed: boolean
          issue_number: number
          owner_id: number
          owner_name: string
          owner_type: string
          pr_number: number | null
          repo_id: number
          repo_name: string
          retry_workflow_id_hash_pairs: string[] | null
          source: string
          token_input: number | null
          token_output: number | null
          total_seconds: number | null
          trigger: string
          user_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          installation_id: number
          is_completed?: boolean
          is_merged?: boolean
          is_test_passed?: boolean
          issue_number?: number
          owner_id?: number
          owner_name?: string
          owner_type?: string
          pr_number?: number | null
          repo_id?: number
          repo_name?: string
          retry_workflow_id_hash_pairs?: string[] | null
          source?: string
          token_input?: number | null
          token_output?: number | null
          total_seconds?: number | null
          trigger?: string
          user_id: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          installation_id?: number
          is_completed?: boolean
          is_merged?: boolean
          is_test_passed?: boolean
          issue_number?: number
          owner_id?: number
          owner_name?: string
          owner_type?: string
          pr_number?: number | null
          repo_id?: number
          repo_name?: string
          retry_workflow_id_hash_pairs?: string[] | null
          source?: string
          token_input?: number | null
          token_output?: number | null
          total_seconds?: number | null
          trigger?: string
          user_id?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          created_by: string | null
          email: string | null
          id: number
          user_id: number
          user_name: string
          user_rules: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: number
          user_id: number
          user_name: string
          user_rules?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: number
          user_id?: number
          user_name?: string
          user_rules?: string
        }
        Relationships: []
      }
    }
    Views: {
      usage_with_issues: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number | null
          installation_id: number | null
          is_completed: boolean | null
          issue_number: number | null
          merged: boolean | null
          owner_id: number | null
          owner_name: string | null
          owner_type: string | null
          repo_id: number | null
          repo_name: string | null
          source: string | null
          token_input: number | null
          token_output: number | null
          total_seconds: number | null
          user_id: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
