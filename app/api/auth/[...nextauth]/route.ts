// Third party
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { sign } from "jsonwebtoken";
import { config, isPrd } from "@/config";

// Local imports
import { slackUs } from "@/app/actions/slack/slack-us";
import { getUser } from "@/app/actions/supabase/users/get-user";
import { upsertUser } from "@/app/actions/supabase/users/upsert-user";

const handler = NextAuth({
  // https://next-auth.js.org/providers/github
  // OAuth App (Dev): https://github.com/organizations/gitautoai/settings/applications/2952819
  // OAuth App (Prd): https://github.com/organizations/gitautoai/settings/applications/2517210
  providers: [
    GithubProvider({
      clientId: config.GITHUB_CLIENT_ID as string,
      clientSecret: config.GITHUB_CLIENT_SECRET as string,
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
        const userName = user.name || "Unknown User";
        const userEmail = user.email || null;

        // Check if user already exists using server action
        const userResult = await getUser(userId);
        const isNewUser = !userResult.exists;

        // Upsert user in Supabase
        const result = await upsertUser(userId, userName, userEmail);
        if (!result.success) console.error("Failed to upsert user:", result.message);

        // Send Slack notification with correct user status
        const slackMessage = `${isNewUser ? "🎉 New user" : "👋 Returning user"} signed in: ${userName} ${userEmail ? `(${userEmail})` : ""}`;
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
  debug: isPrd, // https://next-auth.js.org/warnings#debug_enabled
  secret: config.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
