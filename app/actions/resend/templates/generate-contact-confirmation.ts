import { PRODUCT_NAME } from "@/config";
import { Tables } from "@/types/supabase";

export function generateContactConfirmation(data: Tables<"contacts">): string {
  const sections = [
    `Hey ${data.first_name}!`,
    ``,
    `Got your message. Here's what you submitted:`,
    ``,
    `Name: ${data.first_name} ${data.last_name}`,
    `Company: ${data.company_url}`,
    `Job Title: ${data.job_title}`,
    `Team Size: ${data.team_size === "other" ? data.team_size_other : data.team_size}`,
    ``,
    `What you're working on:`,
    `${data.job_description}`,
    ``,
    `Coverage:`,
    `• Current: ${data.current_coverage === "other" ? data.current_coverage_other : data.current_coverage}`,
    `• Minimum: ${data.minimum_coverage === "other" ? data.minimum_coverage_other : data.minimum_coverage}`,
    `• Target: ${data.target_coverage === "other" ? data.target_coverage_other : data.target_coverage}`,
  ];

  if (data.testing_challenges) {
    sections.push(``, `Testing challenges:`, `${data.testing_challenges}`);
  }

  if (data.additional_info) {
    sections.push(``, `Additional info:`, `${data.additional_info}`);
  }

  sections.push(
    ``,
    `I read every message personally and I'll get back to you within 24 hours.`,
    ``,
    `Wes`,
    `Founder, ${PRODUCT_NAME}`
  );

  return sections.join("\n");
}
