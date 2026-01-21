"use client";

import { memo, useMemo, useCallback } from "react";

import { cn } from "@/lib/utils";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { CustomTableRow } from "./table-row";
import type {
  CustomColumnDef,
  SelectionConfig,
  ExpansionConfig,
  StyleConfig,
} from "../types";

const densityPadding = {
  compact: "py-1 px-2",
  default: "py-2 px-3",
  comfortable: "py-3 px-4",
} as const;

const densityHeight = {
  compact: "h-8",
  default: "h-12",
  comfortable: "h-16",
} as const;

interface TableBodyProps<TData> {
  data: TData[];
  columns: CustomColumnDef<TData>[];
  getRowId: (row: TData) => string;
  selection?: SelectionConfig<TData>;
  expansion?: ExpansionConfig<TData>;
  style?: StyleConfig;
  isLoading?: boolean;
  isPending?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  isRowSelected: (rowId: string) => boolean;
  isRowExpanded: (rowId: string) => boolean;
  onToggleSelection: (rowId: string) => void;
  onToggleExpansion: (rowId: string) => void;
  onRowClick?: (row: TData, event: React.MouseEvent) => void;
  onRowDoubleClick?: (row: TData, event: React.MouseEvent) => void;
  onRowContextMenu?: (row: TData, event: React.MouseEvent) => void;
  rowClassName?: string | ((row: TData, index: number) => string);
  pageSize?: number;
  className?: string;
}

// Skeleton row component - fully memoized
const SkeletonRow = memo(function SkeletonRow({
  index,
  columnsCount,
  hasSelection,
  hasExpander,
  density,
  skeletonHeight,
}: {
  index: number;
  columnsCount: number;
  hasSelection: boolean;
  hasExpander: boolean;
  density: "compact" | "default" | "comfortable";
  skeletonHeight: string;
}) {
  return (
    <TableRow className={densityHeight[density]}>
      {hasSelection && (
        <TableCell className="!px-2 !py-0" style={{ width: 40 }}>
          <Skeleton className="h-4 w-4 mx-auto" />
        </TableCell>
      )}
      {hasExpander && (
        <TableCell className="!px-1 !py-0" style={{ width: 36 }}>
          <Skeleton className="h-4 w-4 mx-auto" />
        </TableCell>
      )}
      {Array.from({ length: columnsCount }).map((_, colIndex) => (
        <TableCell key={colIndex} className={densityPadding[density]}>
          <Skeleton className={cn(skeletonHeight, "w-full")} />
        </TableCell>
      ))}
    </TableRow>
  );
});

// Skeleton rows container
const SkeletonRows = memo(function SkeletonRows({
  pageSize,
  columnsCount,
  hasSelection,
  hasExpander,
  density = "default",
}: {
  pageSize: number;
  columnsCount: number;
  hasSelection: boolean;
  hasExpander: boolean;
  density?: "compact" | "default" | "comfortable";
}) {
  const skeletonHeight =
    density === "compact" ? "h-3" : density === "comfortable" ? "h-5" : "h-4";

  // Generate stable keys
  const rows = useMemo(
    () => Array.from({ length: pageSize }, (_, i) => i),
    [pageSize]
  );

  return (
    <>
      {rows.map((index) => (
        <SkeletonRow
          key={`skeleton-${index}`}
          index={index}
          columnsCount={columnsCount}
          hasSelection={hasSelection}
          hasExpander={hasExpander}
          density={density}
          skeletonHeight={skeletonHeight}
        />
      ))}
    </>
  );
});

// Empty state component
const EmptyRow = memo(function EmptyRow({
  columnsCount,
  emptyMessage,
  emptyIcon,
}: {
  columnsCount: number;
  emptyMessage: string;
  emptyIcon?: React.ReactNode;
}) {
  return (
    <TableRow>
      <TableCell colSpan={columnsCount} className="h-32 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          {emptyIcon}
          <span>{emptyMessage}</span>
        </div>
      </TableCell>
    </TableRow>
  );
});


function TableBodyInner<TData>({
  data,
  columns,
  getRowId,
  selection,
  expansion,
  style,
  isLoading,
  isPending,
  emptyMessage = "No hay datos disponibles",
  emptyIcon,
  isRowSelected,
  isRowExpanded,
  onToggleSelection,
  onToggleExpansion,
  onRowClick,
  onRowDoubleClick,
  onRowContextMenu,
  rowClassName,
  pageSize = 10,
  className,
}: TableBodyProps<TData>) {
  const density = style?.density ?? "default";
  const hasRows = data && data.length > 0;
  const hasSelection = selection?.enabled && selection.showCheckbox;
  const hasExpander = expansion?.enabled;
  const totalColumns = columns.length + (hasSelection ? 1 : 0) + (hasExpander ? 1 : 0);

  // Memoize row class name getter
  const getRowClassNameValue = useCallback(
    (row: TData, index: number): string | undefined => {
      if (!rowClassName) return undefined;
      if (typeof rowClassName === "function") {
        return rowClassName(row, index);
      }
      return rowClassName;
    },
    [rowClassName]
  );

  // Memoize skeleton props
  const skeletonProps = useMemo(
    () => ({
      pageSize,
      columnsCount: columns.length,
      hasSelection: !!hasSelection,
      hasExpander: !!hasExpander,
      density,
    }),
    [pageSize, columns.length, hasSelection, hasExpander, density]
  );

  // Memoize empty row props
  const emptyRowProps = useMemo(
    () => ({
      columnsCount: totalColumns,
      emptyMessage,
      emptyIcon,
    }),
    [totalColumns, emptyMessage, emptyIcon]
  );

  // Render rows with optimized selection state lookup
  // CustomTableRow is already memoized, so we render directly
  const renderedRows = useMemo(() => {
    if (isLoading || !hasRows) return null;

    return data.map((row, rowIndex) => {
      const rowId = getRowId(row);
      const isSelected = isRowSelected(rowId);
      const isExpanded = isRowExpanded(rowId);
      const rowClass = getRowClassNameValue(row, rowIndex);

      return (
        <CustomTableRow
          key={rowId}
          row={row}
          rowId={rowId}
          rowIndex={rowIndex}
          columns={columns}
          selection={selection}
          expansion={expansion}
          style={style}
          isSelected={isSelected}
          isExpanded={isExpanded}
          onToggleSelection={onToggleSelection}
          onToggleExpansion={onToggleExpansion}
          onRowClick={onRowClick}
          onRowDoubleClick={onRowDoubleClick}
          onRowContextMenu={onRowContextMenu}
          isPending={isPending}
          rowClassName={rowClass}
        />
      );
    });
  }, [
    isLoading,
    hasRows,
    data,
    getRowId,
    isRowSelected,
    isRowExpanded,
    getRowClassNameValue,
    columns,
    selection,
    expansion,
    style,
    onToggleSelection,
    onToggleExpansion,
    onRowClick,
    onRowDoubleClick,
    onRowContextMenu,
    isPending,
  ]);

  return (
    <TableBody className={className}>
      {isLoading ? (
        <SkeletonRows {...skeletonProps} />
      ) : hasRows ? (
        renderedRows
      ) : (
        <EmptyRow {...emptyRowProps} />
      )}
    </TableBody>
  );
}

// Custom comparison for body memo
function areBodyPropsEqual<TData>(
  prevProps: TableBodyProps<TData>,
  nextProps: TableBodyProps<TData>
): boolean {
  return (
    prevProps.data === nextProps.data &&
    prevProps.columns === nextProps.columns &&
    prevProps.getRowId === nextProps.getRowId &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.isPending === nextProps.isPending &&
    prevProps.pageSize === nextProps.pageSize &&
    prevProps.className === nextProps.className &&
    prevProps.emptyMessage === nextProps.emptyMessage &&
    prevProps.style?.density === nextProps.style?.density &&
    prevProps.style?.striped === nextProps.style?.striped &&
    prevProps.style?.hover === nextProps.style?.hover &&
    prevProps.selection?.enabled === nextProps.selection?.enabled &&
    prevProps.selection?.mode === nextProps.selection?.mode &&
    prevProps.selection?.showCheckbox === nextProps.selection?.showCheckbox &&
    prevProps.selection?.selectOnRowClick === nextProps.selection?.selectOnRowClick &&
    prevProps.selection?.selectedRows === nextProps.selection?.selectedRows &&
    prevProps.expansion?.enabled === nextProps.expansion?.enabled &&
    prevProps.expansion?.expandedRows === nextProps.expansion?.expandedRows &&
    prevProps.onToggleSelection === nextProps.onToggleSelection &&
    prevProps.onToggleExpansion === nextProps.onToggleExpansion &&
    prevProps.onRowClick === nextProps.onRowClick &&
    prevProps.onRowDoubleClick === nextProps.onRowDoubleClick &&
    prevProps.isRowSelected === nextProps.isRowSelected &&
    prevProps.isRowExpanded === nextProps.isRowExpanded
  );
}

export const CustomTableBody = memo(TableBodyInner, areBodyPropsEqual) as typeof TableBodyInner;
