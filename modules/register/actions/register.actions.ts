"use server";

import { RegisterController } from "../controllers/register.controllers";
import { RegisterUser } from "../validations/schema/register.schema";

export async function registerAction(values: RegisterUser) {
  const registerController = new RegisterController();
  return await registerController.register(values);
}
