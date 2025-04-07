// Third party
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { sign } from "jsonwebtoken";
import { config, isPrd } from "@/config";
import { fetchWithTiming } from "@/utils/fetch";

type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
  token_type: string; // "Bearer"
};

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
      console.log("account in jwt callback", account);
      console.log("user in jwt callback", user);
      console.log("token in jwt callback", token);

      if (account && user) {
        // First time sign in
        token.jwtToken = sign(user, config.JWT_SECRET, { algorithm: "HS256", expiresIn: "100d" });
        token.user_id = account.providerAccountId;
        token.accessToken = account.access_token;
      }
      return token;
    },

    // Always runs AFTER jwt callback
    // https://next-auth.js.org/configuration/callbacks#session-callback
    async session({ session, token }) {
      console.log("session in session callback", session);
      console.log("token in session callback", token);
      try {
        session.jwtToken = token.jwtToken as string;
        session.accessToken = token.accessToken as string;
        session.user.userId = Number(token.user_id);
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
