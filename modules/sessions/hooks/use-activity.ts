"use client";

import { useCallback, useTransition, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getRecentActivityAction } from "../actions/sessions.actions";
import type { ActivityData } from "../types/sessions.types";
import type { PaginationMeta } from "@/types/pagination.types";

interface UseRecentActivityProps {
  initialActivities: ActivityData[];
  initialPagination: PaginationMeta | null;
  initialError?: string | null;
}

export function useRecentActivity({
  initialActivities,
  initialPagination,
  initialError,
}: UseRecentActivityProps) {
  const router = useRouter();
  const [isLoadingMore, startTransition] = useTransition();

  // useRef para acumular actividades adicionales sin causar re-renders
  const extraActivitiesRef = useRef<ActivityData[]>([]);
  const currentPaginationRef = useRef<PaginationMeta | null>(initialPagination);

  // Forzar re-render solo cuando sea necesario
  const forceUpdateRef = useRef(0);

  // useMemo para combinar actividades iniciales con las cargadas posteriormente
  const activities = useMemo(() => {
    // Leer forceUpdateRef para que el memo se invalide cuando cambie
    void forceUpdateRef.current;
    return [...initialActivities, ...extraActivitiesRef.current];
  }, [initialActivities, forceUpdateRef.current]);

  const hasMore = useMemo(() => {
    void forceUpdateRef.current;
    return currentPaginationRef.current?.hasNextPage ?? false;
  }, [forceUpdateRef.current]);

  const total = useMemo(() => {
    void forceUpdateRef.current;
    return currentPaginationRef.current?.total ?? initialPagination?.total ?? 0;
  }, [initialPagination?.total, forceUpdateRef.current]);

  const refresh = useCallback(() => {
    // Reset extra activities on refresh
    extraActivitiesRef.current = [];
    currentPaginationRef.current = initialPagination;
    startTransition(() => {
      router.refresh();
    });
  }, [router, initialPagination]);

  const loadMore = useCallback(() => {
    if (!currentPaginationRef.current?.hasNextPage || isLoadingMore) return;

    startTransition(async () => {
      try {
        const nextPage = currentPaginationRef.current!.page + 1;
        const result = await getRecentActivityAction(nextPage, 10);

        if ("error" in result) {
          return;
        }

        extraActivitiesRef.current = [...extraActivitiesRef.current, ...result.data];
        currentPaginationRef.current = result.pagination;
        // Forzar re-render
        forceUpdateRef.current += 1;
      } catch (err) {
        console.error("Error loading more activity:", err);
      }
    });
  }, [isLoadingMore]);

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
