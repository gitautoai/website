import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface Session {
    jwtToken: string;
    accessToken?: string;
    user: {
      userId: number;
      login?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  // Add this interface to extend the User type
  interface User {
    login?: string;
  }
}
