"use server";

import { headers } from "next/headers";
import { LoginController } from "../controllers/login.controllers";
import { LoginActionInput } from "../validations/schema/login.schema";

async function getRequestContext() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent");
  const forwarded = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const ipAddress = forwarded?.split(",")[0]?.trim() || realIp || null;

  return { ipAddress, userAgent };
}

export async function loginAction(values: LoginActionInput) {
  const loginController = new LoginController();
  const context = await getRequestContext();
  return await loginController.handleLogin(
    {
      identifier: values.identifier,
      password: values.password,
    },
    context
  );
}
