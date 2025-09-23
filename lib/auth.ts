import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "./prisma";

const providers:any[] = [];
if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
  providers.push(EmailProvider({ server: process.env.EMAIL_SERVER, from: process.env.EMAIL_FROM }));
}

export const authConfig: NextAuthConfig = {
  adapter: providers.length ? (PrismaAdapter(prisma) as any) : undefined,
  providers,
  session: { strategy: providers.length ? "database" : "jwt" },
  trustHost: true,
};

export const { handlers: { GET, POST }, auth } = NextAuth(authConfig);
