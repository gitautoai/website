// Third party
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { sign } from "jsonwebtoken";
import { config, isPrd } from "@/config";
import { fetchWithTiming } from "@/utils/fetch";

type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
};

const handler = NextAuth({
  // https://next-auth.js.org/providers/github
  providers: [
    GithubProvider({
      clientId: config.GITHUB_CLIENT_ID as string,
      clientSecret: config.GITHUB_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "read:user user:email read:org repo",
          access_type: "offline",
        },
      },
    }),
  ],
  callbacks: {
    // https://next-auth.js.org/configuration/callbacks#jwt-callback
    async jwt({ token, account, user }) {
      if (account && user) {
        // First time sign in
        console.log("Account in NextAuth: ", account);
        token.jwtToken = sign(user, config.JWT_SECRET as string, {
          algorithm: "HS256",
          expiresIn: "100d",
        });
        token.user_id = account.providerAccountId;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }

      // Token refresh check on subsequent requests
      const now = Math.floor(Date.now() / 1000);
      if (typeof token.expiresAt === "number" && now > token.expiresAt - 300) {
        // https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/refreshing-user-access-tokens#refreshing-a-user-access-token-with-a-refresh-token
        const tokens = await fetchWithTiming<TokenResponse>(
          "https://github.com/login/oauth/access_token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              client_id: config.GITHUB_CLIENT_ID,
              client_secret: config.GITHUB_CLIENT_SECRET,
              grant_type: "refresh_token",
              refresh_token: token.refreshToken,
            }),
          }
        );
        console.log("Tokens: ", tokens);

        return {
          ...token,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token ?? token.refreshToken,
        };
      }

      return token;
    },
    // https://next-auth.js.org/configuration/callbacks#session-callback
    async session({ session, token }) {
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
