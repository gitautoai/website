import { DEFAULT_STRUCTURED_RULES } from "@/app/dashboard/rules/config/structured-rules";

export async function GET() {
  return Response.json(DEFAULT_STRUCTURED_RULES);
}
