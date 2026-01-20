"use server";

import { MagicLinkController } from "../controllers/magic-link.controllers";
import { RequestMagicLinkInput } from "../validations/schema/magic-link.schema";

const controller = new MagicLinkController();

export async function requestMagicLinkAction(input: RequestMagicLinkInput) {
  return await controller.requestMagicLink(input);
}

export async function verifyMagicLinkAction(token: string) {
  return await controller.verifyMagicLink(token);
}
