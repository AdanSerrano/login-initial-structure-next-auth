"use client";

import { memo, useCallback, useMemo, useRef } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableHeader, TableHead, TableRow } from "@/components/ui/table";

import type { CustomColumnDef, SelectionConfig, SortingState } from "../types";

// Memoized selection header cell - no generics, safe to memo
const SelectionHeaderCell = memo(function SelectionHeaderCell({
  mode,
  isAllSelected,
  isSomeSelected,
  onToggle,
}: {
  mode: "single" | "multiple";
  isAllSelected: boolean;
  isSomeSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <TableHead
      className="!px-2 !py-0 w-10 sticky left-0 z-10 bg-background"
      style={{ width: 40, minWidth: 40, maxWidth: 40 }}
    >
      {mode === "multiple" && (
        <div
          className="flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={isAllSelected || (isSomeSelected && "indeterminate")}
            onCheckedChange={onToggle}
            aria-label="Seleccionar todo"
          />
        </div>
      )}
    </TableHead>
  );
});

// Memoized expander header cell - no generics, safe to memo
const ExpanderHeaderCell = memo(function ExpanderHeaderCell({
  hasCheckbox,
}: {
  hasCheckbox: boolean;
}) {
  return (
    <TableHead
      className={cn(
        "!px-1 !py-0 w-9 sticky z-10 bg-background",
        hasCheckbox ? "left-10" : "left-0"
      )}
      style={{ width: 36, minWidth: 36, maxWidth: 36 }}
    />
  );
});

// Sort icon component - memoized since no generics
const SortIcon = memo(function SortIcon({
  direction,
}: {
  direction: "asc" | "desc" | false;
}) {
  if (direction === "asc") return <ArrowUp className="h-4 w-4" />;
  if (direction === "desc") return <ArrowDown className="h-4 w-4" />;
  return <ArrowUpDown className="h-4 w-4 opacity-50" />;
});

interface TableHeaderProps<TData> {
  columns: CustomColumnDef<TData>[];
  selection?: SelectionConfig<TData>;
  showExpander?: boolean;
  sorting?: SortingState[];
  onSort?: (columnId: string) => void;
  getSortDirection?: (columnId: string) => "asc" | "desc" | false;
  isAllSelected?: boolean;
  isSomeSelected?: boolean;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  stickyHeader?: boolean;
  className?: string;
}

function TableHeaderInner<TData>({
  columns,
  selection,
  showExpander,
  onSort,
  getSortDirection,
  isAllSelected = false,
  isSomeSelected = false,
  onSelectAll,
  onClearSelection,
  stickyHeader,
  className,
}: TableHeaderProps<TData>) {
  // Refs for stable callbacks
  const propsRef = useRef({
    isAllSelected,
    onSelectAll,
    onClearSelection,
  });

  propsRef.current = {
    isAllSelected,
    onSelectAll,
    onClearSelection,
  };

  // Stable callback using ref
  const handleSelectAll = useCallback(() => {
    const props = propsRef.current;
    if (props.isAllSelected) {
      props.onClearSelection?.();
    } else {
      props.onSelectAll?.();
    }
  }, []);

  const hasCheckbox = selection?.enabled && selection.showCheckbox;

  // Memoize header class
  const headerClass = useMemo(
    () =>
      cn(
        stickyHeader && "sticky top-0 z-20 bg-background shadow-sm",
        className
      ),
    [stickyHeader, className]
  );

  return (
    <TableHeader className={headerClass}>
      <TableRow className="hover:bg-transparent">
        {/* Selection column */}
        {hasCheckbox && selection && (
          <SelectionHeaderCell
            mode={selection.mode ?? "multiple"}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            onToggle={handleSelectAll}
          />
        )}

        {/* Expander column */}
        {showExpander && <ExpanderHeaderCell hasCheckbox={!!hasCheckbox} />}

        {/* Data columns - rendered inline to preserve TData generic */}
        {columns.map((column) => {
          const sortDirection = getSortDirection?.(column.id) ?? false;
          const canSort = column.enableSorting !== false;

          const style: React.CSSProperties = {};
          if (column.width) {
            style.width =
              typeof column.width === "number"
                ? `${column.width}px`
                : column.width;
          }
          if (column.minWidth) style.minWidth = `${column.minWidth}px`;
          if (column.maxWidth) style.maxWidth = `${column.maxWidth}px`;

          const alignClass =
            column.align === "center"
              ? "text-center"
              : column.align === "right"
                ? "text-right"
                : "text-left";

          const pinnedClass = column.pinned
            ? cn(
                "sticky z-10 bg-background",
                column.pinned === "left"
                  ? "left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                  : "right-0 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]"
              )
            : "";

          const headerContent =
            typeof column.header === "function"
              ? column.header({ sortDirection })
              : column.header;

          const buttonClass = cn(
            "-ml-3 h-8 gap-1",
            column.align === "center" && "mx-auto",
            column.align === "right" && "-mr-3 ml-auto"
          );

          return (
            <TableHead
              key={column.id}
              className={cn(alignClass, pinnedClass, column.headerClassName)}
              style={style}
            >
              {canSort ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className={buttonClass}
                  onClick={() => onSort?.(column.id)}
                >
                  {headerContent}
                  <span className="flex items-center">
                    <SortIcon direction={sortDirection} />
                  </span>
                </Button>
              ) : (
                <div className="flex items-center gap-1">{headerContent}</div>
              )}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}

// Custom comparison for header memo
function areHeaderPropsEqual<TData>(
  prevProps: TableHeaderProps<TData>,
  nextProps: TableHeaderProps<TData>
): boolean {
  // Fast path: most frequently changing props
  if (prevProps.isAllSelected !== nextProps.isAllSelected) return false;
  if (prevProps.isSomeSelected !== nextProps.isSomeSelected) return false;

  // Sorting state
  if (prevProps.sorting !== nextProps.sorting) return false;

  // Selection config
  if (prevProps.selection?.enabled !== nextProps.selection?.enabled)
    return false;
  if (prevProps.selection?.mode !== nextProps.selection?.mode) return false;
  if (prevProps.selection?.showCheckbox !== nextProps.selection?.showCheckbox)
    return false;

  // Other props
  if (prevProps.showExpander !== nextProps.showExpander) return false;
  if (prevProps.stickyHeader !== nextProps.stickyHeader) return false;
  if (prevProps.className !== nextProps.className) return false;

  // Columns reference
  if (prevProps.columns !== nextProps.columns) return false;

  // Callbacks (should be stable)
  if (prevProps.onSort !== nextProps.onSort) return false;
  if (prevProps.getSortDirection !== nextProps.getSortDirection) return false;
  if (prevProps.onSelectAll !== nextProps.onSelectAll) return false;
  if (prevProps.onClearSelection !== nextProps.onClearSelection) return false;

  return true;
}

export const CustomTableHeader = memo(
  TableHeaderInner,
  areHeaderPropsEqual
) as typeof TableHeaderInner;
