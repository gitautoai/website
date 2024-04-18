import prisma from "@/lib/client";

// Third party
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { sign } from "jsonwebtoken";
import config from "@/config";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: config.GITHUB_CLIENT_ID as string,
      clientSecret: config.GITHUB_CLIENT_SECRET as string,
    }),
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
  debug: true,
  secret: config.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
