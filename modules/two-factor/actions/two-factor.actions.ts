"use server";

import { TwoFactorController } from "../controllers/two-factor.controllers";
import { TwoFactorInput, SendTwoFactorInput } from "../validations/schema/two-factor.schema";

const controller = new TwoFactorController();

export async function sendTwoFactorCodeAction(values: SendTwoFactorInput) {
  return await controller.sendCode(values);
}

export async function verifyTwoFactorCodeAction(values: TwoFactorInput) {
  return await controller.verifyCode(values);
}

export async function toggleTwoFactorAction(userId: string, enable: boolean) {
  return await controller.toggle(userId, enable);
}
