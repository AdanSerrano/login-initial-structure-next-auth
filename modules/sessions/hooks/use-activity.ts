"use client";

import { useCallback, useTransition, useMemo, useReducer } from "react";
import { useRouter } from "next/navigation";
import { getRecentActivityAction } from "../actions/sessions.actions";
import type { ActivityData } from "../types/sessions.types";
import type { PaginationMeta } from "@/types/pagination.types";

interface UseRecentActivityProps {
  initialActivities: ActivityData[];
  initialPagination: PaginationMeta | null;
  initialError?: string | null;
}

// Reducer para forzar actualizaciones de manera segura
type ActivityState = {
  extraActivities: ActivityData[];
  currentPagination: PaginationMeta | null;
};

type ActivityAction =
  | { type: "APPEND_ACTIVITIES"; activities: ActivityData[]; pagination: PaginationMeta }
  | { type: "RESET"; pagination: PaginationMeta | null };

function activityReducer(state: ActivityState, action: ActivityAction): ActivityState {
  switch (action.type) {
    case "APPEND_ACTIVITIES":
      return {
        extraActivities: [...state.extraActivities, ...action.activities],
        currentPagination: action.pagination,
      };
    case "RESET":
      return {
        extraActivities: [],
        currentPagination: action.pagination,
      };
    default:
      return state;
  }
}

export function useRecentActivity({
  initialActivities,
  initialPagination,
  initialError,
}: UseRecentActivityProps) {
  const router = useRouter();
  const [isLoadingMore, startTransition] = useTransition();

  // useReducer para manejar estado de manera segura (evita ref en useMemo deps)
  const [state, dispatch] = useReducer(activityReducer, {
    extraActivities: [],
    currentPagination: initialPagination,
  });

  // useMemo para combinar actividades iniciales con las cargadas posteriormente
  const activities = useMemo(() => {
    return [...initialActivities, ...state.extraActivities];
  }, [initialActivities, state.extraActivities]);

  const hasMore = useMemo(() => {
    return state.currentPagination?.hasNextPage ?? false;
  }, [state.currentPagination?.hasNextPage]);

  const total = useMemo(() => {
    return state.currentPagination?.total ?? initialPagination?.total ?? 0;
  }, [state.currentPagination?.total, initialPagination?.total]);

  const refresh = useCallback(() => {
    dispatch({ type: "RESET", pagination: initialPagination });
    startTransition(() => {
      router.refresh();
    });
  }, [router, initialPagination]);

  const loadMore = useCallback(() => {
    if (!state.currentPagination?.hasNextPage || isLoadingMore) return;

    startTransition(async () => {
      try {
        const nextPage = state.currentPagination!.page + 1;
        const result = await getRecentActivityAction(nextPage, 10);

        if ("error" in result) {
          return;
        }

        dispatch({
          type: "APPEND_ACTIVITIES",
          activities: result.data,
          pagination: result.pagination,
        });
      } catch (err) {
        console.error("Error loading more activity:", err);
      }
    });
  }, [state.currentPagination, isLoadingMore]);

  return {
    activities,
    error: initialError,
    isLoadingMore,
    hasMore,
    loadMore,
    refresh,
    total,
  };
}
