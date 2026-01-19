import { TwoFactorRepository } from "../repository/two-factor.repository";
import { TwoFactorInput } from "../validations/schema/two-factor.schema";

export interface TwoFactorValidationResult {
  isValid: boolean;
  error?: string;
  userId?: string;
  tokenId?: string;
}

export class TwoFactorDomainService {
  private repository: TwoFactorRepository;

  constructor() {
    this.repository = new TwoFactorRepository();
  }

  public async validateTwoFactorCode(
    input: TwoFactorInput
  ): Promise<TwoFactorValidationResult> {
    const user = await this.repository.getUserByEmail(input.email);

    if (!user) {
      return {
        isValid: false,
        error: "Usuario no encontrado",
      };
    }

    const twoFactorToken = await this.repository.getTwoFactorTokenByEmail(
      input.email
    );

    if (!twoFactorToken) {
      return {
        isValid: false,
        error: "Código no encontrado. Solicita uno nuevo.",
      };
    }

    if (twoFactorToken.token !== input.code) {
      return {
        isValid: false,
        error: "Código incorrecto",
      };
    }

    const hasExpired = new Date(twoFactorToken.expires) < new Date();

    if (hasExpired) {
      return {
        isValid: false,
        error: "El código ha expirado. Solicita uno nuevo.",
      };
    }

    return {
      isValid: true,
      userId: user.id,
      tokenId: twoFactorToken.id,
    };
  }

  public async validateUserForTwoFactor(email: string): Promise<{
    isValid: boolean;
    error?: string;
    user?: { id: string; email: string; isTwoFactorEnabled: boolean };
  }> {
    const user = await this.repository.getUserByEmail(email);

    if (!user || !user.email) {
      return {
        isValid: false,
        error: "Usuario no encontrado",
      };
    }

    return {
      isValid: true,
      user: {
        id: user.id,
        email: user.email,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
      },
    };
  }
}
