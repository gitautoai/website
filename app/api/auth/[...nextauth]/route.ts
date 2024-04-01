import prisma from "@/lib/client";

// Third party
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { sign } from "jsonwebtoken";

import { REDIRECT_GITHUB_APP_URL } from "@/lib/constants";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      try {
        const isAlreadyUser: any[] = await prisma.user.findMany({
          where: {
            user_id: Number(user.id),
          },
        });
        if (isAlreadyUser.length === 0) {
          return REDIRECT_GITHUB_APP_URL;
        }
        return true;
      } catch (err) {
        console.error(err);
      }
      return false;
    },
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
        token.jwtToken = sign(user, process.env.JWT_SECRET as string, {
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
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
