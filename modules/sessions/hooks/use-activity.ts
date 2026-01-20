"use client";

import { useState, useCallback, useEffect, useTransition } from "react";
import { getRecentActivityAction } from "../actions/sessions.actions";
import type { ActivityData } from "../types/sessions.types";
import type { PaginationMeta } from "@/types/pagination.types";

const DEFAULT_LIMIT = 10;

export function useRecentActivity() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const loadInitial = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getRecentActivityAction(1, DEFAULT_LIMIT);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      setActivities(result.data);
      setPagination(result.pagination);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar actividad";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const loadMore = useCallback(() => {
    if (!pagination?.hasNextPage) return;

    startTransition(async () => {
      try {
        const nextPage = pagination.page + 1;
        const result = await getRecentActivityAction(nextPage, DEFAULT_LIMIT);

        if ("error" in result) {
          return;
        }

        setActivities((prev) => [...prev, ...result.data]);
        setPagination(result.pagination);
      } catch (err) {
        console.error("Error loading more activity:", err);
      }
    });
  }, [pagination]);

  const hasMore = pagination?.hasNextPage ?? false;

  return {
    activities,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh: loadInitial,
    total: pagination?.total ?? 0,
  };
}
