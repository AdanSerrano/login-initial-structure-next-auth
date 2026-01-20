"use server";

import { headers } from "next/headers";
import { MagicLinkController } from "../controllers/magic-link.controllers";
import { RequestMagicLinkActionInput } from "../validations/schema/magic-link.schema";

const controller = new MagicLinkController();

async function getRequestContext() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent");
  const forwarded = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const ipAddress = forwarded?.split(",")[0]?.trim() || realIp || null;

  return { ipAddress, userAgent };
}

export async function requestMagicLinkAction(input: RequestMagicLinkActionInput) {
  const context = await getRequestContext();
  return await controller.requestMagicLink({ email: input.email }, context);
}

export async function verifyMagicLinkAction(token: string) {
  const context = await getRequestContext();
  return await controller.verifyMagicLink(token, context);
}
