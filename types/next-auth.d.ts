import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface Session {
    jwtToken: string;
    user: {
      userId: string;
      email: string;
      access_token: string;
      provider_type: string;
      provider_id: string;
      provider_account_id: string;

    } & DefaultSession["user"];
  }
}
