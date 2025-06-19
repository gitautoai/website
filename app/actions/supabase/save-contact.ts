"use server";

import { supabase } from "@/lib/supabase";
import { TablesInsert, Tables } from "@/types/supabase";

export async function saveContact(
  formData: FormData,
  userId: number | null,
  userName: string | null
) {
  try {
    // Save to database
    const insertData: TablesInsert<"contacts"> = {
      // User info (if available)
      user_id: userId,
      user_name: userName,

      // Basic info
      first_name: formData.get("firstName") as string,
      last_name: formData.get("lastName") as string,
      email: formData.get("email") as string,
      company_url: formData.get("companyUrl") as string,
      job_title: formData.get("jobTitle") as string,

      // Team info
      team_size: formData.get("teamSize") as string,
      team_size_other: (formData.get("teamSizeOther") as string) || null,
      job_description: formData.get("jobDescription") as string,

      // Coverage info - all three fields
      current_coverage: formData.get("currentCoverage") as string,
      current_coverage_other: (formData.get("currentCoverageOther") as string) || null,
      minimum_coverage: formData.get("minimumCoverage") as string,
      minimum_coverage_other: (formData.get("minimumCoverageOther") as string) || null,
      target_coverage: formData.get("targetCoverage") as string,
      target_coverage_other: (formData.get("targetCoverageOther") as string) || null,

      // Testing challenges
      testing_challenges: (formData.get("testingChallenges") as string) || null,
      additional_info: (formData.get("additionalInfo") as string) || null,
    };

    const { data, error } = await supabase.from("contacts").insert(insertData).select().single();

    if (error) throw error;

    return {
      success: true,
      message: "Contact saved successfully",
      data: data as Tables<"contacts">,
    };
  } catch (error) {
    console.error("Contact save error:", error);
    return { success: false, message: "Failed to save contact" };
  }
}
