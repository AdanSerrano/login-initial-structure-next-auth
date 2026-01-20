"use server";

import { MagicLinkController } from "../controllers/magic-link.controllers";
import { RequestMagicLinkActionInput } from "../validations/schema/magic-link.schema";
import { verifyReCaptcha } from "@/lib/recaptcha";

const controller = new MagicLinkController();

export async function requestMagicLinkAction(input: RequestMagicLinkActionInput) {
  if (input.recaptchaToken) {
    const recaptchaResult = await verifyReCaptcha(input.recaptchaToken, "magic_link");
    if (!recaptchaResult.success) {
      return { error: recaptchaResult.error };
    }
  }

  return await controller.requestMagicLink({ email: input.email });
}

export async function verifyMagicLinkAction(token: string) {
  return await controller.verifyMagicLink(token);
}
