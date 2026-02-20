import { Resend } from "resend";
import { RESEND_API_KEY } from "@/config/resend";

export const resend = new Resend(RESEND_API_KEY);
