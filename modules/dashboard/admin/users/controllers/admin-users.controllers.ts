import { AdminUsersService } from "../services/admin-users.services";
import type {
  GetUsersParams,
  BlockUserParams,
  UnblockUserParams,
  ChangeRoleParams,
  DeleteUserParams,
  BulkBlockParams,
  BulkDeleteParams,
  RestoreUserParams,
  BulkRestoreParams,
  AdminUsersActionResult,
} from "../types/admin-users.types";

export class AdminUsersController {
  private service: AdminUsersService;

  constructor() {
    this.service = new AdminUsersService();
  }

  public async getUsers(
    params: GetUsersParams
  ): Promise<AdminUsersActionResult> {
    return await this.service.getUsers(params);
  }

  public async blockUser(
    params: BlockUserParams
  ): Promise<AdminUsersActionResult> {
    return await this.service.blockUser(params);
  }

  public async unblockUser(
    params: UnblockUserParams
  ): Promise<AdminUsersActionResult> {
    return await this.service.unblockUser(params);
  }

  public async changeRole(
    params: ChangeRoleParams
  ): Promise<AdminUsersActionResult> {
    return await this.service.changeRole(params);
  }

  public async deleteUser(
    params: DeleteUserParams
  ): Promise<AdminUsersActionResult> {
    return await this.service.deleteUser(params);
  }

  public async bulkBlockUsers(
    params: BulkBlockParams
  ): Promise<AdminUsersActionResult> {
    return await this.service.bulkBlockUsers(params);
  }

  public async bulkDeleteUsers(
    params: BulkDeleteParams
  ): Promise<AdminUsersActionResult> {
    return await this.service.bulkDeleteUsers(params);
  }

  public async restoreUser(
    params: RestoreUserParams
  ): Promise<AdminUsersActionResult> {
    return await this.service.restoreUser(params);
  }

  public async bulkRestoreUsers(
    params: BulkRestoreParams
  ): Promise<AdminUsersActionResult> {
    return await this.service.bulkRestoreUsers(params);
  }
}
