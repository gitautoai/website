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
          scope: "read:jira-work read:me",
        },
      },
    })
  ],
  callbacks: {
    async session({ session, token }) {
      try {
        if (token.provider === "github") {
          session.user.userId = Number(token.user_id);
          session.jwtToken = token.jwtToken as string;
        } else if (token.provider === "atlassian") {
          session.user.atlassianInfo = {
            accessToken: token.atlassian_access_token as string,
            userId: token.atlassian_user_id as string,
            jwtToken: token.jwtToken as string,
            expiresAt: token.exp as number,
            name: token.name as string,
            email: token.email as string,
            picture: token.picture as string
          }
        }
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
        token.provider = account.provider;
        if (account.provider === "atlassian") {
          token.atlassian_access_token = account.access_token;
          token.atlassian_user_id = account.providerAccountId;
          token.atlassian_cloud_id = account.cloudId;
        }
      }
      return token;
    },
  },
  debug: isPrd, // https://next-auth.js.org/warnings#debug_enabled
  secret: config.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
