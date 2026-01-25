"use server";

import { currentUser } from "@/lib/user";
import { UserController } from "../controllers/user.controllers";
import {
  UpdateProfileInput,
  UpdateEmailInput,
  UpdatePasswordInput,
  DeleteAccountInput,
} from "../validations/schema/user.schema";

const controller = new UserController();

export async function getProfileAction() {
  const user = await currentUser();

  if (!user?.id) {
    return { error: "No autorizado" };
  }

  return await controller.getProfile(user.id);
}

export async function updateProfileAction(input: UpdateProfileInput) {
  const user = await currentUser();

  if (!user?.id) {
    return { error: "No autorizado" };
  }

  return await controller.updateProfile(user.id, input);
}

export async function updateProfileImageAction(imageUrl: string) {
  const user = await currentUser();

  if (!user?.id) {
    return { error: "No autorizado" };
  }

  return await controller.updateProfileImage(user.id, imageUrl);
}

export async function updateEmailAction(input: UpdateEmailInput) {
  const user = await currentUser();

  if (!user?.id) {
    return { error: "No autorizado" };
  }

  return await controller.updateEmail(user.id, input);
}

export async function updatePasswordAction(input: UpdatePasswordInput) {
  const user = await currentUser();

  if (!user?.id) {
    return { error: "No autorizado" };
  }

  return await controller.updatePassword(user.id, input);
}

export async function scheduleAccountDeletionAction(input: DeleteAccountInput) {
  const user = await currentUser();

  if (!user?.id) {
    return { error: "No autorizado" };
  }

  return await controller.scheduleAccountDeletion(user.id, input);
}

export async function cancelAccountDeletionAction() {
  const user = await currentUser();

  if (!user?.id) {
    return { error: "No autorizado" };
  }

  return await controller.cancelAccountDeletion(user.id);
}

export async function getDeletionStatusAction() {
  const user = await currentUser();

  if (!user?.id) {
    return { error: "No autorizado" };
  }

  return await controller.getDeletionStatus(user.id);
}

export async function checkDeletionStatusByEmailAction(email: string) {
  return await controller.getDeletionStatusByEmail(email);
}

export async function reactivateAccountAction(email: string) {
  return await controller.reactivateAccountByEmail(email);
}
