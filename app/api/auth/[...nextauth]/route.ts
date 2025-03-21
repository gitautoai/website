// Third party
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { sign } from "jsonwebtoken";
import { config, isPrd } from "@/config";

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: config.GITHUB_CLIENT_ID as string,
      clientSecret: config.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
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

    // https://next-auth.js.org/configuration/callbacks#jwt-callback
    async jwt({ token, account, user }) {
      if (user) {
        token.jwtToken = sign(user, config.JWT_SECRET as string, {
          algorithm: "HS256",
          expiresIn: "100d",
        });
      }
      if (account) {
        token.user_id = account.providerAccountId;
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  debug: isPrd, // https://next-auth.js.org/warnings#debug_enabled
  secret: config.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
