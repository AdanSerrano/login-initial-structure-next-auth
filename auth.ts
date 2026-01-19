import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import { Role } from "./app/prisma/enums";
import authConfig from "./auth.config";
import { db } from "./utils/db";

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
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      const existingUser = await db.user.findUnique({ where: { id: user.id } });
      if (!existingUser?.emailVerified) return false;
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) session.user.id = token.sub;
      if (token.role && session.user) session.user.role = token.role as Role;
      if (session.user) {
        session.user.userName = token.userName as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.role = token.role as string;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      return session;
    },
    async jwt({ token, user, trigger }) {
      // Solo cargar datos del usuario cuando:
      // 1. Es un nuevo login (user existe)
      // 2. Se solicita actualización explícita (trigger === "update")
      if (user) {
        // Nuevo login - cargar datos iniciales del usuario
        token.userName = user.userName ?? undefined;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image;
        token.isTwoFactorEnabled = user.isTwoFactorEnabled;
        return token;
      }

      // Solo refrescar datos de la DB si se solicita explícitamente
      if (trigger === "update" && token.sub) {
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

      return token;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  ...authConfig,
});
