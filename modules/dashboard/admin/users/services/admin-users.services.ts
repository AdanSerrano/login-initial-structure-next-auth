import { AdminUsersRepository } from "../repository/admin-users.repository";
import { AdminUsersDomainService } from "./admin-users.domain.service";
import type {
  GetUsersResult,
  AdminUsersActionResult,
  GetUsersParams,
  BlockUserParams,
  UnblockUserParams,
  ChangeRoleParams,
  DeleteUserParams,
  BulkBlockParams,
  BulkDeleteParams,
  RestoreUserParams,
  BulkRestoreParams,
} from "../types/admin-users.types";

export class AdminUsersService {
  private repository: AdminUsersRepository;
  private domainService: AdminUsersDomainService;

  constructor() {
    this.repository = new AdminUsersRepository();
    this.domainService = new AdminUsersDomainService();
  }

  public async getUsers(params: GetUsersParams): Promise<AdminUsersActionResult> {
    try {
      const { page, limit, sorting, filters } = params;

      const [{ users, total }, stats] = await Promise.all([
        this.repository.getUsers(page, limit, sorting, filters),
        this.repository.getStats(),
      ]);

      const totalPages = Math.ceil(total / limit);

      const result: GetUsersResult = {
        users,
        stats,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };

      return { data: result };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { error: "Error al obtener usuarios" };
    }
  }

  public async blockUser(params: BlockUserParams): Promise<AdminUsersActionResult> {
    try {
      const { userId, reason, currentUserId } = params;

      const user = await this.repository.getUserById(userId);
      const validation = this.domainService.validateBlockUser(
        userId,
        currentUserId,
        user
      );

      if (!validation.isValid) {
        return { error: validation.error };
      }

      await this.repository.blockUser(userId, reason);

      return { success: "Usuario bloqueado correctamente" };
    } catch (error) {
      console.error("Error blocking user:", error);
      return { error: "Error al bloquear usuario" };
    }
  }

  public async unblockUser(params: UnblockUserParams): Promise<AdminUsersActionResult> {
    try {
      const { userId, currentUserId } = params;

      const user = await this.repository.getUserById(userId);
      const validation = this.domainService.validateUnblockUser(
        userId,
        currentUserId,
        user
      );

      if (!validation.isValid) {
        return { error: validation.error };
      }

      await this.repository.unblockUser(userId);

      return { success: "Usuario desbloqueado correctamente" };
    } catch (error) {
      console.error("Error unblocking user:", error);
      return { error: "Error al desbloquear usuario" };
    }
  }

  public async changeRole(params: ChangeRoleParams): Promise<AdminUsersActionResult> {
    try {
      const { userId, newRole, currentUserId } = params;

      const user = await this.repository.getUserById(userId);
      const validation = this.domainService.validateChangeRole(
        userId,
        currentUserId,
        newRole,
        user
      );

      if (!validation.isValid) {
        return { error: validation.error };
      }

      await this.repository.changeRole(userId, newRole);

      return { success: "Rol actualizado correctamente" };
    } catch (error) {
      console.error("Error changing role:", error);
      return { error: "Error al cambiar rol" };
    }
  }

  public async deleteUser(params: DeleteUserParams): Promise<AdminUsersActionResult> {
    try {
      const { userId, currentUserId, reason } = params;

      const user = await this.repository.getUserById(userId);
      const validation = this.domainService.validateDeleteUser(
        userId,
        currentUserId,
        user
      );

      if (!validation.isValid) {
        return { error: validation.error };
      }

      await this.repository.softDeleteUser(userId, reason);

      return { success: "Usuario eliminado correctamente" };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { error: "Error al eliminar usuario" };
    }
  }

  public async bulkBlockUsers(params: BulkBlockParams): Promise<AdminUsersActionResult> {
    try {
      const { userIds, reason, currentUserId } = params;

      const validation = this.domainService.validateBulkAction(
        userIds,
        currentUserId
      );

      if (!validation.isValid) {
        return { error: validation.error };
      }

      const filteredIds = this.domainService.filterCurrentUserFromBulkAction(
        userIds,
        currentUserId
      );

      const count = await this.repository.bulkBlockUsers(filteredIds, reason);

      return { success: `${count} usuarios bloqueados correctamente` };
    } catch (error) {
      console.error("Error bulk blocking users:", error);
      return { error: "Error al bloquear usuarios" };
    }
  }

  public async bulkDeleteUsers(params: BulkDeleteParams): Promise<AdminUsersActionResult> {
    try {
      const { userIds, currentUserId, reason } = params;

      const validation = this.domainService.validateBulkAction(
        userIds,
        currentUserId
      );

      if (!validation.isValid) {
        return { error: validation.error };
      }

      const filteredIds = this.domainService.filterCurrentUserFromBulkAction(
        userIds,
        currentUserId
      );

      const count = await this.repository.bulkDeleteUsers(filteredIds, reason);

      return { success: `${count} usuarios eliminados correctamente` };
    } catch (error) {
      console.error("Error bulk deleting users:", error);
      return { error: "Error al eliminar usuarios" };
    }
  }

  public async restoreUser(params: RestoreUserParams): Promise<AdminUsersActionResult> {
    try {
      const { userId, currentUserId } = params;

      const user = await this.repository.getUserById(userId);
      const validation = this.domainService.validateRestoreUser(
        userId,
        currentUserId,
        user
      );

      if (!validation.isValid) {
        return { error: validation.error };
      }

      await this.repository.restoreUser(userId);

      return { success: "Usuario restaurado correctamente" };
    } catch (error) {
      console.error("Error restoring user:", error);
      return { error: "Error al restaurar usuario" };
    }
  }

  public async bulkRestoreUsers(params: BulkRestoreParams): Promise<AdminUsersActionResult> {
    try {
      const { userIds, currentUserId } = params;

      const validation = this.domainService.validateBulkAction(
        userIds,
        currentUserId
      );

      if (!validation.isValid) {
        return { error: validation.error };
      }

      const filteredIds = this.domainService.filterCurrentUserFromBulkAction(
        userIds,
        currentUserId
      );

      const count = await this.repository.bulkRestoreUsers(filteredIds);

      return { success: `${count} usuarios restaurados correctamente` };
    } catch (error) {
      console.error("Error bulk restoring users:", error);
      return { error: "Error al restaurar usuarios" };
    }
  }
}
