import { z } from "zod";
import { Role } from "@/app/prisma/client";

export const adminUsersFiltersSchema = z.object({
  search: z.string().default(""),
  role: z.enum(["USER", "ADMIN", "all"]).default("all"),
  status: z
    .enum(["active", "blocked", "deleted", "unverified", "all"])
    .default("all"),
});

export const getUsersParamsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sorting: z
    .array(
      z.object({
        id: z.string(),
        desc: z.boolean(),
      })
    )
    .optional(),
  filters: adminUsersFiltersSchema.optional(),
});

export const blockUserSchema = z.object({
  userId: z.string().min(1, "ID de usuario requerido"),
  reason: z.string().optional(),
  currentUserId: z.string().min(1, "ID de usuario actual requerido"),
});

export const unblockUserSchema = z.object({
  userId: z.string().min(1, "ID de usuario requerido"),
  currentUserId: z.string().min(1, "ID de usuario actual requerido"),
});

export const changeRoleSchema = z.object({
  userId: z.string().min(1, "ID de usuario requerido"),
  newRole: z.nativeEnum(Role),
  currentUserId: z.string().min(1, "ID de usuario actual requerido"),
});

export const deleteUserSchema = z.object({
  userId: z.string().min(1, "ID de usuario requerido"),
  reason: z.string().min(5, "El motivo debe tener al menos 5 caracteres"),
  currentUserId: z.string().min(1, "ID de usuario actual requerido"),
});

export const bulkBlockSchema = z.object({
  userIds: z.array(z.string()).min(1, "Se requiere al menos un usuario"),
  reason: z.string().optional(),
  currentUserId: z.string().min(1, "ID de usuario actual requerido"),
});

export const bulkDeleteSchema = z.object({
  userIds: z.array(z.string()).min(1, "Se requiere al menos un usuario"),
  reason: z.string().optional(),
  currentUserId: z.string().min(1, "ID de usuario actual requerido"),
});

export const restoreUserSchema = z.object({
  userId: z.string().min(1, "ID de usuario requerido"),
  currentUserId: z.string().min(1, "ID de usuario actual requerido"),
});

export const bulkRestoreSchema = z.object({
  userIds: z.array(z.string()).min(1, "Se requiere al menos un usuario"),
  currentUserId: z.string().min(1, "ID de usuario actual requerido"),
});

export type AdminUsersFiltersInput = z.infer<typeof adminUsersFiltersSchema>;
export type GetUsersParamsInput = z.infer<typeof getUsersParamsSchema>;
export type BlockUserInput = z.infer<typeof blockUserSchema>;
export type UnblockUserInput = z.infer<typeof unblockUserSchema>;
export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type BulkBlockInput = z.infer<typeof bulkBlockSchema>;
export type BulkDeleteInput = z.infer<typeof bulkDeleteSchema>;
export type RestoreUserInput = z.infer<typeof restoreUserSchema>;
export type BulkRestoreInput = z.infer<typeof bulkRestoreSchema>;
