/**
 * Integration test: calls processDripEmails with real Supabase data for gitautoai.
 * Mocks shouldSkip (bypass) and sendAndRecord (send via Resend with [TEST] prefix).
 * Run manually: npx jest drip-send.integration --no-cache
 */
import { Resend } from "resend";

import { coverageThresholds } from "@/app/actions/cron/drip-emails/owner-coverage-schedule";
import { onboardingSchedule } from "@/app/actions/cron/drip-emails/onboarding-schedule";
import { generateWelcomeEmail } from "@/app/actions/resend/templates/generate-welcome-email";
import { parseName } from "@/utils/parse-name";
import { sleep } from "@/utils/sleep";
import { supabaseAdmin } from "@/lib/supabase/server";

const FROM = "Wes from GitAuto <wes@gitauto.ai>";
const OWNER_NAME = "gitautoai";
const OWNER_ID = 159883862;
const USER_ID = 4620828;

const describeIf = process.env.RESEND_API_KEY ? describe : describe.skip;

describeIf("drip email send integration", () => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  it("sends all email templates using real processDripEmails data", async () => {
    // Fetch user info (same query as process-onboarding.ts)
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("email, display_name, user_name")
      .eq("user_id", USER_ID)
      .single();
    const to = user!.email!;
    const { firstName } = parseName(user!.display_name || user!.user_name);

    const emails: { subject: string; text: string }[] = [];

    // Welcome
    emails.push({
      subject: `Welcome to GitAuto, ${firstName}!`,
      text: generateWelcomeEmail(firstName),
    });

    // Onboarding - call real schedule subject/body with a representative context
    // We need a context object for the schedule functions. Build one from real data.
    const { fetchAllDripData } = await import("@/app/actions/cron/drip-emails/fetch-batch-data");
    const { buildOwnerContext } =
      await import("@/app/actions/cron/drip-emails/build-owner-context");
    const { data } = await fetchAllDripData();
    const { buildContext } = buildOwnerContext(data);
    const ctx = buildContext(OWNER_ID, new Date().toISOString());

    for (const schedule of onboardingSchedule) {
      // Bypass shouldSkip - send every template
      emails.push({
        subject: schedule.subject(OWNER_NAME, firstName, ctx),
        text: schedule.body(OWNER_NAME, firstName, ctx),
      });
    }

    // Coverage thresholds
    for (const threshold of coverageThresholds) {
      emails.push({
        subject: threshold.subject(
          OWNER_NAME,
          threshold.pct,
          ctx.coverageRepoCount,
          ctx.repoMostNeedingCoverage,
        ),
        text: threshold.body(
          OWNER_NAME,
          firstName,
          threshold.pct,
          ctx.coverageRepoCount,
          ctx.repoMostNeedingCoverage,
        ),
      });
    }

    // Send sequentially with rate limit delay
    for (const { subject, text } of emails) {
      const { error } = await resend.emails.send({
        from: FROM,
        to: [to],
        subject: `[TEST] ${subject}`,
        text,
      });
      expect(error).toBeNull();
      await sleep(600);
    }
  }, 120_000);
});
