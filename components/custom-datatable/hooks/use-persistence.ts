"use client";

import { useEffect, useCallback, useRef } from "react";
import type {
  PersistenceConfig,
  ColumnVisibilityState,
  ColumnSizingState,
  SortingState,
  DensityType,
} from "../types";

interface PersistedState {
  columnVisibility?: ColumnVisibilityState;
  sorting?: SortingState;
  density?: DensityType;
  pageSize?: number;
  columnSizing?: ColumnSizingState;
  columnPinning?: { left: string[]; right: string[] };
}

interface UsePersistenceProps {
  enabled: boolean;
  config?: PersistenceConfig;
  state: {
    columnVisibility?: ColumnVisibilityState;
    sorting?: SortingState;
    density?: DensityType;
    pageSize?: number;
    columnSizing?: ColumnSizingState;
    columnPinning?: { left: string[]; right: string[] };
  };
  onStateRestore?: (state: PersistedState) => void;
}

export function usePersistence({
  enabled,
  config,
  state,
  onStateRestore,
}: UsePersistenceProps) {
  const isInitialized = useRef(false);
  const storageKey = config?.key ?? "datatable-state";
  const storage = config?.storage === "sessionStorage" ? sessionStorage : localStorage;
  const include = config?.include ?? [
    "columnVisibility",
    "sorting",
    "density",
    "pageSize",
    "columnSizing",
    "columnPinning",
  ];

  // Get storage instance
  const getStorage = useCallback(() => {
    if (typeof window === "undefined") return null;
    return config?.storage === "sessionStorage" ? sessionStorage : localStorage;
  }, [config?.storage]);

  // Load state from storage
  const loadState = useCallback((): PersistedState | null => {
    const storageInstance = getStorage();
    if (!storageInstance) return null;

    try {
      const stored = storageInstance.getItem(storageKey);
      if (!stored) return null;

      const parsed = JSON.parse(stored) as PersistedState;
      return parsed;
    } catch (error) {
      console.error("Error loading persisted state:", error);
      return null;
    }
  }, [storageKey, getStorage]);

  // Save state to storage
  const saveState = useCallback(
    (newState: PersistedState) => {
      const storageInstance = getStorage();
      if (!storageInstance) return;

      try {
        const stateToSave: PersistedState = {};

        if (include.includes("columnVisibility") && newState.columnVisibility) {
          stateToSave.columnVisibility = newState.columnVisibility;
        }
        if (include.includes("sorting") && newState.sorting) {
          stateToSave.sorting = newState.sorting;
        }
        if (include.includes("density") && newState.density) {
          stateToSave.density = newState.density;
        }
        if (include.includes("pageSize") && newState.pageSize) {
          stateToSave.pageSize = newState.pageSize;
        }
        if (include.includes("columnSizing") && newState.columnSizing) {
          stateToSave.columnSizing = newState.columnSizing;
        }
        if (include.includes("columnPinning") && newState.columnPinning) {
          stateToSave.columnPinning = newState.columnPinning;
        }

        storageInstance.setItem(storageKey, JSON.stringify(stateToSave));
      } catch (error) {
        console.error("Error saving persisted state:", error);
      }
    },
    [storageKey, include, getStorage]
  );

  // Clear persisted state
  const clearState = useCallback(() => {
    const storageInstance = getStorage();
    if (!storageInstance) return;

    try {
      storageInstance.removeItem(storageKey);
    } catch (error) {
      console.error("Error clearing persisted state:", error);
    }
  }, [storageKey, getStorage]);

  // Restore state on mount
  useEffect(() => {
    if (!enabled || !config?.enabled || isInitialized.current) return;

    const savedState = loadState();
    if (savedState && onStateRestore) {
      onStateRestore(savedState);
    }

    isInitialized.current = true;
  }, [enabled, config?.enabled, loadState, onStateRestore]);

  // Auto-save state when it changes
  useEffect(() => {
    if (!enabled || !config?.enabled || !isInitialized.current) return;

    const timeoutId = setTimeout(() => {
      saveState(state);
    }, 300); // Debounce to avoid excessive saves

    return () => clearTimeout(timeoutId);
  }, [enabled, config?.enabled, state, saveState]);

  return {
    loadState,
    saveState,
    clearState,
    isInitialized: isInitialized.current,
  };
}
