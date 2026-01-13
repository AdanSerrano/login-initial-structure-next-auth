import { signIn } from "@/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { LoginRepository } from "../repository/login.repository";
import {
  LoginUser,
  createLoginFormSchema,
} from "../validations/schema/login.schema";

export class LoginService {
  private loginRepository: LoginRepository;

  constructor() {
    this.loginRepository = new LoginRepository();
  }

  public async login(loginUser: LoginUser) {
    try {
      const validatedFields = createLoginFormSchema.safeParse(loginUser);

      if (!validatedFields.success) {
        return { error: "Campos inválidos" };
      }

      const { identifier, password } = validatedFields.data;
      const user = await this.loginRepository.getUserByIdentifier(loginUser);
      if (!user) {
        return { error: "Usuario no encontrado" };
      }

      if (!user.email || !user.password) {
        return { error: "Usuario no tiene email o contraseña configurada" };
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return { error: "Contraseña incorrecta" };
      }
      if (!user.emailVerified) {
        // const verificationToken = await generateVerificationToken(user.email);
        // await sendVerificationEmail(
        //   user.email,
        //   verificationToken.token,
        //   locale,
        //   user.name
        // );
        // return { success: tErrors("verificationEmailSent"), redirect: false };
        return { error: "Usuario no verificado", redirect: false };
      }

      try {
        await signIn("credentials", {
          identifier,
          password,
          redirect: false,
        });

        return { success: "Login Realizado Correctamente", redirect: true };
      } catch (error) {
        console.error("Error en signIn:", error);
        if (error instanceof AuthError) {
          return { error: "Credenciales incorrectas" };
        }
        if ((error as Error).message === "NEXT_REDIRECT") {
          console.log("Redirección detectada, ignorando...");
          return { success: "Login Realizado Correctamente", redirect: true };
        }
        return { error: "Error al iniciar sesión" };
      }
    } catch (error) {
      console.error("Error en login service:", error);
      return { error: "Error al verificar credenciales" };
    }
  }
}
