"use server";

import { LoginController } from "../controllers/login.controllers";
import { LoginUser } from "../validations/schema/login.schema";

export async function loginAction(values: LoginUser) {
  const loginController = new LoginController();
  return await loginController.handleLogin(values);
}
