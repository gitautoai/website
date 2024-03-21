import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface Session {
    jwt: string;
    user: {
      userId: int;
    } & DefaultSession["user"];
  }
}
