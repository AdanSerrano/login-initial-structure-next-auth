import { db } from "@/utils/db";

const DELETION_GRACE_PERIOD_DAYS = 30;

export interface UserProfileData {
  id: string;
  name: string | null;
  userName: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: string;
  isTwoFactorEnabled: boolean;
  createdAt: Date;
  deletedAt: Date | null;
  scheduledDeletionDate: Date | null;
}

export interface UpdateProfileData {
  name?: string;
  userName?: string | null;
  image?: string | null;
}

export interface UpdateEmailData {
  email: string;
  emailVerified: Date | null;
}

export interface UserDeletionStatus {
  id: string;
  email: string | null;
  name: string | null;
  deletedAt: Date | null;
  scheduledDeletionDate: Date | null;
  deletionReason: string | null;
}

export class UserRepository {
  public async findById(userId: string): Promise<UserProfileData | null> {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        userName: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        isTwoFactorEnabled: true,
        createdAt: true,
        deletedAt: true,
        scheduledDeletionDate: true,
      },
    });

    return user;
  }

  public async findByEmail(email: string) {
    // Normalizar a minúsculas para búsqueda case-insensitive
    return await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
  }

  public async findByUserName(userName: string) {
    // Normalizar a minúsculas para búsqueda case-insensitive
    return await db.user.findUnique({
      where: { userName: userName.toLowerCase() },
      select: {
        id: true,
        userName: true,
      },
    });
  }

  public async getUserWithPassword(userId: string) {
    return await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
  }

  public async getUserDeletionStatus(userId: string): Promise<UserDeletionStatus | null> {
    return await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        deletedAt: true,
        scheduledDeletionDate: true,
        deletionReason: true,
      },
    });
  }

  public async getUserDeletionStatusByEmail(email: string): Promise<UserDeletionStatus | null> {
    // Normalizar a minúsculas para búsqueda case-insensitive
    return await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        deletedAt: true,
        scheduledDeletionDate: true,
        deletionReason: true,
      },
    });
  }

  public async updateProfile(userId: string, data: UpdateProfileData) {
    return await db.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        // Normalizar username a minúsculas al guardar
        userName: data.userName?.toLowerCase() || null,
        image: data.image || null,
      },
      select: {
        id: true,
        name: true,
        userName: true,
        image: true,
      },
    });
  }

  public async updateEmail(userId: string, data: UpdateEmailData) {
    return await db.user.update({
      where: { id: userId },
      data: {
        // Normalizar email a minúsculas al guardar
        email: data.email.toLowerCase(),
        emailVerified: data.emailVerified,
      },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });
  }

  public async updatePassword(userId: string, hashedPassword: string) {
    return await db.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
  }

  public async scheduleAccountDeletion(userId: string, reason?: string) {
    const now = new Date();
    const scheduledDate = new Date(now);
    scheduledDate.setDate(scheduledDate.getDate() + DELETION_GRACE_PERIOD_DAYS);

    return await db.user.update({
      where: { id: userId },
      data: {
        deletedAt: now,
        scheduledDeletionDate: scheduledDate,
        deletionReason: reason || "Solicitado por el usuario",
      },
      select: {
        id: true,
        deletedAt: true,
        scheduledDeletionDate: true,
      },
    });
  }

  public async cancelAccountDeletion(userId: string) {
    return await db.user.update({
      where: { id: userId },
      data: {
        deletedAt: null,
        scheduledDeletionDate: null,
        deletionReason: null,
      },
      select: {
        id: true,
      },
    });
  }

  public async deleteUserPermanently(userId: string) {
    await db.$transaction(async (tx) => {
      await tx.twoFactorConfirmation.deleteMany({
        where: { userId },
      });

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (user?.email) {
        await tx.twoFactorToken.deleteMany({
          where: { email: user.email },
        });

        await tx.verificationToken.deleteMany({
          where: { email: user.email },
        });

        await tx.passwordResetToken.deleteMany({
          where: { email: user.email },
        });
      }

      await tx.auditLog.updateMany({
        where: { userId },
        data: { userId: null },
      });

      await tx.user.delete({
        where: { id: userId },
      });
    });
  }

  public async getAccountsPendingDeletion() {
    const now = new Date();
    return await db.user.findMany({
      where: {
        deletedAt: { not: null },
        scheduledDeletionDate: { lte: now },
      },
      select: {
        id: true,
        email: true,
        scheduledDeletionDate: true,
      },
    });
  }
}
