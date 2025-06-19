import { Tables } from "@/types/supabase";

export function formatContactMessage(data: Tables<"contacts">): string {
  const sections = [
    `🚀 *New Contact Form Submission*`,
    ``,
    `*Name:* ${data.first_name} ${data.last_name}`,
    `*Email:* ${data.email}`,
    `*Company:* ${data.company_url}`,
    `*Job Title:* ${data.job_title}`,
    `*Team Size:* ${data.team_size === "other" ? data.team_size_other : data.team_size}`,
    ``,
    `*What they're working on:*`,
    `${data.job_description}`,

    // Coverage info
    `*Coverage Information:*`,
    `• Current: ${
      data.current_coverage === "other" ? data.current_coverage_other : data.current_coverage
    }`,
    `• Minimum: ${
      data.minimum_coverage === "other" ? data.minimum_coverage_other : data.minimum_coverage
    }`,
    `• Target: ${
      data.target_coverage === "other" ? data.target_coverage_other : data.target_coverage
    }`,
    ``,
  ];

  // Testing challenges
  if (data.testing_challenges) {
    sections.push(``, `*Testing Challenges:*`, `${data.testing_challenges}`);
  }

  // Additional info
  if (data.additional_info) {
    sections.push(``, `*Additional Information:*`, `${data.additional_info}`);
  }

  sections.push(``, `*Submitted at:* ${new Date().toLocaleString()}`);

  return sections.join("\n");
}
