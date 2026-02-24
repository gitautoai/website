// Third party
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { sign } from "jsonwebtoken";

// Local imports
import { config, PRODUCT_NAME } from "@/config";
import { generateRandomDelay } from "@/utils/generate-random-delay";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "@/config/github";
import { getUserPrimaryEmail } from "@/app/actions/github/get-user-emails";
import { sendAndRecord } from "@/app/actions/cron/drip-emails/send-and-record";
import { generateWelcomeEmail } from "@/app/actions/resend/templates/generate-welcome-email";
import { slackUs } from "@/app/actions/slack/slack-us";
import { getUser } from "@/app/actions/supabase/users/get-user";
import { upsertUser } from "@/app/actions/supabase/users/upsert-user";

import { normalizeDisplayName } from "@/utils/normalize-display-name";
import { parseName } from "@/utils/parse-name";

const handler = NextAuth({
  // https://next-auth.js.org/providers/github
  // OAuth App (Dev): https://github.com/organizations/gitautoai/settings/applications/2952819
  // OAuth App (Prd): https://github.com/organizations/gitautoai/settings/applications/2517210
  providers: [
    GithubProvider({
      clientId: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email read:org repo",
        },
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          login: profile.login,
        };
      },
    }),
  ],
  callbacks: {
    // JWT Callback triggers on:
    // 1. Initial sign in (account & user params available)
    // 2. Every page load using getServerSession()
    // 3. Every client render using useSession()
    // 4. Every API call using getServerSession()
    // 5. Automatic session refresh attempts
    // For cases 2-5, only the token parameter is available
    // https://next-auth.js.org/configuration/callbacks#jwt-callback
    async jwt({ token, account, user }) {
      if (account && user) {
        // First time sign in
        const userId = Number(account.providerAccountId);
        token.user_id = userId;
        token.jwtToken = sign(user, config.JWT_SECRET, { algorithm: "HS256", expiresIn: "100d" });
        token.accessToken = account.access_token;
        token.login = user.login;

        // Upsert user in Supabase
        const userLogin = user.login || "";
        // Cross-ref: gitauto/services/github/users/get_user_public_email.py
        const displayName = normalizeDisplayName(user.name || "");
        // Fallback: if GitHub profile email is private, use the emails API (requires user:email scope)
        const userEmail =
          user.email ||
          (account.access_token ? await getUserPrimaryEmail(account.access_token) : null);

        // Check if user already exists using server action
        const existingUser = await getUser(userId);
        const isNewUser = !existingUser;
        const hadEmailBefore = existingUser?.email;

        // Upsert user in Supabase
        const result = await upsertUser(userId, userLogin, displayName, userEmail);
        if (!result.success) console.error("Failed to upsert user:", result.message);

        // Send welcome email if this is the first time we have their email
        if (!hadEmailBefore && userEmail) {
          const { firstName } = parseName(displayName || userLogin);
          const result = await sendAndRecord(
            userId,
            userLogin,
            "welcome",
            userEmail,
            `Welcome to ${PRODUCT_NAME}, ${firstName}!`,
            generateWelcomeEmail(firstName),
            // Welcome email: soon after sign-up but not instant (feels less automated)
            generateRandomDelay(30, 60),
          );

          if (!result.success) console.error("Failed to send welcome email for user:", userId);
        }

        // Send Slack notification with correct user status
        const slackMessage = `${isNewUser ? "🎉 New user" : "👋 Returning user"} signed in: ${displayName || userLogin} ${userEmail ? `(${userEmail})` : ""}`;
        const slackResult = await slackUs(slackMessage);
        if (!slackResult.success)
          console.error("Failed to send Slack notification:", slackResult.error);
      }

      return token;
    },

    // Always runs AFTER jwt callback
    // https://next-auth.js.org/configuration/callbacks#session-callback
    async session({ session, token }) {
      try {
        session.jwtToken = token.jwtToken as string;
        session.accessToken = token.accessToken as string;
        session.user.userId = Number(token.user_id);
        session.user.login = token.login as string;
      } catch (err) {
        console.error(err);
      }
      return session;
    },
  },
  debug: false, // https://next-auth.js.org/warnings#debug_enabled
  secret: config.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
