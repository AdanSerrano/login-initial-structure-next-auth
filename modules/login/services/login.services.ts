import {
  checkRateLimit,
  formatResetTime,
  resetRateLimit,
} from "@/lib/rate-limit";
import { generateTwoFactorToken } from "@/lib/tokens";
import { db } from "@/utils/db";
import { sendTwoFactorEmail } from "@/modules/two-factor/emails/two-factor.emails";
import { LoginUser } from "../validations/schema/login.schema";
import { LoginAuthService, AuthResult } from "./login.auth.service";
import { LoginDomainService } from "./login.domain.service";

export interface LoginResult extends AuthResult {
  rateLimited?: boolean;
  remainingAttempts?: number;
  requiresTwoFactor?: boolean;
  email?: string;
}

export class LoginService {
  private loginDomainService: LoginDomainService;
  private loginAuthService: LoginAuthService;

  constructor() {
    this.loginDomainService = new LoginDomainService();
    this.loginAuthService = new LoginAuthService();
  }

  public async login(loginUser: LoginUser): Promise<LoginResult> {
    try {
      const rateLimitKey = loginUser.identifier.toLowerCase();
      const rateLimit = checkRateLimit(rateLimitKey);

      if (!rateLimit.allowed) {
        return {
          error: `Demasiados intentos fallidos. Intenta de nuevo en ${formatResetTime(rateLimit.resetIn)}.`,
          rateLimited: true,
        };
      }

      const domainValidation =
        await this.loginDomainService.validateLoginBusinessRules(loginUser);

      if (!domainValidation.isValid) {
        return {
          error: domainValidation.error,
          redirect: domainValidation.redirect,
          remainingAttempts: rateLimit.remainingAttempts,
        };
      }

      const identifier = domainValidation.identifier;
      const user = domainValidation.user;

      if (!identifier || !user) {
        return { error: "Error interno de validación" };
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
        resetRateLimit(rateLimitKey);
      }

      return authResult;
    } catch (error) {
      console.error("Error en login service:", error);
      return { error: "Error al verificar credenciales" };
    }
  }
}
