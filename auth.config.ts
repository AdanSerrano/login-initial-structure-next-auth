import bcrypt from "bcryptjs";
import { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginRepository } from "./modules/login/repository/login.repository";
import { createLoginFormSchema } from "./modules/login/validations/schema/login.schema";

export default {
  providers: [
    Credentials({
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

          // Validar la contraseña
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
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
