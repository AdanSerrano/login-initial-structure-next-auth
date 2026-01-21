"use client";

import { memo, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { PaginationConfig } from "../types";

interface TablePaginationProps {
  pagination: PaginationConfig;
  selectedCount?: number;
  totalRows?: number;
  className?: string;
}

function TablePaginationInner({
  pagination,
  selectedCount = 0,
  totalRows,
  className,
}: TablePaginationProps) {
  const {
    pageIndex,
    pageSize,
    totalPages,
    pageSizeOptions = [10, 20, 30, 50, 100],
    onPaginationChange,
    showPageNumbers = true,
    showFirstLast = true,
    showRowsInfo = true,
    showSelectedInfo = true,
  } = pagination;

  const total = totalRows ?? pagination.totalRows;
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < totalPages - 1;

  const handleFirstPage = useCallback(() => {
    onPaginationChange({ pageIndex: 0, pageSize });
  }, [onPaginationChange, pageSize]);

  const handlePreviousPage = useCallback(() => {
    onPaginationChange({ pageIndex: Math.max(0, pageIndex - 1), pageSize });
  }, [onPaginationChange, pageIndex, pageSize]);

  const handleNextPage = useCallback(() => {
    onPaginationChange({
      pageIndex: Math.min(totalPages - 1, pageIndex + 1),
      pageSize,
    });
  }, [onPaginationChange, pageIndex, pageSize, totalPages]);

  const handleLastPage = useCallback(() => {
    onPaginationChange({ pageIndex: totalPages - 1, pageSize });
  }, [onPaginationChange, pageSize, totalPages]);

  const handlePageChange = useCallback(
    (page: number) => {
      onPaginationChange({ pageIndex: page, pageSize });
    },
    [onPaginationChange, pageSize]
  );

  const handlePageSizeChange = useCallback(
    (value: string) => {
      onPaginationChange({ pageIndex: 0, pageSize: Number(value) });
    },
    [onPaginationChange]
  );

  const pageInfo = useMemo(() => {
    const start = total > 0 ? pageIndex * pageSize + 1 : 0;
    const end = Math.min((pageIndex + 1) * pageSize, total);
    return { start, end };
  }, [pageIndex, pageSize, total]);

  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const pages: (number | "ellipsis")[] = [];
    const current = pageIndex;

    // Always show first page
    pages.push(0);

    if (current > 3) {
      pages.push("ellipsis");
    }

    // Pages around current
    const start = Math.max(1, current - 1);
    const end = Math.min(totalPages - 2, current + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (current < totalPages - 4) {
      pages.push("ellipsis");
    }

    // Always show last page
    if (totalPages > 1 && !pages.includes(totalPages - 1)) {
      pages.push(totalPages - 1);
    }

    return pages;
  }, [pageIndex, totalPages]);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 px-2 py-4",
        "lg:flex-row lg:items-center lg:justify-between",
        className
      )}
    >
      {/* Left side: Info */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
        {showRowsInfo && (
          <span className="text-sm text-muted-foreground">
            Mostrando {pageInfo.start} - {pageInfo.end} de {total} registros
          </span>
        )}
        {showSelectedInfo && selectedCount > 0 && (
          <span className="text-sm font-medium text-primary">
            ({selectedCount} seleccionado{selectedCount > 1 ? "s" : ""})
          </span>
        )}
      </div>

      {/* Right side: Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Filas por página
          </span>
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          {/* First page */}
          {showFirstLast && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleFirstPage}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Primera página</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Previous page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handlePreviousPage}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Página anterior</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          {showPageNumbers && (
            <div className="hidden sm:flex items-center gap-1">
              {pageNumbers.map((page, index) =>
                page === "ellipsis" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-8 w-8 items-center justify-center"
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={pageIndex === page ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(page)}
                  >
                    {page + 1}
                  </Button>
                )
              )}
            </div>
          )}

          {/* Mobile page indicator */}
          {showPageNumbers && (
            <span className="flex sm:hidden items-center justify-center text-sm font-medium px-2">
              {pageIndex + 1} / {totalPages || 1}
            </span>
          )}

          {/* Next page */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleNextPage}
            disabled={!canNextPage}
          >
            <span className="sr-only">Página siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last page */}
          {showFirstLast && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleLastPage}
              disabled={!canNextPage}
            >
              <span className="sr-only">Última página</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export const CustomTablePagination = memo(TablePaginationInner);
