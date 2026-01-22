import type { Role } from "@/app/prisma/client";
import type { AdminUser } from "../types/admin-users.types";

export interface DomainValidationResult {
  isValid: boolean;
  error?: string;
}

export class AdminUsersDomainService {
  public validateBlockUser(
    userId: string,
    currentUserId: string,
    user: AdminUser | null
  ): DomainValidationResult {
    if (userId === currentUserId) {
      return { isValid: false, error: "No puedes bloquearte a ti mismo" };
    }

    if (!user) {
      return { isValid: false, error: "Usuario no encontrado" };
    }

    if (user.isBlocked) {
      return { isValid: false, error: "El usuario ya está bloqueado" };
    }

    if (user.deletedAt) {
      return { isValid: false, error: "El usuario ya está eliminado" };
    }

    return { isValid: true };
  }

  public validateUnblockUser(
    userId: string,
    currentUserId: string,
    user: AdminUser | null
  ): DomainValidationResult {
    if (userId === currentUserId) {
      return { isValid: false, error: "No puedes desbloquearte a ti mismo" };
    }

    if (!user) {
      return { isValid: false, error: "Usuario no encontrado" };
    }

    if (!user.isBlocked) {
      return { isValid: false, error: "El usuario no está bloqueado" };
    }

    if (user.deletedAt) {
      return { isValid: false, error: "El usuario está eliminado" };
    }

    return { isValid: true };
  }

  public validateChangeRole(
    userId: string,
    currentUserId: string,
    newRole: Role,
    user: AdminUser | null
  ): DomainValidationResult {
    if (userId === currentUserId) {
      return { isValid: false, error: "No puedes cambiar tu propio rol" };
    }

    if (!user) {
      return { isValid: false, error: "Usuario no encontrado" };
    }

    if (user.deletedAt) {
      return {
        isValid: false,
        error: "No se puede cambiar el rol de un usuario eliminado",
      };
    }

    if (user.role === newRole) {
      return { isValid: false, error: "El usuario ya tiene ese rol" };
    }

    return { isValid: true };
  }

  public validateDeleteUser(
    userId: string,
    currentUserId: string,
    user: AdminUser | null
  ): DomainValidationResult {
    if (userId === currentUserId) {
      return { isValid: false, error: "No puedes eliminarte a ti mismo" };
    }

    if (!user) {
      return { isValid: false, error: "Usuario no encontrado" };
    }

    if (user.deletedAt) {
      return { isValid: false, error: "El usuario ya está eliminado" };
    }

    return { isValid: true };
  }

  public validateRestoreUser(
    userId: string,
    currentUserId: string,
    user: AdminUser | null
  ): DomainValidationResult {
    if (userId === currentUserId) {
      return { isValid: false, error: "No puedes restaurarte a ti mismo" };
    }

    if (!user) {
      return { isValid: false, error: "Usuario no encontrado" };
    }

    if (!user.deletedAt) {
      return { isValid: false, error: "El usuario no está eliminado" };
    }

    return { isValid: true };
  }

  public filterCurrentUserFromBulkAction(
    userIds: string[],
    currentUserId: string
  ): string[] {
    return userIds.filter((id) => id !== currentUserId);
  }

  public validateBulkAction(
    userIds: string[],
    currentUserId: string
  ): DomainValidationResult {
    const filteredIds = this.filterCurrentUserFromBulkAction(
      userIds,
      currentUserId
    );

    if (filteredIds.length === 0) {
      return {
        isValid: false,
        error: "No hay usuarios válidos para esta acción",
      };
    }

    return { isValid: true };
  }
}
