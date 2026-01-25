"use client";

import { useCallback, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  revokeSessionAction,
  revokeAllOtherSessionsAction,
} from "../actions/sessions.actions";
import type { SessionData } from "../types/sessions.types";

interface UseSessionsProps {
  initialSessions: SessionData[];
  initialError?: string | null;
}

export function useSessions({ initialSessions, initialError }: UseSessionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const hasOtherSessions = useMemo(
    () => initialSessions.filter((s) => !s.isCurrent).length > 0,
    [initialSessions]
  );

  const refresh = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

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
          router.refresh();
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Error al cerrar sesión";
          toast.error(errorMessage);
        }
      });
    },
    [router]
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
        router.refresh();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al cerrar sesiones";
        toast.error(errorMessage);
      }
    });
  }, [router]);

  return {
    sessions: initialSessions,
    error: initialError,
    isPending,
    revokeSession,
    revokeAllOther,
    refresh,
    hasOtherSessions,
  };
}
