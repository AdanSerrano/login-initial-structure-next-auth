import { db } from "@/utils/db";
import { parseUserAgent } from "@/lib/device-parser";
import {
  createPaginationMeta,
  type PaginatedResponse,
} from "@/types/pagination.types";
import type { CreateSessionInput, ActivityData } from "../types/sessions.types";

export class SessionsRepository {
  public async getActiveSessions(userId: string) {
    return await db.session.findMany({
      where: { userId },
      orderBy: { lastActive: "desc" },
    });
  }

  public async getRecentActivity(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResponse<ActivityData>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      db.auditLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          action: true,
          ipAddress: true,
          userAgent: true,
          metadata: true,
          createdAt: true,
        },
      }),
      db.auditLog.count({ where: { userId } }),
    ]);

    const activityWithDevice: ActivityData[] = data.map((item) => {
      const deviceInfo = parseUserAgent(item.userAgent);
      return {
        ...item,
        metadata: item.metadata as Record<string, unknown> | null,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
      };
    });

    return {
      data: activityWithDevice,
      pagination: createPaginationMeta(page, limit, total),
    };
  }

  public async createSession(input: CreateSessionInput) {
    const deviceInfo = parseUserAgent(input.userAgent);

    return await db.session.create({
      data: {
        userId: input.userId,
        token: input.token,
        deviceType: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        ipAddress: input.ipAddress,
      },
    });
  }

  public async updateSessionActivity(token: string) {
    await db.session.update({
      where: { token },
      data: { lastActive: new Date() },
    });
  }

  public async findSessionByToken(token: string) {
    return await db.session.findUnique({
      where: { token },
    });
  }

  public async revokeSession(sessionId: string, userId: string) {
    const session = await db.session.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      return false;
    }

    await db.session.delete({
      where: { id: sessionId },
    });

    return true;
  }

  public async revokeOtherSessions(userId: string, currentToken: string) {
    const result = await db.session.deleteMany({
      where: {
        userId,
        token: { not: currentToken },
      },
    });

    return result.count;
  }

  public async revokeAllSessions(userId: string) {
    const result = await db.session.deleteMany({
      where: { userId },
    });

    return result.count;
  }

  public async deleteSessionByToken(token: string) {
    try {
      await db.session.delete({
        where: { token },
      });
      return true;
    } catch {
      return false;
    }
  }
}
