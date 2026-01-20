import { db } from "@/utils/db";
import { v4 as uuidv4 } from "uuid";
import type { Prisma } from "@/app/prisma/client";

const MAGIC_LINK_EXPIRY_MINUTES = 15;

export class MagicLinkRepository {
  async getUserByEmail(email: string) {
    return await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        userName: true,
        image: true,
        role: true,
        emailVerified: true,
        isTwoFactorEnabled: true,
        deletedAt: true,
        isBlocked: true,
      },
    });
  }

  async generateMagicLinkToken(email: string) {
    const token = uuidv4();
    const expires = new Date(
      new Date().getTime() + MAGIC_LINK_EXPIRY_MINUTES * 60 * 1000
    );

    const existingToken = await db.magicLinkToken.findFirst({
      where: { email },
    });

    if (existingToken) {
      await db.magicLinkToken.delete({
        where: { id: existingToken.id },
      });
    }

    const magicLinkToken = await db.magicLinkToken.create({
      data: {
        email,
        token,
        expires,
      },
    });

    return magicLinkToken;
  }

  async getMagicLinkTokenByToken(token: string) {
    return await db.magicLinkToken.findUnique({
      where: { token },
    });
  }

  async deleteMagicLinkToken(id: string) {
    await db.magicLinkToken.delete({
      where: { id },
    });
  }

  async createAuditLog(
    userId: string | null,
    action: "MAGIC_LINK_REQUESTED" | "MAGIC_LINK_LOGIN",
    metadata?: Record<string, unknown>,
    ipAddress?: string | null,
    userAgent?: string | null
  ) {
    await db.auditLog.create({
      data: {
        userId,
        action,
        ipAddress,
        userAgent,
        metadata: metadata as Prisma.InputJsonValue | undefined,
      },
    });
  }
}
