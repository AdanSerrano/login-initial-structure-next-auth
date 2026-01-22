import { db } from "@/utils/db";
import type { Role, Prisma } from "@/app/prisma/client";
import type {
  AdminUser,
  AdminUsersFilters,
  AdminUsersSorting,
  AdminUsersStats,
} from "../types/admin-users.types";

const userSelectFields = {
  id: true,
  userName: true,
  name: true,
  email: true,
  emailVerified: true,
  image: true,
  role: true,
  isTwoFactorEnabled: true,
  isBlocked: true,
  blockedAt: true,
  blockedReason: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class AdminUsersRepository {
  private buildWhereClause(
    filters?: AdminUsersFilters
  ): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};

    if (!filters) return where;

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { userName: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.role && filters.role !== "all") {
      where.role = filters.role as Role;
    }

    if (filters.status && filters.status !== "all") {
      switch (filters.status) {
        case "active":
          where.isBlocked = false;
          where.deletedAt = null;
          where.emailVerified = { not: null };
          break;
        case "blocked":
          where.isBlocked = true;
          break;
        case "deleted":
          where.deletedAt = { not: null };
          break;
        case "unverified":
          where.emailVerified = null;
          where.deletedAt = null;
          break;
      }
    }

    return where;
  }

  private buildOrderByClause(
    sorting?: AdminUsersSorting[]
  ): Prisma.UserOrderByWithRelationInput[] {
    if (!sorting || sorting.length === 0) {
      return [{ createdAt: "desc" }];
    }

    return sorting.map((sort) => {
      const direction = sort.desc ? "desc" : "asc";

      switch (sort.id) {
        case "name":
          return { name: direction };
        case "email":
          return { email: direction };
        case "role":
          return { role: direction };
        case "createdAt":
          return { createdAt: direction };
        case "twoFactor":
          return { isTwoFactorEnabled: direction };
        default:
          return { createdAt: "desc" };
      }
    });
  }

  public async getUsers(
    page: number,
    limit: number,
    sorting?: AdminUsersSorting[],
    filters?: AdminUsersFilters
  ): Promise<{ users: AdminUser[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(filters);
    const orderBy = this.buildOrderByClause(sorting);

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: userSelectFields,
        skip,
        take: limit,
        orderBy,
      }),
      db.user.count({ where }),
    ]);

    return { users: users as AdminUser[], total };
  }

  public async getStats(): Promise<AdminUsersStats> {
    const [total, active, blocked, admins, unverified, deleted] =
      await Promise.all([
        db.user.count(),
        db.user.count({
          where: {
            isBlocked: false,
            deletedAt: null,
            emailVerified: { not: null },
          },
        }),
        db.user.count({
          where: { isBlocked: true },
        }),
        db.user.count({
          where: { role: "ADMIN" },
        }),
        db.user.count({
          where: {
            emailVerified: null,
            deletedAt: null,
          },
        }),
        db.user.count({
          where: { deletedAt: { not: null } },
        }),
      ]);

    return { total, active, blocked, admins, unverified, deleted };
  }

  public async getUserById(id: string): Promise<AdminUser | null> {
    const user = await db.user.findUnique({
      where: { id },
      select: userSelectFields,
    });

    return user as AdminUser | null;
  }

  public async blockUser(
    id: string,
    reason?: string
  ): Promise<AdminUser | null> {
    const user = await db.user.update({
      where: { id },
      data: {
        isBlocked: true,
        blockedAt: new Date(),
        blockedReason: reason || null,
      },
      select: userSelectFields,
    });

    return user as AdminUser;
  }

  public async unblockUser(id: string): Promise<AdminUser | null> {
    const user = await db.user.update({
      where: { id },
      data: {
        isBlocked: false,
        blockedAt: null,
        blockedReason: null,
      },
      select: userSelectFields,
    });

    return user as AdminUser;
  }

  public async changeRole(id: string, role: Role): Promise<AdminUser | null> {
    const user = await db.user.update({
      where: { id },
      data: { role },
      select: userSelectFields,
    });

    return user as AdminUser;
  }

  public async softDeleteUser(
    id: string,
    reason?: string
  ): Promise<AdminUser | null> {
    // Soft delete: establece deletedAt Y bloquea al usuario
    // El usuario tiene un período de gracia de 30 días para reactivar su cuenta
    // También se bloquea para que no pueda acceder durante ese tiempo
    const user = await db.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isBlocked: true,
        blockedAt: new Date(),
        blockedReason: reason || "Cuenta eliminada por administrador",
      },
      select: userSelectFields,
    });

    return user as AdminUser;
  }

  public async restoreUser(id: string): Promise<AdminUser | null> {
    // Restaurar usuario eliminado: limpiar deletedAt Y desbloquear
    const user = await db.user.update({
      where: { id },
      data: {
        deletedAt: null,
        isBlocked: false,
        blockedAt: null,
        blockedReason: null,
      },
      select: userSelectFields,
    });

    return user as AdminUser;
  }

  public async bulkBlockUsers(
    ids: string[],
    reason?: string
  ): Promise<number> {
    const result = await db.user.updateMany({
      where: { id: { in: ids } },
      data: {
        isBlocked: true,
        blockedAt: new Date(),
        blockedReason: reason || null,
      },
    });

    return result.count;
  }

  public async bulkDeleteUsers(ids: string[], reason?: string): Promise<number> {
    // Soft delete masivo: establece deletedAt Y bloquea
    const result = await db.user.updateMany({
      where: { id: { in: ids } },
      data: {
        deletedAt: new Date(),
        isBlocked: true,
        blockedAt: new Date(),
        blockedReason: reason || "Cuenta eliminada por administrador",
      },
    });

    return result.count;
  }

  public async bulkRestoreUsers(ids: string[]): Promise<number> {
    // Restaurar masivo: limpiar deletedAt Y desbloquear
    const result = await db.user.updateMany({
      where: { id: { in: ids } },
      data: {
        deletedAt: null,
        isBlocked: false,
        blockedAt: null,
        blockedReason: null,
      },
    });

    return result.count;
  }
}
