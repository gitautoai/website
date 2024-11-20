// Third party
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import AtlassianProvider from "next-auth/providers/atlassian"; // Import Atlassian provider
import { sign } from "jsonwebtoken";
import { config, isPrd } from "@/config";

import { upsertAccount } from '@/utils/prisma_client';


const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: config.GITHUB_CLIENT_ID as string,
      clientSecret: config.GITHUB_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: 'user repo',
        },
      },
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
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        token.jwtToken = sign(user, config.JWT_SECRET as string, {
          algorithm: "HS256",
          expiresIn: "100d",
        });
      }
      console.log("");
      console.log("");
      console.log("");
      console.log("");
      console.log("");
      console.log("");
      console.log("");
      console.log("");
      console.log("account", account);
      console.log("user", user);
      console.log("token", token);
      if (account) {
        token.user_id = account.providerAccountId;
        if (account.provider === "github") {
          token.user = {
            userId: user.id,
            email: user.email,
            access_token: account.access_token,
            provider_type: account.type,
            provider_id: account.provider,
            provider_account_id: account.providerAccountId,
          }
        } else if (account.provider === "atlassian") {
          token.user = {
            userId: user.id,
            email: user.email,
            access_token: account.access_token,
            provider_type: account.type,
            provider_id: account.provider,
            provider_account_id: account.providerAccountId,
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      try {
        session.jwtToken = token.jwtToken as string;
        session.user = token.user as {
          userId: string;
          email: string;
          access_token: string;
          provider_type: string;
          provider_id: string;
          provider_account_id: string;
        };
        upsertAccount({
          user: session.user,
        })
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
