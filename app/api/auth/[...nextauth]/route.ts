import NextAuth from "next-auth";

// importing providers
import GithubProvider from "next-auth/providers/github";

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
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
