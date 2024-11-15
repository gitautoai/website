// Third party
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import AtlassianProvider from "next-auth/providers/atlassian"; // Import Atlassian provider
import { sign } from "jsonwebtoken";
import { config, isPrd } from "@/config";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: config.GITHUB_CLIENT_ID as string,
      clientSecret: config.GITHUB_CLIENT_SECRET as string,
    }),
    AtlassianProvider({
      clientId: config.ATLASSIAN_CLIENT_ID as string,
      clientSecret: config.ATLASSIAN_CLIENT_SECRET as string,
      authorization: {
        params: {
          audience: "api.atlassian.com",
          scope: "write:jira-work read:jira-work read:jira-user offline_access read:me",
          prompt: "consent"
        },
      },
    })
  ],
  callbacks: {
    async session({ session, token }) {
      try {
        session.user.userId = Number(token.user_id);
        session.jwtToken = token.jwtToken as string;
      } catch (err) {
        console.error(err);
      }
      return session;
    },
    async jwt({ token, account, user }) {
      if (user) {
        token.jwtToken = sign(user, config.JWT_SECRET as string, {
          algorithm: "HS256",
          expiresIn: "100d",
        });
      }
      if (account) {
        token.user_id = account.providerAccountId;
      }
      return token;
    },
  },
  debug: isPrd, // https://next-auth.js.org/warnings#debug_enabled
  secret: config.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
