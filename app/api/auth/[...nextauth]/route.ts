// Third party
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import prisma from "@/lib/client";
import axios from "axios";
import { sign } from "jsonwebtoken";

const { GITHUB_ID = "", GITHUB_SECRET = "" } = process.env;
const handler = NextAuth({
  providers: [
    GithubProvider({
      // clientId: GITHUB_ID as string,
      // clientSecret: GITHUB_SECRET as string,
      clientId: "cbba3e5ff46520474dc2",
      clientSecret: "058876e0b27e7a03e46385a572f6c608ef777a0e",
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      try {
        console.log("signIn", user, profile);
        const isAlreadyUser = await prisma.users.findUnique({
          where: {
            user_id: Number(user.id),
          },
        });
        if (isAlreadyUser == undefined) {
          return "/get-started";
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
        session.jwt = token.jwt as string;
      } catch (err) {
        console.error(err);
      }
      return session;
    },
    async jwt({ token, account, user }) {
      if (user) {
        token.jwt = sign(user, process.env.JWT_SECRET as string, {
          expiresIn: "1h",
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
