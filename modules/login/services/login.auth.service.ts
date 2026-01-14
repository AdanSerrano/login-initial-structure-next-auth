import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export interface AuthResult {
  success?: string;
  error?: string;
  redirect?: boolean;
}

export class LoginAuthService {
  public async authenticateUser(
    identifier: string,
    password: string
  ): Promise<AuthResult> {
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
  }
}
