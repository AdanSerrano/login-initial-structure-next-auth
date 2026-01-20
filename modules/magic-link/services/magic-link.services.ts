import { MagicLinkRepository } from "../repository/magic-link.repository";
import { sendMagicLinkEmail } from "../emails/magic-link.emails";
import {
  RequestMagicLinkInput,
  requestMagicLinkSchema,
} from "../validations/schema/magic-link.schema";

export interface MagicLinkResult {
  success?: string;
  error?: string;
  user?: {
    id: string;
    email: string | null;
    name: string | null;
    userName: string | null;
    image: string | null;
    role: string;
    isTwoFactorEnabled: boolean;
  };
}

export interface RequestContext {
  ipAddress?: string | null;
  userAgent?: string | null;
}

export class MagicLinkService {
  private repository: MagicLinkRepository;

  constructor() {
    this.repository = new MagicLinkRepository();
  }

  async requestMagicLink(
    input: RequestMagicLinkInput,
    context?: RequestContext
  ): Promise<MagicLinkResult> {
    const validatedFields = requestMagicLinkSchema.safeParse(input);

    if (!validatedFields.success) {
      return { error: "Email inválido" };
    }

    const { email } = validatedFields.data;

    const user = await this.repository.getUserByEmail(email);

    if (!user) {
      return {
        success:
          "Si el email existe, recibirás un enlace para iniciar sesión",
      };
    }

    if (user.deletedAt) {
      return { error: "Esta cuenta ha sido eliminada" };
    }

    if (user.isBlocked) {
      return { error: "Esta cuenta está bloqueada" };
    }

    if (!user.emailVerified) {
      return {
        error: "Debes verificar tu email antes de usar Magic Link",
      };
    }

    const magicLinkToken = await this.repository.generateMagicLinkToken(email);

    const emailResult = await sendMagicLinkEmail(email, magicLinkToken.token);

    if (!emailResult.success) {
      return { error: "Error al enviar el email" };
    }

    await this.repository.createAuditLog(
      user.id,
      "MAGIC_LINK_REQUESTED",
      { email },
      context?.ipAddress,
      context?.userAgent
    );

    return {
      success: "Te hemos enviado un enlace para iniciar sesión",
    };
  }

  async verifyMagicLink(
    token: string,
    context?: RequestContext
  ): Promise<MagicLinkResult> {
    const magicLinkToken = await this.repository.getMagicLinkTokenByToken(token);

    if (!magicLinkToken) {
      return { error: "Enlace inválido o expirado" };
    }

    const hasExpired = new Date(magicLinkToken.expires) < new Date();

    if (hasExpired) {
      await this.repository.deleteMagicLinkToken(magicLinkToken.id);
      return { error: "El enlace ha expirado. Solicita uno nuevo." };
    }

    const user = await this.repository.getUserByEmail(magicLinkToken.email);

    if (!user) {
      await this.repository.deleteMagicLinkToken(magicLinkToken.id);
      return { error: "Usuario no encontrado" };
    }

    if (user.deletedAt) {
      await this.repository.deleteMagicLinkToken(magicLinkToken.id);
      return { error: "Esta cuenta ha sido eliminada" };
    }

    if (user.isBlocked) {
      await this.repository.deleteMagicLinkToken(magicLinkToken.id);
      return { error: "Esta cuenta está bloqueada" };
    }

    await this.repository.deleteMagicLinkToken(magicLinkToken.id);

    await this.repository.createAuditLog(
      user.id,
      "MAGIC_LINK_LOGIN",
      { email: user.email },
      context?.ipAddress,
      context?.userAgent
    );

    return {
      success: "Sesión iniciada correctamente",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userName: user.userName,
        image: user.image,
        role: user.role,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
      },
    };
  }
}
