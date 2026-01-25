"use client";

import { useCallback, useRef, useMemo } from "react";
import type {
  CustomDataTableProps,
  SortingState,
} from "../types";

export function useDataTableState<TData>(props: CustomDataTableProps<TData>) {
  const {
    data,
    columns,
    getRowId,
    selection,
    expansion,
    pagination,
    sorting,
    filter,
  } = props;

  // Refs for stable callbacks and state - prevents recreating callbacks on every render
  const callbacksRef = useRef({
    onSelectionChange: selection?.onSelectionChange,
    onExpansionChange: expansion?.onExpansionChange,
    onPaginationChange: pagination?.onPaginationChange,
    onSortingChange: sorting?.onSortingChange,
    onGlobalFilterChange: filter?.onGlobalFilterChange,
  });

  // Refs for data and getRowId to avoid dependency cascades
  const dataRef = useRef(data);
  const getRowIdRef = useRef(getRowId);
  const columnsRef = useRef(columns);

  // Ref for current selection state to avoid stale closures
  const selectionStateRef = useRef(selection?.selectedRows ?? {});
  const selectionModeRef = useRef(selection?.mode ?? "multiple");
  const selectionEnabledRef = useRef(selection?.enabled ?? false);

  // Update refs on every render (safe pattern for callbacks)
  callbacksRef.current = {
    onSelectionChange: selection?.onSelectionChange,
    onExpansionChange: expansion?.onExpansionChange,
    onPaginationChange: pagination?.onPaginationChange,
    onSortingChange: sorting?.onSortingChange,
    onGlobalFilterChange: filter?.onGlobalFilterChange,
  };
  dataRef.current = data;
  getRowIdRef.current = getRowId;
  columnsRef.current = columns;
  selectionStateRef.current = selection?.selectedRows ?? {};
  selectionModeRef.current = selection?.mode ?? "multiple";
  selectionEnabledRef.current = selection?.enabled ?? false;

  // Selection handlers - stable reference using refs
  const toggleRowSelection = useCallback(
    (rowId: string) => {
      if (!selectionEnabledRef.current) return;

      const current = selectionStateRef.current;
      const isSelected = !!current[rowId];

      if (selectionModeRef.current === "single") {
        // Single mode: only one can be selected
        callbacksRef.current.onSelectionChange?.(
          isSelected ? {} : { [rowId]: true }
        );
      } else {
        // Multiple mode: toggle
        const newSelection = { ...current };
        if (isSelected) {
          delete newSelection[rowId];
        } else {
          newSelection[rowId] = true;
        }
        callbacksRef.current.onSelectionChange?.(newSelection);
      }
    },
    [] // Empty deps - uses refs for stable reference
  );

  // Ref for expansion state
  const expansionStateRef = useRef(expansion?.expandedRows ?? {});
  const expansionEnabledRef = useRef(expansion?.enabled ?? false);
  expansionStateRef.current = expansion?.expandedRows ?? {};
  expansionEnabledRef.current = expansion?.enabled ?? false;

  // Stable selectAllRows - uses refs to avoid recreation on data changes
  const selectAllRows = useCallback(() => {
    if (!selectionEnabledRef.current || selectionModeRef.current === "single") return;

    const newSelection: Record<string, boolean> = {};
    const currentData = dataRef.current;
    const getId = getRowIdRef.current;

    for (let i = 0; i < currentData.length; i++) {
      newSelection[getId(currentData[i])] = true;
    }
    callbacksRef.current.onSelectionChange?.(newSelection);
  }, []); // Empty deps - stable reference using refs

  const clearSelection = useCallback(() => {
    callbacksRef.current.onSelectionChange?.({});
  }, []);

  // Selection state object - stable reference when selection doesn't change
  // Each row will check its own state using this object directly
  const selectionState = useMemo(
    () => selection?.selectedRows ?? {},
    [selection?.selectedRows]
  );

  // isRowSelected - stable callback that uses the selection state
  // This is kept for backwards compatibility but rows should use selectionState directly
  const isRowSelected = useCallback(
    (rowId: string) => !!selectionState[rowId],
    [selectionState]
  );

  const isAllSelected = useMemo(() => {
    if (!selection?.enabled || data.length === 0) return false;
    return data.every((row) => selection.selectedRows[getRowId(row)]);
  }, [selection?.enabled, selection?.selectedRows, data, getRowId]);

  const isSomeSelected = useMemo(() => {
    if (!selection?.enabled || data.length === 0) return false;
    const selectedCount = data.filter(
      (row) => selection.selectedRows[getRowId(row)]
    ).length;
    return selectedCount > 0 && selectedCount < data.length;
  }, [selection?.enabled, selection?.selectedRows, data, getRowId]);

  const selectedCount = useMemo(() => {
    if (!selection?.enabled) return 0;
    return Object.keys(selection.selectedRows).filter(
      (k) => selection.selectedRows[k]
    ).length;
  }, [selection?.enabled, selection?.selectedRows]);

  // Expansion handlers - stable reference using refs
  const toggleRowExpansion = useCallback(
    (rowId: string) => {
      if (!expansionEnabledRef.current) return;

      const current = expansionStateRef.current;
      const isExpanded = !!current[rowId];

      const newExpansion = { ...current };
      if (isExpanded) {
        delete newExpansion[rowId];
      } else {
        newExpansion[rowId] = true;
      }
      callbacksRef.current.onExpansionChange?.(newExpansion);
    },
    [] // Empty deps - uses refs for stable reference
  );

  // Ref for expansion canExpand function
  const canExpandRef = useRef(expansion?.canExpand);
  canExpandRef.current = expansion?.canExpand;

  // Stable expandAllRows - uses refs to avoid recreation on data changes
  const expandAllRows = useCallback(() => {
    if (!expansionEnabledRef.current) return;

    const newExpansion: Record<string, boolean> = {};
    const currentData = dataRef.current;
    const getId = getRowIdRef.current;
    const canExpandFn = canExpandRef.current;

    for (let i = 0; i < currentData.length; i++) {
      const row = currentData[i];
      const canExpand = canExpandFn ? canExpandFn(row) : true;
      if (canExpand) {
        newExpansion[getId(row)] = true;
      }
    }
    callbacksRef.current.onExpansionChange?.(newExpansion);
  }, []); // Empty deps - stable reference using refs

  const collapseAllRows = useCallback(() => {
    callbacksRef.current.onExpansionChange?.({});
  }, []);

  // Expansion state object - stable reference when expansion doesn't change
  const expansionState = useMemo(
    () => expansion?.expandedRows ?? {},
    [expansion?.expandedRows]
  );

  // isRowExpanded - stable callback for backwards compatibility
  const isRowExpanded = useCallback(
    (rowId: string) => !!expansionState[rowId],
    [expansionState]
  );

  // Sorting handlers
  const toggleSort = useCallback(
    (columnId: string) => {
      if (!sorting) return;

      const currentSort = sorting.sorting.find((s) => s.id === columnId);
      let newSorting: SortingState[];

      if (!currentSort) {
        // Not sorted -> asc
        newSorting = sorting.enableMultiSort
          ? [...sorting.sorting, { id: columnId, desc: false }]
          : [{ id: columnId, desc: false }];
      } else if (!currentSort.desc) {
        // asc -> desc
        newSorting = sorting.sorting.map((s) =>
          s.id === columnId ? { ...s, desc: true } : s
        );
      } else {
        // desc -> remove
        newSorting = sorting.sorting.filter((s) => s.id !== columnId);
      }

      callbacksRef.current.onSortingChange?.(newSorting);
    },
    [sorting]
  );

  const getSortDirection = useCallback(
    (columnId: string): "asc" | "desc" | false => {
      if (!sorting) return false;
      const sort = sorting.sorting.find((s) => s.id === columnId);
      if (!sort) return false;
      return sort.desc ? "desc" : "asc";
    },
    [sorting]
  );

  // Pagination handlers
  const goToPage = useCallback(
    (pageIndex: number) => {
      if (!pagination) return;
      callbacksRef.current.onPaginationChange?.({
        pageIndex,
        pageSize: pagination.pageSize,
      });
    },
    [pagination]
  );

  const setPageSize = useCallback(
    (pageSize: number) => {
      if (!pagination) return;
      callbacksRef.current.onPaginationChange?.({
        pageIndex: 0,
        pageSize,
      });
    },
    [pagination]
  );

  // Filter handler
  const setGlobalFilter = useCallback(
    (value: string) => {
      callbacksRef.current.onGlobalFilterChange?.(value);
    },
    []
  );

  // Process data (filtering + sorting for client-side)
  const processedData = useMemo(() => {
    let result = [...data];

    // Client-side filtering
    if (filter?.globalFilter && filter.filterFn) {
      result = result.filter((row) => filter.filterFn!(row, filter.globalFilter));
    }

    // Client-side sorting
    if (sorting && !sorting.manualSorting && sorting.sorting.length > 0) {
      result.sort((a, b) => {
        for (const sort of sorting.sorting) {
          const column = columns.find((c) => c.id === sort.id);
          if (!column) continue;

          let comparison = 0;
          if (column.sortingFn) {
            comparison = column.sortingFn(a, b);
          } else if (column.accessorKey) {
            const aVal = a[column.accessorKey];
            const bVal = b[column.accessorKey];
            if (aVal < bVal) comparison = -1;
            else if (aVal > bVal) comparison = 1;
          }

          if (comparison !== 0) {
            return sort.desc ? -comparison : comparison;
          }
        }
        return 0;
      });
    }

    return result;
  }, [data, filter?.globalFilter, filter?.filterFn, sorting, columns]);

  // Get selected rows - stable using refs
  const getSelectedRows = useCallback(() => {
    if (!selectionEnabledRef.current) return [];
    const currentData = dataRef.current;
    const getId = getRowIdRef.current;
    const selectedRows = selectionStateRef.current;

    const result: TData[] = [];
    for (let i = 0; i < currentData.length; i++) {
      const row = currentData[i];
      if (selectedRows[getId(row)]) {
        result.push(row);
      }
    }
    return result;
  }, []); // Empty deps - stable reference using refs

  return {
    // Selection
    toggleRowSelection,
    selectAllRows,
    clearSelection,
    isRowSelected,
    selectionState, // Direct state object for optimized row rendering
    isAllSelected,
    isSomeSelected,
    selectedCount,
    getSelectedRows,

    // Expansion
    toggleRowExpansion,
    expandAllRows,
    collapseAllRows,
    isRowExpanded,
    expansionState, // Direct state object for optimized row rendering

    // Sorting
    toggleSort,
    getSortDirection,

    // Pagination
    goToPage,
    setPageSize,

    // Filter
    setGlobalFilter,

    // Processed data
    processedData,
  };
}
