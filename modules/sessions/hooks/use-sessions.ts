"use client";

import { useState, useCallback, useEffect, useTransition } from "react";
import { toast } from "sonner";
import {
  getActiveSessionsAction,
  revokeSessionAction,
  revokeAllOtherSessionsAction,
} from "../actions/sessions.actions";
import type { SessionData } from "../types/sessions.types";

export function useSessions() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getActiveSessionsAction();

      if (result.error) {
        setError(result.error);
        return;
      }

      setSessions(result.sessions || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar sesiones";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const revokeSession = useCallback(
    (sessionId: string) => {
      startTransition(async () => {
        try {
          const result = await revokeSessionAction(sessionId);

          if (result.error) {
            toast.error(result.error);
            return;
          }

          toast.success(result.success);
          setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Error al cerrar sesión";
          toast.error(errorMessage);
        }
      });
    },
    []
  );

  const revokeAllOther = useCallback(() => {
    startTransition(async () => {
      try {
        const result = await revokeAllOtherSessionsAction();

        if (result.error) {
          toast.error(result.error);
          return;
        }

        toast.success(result.success);
        setSessions((prev) => prev.filter((s) => s.isCurrent));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al cerrar sesiones";
        toast.error(errorMessage);
      }
    });
  }, []);

  const hasOtherSessions = sessions.filter((s) => !s.isCurrent).length > 0;

  return {
    sessions,
    isLoading,
    isPending,
    error,
    revokeSession,
    revokeAllOther,
    refresh: loadSessions,
    hasOtherSessions,
  };
}
