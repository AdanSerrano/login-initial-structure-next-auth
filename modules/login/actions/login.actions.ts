"use server";

import { LoginController } from "../controllers/login.controllers";
import { LoginActionInput } from "../validations/schema/login.schema";
import { verifyReCaptcha } from "@/lib/recaptcha";

export async function loginAction(values: LoginActionInput) {
  console.log("[loginAction] Recibido token reCAPTCHA:", values.recaptchaToken ? "SÍ" : "NO");

  if (values.recaptchaToken) {
    console.log("[loginAction] Verificando token con Google...");
    const recaptchaResult = await verifyReCaptcha(values.recaptchaToken, "login");
    console.log("[loginAction] Resultado verificación:", recaptchaResult);
    if (!recaptchaResult.success) {
      console.log("[loginAction] Verificación FALLIDA:", recaptchaResult.error);
      return { error: recaptchaResult.error };
    }
    console.log("[loginAction] Verificación EXITOSA, score:", recaptchaResult.score);
  } else {
    console.log("[loginAction] Sin token, continuando sin verificación");
  }

  const loginController = new LoginController();
  return await loginController.handleLogin({
    identifier: values.identifier,
    password: values.password,
  });
}
