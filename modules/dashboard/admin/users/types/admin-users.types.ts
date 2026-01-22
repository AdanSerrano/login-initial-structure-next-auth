import type { Role } from "@/app/prisma/enums";

export interface AdminUser {
  id: string;
  userName: string | null;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: Role;
  isTwoFactorEnabled: boolean;
  isBlocked: boolean;
  blockedAt: Date | null;
  blockedReason: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type AdminUserStatus =
  | "active"
  | "blocked"
  | "deleted"
  | "unverified"
  | "all";

export interface AdminUsersFilters {
  search: string;
  role: Role | "all";
  status: AdminUserStatus;
}

export interface AdminUsersStats {
  total: number;
  active: number;
  blocked: number;
  admins: number;
  unverified: number;
  deleted: number;
}

export type AdminUsersDialogType =
  | "details"
  | "block"
  | "unblock"
  | "change-role"
  | "delete"
  | "restore"
  | null;

export interface AdminUsersPagination {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
}

export interface AdminUsersSorting {
  id: string;
  desc: boolean;
}

export interface AdminUsersColumnVisibility {
  [key: string]: boolean;
}

export interface GetUsersParams {
  page: number;
  limit: number;
  sorting?: AdminUsersSorting[];
  filters?: AdminUsersFilters;
}

export interface GetUsersResult {
  users: AdminUser[];
  stats: AdminUsersStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface BlockUserParams {
  userId: string;
  reason?: string;
  currentUserId: string;
}

export interface UnblockUserParams {
  userId: string;
  currentUserId: string;
}

export interface ChangeRoleParams {
  userId: string;
  newRole: Role;
  currentUserId: string;
}

export interface DeleteUserParams {
  userId: string;
  reason: string;
  currentUserId: string;
}

export interface BulkBlockParams {
  userIds: string[];
  reason?: string;
  currentUserId: string;
}

export interface BulkDeleteParams {
  userIds: string[];
  reason?: string;
  currentUserId: string;
}

export interface RestoreUserParams {
  userId: string;
  currentUserId: string;
}

export interface BulkRestoreParams {
  userIds: string[];
  currentUserId: string;
}

export interface AdminUsersActionResult {
  success?: string;
  error?: string;
  data?: GetUsersResult;
}
