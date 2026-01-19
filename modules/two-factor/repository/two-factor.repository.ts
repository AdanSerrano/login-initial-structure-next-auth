import { db } from "@/utils/db";

export class TwoFactorRepository {
  public async getTwoFactorTokenByEmail(email: string) {
    return await db.twoFactorToken.findFirst({
      where: { email },
    });
  }

  public async getTwoFactorTokenByToken(token: string) {
    return await db.twoFactorToken.findUnique({
      where: { token },
    });
  }

  public async deleteTwoFactorToken(id: string) {
    return await db.twoFactorToken.delete({
      where: { id },
    });
  }

  public async getUserByEmail(email: string) {
    return await db.user.findUnique({
      where: { email },
    });
  }

  public async getTwoFactorConfirmationByUserId(userId: string) {
    return await db.twoFactorConfirmation.findUnique({
      where: { userId },
    });
  }

  public async deleteTwoFactorConfirmation(id: string) {
    return await db.twoFactorConfirmation.delete({
      where: { id },
    });
  }

  public async createTwoFactorConfirmation(userId: string) {
    return await db.twoFactorConfirmation.create({
      data: { userId },
    });
  }

  public async updateUserTwoFactorEnabled(userId: string, enabled: boolean) {
    return await db.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: enabled },
    });
  }
}
