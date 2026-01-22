import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import { headers } from "next/headers";
import { Role } from "./app/prisma/enums";
import authConfig from "./auth.config";
import { db } from "./utils/db";
import { createUserSession, deleteSessionByToken, isSessionValid } from "./lib/session-manager";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
    signOut: "/login",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
    async signOut(message) {
      if ("token" in message && message.token?.sessionToken) {
        await deleteSessionByToken(message.token.sessionToken as string);
      }
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials" && account?.provider !== "magic-link") {
        return true;
      }
      const existingUser = await db.user.findUnique({ where: { id: user.id } });
      if (!existingUser?.emailVerified) return false;
      return true;
    },
    async session({ token, session }) {
      // Si la sesión fue revocada, marcarla para que el cliente lo detecte
      if (token.sessionRevoked) {
        (session as { sessionRevoked?: boolean }).sessionRevoked = true;
        return session;
      }

      if (session.user) {
        if (token.sub) session.user.id = token.sub;
        session.user.userName = token.userName as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.role = token.role as Role;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      if (token.sessionToken) {
        (session as { sessionToken?: string }).sessionToken =
          token.sessionToken as string;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user && trigger === "signIn") {
        token.userName = user.userName ?? undefined;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image;
        token.isTwoFactorEnabled = user.isTwoFactorEnabled;

        try {
          const headersList = await headers();
          const userAgent = headersList.get("user-agent");
          const forwarded = headersList.get("x-forwarded-for");
          const realIp = headersList.get("x-real-ip");
          const ipAddress = forwarded?.split(",")[0]?.trim() || realIp || null;

          const sessionResult = await createUserSession({
            userId: user.id!,
            userAgent,
            ipAddress,
          });

          if (sessionResult) {
            token.sessionToken = sessionResult.token;
          }
        } catch (error) {
          console.error("Error creating session on sign in:", error);
        }

        return token;
      }

      // Verificar si la sesión fue revocada (solo si hay sessionToken)
      if (token.sessionToken) {
        const sessionExists = await isSessionValid(token.sessionToken as string);
        if (!sessionExists) {
          // Marcar el token como revocado para que el middleware lo detecte
          token.sessionRevoked = true;
          return token;
        }
      }

      if (token.sub && !user) {
        const dbUser = await db.user.findUnique({
          where: { id: token.sub },
          select: {
            role: true,
            name: true,
            email: true,
            image: true,
            userName: true,
            isTwoFactorEnabled: true,
            isBlocked: true,
            deletedAt: true,
          },
        });

        if (dbUser) {
          if (dbUser.isBlocked || dbUser.deletedAt) {
            token.sessionRevoked = true;
            return token;
          }
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.image = dbUser.image;
          token.userName = dbUser.userName ?? undefined;
          token.isTwoFactorEnabled = dbUser.isTwoFactorEnabled;
        }
      }

      if (trigger === "update") {
        if (session?.user) {
          if (session.user.name !== undefined) token.name = session.user.name;
          if (session.user.userName !== undefined)
            token.userName = session.user.userName;
          if (session.user.image !== undefined) token.image = session.user.image;
          if (session.user.email !== undefined) token.email = session.user.email;
          if (session.user.isTwoFactorEnabled !== undefined)
            token.isTwoFactorEnabled = session.user.isTwoFactorEnabled;
        } else if (token.sub) {
          const existingUser = await db.user.findUnique({
            where: { id: token.sub },
          });
          if (existingUser) {
            token.userName = existingUser.userName ?? undefined;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.image = existingUser.image;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
          }
        }
      }

      return token;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  ...authConfig,
});
