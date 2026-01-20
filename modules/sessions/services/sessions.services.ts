import { SessionsRepository } from "../repository/sessions.repository";
import type {
  SessionData,
  CreateSessionInput,
  SessionsResult,
  RevokeSessionResult,
  RevokeAllResult,
} from "../types/sessions.types";
import type { PaginatedResponse } from "@/types/pagination.types";
import type { ActivityData } from "../types/sessions.types";
import type { DeviceType } from "@/lib/device-parser";

export class SessionsService {
  private repository: SessionsRepository;

  constructor() {
    this.repository = new SessionsRepository();
  }

  public async getActiveSessions(
    userId: string,
    currentToken?: string
  ): Promise<SessionsResult> {
    try {
      const sessions = await this.repository.getActiveSessions(userId);

      const sessionsWithCurrent: SessionData[] = sessions.map((session) => ({
        id: session.id,
        userId: session.userId,
        token: session.token,
        deviceType: session.deviceType as DeviceType | null,
        browser: session.browser,
        os: session.os,
        ipAddress: session.ipAddress,
        lastActive: session.lastActive,
        createdAt: session.createdAt,
        isCurrent: currentToken ? session.token === currentToken : false,
      }));

      const sortedSessions = sessionsWithCurrent.sort((a, b) => {
        if (a.isCurrent) return -1;
        if (b.isCurrent) return 1;
        return b.lastActive.getTime() - a.lastActive.getTime();
      });

      return { sessions: sortedSessions };
    } catch (error) {
      console.error("Error getting active sessions:", error);
      return { error: "Error al obtener las sesiones activas" };
    }
  }

  public async getRecentActivity(
    userId: string,
    page: number,
    limit: number
  ): Promise<PaginatedResponse<ActivityData> | { error: string }> {
    try {
      return await this.repository.getRecentActivity(userId, page, limit);
    } catch (error) {
      console.error("Error getting recent activity:", error);
      return { error: "Error al obtener la actividad reciente" };
    }
  }

  public async createSession(input: CreateSessionInput) {
    try {
      return await this.repository.createSession(input);
    } catch (error) {
      console.error("Error creating session:", error);
      return null;
    }
  }

  public async updateSessionActivity(token: string) {
    try {
      await this.repository.updateSessionActivity(token);
    } catch (error) {
      console.error("Error updating session activity:", error);
    }
  }

  public async revokeSession(
    sessionId: string,
    userId: string,
    currentToken?: string
  ): Promise<RevokeSessionResult> {
    try {
      const sessions = await this.repository.getActiveSessions(userId);
      const sessionToRevoke = sessions.find((s) => s.id === sessionId);

      if (!sessionToRevoke) {
        return { error: "Sesión no encontrada" };
      }

      if (currentToken && sessionToRevoke.token === currentToken) {
        return { error: "No puedes cerrar tu sesión actual desde aquí" };
      }

      const revoked = await this.repository.revokeSession(sessionId, userId);

      if (!revoked) {
        return { error: "No se pudo cerrar la sesión" };
      }

      return { success: "Sesión cerrada correctamente" };
    } catch (error) {
      console.error("Error revoking session:", error);
      return { error: "Error al cerrar la sesión" };
    }
  }

  public async revokeOtherSessions(
    userId: string,
    currentToken: string
  ): Promise<RevokeAllResult> {
    try {
      const count = await this.repository.revokeOtherSessions(
        userId,
        currentToken
      );

      if (count === 0) {
        return { success: "No hay otras sesiones activas" };
      }

      return {
        success: `Se cerraron ${count} sesión${count > 1 ? "es" : ""}`,
        count,
      };
    } catch (error) {
      console.error("Error revoking other sessions:", error);
      return { error: "Error al cerrar las otras sesiones" };
    }
  }

  public async deleteSessionByToken(token: string) {
    return await this.repository.deleteSessionByToken(token);
  }
}
