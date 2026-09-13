import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    accessToken: string;
    refreshToken: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    id: string;
    role?: string;
    error?: string;
  }
}
