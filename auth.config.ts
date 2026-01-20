import bcrypt from "bcryptjs";
import { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginRepository } from "./modules/login/repository/login.repository";
import { createLoginFormSchema } from "./modules/login/validations/schema/login.schema";
import { MagicLinkRepository } from "./modules/magic-link/repository/magic-link.repository";

export default {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials) {
        try {
          if (!credentials?.identifier || !credentials?.password) {
            return null;
          }

          const validatedFields = createLoginFormSchema.safeParse({
            identifier: credentials.identifier as string,
            password: credentials.password as string,
          });

          if (!validatedFields.success) {
            return null;
          }

          const { identifier, password } = validatedFields.data;

          const loginRepository = new LoginRepository();
          const user = await loginRepository.getUserByIdentifier({
            identifier,
            password,
          });

          if (!user || !user.password || !user.emailVerified) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.error("Error en authorize:", error);
          return null;
        }
      },
    }),
    Credentials({
      id: "magic-link",
      name: "Magic Link",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.token) {
            return null;
          }

          const token = credentials.token as string;
          const magicLinkRepository = new MagicLinkRepository();

          const magicLinkToken =
            await magicLinkRepository.getMagicLinkTokenByToken(token);

          if (!magicLinkToken) {
            return null;
          }

          const hasExpired = new Date(magicLinkToken.expires) < new Date();
          if (hasExpired) {
            await magicLinkRepository.deleteMagicLinkToken(magicLinkToken.id);
            return null;
          }

          const user = await magicLinkRepository.getUserByEmail(
            magicLinkToken.email
          );

          if (!user || !user.emailVerified || user.deletedAt || user.isBlocked) {
            await magicLinkRepository.deleteMagicLinkToken(magicLinkToken.id);
            return null;
          }

          await magicLinkRepository.deleteMagicLinkToken(magicLinkToken.id);
          await magicLinkRepository.createAuditLog(user.id, "MAGIC_LINK_LOGIN", {
            email: user.email,
          });

          return user;
        } catch (error) {
          console.error("Error en magic link authorize:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
} satisfies NextAuthConfig;
