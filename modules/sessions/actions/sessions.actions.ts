"use server";

import { auth } from "@/auth";
import { SessionsService } from "../services/sessions.services";
import type { PaginatedResponse } from "@/types/pagination.types";
import type {
  SessionsResult,
  RevokeSessionResult,
  RevokeAllResult,
  ActivityData,
} from "../types/sessions.types";

const sessionsService = new SessionsService();

export async function getActiveSessionsAction(): Promise<SessionsResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  const currentToken = (session as { sessionToken?: string }).sessionToken;

  return await sessionsService.getActiveSessions(session.user.id, currentToken);
}

export async function getRecentActivityAction(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<ActivityData> | { error: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  return await sessionsService.getRecentActivity(session.user.id, page, limit);
}

export async function revokeSessionAction(
  sessionId: string
): Promise<RevokeSessionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  const currentToken = (session as { sessionToken?: string }).sessionToken;

  return await sessionsService.revokeSession(
    sessionId,
    session.user.id,
    currentToken
  );
}

export async function revokeAllOtherSessionsAction(): Promise<RevokeAllResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "No autorizado" };
  }

  const currentToken = (session as { sessionToken?: string }).sessionToken;

  if (!currentToken) {
    return { error: "No se pudo identificar la sesión actual" };
  }

  return await sessionsService.revokeOtherSessions(
    session.user.id,
    currentToken
  );
}
