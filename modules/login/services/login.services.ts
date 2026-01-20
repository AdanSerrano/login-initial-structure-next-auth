import { generateTwoFactorToken } from "@/lib/tokens";
import { db } from "@/utils/db";
import { sendTwoFactorEmail } from "@/modules/two-factor/emails/two-factor.emails";
import { LoginUser } from "../validations/schema/login.schema";
import { LoginAuthService, AuthResult } from "./login.auth.service";
import { LoginDomainService } from "./login.domain.service";
import {
  checkAccountLock,
  recordFailedLogin,
  resetFailedAttempts,
} from "@/lib/account-security";
import { isUserBlocked } from "@/lib/user-blocking";
import { logLoginSuccess } from "@/lib/audit";
import bcrypt from "bcryptjs";

export interface LoginResult extends AuthResult {
  rateLimited?: boolean;
  remainingAttempts?: number;
  requiresTwoFactor?: boolean;
  email?: string;
  pendingDeletion?: boolean;
  scheduledDeletionDate?: Date;
  daysRemaining?: number;
}

export interface RequestContext {
  ipAddress?: string | null;
  userAgent?: string | null;
}

export class LoginService {
  private loginDomainService: LoginDomainService;
  private loginAuthService: LoginAuthService;

  constructor() {
    this.loginDomainService = new LoginDomainService();
    this.loginAuthService = new LoginAuthService();
  }

  public async login(loginUser: LoginUser, context?: RequestContext): Promise<LoginResult> {
    try {
      const domainValidation =
        await this.loginDomainService.validateLoginBusinessRules(loginUser);

      if (!domainValidation.isValid) {
        return {
          error: domainValidation.error,
          redirect: domainValidation.redirect,
        };
      }

      const identifier = domainValidation.identifier;
      const user = domainValidation.user;

      if (!identifier || !user) {
        return { error: "Error interno de validación" };
      }

      const userBlocked = await isUserBlocked(user.id);
      if (userBlocked) {
        return {
          error: "Tu cuenta ha sido suspendida. Contacta a soporte para más información.",
        };
      }

      if (user.deletedAt && user.scheduledDeletionDate) {
        const now = new Date();
        const scheduledDate = new Date(user.scheduledDeletionDate);

        if (scheduledDate > now) {
          const daysRemaining = Math.ceil(
            (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );

          return {
            pendingDeletion: true,
            email: user.email || undefined,
            scheduledDeletionDate: user.scheduledDeletionDate,
            daysRemaining,
          };
        }
      }

      const accountLock = await checkAccountLock(user.id);
      if (!accountLock.allowed) {
        return {
          error: accountLock.error?.message || "Cuenta bloqueada temporalmente",
          rateLimited: true,
        };
      }

      const passwordMatch = await bcrypt.compare(loginUser.password, user.password);
      if (!passwordMatch) {
        const failedResult = await recordFailedLogin(
          user.id,
          user.email || identifier,
          "Contraseña incorrecta",
          context?.ipAddress ?? undefined,
          context?.userAgent ?? undefined
        );

        if (!failedResult.allowed) {
          return {
            error: failedResult.error?.message || "Cuenta bloqueada por demasiados intentos fallidos",
            rateLimited: true,
          };
        }

        return {
          error: "Contraseña incorrecta",
          remainingAttempts: failedResult.remainingAttempts,
        };
      }

      if (user.isTwoFactorEnabled && user.email) {
        const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
          where: { userId: user.id },
        });

        if (twoFactorConfirmation) {
          await db.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id },
          });
        } else {
          const twoFactorToken = await generateTwoFactorToken(user.email);
          await sendTwoFactorEmail(user.email, twoFactorToken.token);

          return {
            requiresTwoFactor: true,
            email: user.email,
            success: "Código de verificación enviado",
          };
        }
      }

      const authResult = await this.loginAuthService.authenticateUser(
        identifier,
        loginUser.password
      );

      if (authResult.success) {
        await resetFailedAttempts(user.id);
        await logLoginSuccess(
          user.id,
          context?.ipAddress ?? undefined,
          context?.userAgent ?? undefined
        );
      }

      return authResult;
    } catch (error) {
      console.error("Error en login service:", error);
      return { error: "Error al verificar credenciales" };
    }
  }
}
