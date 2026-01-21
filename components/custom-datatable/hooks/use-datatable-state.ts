"use client";

import { useCallback, useRef, useMemo } from "react";
import type {
  CustomDataTableProps,
  SortingState,
  PaginationState,
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

  // Refs for stable callbacks and state
  const callbacksRef = useRef({
    onSelectionChange: selection?.onSelectionChange,
    onExpansionChange: expansion?.onExpansionChange,
    onPaginationChange: pagination?.onPaginationChange,
    onSortingChange: sorting?.onSortingChange,
    onGlobalFilterChange: filter?.onGlobalFilterChange,
  });

  // Ref for current selection state to avoid stale closures
  const selectionStateRef = useRef(selection?.selectedRows ?? {});
  const selectionModeRef = useRef(selection?.mode ?? "multiple");
  const selectionEnabledRef = useRef(selection?.enabled ?? false);

  // Update refs on every render
  callbacksRef.current = {
    onSelectionChange: selection?.onSelectionChange,
    onExpansionChange: expansion?.onExpansionChange,
    onPaginationChange: pagination?.onPaginationChange,
    onSortingChange: sorting?.onSortingChange,
    onGlobalFilterChange: filter?.onGlobalFilterChange,
  };
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

  const selectAllRows = useCallback(() => {
    if (!selectionEnabledRef.current || selectionModeRef.current === "single") return;

    const newSelection: Record<string, boolean> = {};
    data.forEach((row) => {
      newSelection[getRowId(row)] = true;
    });
    callbacksRef.current.onSelectionChange?.(newSelection);
  }, [data, getRowId]);

  const clearSelection = useCallback(() => {
    callbacksRef.current.onSelectionChange?.({});
  }, []);

  // isRowSelected MUST be reactive - it determines if a row shows as selected
  const isRowSelected = useCallback(
    (rowId: string) => {
      return !!selection?.selectedRows[rowId];
    },
    [selection?.selectedRows] // Must depend on selectedRows to re-render when selection changes
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

  const expandAllRows = useCallback(() => {
    if (!expansionEnabledRef.current) return;

    const newExpansion: Record<string, boolean> = {};
    data.forEach((row) => {
      const canExpand = expansion?.canExpand ? expansion.canExpand(row) : true;
      if (canExpand) {
        newExpansion[getRowId(row)] = true;
      }
    });
    callbacksRef.current.onExpansionChange?.(newExpansion);
  }, [data, getRowId, expansion?.canExpand]);

  const collapseAllRows = useCallback(() => {
    callbacksRef.current.onExpansionChange?.({});
  }, []);

  // isRowExpanded MUST be reactive - it determines if expanded content shows
  const isRowExpanded = useCallback(
    (rowId: string) => {
      return !!expansion?.expandedRows[rowId];
    },
    [expansion?.expandedRows] // Must depend on expandedRows to re-render when expansion changes
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

  // Get selected rows
  const getSelectedRows = useCallback(() => {
    if (!selection?.enabled) return [];
    return data.filter((row) => selection.selectedRows[getRowId(row)]);
  }, [selection?.enabled, selection?.selectedRows, data, getRowId]);

  return {
    // Selection
    toggleRowSelection,
    selectAllRows,
    clearSelection,
    isRowSelected,
    isAllSelected,
    isSomeSelected,
    selectedCount,
    getSelectedRows,

    // Expansion
    toggleRowExpansion,
    expandAllRows,
    collapseAllRows,
    isRowExpanded,

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
