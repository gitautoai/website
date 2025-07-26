import { Resend } from "resend";
import { RESEND_API_KEY } from "@/config/resend";

// Use a dummy key for testing environments if RESEND_API_KEY is not provided
const apiKey = RESEND_API_KEY || "re_dummy_key_for_testing";

// Initialize Resend with the API key (dummy key for testing)
export const resend = new Resend(apiKey);

