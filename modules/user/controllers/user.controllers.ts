import { UserService } from "../services/user.services";
import {
  UpdateProfileInput,
  UpdateEmailInput,
  UpdatePasswordInput,
  DeleteAccountInput,
} from "../validations/schema/user.schema";

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  public async getProfile(userId: string) {
    return await this.service.getProfile(userId);
  }

  public async updateProfile(userId: string, input: UpdateProfileInput) {
    return await this.service.updateProfile(userId, input);
  }

  public async updateProfileImage(userId: string, imageUrl: string) {
    return await this.service.updateProfileImage(userId, imageUrl);
  }

  public async updateEmail(userId: string, input: UpdateEmailInput) {
    return await this.service.updateEmail(userId, input);
  }

  public async updatePassword(userId: string, input: UpdatePasswordInput) {
    return await this.service.updatePassword(userId, input);
  }

  public async scheduleAccountDeletion(userId: string, input: DeleteAccountInput) {
    return await this.service.scheduleAccountDeletion(userId, input);
  }

  public async cancelAccountDeletion(userId: string) {
    return await this.service.cancelAccountDeletion(userId);
  }

  public async getDeletionStatus(userId: string) {
    return await this.service.getDeletionStatus(userId);
  }

  public async getDeletionStatusByEmail(email: string) {
    return await this.service.getDeletionStatusByEmail(email);
  }

  public async reactivateAccountByEmail(email: string) {
    return await this.service.reactivateAccountByEmail(email);
  }
}
