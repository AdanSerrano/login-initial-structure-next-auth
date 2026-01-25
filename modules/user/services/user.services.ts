import bcrypt from "bcryptjs";
import { UserRepository, UserProfileData } from "../repository/user.repository";
import { UserDomainService } from "./user.domain.service";
import {
  UpdateProfileInput,
  UpdateEmailInput,
  UpdatePasswordInput,
  DeleteAccountInput,
} from "../validations/schema/user.schema";
import { generateVerificationToken } from "@/lib/tokens";
import { logAuditEvent } from "@/lib/audit";
import { AuditAction } from "@/app/prisma/enums";

export interface UserResult {
  success?: string;
  error?: string;
  data?: unknown;
  requiresVerification?: boolean;
  requiresLogout?: boolean;
}

export interface GetProfileResult {
  success?: string;
  error?: string;
  data?: UserProfileData;
}

export interface DeletionStatusResult {
  success?: string;
  error?: string;
  isPendingDeletion?: boolean;
  scheduledDeletionDate?: Date | null;
  daysRemaining?: number;
}

const BCRYPT_SALT_ROUNDS = 10;

export class UserService {
  private repository: UserRepository;
  private domainService: UserDomainService;

  constructor() {
    this.repository = new UserRepository();
    this.domainService = new UserDomainService();
  }

  public async getProfile(userId: string): Promise<GetProfileResult> {
    try {
      const user = await this.repository.findById(userId);

      if (!user) {
        return { error: "Usuario no encontrado" };
      }

      return { data: user };
    } catch (error) {
      console.error("Error getting user profile:", error);
      return { error: "Error al obtener el perfil" };
    }
  }

  public async updateProfile(
    userId: string,
    input: UpdateProfileInput
  ): Promise<UserResult> {
    try {
      const validation = await this.domainService.validateProfileUpdate(
        userId,
        input
      );

      if (!validation.isValid) {
        return { error: validation.error };
      }

      const updatedUser = await this.repository.updateProfile(userId, {
        name: validation.data?.name,
        userName: validation.data?.userName,
        image: validation.data?.image,
      });

      return {
        success: "Perfil actualizado correctamente",
        data: updatedUser,
      };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { error: "Error al actualizar el perfil" };
    }
  }

  public async updateProfileImage(
    userId: string,
    imageUrl: string
  ): Promise<UserResult> {
    try {
      const updatedUser = await this.repository.updateProfile(userId, {
        image: imageUrl,
      });

      return {
        success: "Imagen de perfil actualizada",
        data: updatedUser,
      };
    } catch (error) {
      console.error("Error updating profile image:", error);
      return { error: "Error al actualizar la imagen de perfil" };
    }
  }

  public async updateEmail(
    userId: string,
    input: UpdateEmailInput
  ): Promise<UserResult> {
    try {
      const validation = await this.domainService.validateEmailUpdate(
        userId,
        input
      );

      if (!validation.isValid) {
        return { error: validation.error };
      }

      await this.repository.updateEmail(userId, {
        email: validation.data!.email,
        emailVerified: null,
      });

      const verificationToken = await generateVerificationToken(
        validation.data!.email
      );

      return {
        success: "Email actualizado. Revisa tu correo para verificarlo.",
        requiresVerification: true,
        data: { token: verificationToken.token },
      };
    } catch (error) {
      console.error("Error updating email:", error);
      return { error: "Error al actualizar el email" };
    }
  }

  public async updatePassword(
    userId: string,
    input: UpdatePasswordInput
  ): Promise<UserResult> {
    try {
      const validation = await this.domainService.validatePasswordUpdate(
        userId,
        input
      );

      if (!validation.isValid) {
        return { error: validation.error };
      }

      const hashedPassword = await bcrypt.hash(
        validation.data!.newPassword,
        BCRYPT_SALT_ROUNDS
      );

      await this.repository.updatePassword(userId, hashedPassword);

      await logAuditEvent({
        userId,
        action: AuditAction.PASSWORD_RESET_COMPLETED,
        metadata: { method: "profile_update" },
      });

      return {
        success: "Contraseña actualizada correctamente",
      };
    } catch (error) {
      console.error("Error updating password:", error);
      return { error: "Error al actualizar la contraseña" };
    }
  }

  public async scheduleAccountDeletion(
    userId: string,
    input: DeleteAccountInput
  ): Promise<UserResult> {
    try {
      const validation = await this.domainService.validateDeleteAccount(
        userId,
        input
      );

      if (!validation.isValid) {
        return { error: validation.error };
      }

      const result = await this.repository.scheduleAccountDeletion(userId);

      await logAuditEvent({
        userId,
        action: AuditAction.ACCOUNT_DELETION_REQUESTED,
        metadata: {
          scheduledDeletionDate: result.scheduledDeletionDate,
        },
      });

      const formattedDate = result.scheduledDeletionDate
        ? new Intl.DateTimeFormat("es", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(result.scheduledDeletionDate)
        : "";

      return {
        success: `Tu cuenta será eliminada el ${formattedDate}. Puedes reactivarla iniciando sesión antes de esa fecha.`,
        requiresLogout: true,
      };
    } catch (error) {
      console.error("Error scheduling account deletion:", error);
      return { error: "Error al programar la eliminación de la cuenta" };
    }
  }

  public async cancelAccountDeletion(userId: string): Promise<UserResult> {
    try {
      await this.repository.cancelAccountDeletion(userId);

      await logAuditEvent({
        userId,
        action: AuditAction.ACCOUNT_DELETION_CANCELLED,
      });

      return {
        success: "¡Tu cuenta ha sido reactivada exitosamente!",
      };
    } catch (error) {
      console.error("Error cancelling account deletion:", error);
      return { error: "Error al reactivar la cuenta" };
    }
  }

  public async getDeletionStatus(userId: string): Promise<DeletionStatusResult> {
    try {
      const status = await this.repository.getUserDeletionStatus(userId);

      if (!status) {
        return { error: "Usuario no encontrado" };
      }

      if (!status.deletedAt || !status.scheduledDeletionDate) {
        return { isPendingDeletion: false };
      }

      const now = new Date();
      const scheduledDate = new Date(status.scheduledDeletionDate);
      const daysRemaining = Math.ceil(
        (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        isPendingDeletion: true,
        scheduledDeletionDate: status.scheduledDeletionDate,
        daysRemaining: Math.max(0, daysRemaining),
      };
    } catch (error) {
      console.error("Error getting deletion status:", error);
      return { error: "Error al obtener el estado de eliminación" };
    }
  }

  public async getDeletionStatusByEmail(email: string): Promise<DeletionStatusResult> {
    try {
      const status = await this.repository.getUserDeletionStatusByEmail(email);

      if (!status) {
        return { isPendingDeletion: false };
      }

      if (!status.deletedAt || !status.scheduledDeletionDate) {
        return { isPendingDeletion: false };
      }

      const now = new Date();
      const scheduledDate = new Date(status.scheduledDeletionDate);
      const daysRemaining = Math.ceil(
        (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        isPendingDeletion: true,
        scheduledDeletionDate: status.scheduledDeletionDate,
        daysRemaining: Math.max(0, daysRemaining),
      };
    } catch (error) {
      console.error("Error getting deletion status by email:", error);
      return { error: "Error al obtener el estado de eliminación" };
    }
  }

  public async reactivateAccountByEmail(email: string): Promise<UserResult> {
    try {
      const status = await this.repository.getUserDeletionStatusByEmail(email);

      if (!status) {
        return { error: "Usuario no encontrado" };
      }

      if (!status.deletedAt) {
        return { error: "La cuenta no está pendiente de eliminación" };
      }

      await this.repository.cancelAccountDeletion(status.id);

      await logAuditEvent({
        userId: status.id,
        action: AuditAction.ACCOUNT_DELETION_CANCELLED,
        metadata: { reactivatedViaLogin: true },
      });

      return {
        success: "¡Tu cuenta ha sido reactivada! Ya puedes iniciar sesión.",
      };
    } catch (error) {
      console.error("Error reactivating account:", error);
      return { error: "Error al reactivar la cuenta" };
    }
  }
}
