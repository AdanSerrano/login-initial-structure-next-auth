"use server";

import { auth } from "@/auth";
import { Role } from "@/app/prisma/client";
import { AdminUsersController } from "../controllers/admin-users.controllers";
import {
  getUsersParamsSchema,
  blockUserSchema,
  unblockUserSchema,
  changeRoleSchema,
  deleteUserSchema,
  bulkBlockSchema,
  bulkDeleteSchema,
  restoreUserSchema,
  bulkRestoreSchema,
} from "../validations/schema/admin-users.schema";
import type {
  GetUsersParams,
  AdminUsersActionResult,
} from "../types/admin-users.types";

const controller = new AdminUsersController();

async function validateAdminAccess(): Promise<{
  isValid: boolean;
  userId?: string;
  error?: string;
}> {
  const session = await auth();

  if (!session?.user) {
    return { isValid: false, error: "No autenticado" };
  }

  if (session.user.role !== Role.ADMIN) {
    return { isValid: false, error: "Acceso denegado. Se requiere rol de administrador" };
  }

  return { isValid: true, userId: session.user.id };
}

export async function getUsersAction(
  params: GetUsersParams
): Promise<AdminUsersActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid) {
    return { error: accessValidation.error };
  }

  const inputValidation = getUsersParamsSchema.safeParse(params);
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Parámetros inválidos" };
  }

  return await controller.getUsers(inputValidation.data);
}

export async function blockUserAction(
  userId: string,
  reason?: string
): Promise<AdminUsersActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid || !accessValidation.userId) {
    return { error: accessValidation.error };
  }

  const inputValidation = blockUserSchema.safeParse({
    userId,
    reason,
    currentUserId: accessValidation.userId,
  });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.blockUser(inputValidation.data);
}

export async function unblockUserAction(
  userId: string
): Promise<AdminUsersActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid || !accessValidation.userId) {
    return { error: accessValidation.error };
  }

  const inputValidation = unblockUserSchema.safeParse({
    userId,
    currentUserId: accessValidation.userId,
  });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.unblockUser(inputValidation.data);
}

export async function changeRoleAction(
  userId: string,
  newRole: Role
): Promise<AdminUsersActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid || !accessValidation.userId) {
    return { error: accessValidation.error };
  }

  const inputValidation = changeRoleSchema.safeParse({
    userId,
    newRole,
    currentUserId: accessValidation.userId,
  });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.changeRole(inputValidation.data);
}

export async function deleteUserAction(
  userId: string,
  reason: string
): Promise<AdminUsersActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid || !accessValidation.userId) {
    return { error: accessValidation.error };
  }

  const inputValidation = deleteUserSchema.safeParse({
    userId,
    reason,
    currentUserId: accessValidation.userId,
  });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.deleteUser(inputValidation.data);
}

export async function bulkBlockUsersAction(
  userIds: string[],
  reason?: string
): Promise<AdminUsersActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid || !accessValidation.userId) {
    return { error: accessValidation.error };
  }

  const inputValidation = bulkBlockSchema.safeParse({
    userIds,
    reason,
    currentUserId: accessValidation.userId,
  });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.bulkBlockUsers(inputValidation.data);
}

export async function bulkDeleteUsersAction(
  userIds: string[]
): Promise<AdminUsersActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid || !accessValidation.userId) {
    return { error: accessValidation.error };
  }

  const inputValidation = bulkDeleteSchema.safeParse({
    userIds,
    currentUserId: accessValidation.userId,
  });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.bulkDeleteUsers(inputValidation.data);
}

export async function restoreUserAction(
  userId: string
): Promise<AdminUsersActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid || !accessValidation.userId) {
    return { error: accessValidation.error };
  }

  const inputValidation = restoreUserSchema.safeParse({
    userId,
    currentUserId: accessValidation.userId,
  });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.restoreUser(inputValidation.data);
}

export async function bulkRestoreUsersAction(
  userIds: string[]
): Promise<AdminUsersActionResult> {
  const accessValidation = await validateAdminAccess();
  if (!accessValidation.isValid || !accessValidation.userId) {
    return { error: accessValidation.error };
  }

  const inputValidation = bulkRestoreSchema.safeParse({
    userIds,
    currentUserId: accessValidation.userId,
  });
  if (!inputValidation.success) {
    return { error: inputValidation.error.issues[0]?.message || "Datos inválidos" };
  }

  return await controller.bulkRestoreUsers(inputValidation.data);
}
