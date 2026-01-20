"use server";

import { RegisterController } from "../controllers/register.controllers";
import { RegisterActionInput } from "../validations/schema/register.schema";
import { verifyReCaptcha } from "@/lib/recaptcha";

export async function registerAction(values: RegisterActionInput) {
  if (values.recaptchaToken) {
    const recaptchaResult = await verifyReCaptcha(values.recaptchaToken, "register");
    if (!recaptchaResult.success) {
      return { error: recaptchaResult.error };
    }
  }

  const registerController = new RegisterController();
  return await registerController.register({
    email: values.email,
    userName: values.userName,
    name: values.name,
    password: values.password,
    confirmPassword: values.confirmPassword,
  });
}
