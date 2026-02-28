export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      check_suites: {
        Row: {
          check_suite_id: number;
          created_at: string | null;
        };
        Insert: {
          check_suite_id: number;
          created_at?: string | null;
        };
        Update: {
          check_suite_id?: number;
          created_at?: string | null;
        };
        Relationships: [];
      };
      circleci_tokens: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          owner_id: number;
          token: string;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: string;
          owner_id: number;
          token: string;
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          owner_id?: number;
          token?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [];
      };
      codecov_tokens: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          owner_id: number;
          token: string;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: string;
          owner_id: number;
          token: string;
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          owner_id?: number;
          token?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "codecov_tokens_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: true;
            referencedRelation: "owners";
            referencedColumns: ["owner_id"];
          },
        ];
      };
      contacts: {
        Row: {
          additional_info: string | null;
          company_url: string;
          created_at: string | null;
          current_coverage: string;
          current_coverage_other: string | null;
          email: string;
          first_name: string;
          id: number;
          job_description: string;
          job_title: string;
          last_name: string;
          minimum_coverage: string;
          minimum_coverage_other: string | null;
          target_coverage: string;
          target_coverage_other: string | null;
          team_size: string;
          team_size_other: string | null;
          testing_challenges: string | null;
          updated_at: string | null;
          user_id: number | null;
          user_name: string | null;
        };
        Insert: {
          additional_info?: string | null;
          company_url: string;
          created_at?: string | null;
          current_coverage: string;
          current_coverage_other?: string | null;
          email: string;
          first_name: string;
          id?: number;
          job_description: string;
          job_title: string;
          last_name: string;
          minimum_coverage: string;
          minimum_coverage_other?: string | null;
          target_coverage: string;
          target_coverage_other?: string | null;
          team_size: string;
          team_size_other?: string | null;
          testing_challenges?: string | null;
          updated_at?: string | null;
          user_id?: number | null;
          user_name?: string | null;
        };
        Update: {
          additional_info?: string | null;
          company_url?: string;
          created_at?: string | null;
          current_coverage?: string;
          current_coverage_other?: string | null;
          email?: string;
          first_name?: string;
          id?: number;
          job_description?: string;
          job_title?: string;
          last_name?: string;
          minimum_coverage?: string;
          minimum_coverage_other?: string | null;
          target_coverage?: string;
          target_coverage_other?: string | null;
          team_size?: string;
          team_size_other?: string | null;
          testing_challenges?: string | null;
          updated_at?: string | null;
          user_id?: number | null;
          user_name?: string | null;
        };
        Relationships: [];
      };
      coverages: {
        Row: {
          branch_coverage: number | null;
          branch_name: string;
          created_at: string;
          created_by: string;
          exclusion_reason: string | null;
          file_size: number | null;
          full_path: string;
          function_coverage: number | null;
          github_issue_url: string | null;
          id: number;
          is_excluded_from_testing: boolean | null;
          language: string | null;
          level: string;
          line_coverage: number | null;
          owner_id: number;
          package_name: string | null;
          repo_id: number;
          statement_coverage: number | null;
          uncovered_branches: string | null;
          uncovered_functions: string | null;
          uncovered_lines: string | null;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          branch_coverage?: number | null;
          branch_name?: string;
          created_at?: string;
          created_by: string;
          exclusion_reason?: string | null;
          file_size?: number | null;
          full_path: string;
          function_coverage?: number | null;
          github_issue_url?: string | null;
          id?: number;
          is_excluded_from_testing?: boolean | null;
          language?: string | null;
          level: string;
          line_coverage?: number | null;
          owner_id: number;
          package_name?: string | null;
          repo_id: number;
          statement_coverage?: number | null;
          uncovered_branches?: string | null;
          uncovered_functions?: string | null;
          uncovered_lines?: string | null;
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          branch_coverage?: number | null;
          branch_name?: string;
          created_at?: string;
          created_by?: string;
          exclusion_reason?: string | null;
          file_size?: number | null;
          full_path?: string;
          function_coverage?: number | null;
          github_issue_url?: string | null;
          id?: number;
          is_excluded_from_testing?: boolean | null;
          language?: string | null;
          level?: string;
          line_coverage?: number | null;
          owner_id?: number;
          package_name?: string | null;
          repo_id?: number;
          statement_coverage?: number | null;
          uncovered_branches?: string | null;
          uncovered_functions?: string | null;
          uncovered_lines?: string | null;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "coverages_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "owners";
            referencedColumns: ["owner_id"];
          },
        ];
      };
      credits: {
        Row: {
          amount_usd: number;
          created_at: string;
          expires_at: string | null;
          id: number;
          owner_id: number;
          stripe_payment_intent_id: string | null;
          transaction_type: Database["public"]["Enums"]["credit_transaction_type"];
          usage_id: number | null;
        };
        Insert: {
          amount_usd: number;
          created_at?: string;
          expires_at?: string | null;
          id?: number;
          owner_id: number;
          stripe_payment_intent_id?: string | null;
          transaction_type: Database["public"]["Enums"]["credit_transaction_type"];
          usage_id?: number | null;
        };
        Update: {
          amount_usd?: number;
          created_at?: string;
          expires_at?: string | null;
          id?: number;
          owner_id?: number;
          stripe_payment_intent_id?: string | null;
          transaction_type?: Database["public"]["Enums"]["credit_transaction_type"];
          usage_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "credits_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "owners";
            referencedColumns: ["owner_id"];
          },
          {
            foreignKeyName: "credits_usage_id_fkey";
            columns: ["usage_id"];
            isOneToOne: false;
            referencedRelation: "usage";
            referencedColumns: ["id"];
          },
        ];
      };
      email_sends: {
        Row: {
          created_at: string;
          email_type: string;
          id: number;
          owner_id: number;
          owner_name: string;
          replied_at: string | null;
          resend_email_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          email_type: string;
          id?: number;
          owner_id: number;
          owner_name: string;
          replied_at?: string | null;
          resend_email_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          email_type?: string;
          id?: number;
          owner_id?: number;
          owner_name?: string;
          replied_at?: string | null;
          resend_email_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      installations: {
        Row: {
          created_at: string;
          created_by: string | null;
          installation_id: number;
          owner_id: number;
          owner_name: string;
          owner_type: Database["public"]["Enums"]["owner_type_enum"];
          uninstalled_at: string | null;
          uninstalled_by: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          installation_id: number;
          owner_id?: number;
          owner_name: string;
          owner_type: Database["public"]["Enums"]["owner_type_enum"];
          uninstalled_at?: string | null;
          uninstalled_by?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          installation_id?: number;
          owner_id?: number;
          owner_name?: string;
          owner_type?: Database["public"]["Enums"]["owner_type_enum"];
          uninstalled_at?: string | null;
          uninstalled_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_owners_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "owners";
            referencedColumns: ["owner_id"];
          },
        ];
      };
      llm_requests: {
        Row: {
          created_at: string;
          created_by: string | null;
          error_message: string | null;
          id: number;
          input_content: string;
          input_cost_usd: number;
          input_length: number;
          input_tokens: number;
          model_id: string;
          output_content: string;
          output_cost_usd: number;
          output_length: number;
          output_tokens: number;
          provider: string;
          response_time_ms: number | null;
          total_cost_usd: number;
          updated_at: string;
          updated_by: string | null;
          usage_id: number | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          error_message?: string | null;
          id?: number;
          input_content: string;
          input_cost_usd: number;
          input_length: number;
          input_tokens: number;
          model_id: string;
          output_content: string;
          output_cost_usd: number;
          output_length: number;
          output_tokens: number;
          provider: string;
          response_time_ms?: number | null;
          total_cost_usd: number;
          updated_at?: string;
          updated_by?: string | null;
          usage_id?: number | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          error_message?: string | null;
          id?: number;
          input_content?: string;
          input_cost_usd?: number;
          input_length?: number;
          input_tokens?: number;
          model_id?: string;
          output_content?: string;
          output_cost_usd?: number;
          output_length?: number;
          output_tokens?: number;
          provider?: string;
          response_time_ms?: number | null;
          total_cost_usd?: number;
          updated_at?: string;
          updated_by?: string | null;
          usage_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "llm_requests_usage_id_fkey";
            columns: ["usage_id"];
            isOneToOne: false;
            referencedRelation: "usage";
            referencedColumns: ["id"];
          },
        ];
      };
      marketing_coverage: {
        Row: {
          created_at: string;
          id: number;
          line_coverage: number | null;
          lines: number | null;
          owner_id: number;
          owner_name: string;
          repo_id: number;
          repo_name: string;
          source: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          line_coverage?: number | null;
          lines?: number | null;
          owner_id: number;
          owner_name: string;
          repo_id: number;
          repo_name: string;
          source: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          line_coverage?: number | null;
          lines?: number | null;
          owner_id?: number;
          owner_name?: string;
          repo_id?: number;
          repo_name?: string;
          source?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      marketing_search_history: {
        Row: {
          created_at: string;
          id: number;
          owner_id: number;
          owner_name: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          owner_id: number;
          owner_name: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          owner_id?: number;
          owner_name?: string;
        };
        Relationships: [];
      };
      marketing_users: {
        Row: {
          created_at: string;
          email: string;
          email_source: string;
          first_name: string | null;
          id: number;
          last_name: string | null;
          owner_id: number;
          owner_name: string;
          repo_id: number;
          repo_name: string;
          updated_at: string;
          user_id: number;
          username: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          email_source: string;
          first_name?: string | null;
          id?: number;
          last_name?: string | null;
          owner_id: number;
          owner_name: string;
          repo_id: number;
          repo_name: string;
          updated_at?: string;
          user_id: number;
          username: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          email_source?: string;
          first_name?: string | null;
          id?: number;
          last_name?: string | null;
          owner_id?: number;
          owner_name?: string;
          repo_id?: number;
          repo_name?: string;
          updated_at?: string;
          user_id?: number;
          username?: string;
        };
        Relationships: [];
      };
      npm_tokens: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          owner_id: number;
          token: string;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: string;
          owner_id: number;
          token: string;
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          owner_id?: number;
          token?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "npm_tokens_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: true;
            referencedRelation: "owners";
            referencedColumns: ["owner_id"];
          },
        ];
      };
      owners: {
        Row: {
          auto_reload_enabled: boolean;
          auto_reload_target_usd: number;
          auto_reload_threshold_usd: number;
          created_at: string;
          created_by: string | null;
          credit_balance_usd: number;
          max_spending_limit_usd: number | null;
          org_rules: string;
          owner_id: number;
          owner_name: string;
          owner_type: Database["public"]["Enums"]["owner_type_enum"];
          stripe_customer_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          auto_reload_enabled?: boolean;
          auto_reload_target_usd?: number;
          auto_reload_threshold_usd?: number;
          created_at?: string;
          created_by?: string | null;
          credit_balance_usd?: number;
          max_spending_limit_usd?: number | null;
          org_rules?: string;
          owner_id: number;
          owner_name?: string;
          owner_type: Database["public"]["Enums"]["owner_type_enum"];
          stripe_customer_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          auto_reload_enabled?: boolean;
          auto_reload_target_usd?: number;
          auto_reload_threshold_usd?: number;
          created_at?: string;
          created_by?: string | null;
          credit_balance_usd?: number;
          max_spending_limit_usd?: number | null;
          org_rules?: string;
          owner_id?: number;
          owner_name?: string;
          owner_type?: Database["public"]["Enums"]["owner_type_enum"];
          stripe_customer_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      repo_coverage: {
        Row: {
          branch_coverage: number | null;
          branch_name: string;
          branches_covered: number;
          branches_total: number;
          created_at: string;
          created_by: string;
          function_coverage: number | null;
          functions_covered: number;
          functions_total: number;
          id: number;
          language: string;
          line_coverage: number | null;
          lines_covered: number;
          lines_total: number;
          owner_id: number;
          owner_name: string;
          repo_id: number;
          repo_name: string;
          statement_coverage: number | null;
        };
        Insert: {
          branch_coverage?: number | null;
          branch_name: string;
          branches_covered?: number;
          branches_total?: number;
          created_at?: string;
          created_by: string;
          function_coverage?: number | null;
          functions_covered?: number;
          functions_total?: number;
          id?: number;
          language: string;
          line_coverage?: number | null;
          lines_covered?: number;
          lines_total?: number;
          owner_id: number;
          owner_name: string;
          repo_id: number;
          repo_name: string;
          statement_coverage?: number | null;
        };
        Update: {
          branch_coverage?: number | null;
          branch_name?: string;
          branches_covered?: number;
          branches_total?: number;
          created_at?: string;
          created_by?: string;
          function_coverage?: number | null;
          functions_covered?: number;
          functions_total?: number;
          id?: number;
          language?: string;
          line_coverage?: number | null;
          lines_covered?: number;
          lines_total?: number;
          owner_id?: number;
          owner_name?: string;
          repo_id?: number;
          repo_name?: string;
          statement_coverage?: number | null;
        };
        Relationships: [];
      };
      repositories: {
        Row: {
          blank_lines: number;
          code_lines: number;
          comment_lines: number;
          created_at: string;
          created_by: string;
          file_count: number;
          file_paths: string[] | null;
          id: number;
          local_port: number | null;
          owner_id: number;
          production_url: string | null;
          repo_id: number;
          repo_name: string;
          repo_rules: string | null;
          schedule_day_of_week: string | null;
          schedule_execution_count: number;
          schedule_frequency: string | null;
          schedule_include_weekends: boolean;
          schedule_interval_minutes: number;
          schedule_minute: number | null;
          schedule_time: string | null;
          startup_commands: string[] | null;
          structured_rules: Json | null;
          target_branch: string;
          test_dir_prefixes: string[];
          trigger_on_commit: boolean;
          trigger_on_merged: boolean;
          trigger_on_pr_change: boolean;
          trigger_on_review_comment: boolean;
          trigger_on_schedule: boolean;
          trigger_on_test_failure: boolean;
          updated_at: string;
          updated_by: string;
          use_screenshots: boolean | null;
          web_urls: string[] | null;
        };
        Insert: {
          blank_lines?: number;
          code_lines?: number;
          comment_lines?: number;
          created_at?: string;
          created_by: string;
          file_count?: number;
          file_paths?: string[] | null;
          id?: number;
          local_port?: number | null;
          owner_id: number;
          production_url?: string | null;
          repo_id: number;
          repo_name: string;
          repo_rules?: string | null;
          schedule_day_of_week?: string | null;
          schedule_execution_count?: number;
          schedule_frequency?: string | null;
          schedule_include_weekends?: boolean;
          schedule_interval_minutes?: number;
          schedule_minute?: number | null;
          schedule_time?: string | null;
          startup_commands?: string[] | null;
          structured_rules?: Json | null;
          target_branch?: string;
          test_dir_prefixes?: string[];
          trigger_on_commit?: boolean;
          trigger_on_merged?: boolean;
          trigger_on_pr_change?: boolean;
          trigger_on_review_comment?: boolean;
          trigger_on_schedule?: boolean;
          trigger_on_test_failure?: boolean;
          updated_at?: string;
          updated_by: string;
          use_screenshots?: boolean | null;
          web_urls?: string[] | null;
        };
        Update: {
          blank_lines?: number;
          code_lines?: number;
          comment_lines?: number;
          created_at?: string;
          created_by?: string;
          file_count?: number;
          file_paths?: string[] | null;
          id?: number;
          local_port?: number | null;
          owner_id?: number;
          production_url?: string | null;
          repo_id?: number;
          repo_name?: string;
          repo_rules?: string | null;
          schedule_day_of_week?: string | null;
          schedule_execution_count?: number;
          schedule_frequency?: string | null;
          schedule_include_weekends?: boolean;
          schedule_interval_minutes?: number;
          schedule_minute?: number | null;
          schedule_time?: string | null;
          startup_commands?: string[] | null;
          structured_rules?: Json | null;
          target_branch?: string;
          test_dir_prefixes?: string[];
          trigger_on_commit?: boolean;
          trigger_on_merged?: boolean;
          trigger_on_pr_change?: boolean;
          trigger_on_review_comment?: boolean;
          trigger_on_schedule?: boolean;
          trigger_on_test_failure?: boolean;
          updated_at?: string;
          updated_by?: string;
          use_screenshots?: boolean | null;
          web_urls?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "repositories_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "owners";
            referencedColumns: ["owner_id"];
          },
        ];
      };
      repository_features: {
        Row: {
          allow_edit_any_file: boolean;
          auto_merge: boolean;
          auto_merge_only_test_files: boolean;
          created_at: string;
          created_by: string;
          id: number;
          merge_method: string;
          owner_id: number;
          owner_name: string;
          repo_id: number;
          repo_name: string;
          restrict_edit_to_target_test_file_only: boolean;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          allow_edit_any_file?: boolean;
          auto_merge?: boolean;
          auto_merge_only_test_files?: boolean;
          created_at?: string;
          created_by: string;
          id?: number;
          merge_method?: string;
          owner_id: number;
          owner_name: string;
          repo_id: number;
          repo_name: string;
          restrict_edit_to_target_test_file_only?: boolean;
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          allow_edit_any_file?: boolean;
          auto_merge?: boolean;
          auto_merge_only_test_files?: boolean;
          created_at?: string;
          created_by?: string;
          id?: number;
          merge_method?: string;
          owner_id?: number;
          owner_name?: string;
          repo_id?: number;
          repo_name?: string;
          restrict_edit_to_target_test_file_only?: boolean;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "repository_features_owner_id_repo_id_fkey";
            columns: ["owner_id", "repo_id"];
            isOneToOne: true;
            referencedRelation: "repositories";
            referencedColumns: ["owner_id", "repo_id"];
          },
        ];
      };
      schedule_pauses: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          owner_id: number;
          pause_end: string;
          pause_start: string;
          reason: string | null;
          repo_id: number;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: string;
          owner_id: number;
          pause_end: string;
          pause_start: string;
          reason?: string | null;
          repo_id: number;
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          owner_id?: number;
          pause_end?: string;
          pause_start?: string;
          reason?: string | null;
          repo_id?: number;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "schedule_pauses_owner_id_repo_id_fkey";
            columns: ["owner_id", "repo_id"];
            isOneToOne: false;
            referencedRelation: "repositories";
            referencedColumns: ["owner_id", "repo_id"];
          },
        ];
      };
      usage: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: number;
          installation_id: number;
          is_completed: boolean;
          is_merged: boolean;
          is_test_passed: boolean;
          issue_number: number;
          lambda_log_group: string | null;
          lambda_log_stream: string | null;
          lambda_request_id: string | null;
          minimized_error_log: string | null;
          original_error_log: string | null;
          owner_id: number;
          owner_name: string;
          owner_type: Database["public"]["Enums"]["owner_type_enum"];
          pr_number: number | null;
          repo_id: number;
          repo_name: string;
          retry_workflow_id_hash_pairs: string[] | null;
          source: string;
          token_input: number | null;
          token_output: number | null;
          total_seconds: number | null;
          trigger: string;
          user_id: number;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: number;
          installation_id: number;
          is_completed?: boolean;
          is_merged?: boolean;
          is_test_passed?: boolean;
          issue_number?: number;
          lambda_log_group?: string | null;
          lambda_log_stream?: string | null;
          lambda_request_id?: string | null;
          minimized_error_log?: string | null;
          original_error_log?: string | null;
          owner_id?: number;
          owner_name?: string;
          owner_type: Database["public"]["Enums"]["owner_type_enum"];
          pr_number?: number | null;
          repo_id?: number;
          repo_name?: string;
          retry_workflow_id_hash_pairs?: string[] | null;
          source?: string;
          token_input?: number | null;
          token_output?: number | null;
          total_seconds?: number | null;
          trigger?: string;
          user_id: number;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: number;
          installation_id?: number;
          is_completed?: boolean;
          is_merged?: boolean;
          is_test_passed?: boolean;
          issue_number?: number;
          lambda_log_group?: string | null;
          lambda_log_stream?: string | null;
          lambda_request_id?: string | null;
          minimized_error_log?: string | null;
          original_error_log?: string | null;
          owner_id?: number;
          owner_name?: string;
          owner_type?: Database["public"]["Enums"]["owner_type_enum"];
          pr_number?: number | null;
          repo_id?: number;
          repo_name?: string;
          retry_workflow_id_hash_pairs?: string[] | null;
          source?: string;
          token_input?: number | null;
          token_output?: number | null;
          total_seconds?: number | null;
          trigger?: string;
          user_id?: number;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string;
          created_by: string | null;
          deleted_at: string | null;
          display_name: string;
          display_name_override: string | null;
          email: string | null;
          id: number;
          skip_drip_emails: boolean;
          user_id: number;
          user_name: string;
          user_rules: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          display_name?: string;
          display_name_override?: string | null;
          email?: string | null;
          id?: number;
          skip_drip_emails?: boolean;
          user_id: number;
          user_name: string;
          user_rules?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          deleted_at?: string | null;
          display_name?: string;
          display_name_override?: string | null;
          email?: string | null;
          id?: number;
          skip_drip_emails?: boolean;
          user_id?: number;
          user_name?: string;
          user_rules?: string;
        };
        Relationships: [];
      };
      webhook_deliveries: {
        Row: {
          created_at: string | null;
          delivery_id: string;
          event_name: string;
          id: number;
        };
        Insert: {
          created_at?: string | null;
          delivery_id: string;
          event_name: string;
          id?: number;
        };
        Update: {
          created_at?: string | null;
          delivery_id?: string;
          event_name?: string;
          id?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      total_repo_coverage: {
        Row: {
          branch_coverage: number | null;
          branches_covered: number | null;
          branches_total: number | null;
          coverage_date: string | null;
          function_coverage: number | null;
          functions_covered: number | null;
          functions_total: number | null;
          lines_covered: number | null;
          lines_total: number | null;
          owner_id: number | null;
          statement_coverage: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      credit_transaction_type:
        | "purchase"
        | "usage"
        | "expiration"
        | "refund"
        | "auto_reload"
        | "trial"
        | "grant"
        | "salvage";
      owner_type_enum: "User" | "Organization";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      credit_transaction_type: [
        "purchase",
        "usage",
        "expiration",
        "refund",
        "auto_reload",
        "trial",
        "grant",
        "salvage",
      ],
      owner_type_enum: ["User", "Organization"],
    },
  },
} as const;
