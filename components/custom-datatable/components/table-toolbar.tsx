"use client";

import { memo, useCallback, useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  X,
  Download,
  Columns3,
  RefreshCw,
  FileText,
  FileJson,
  FileSpreadsheet,
  SlidersHorizontal,
  Rows3,
  Rows2,
  Square,
  Copy,
  Printer,
  Maximize,
  Minimize,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type {
  FilterConfig,
  ExportConfig,
  ColumnVisibilityConfig,
  ToolbarConfig,
  CustomColumnDef,
  DensityType,
  ExportFormat,
} from "../types";

const exportIcons: Record<ExportFormat, React.ElementType> = {
  csv: FileText,
  json: FileJson,
  xlsx: FileSpreadsheet,
};

const densityIcons: Record<DensityType, React.ElementType> = {
  compact: Rows2,
  default: Rows3,
  comfortable: Square,
};

const densityLabels: Record<DensityType, string> = {
  compact: "Compacta",
  default: "Normal",
  comfortable: "Amplia",
};

const DENSITY_OPTIONS: DensityType[] = ["compact", "default", "comfortable"];

// Memoized tooltip button component
const TooltipButton = memo(function TooltipButton({
  onClick,
  disabled,
  icon: Icon,
  tooltip,
  iconClassName,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ElementType;
  tooltip: string;
  iconClassName?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onClick}
            disabled={disabled}
            className="h-9 w-9"
          >
            <Icon className={cn("h-4 w-4", iconClassName)} />
            <span className="sr-only">{tooltip}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

// Memoized search input
const SearchInput = memo(function SearchInput({
  inputRef,
  value,
  placeholder,
  onChange,
  onClear,
  onSubmit,
  showClearButton,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onSubmit: () => void;
  showClearButton: boolean;
}) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onSubmit();
      }
    },
    [onSubmit]
  );

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        className="pl-9 pr-9"
      />
      {value && showClearButton && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
          onClick={onClear}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Limpiar búsqueda</span>
        </Button>
      )}
    </div>
  );
});

// Memoized density dropdown
const DensityDropdown = memo(function DensityDropdown({
  currentDensity,
  onDensityChange,
}: {
  currentDensity: DensityType;
  onDensityChange: (density: DensityType) => void;
}) {
  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Densidad</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Densidad de filas</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Densidad</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {DENSITY_OPTIONS.map((d) => {
          const Icon = densityIcons[d];
          return (
            <DropdownMenuItem
              key={d}
              onClick={() => onDensityChange(d)}
              className={cn("gap-2", currentDensity === d && "bg-accent")}
            >
              <Icon className="h-4 w-4" />
              {densityLabels[d]}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

// Column info for visibility dropdown - no generics needed
interface ColumnInfo {
  id: string;
  header: string | React.ReactNode;
}

// Memoized column visibility dropdown - uses simplified ColumnInfo instead of generic
const ColumnVisibilityDropdown = memo(function ColumnVisibilityDropdown({
  columns,
  columnVisibility,
  onColumnVisibilityChange,
}: {
  columns: ColumnInfo[];
  columnVisibility: ColumnVisibilityConfig;
  onColumnVisibilityChange: (columnId: string, visible: boolean) => void;
}) {
  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Columns3 className="h-4 w-4" />
                <span className="hidden sm:inline">Columnas</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Mostrar/ocultar columnas</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="w-48 max-h-[300px] overflow-auto">
        <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => {
          const isVisible = columnVisibility.columnVisibility[column.id] !== false;
          const isAlwaysVisible = columnVisibility.alwaysVisibleColumns?.includes(column.id);

          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={isVisible}
              disabled={isAlwaysVisible}
              onCheckedChange={(checked) => onColumnVisibilityChange(column.id, checked)}
            >
              {column.header}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

// Memoized export dropdown
const ExportDropdown = memo(function ExportDropdown({
  formats,
  onExport,
}: {
  formats: ExportFormat[];
  onExport: (format: ExportFormat) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Exportar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Formato de exportación</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {formats.map((format) => {
          const Icon = exportIcons[format];
          return (
            <DropdownMenuItem
              key={format}
              onClick={() => onExport(format)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              <span className="uppercase">{format}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

// Memoized bulk actions bar
const BulkActionsBar = memo(function BulkActionsBar({
  selectedCount,
  bulkActions,
  onClearSelection,
}: {
  selectedCount: number;
  bulkActions: React.ReactNode;
  onClearSelection: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border bg-muted/50 px-4 py-2">
      <Badge variant="secondary" className="font-mono">
        {selectedCount} seleccionado{selectedCount > 1 ? "s" : ""}
      </Badge>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2">{bulkActions}</div>
      <div className="flex-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        className="text-muted-foreground"
      >
        Limpiar selección
      </Button>
    </div>
  );
});

interface TableToolbarProps<TData> {
  // Filter
  filter?: FilterConfig;

  // Export
  exportConfig?: ExportConfig<TData>;
  onExport?: (format: ExportFormat) => void;

  // Column visibility
  columnVisibility?: ColumnVisibilityConfig;
  columns?: CustomColumnDef<TData>[];

  // Selection
  selectedCount?: number;
  totalRows?: number;
  bulkActions?: React.ReactNode;
  onClearSelection?: () => void;

  // Custom actions
  headerActions?: React.ReactNode;

  // Toolbar config
  toolbarConfig?: ToolbarConfig;

  // Density
  density?: DensityType;
  onDensityChange?: (density: DensityType) => void;

  // Refresh
  onRefresh?: () => void;
  isRefreshing?: boolean;

  // Copy
  onCopy?: () => void;
  isCopyEnabled?: boolean;

  // Print
  onPrint?: () => void;
  isPrintEnabled?: boolean;

  // Fullscreen
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isFullscreenEnabled?: boolean;

  // Classes
  className?: string;
}

function TableToolbarInner<TData>({
  filter,
  exportConfig,
  onExport,
  columnVisibility,
  columns = [],
  selectedCount = 0,
  bulkActions,
  onClearSelection,
  headerActions,
  toolbarConfig,
  density = "default",
  onDensityChange,
  onRefresh,
  isRefreshing = false,
  onCopy,
  isCopyEnabled = false,
  onPrint,
  isPrintEnabled = false,
  isFullscreen = false,
  onToggleFullscreen,
  isFullscreenEnabled = false,
  className,
}: TableToolbarProps<TData>) {
  const [localFilter, setLocalFilter] = useState(filter?.globalFilter ?? "");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs for stable callbacks
  const filterRef = useRef(filter);
  const onExportRef = useRef(onExport);
  const exportConfigRef = useRef(exportConfig);
  const columnVisibilityRef = useRef(columnVisibility);

  // Update refs on every render
  filterRef.current = filter;
  onExportRef.current = onExport;
  exportConfigRef.current = exportConfig;
  columnVisibilityRef.current = columnVisibility;

  // Sync with external filter value
  useEffect(() => {
    setLocalFilter(filter?.globalFilter ?? "");
  }, [filter?.globalFilter]);

  // Debounced filter change - stable callback using refs
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalFilter(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const debounceMs = filterRef.current?.debounceMs ?? 300;
    debounceRef.current = setTimeout(() => {
      filterRef.current?.onGlobalFilterChange?.(value);
    }, debounceMs);
  }, []);

  // Clear filter - stable callback using refs
  const handleClearFilter = useCallback(() => {
    setLocalFilter("");
    filterRef.current?.onGlobalFilterChange?.("");
    inputRef.current?.focus();
  }, []);

  // Submit filter immediately (on Enter key) - clears debounce
  const handleSubmitFilter = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    filterRef.current?.onGlobalFilterChange?.(localFilter);
  }, [localFilter]);

  // Export handler - stable callback using refs
  const handleExport = useCallback((format: ExportFormat) => {
    onExportRef.current?.(format);
    exportConfigRef.current?.onExport?.(format, []);
  }, []);

  // Column visibility change - stable callback using refs
  const handleColumnVisibilityChange = useCallback((columnId: string, visible: boolean) => {
    const cv = columnVisibilityRef.current;
    if (!cv) return;
    const newVisibility = {
      ...cv.columnVisibility,
      [columnId]: visible,
    };
    cv.onColumnVisibilityChange(newVisibility);
  }, []);

  // Density change handler - identity function wrapper removed
  const handleDensityChange = useCallback((newDensity: DensityType) => {
    onDensityChange?.(newDensity);
  }, [onDensityChange]);

  // Filter hideable columns and map to ColumnInfo - memoized
  const hideableColumnsInfo = useMemo(
    () =>
      columns
        .filter((col) => col.enableHiding !== false)
        .map((col) => ({
          id: col.id,
          header: typeof col.header === "string" ? col.header : col.id,
        })),
    [columns]
  );

  // Memoize computed booleans
  const hasSelection = selectedCount > 0;

  const showFlags = useMemo(() => ({
    search: toolbarConfig?.showSearch ?? true,
    export: toolbarConfig?.showExport ?? exportConfig?.enabled ?? false,
    columnVisibility: toolbarConfig?.showColumnVisibility ?? columnVisibility?.enabled ?? false,
    densityToggle: toolbarConfig?.showDensityToggle ?? false,
    refresh: toolbarConfig?.showRefresh ?? false,
    copy: toolbarConfig?.showCopy ?? isCopyEnabled,
    print: toolbarConfig?.showPrint ?? isPrintEnabled,
    fullscreen: toolbarConfig?.showFullscreen ?? isFullscreenEnabled,
  }), [
    toolbarConfig?.showSearch,
    toolbarConfig?.showExport,
    toolbarConfig?.showColumnVisibility,
    toolbarConfig?.showDensityToggle,
    toolbarConfig?.showRefresh,
    toolbarConfig?.showCopy,
    toolbarConfig?.showPrint,
    toolbarConfig?.showFullscreen,
    exportConfig?.enabled,
    columnVisibility?.enabled,
    isCopyEnabled,
    isPrintEnabled,
    isFullscreenEnabled,
  ]);

  // Memoize export formats
  const exportFormats = useMemo(
    () => exportConfig?.formats ?? ["csv", "json", "xlsx"] as ExportFormat[],
    [exportConfig?.formats]
  );

  // Memoize search input props
  const searchPlaceholder = filter?.placeholder ?? "Buscar...";
  const showClearButton = filter?.showClearButton ?? true;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Memoize container class
  const containerClass = useMemo(
    () => cn("flex flex-col gap-4 py-4", className),
    [className]
  );

  return (
    <div className={containerClass}>
      {/* Main toolbar row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side: Search and custom start */}
        <div className="flex flex-1 items-center gap-2">
          {toolbarConfig?.customStart}

          {filter && showFlags.search && (
            <SearchInput
              inputRef={inputRef}
              value={localFilter}
              placeholder={searchPlaceholder}
              onChange={handleFilterChange}
              onClear={handleClearFilter}
              onSubmit={handleSubmitFilter}
              showClearButton={showClearButton}
            />
          )}
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center gap-2">
          {headerActions}

          {/* Fullscreen toggle */}
          {showFlags.fullscreen && onToggleFullscreen && (
            <TooltipButton
              onClick={onToggleFullscreen}
              icon={isFullscreen ? Minimize : Maximize}
              tooltip={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            />
          )}

          {/* Copy button */}
          {showFlags.copy && onCopy && (
            <TooltipButton
              onClick={onCopy}
              icon={Copy}
              tooltip="Copiar datos al portapapeles"
            />
          )}

          {/* Print button */}
          {showFlags.print && onPrint && (
            <TooltipButton
              onClick={onPrint}
              icon={Printer}
              tooltip="Imprimir tabla"
            />
          )}

          {/* Refresh button */}
          {showFlags.refresh && onRefresh && (
            <TooltipButton
              onClick={onRefresh}
              disabled={isRefreshing}
              icon={RefreshCw}
              tooltip="Actualizar datos"
              iconClassName={isRefreshing ? "animate-spin" : undefined}
            />
          )}

          {/* Density toggle */}
          {showFlags.densityToggle && onDensityChange && (
            <DensityDropdown
              currentDensity={density}
              onDensityChange={handleDensityChange}
            />
          )}

          {/* Column visibility */}
          {showFlags.columnVisibility && hideableColumnsInfo.length > 0 && columnVisibility && (
            <ColumnVisibilityDropdown
              columns={hideableColumnsInfo}
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={handleColumnVisibilityChange}
            />
          )}

          {/* Export */}
          {showFlags.export && (
            <ExportDropdown
              formats={exportFormats}
              onExport={handleExport}
            />
          )}

          {toolbarConfig?.customEnd}
        </div>
      </div>

      {/* Bulk actions row */}
      {hasSelection && bulkActions && onClearSelection && (
        <BulkActionsBar
          selectedCount={selectedCount}
          bulkActions={bulkActions}
          onClearSelection={onClearSelection}
        />
      )}
    </div>
  );
}

// Custom comparison for toolbar memo
function areToolbarPropsEqual<TData>(
  prevProps: TableToolbarProps<TData>,
  nextProps: TableToolbarProps<TData>
): boolean {
  // Fast path: most frequently changing props
  if (prevProps.selectedCount !== nextProps.selectedCount) return false;
  if (prevProps.isRefreshing !== nextProps.isRefreshing) return false;
  if (prevProps.isFullscreen !== nextProps.isFullscreen) return false;
  if (prevProps.density !== nextProps.density) return false;

  // Filter state
  if (prevProps.filter?.globalFilter !== nextProps.filter?.globalFilter) return false;

  // Toolbar config
  if (prevProps.toolbarConfig?.showSearch !== nextProps.toolbarConfig?.showSearch) return false;
  if (prevProps.toolbarConfig?.showExport !== nextProps.toolbarConfig?.showExport) return false;
  if (prevProps.toolbarConfig?.showColumnVisibility !== nextProps.toolbarConfig?.showColumnVisibility) return false;
  if (prevProps.toolbarConfig?.showDensityToggle !== nextProps.toolbarConfig?.showDensityToggle) return false;
  if (prevProps.toolbarConfig?.showRefresh !== nextProps.toolbarConfig?.showRefresh) return false;
  if (prevProps.toolbarConfig?.showCopy !== nextProps.toolbarConfig?.showCopy) return false;
  if (prevProps.toolbarConfig?.showPrint !== nextProps.toolbarConfig?.showPrint) return false;
  if (prevProps.toolbarConfig?.showFullscreen !== nextProps.toolbarConfig?.showFullscreen) return false;

  // Enable flags
  if (prevProps.isCopyEnabled !== nextProps.isCopyEnabled) return false;
  if (prevProps.isPrintEnabled !== nextProps.isPrintEnabled) return false;
  if (prevProps.isFullscreenEnabled !== nextProps.isFullscreenEnabled) return false;
  if (prevProps.exportConfig?.enabled !== nextProps.exportConfig?.enabled) return false;
  if (prevProps.columnVisibility?.enabled !== nextProps.columnVisibility?.enabled) return false;

  // Column visibility state
  if (prevProps.columnVisibility?.columnVisibility !== nextProps.columnVisibility?.columnVisibility) return false;

  // Class names
  if (prevProps.className !== nextProps.className) return false;

  // Columns reference
  if (prevProps.columns !== nextProps.columns) return false;

  // Callbacks (should be stable)
  if (prevProps.onExport !== nextProps.onExport) return false;
  if (prevProps.onDensityChange !== nextProps.onDensityChange) return false;
  if (prevProps.onRefresh !== nextProps.onRefresh) return false;
  if (prevProps.onCopy !== nextProps.onCopy) return false;
  if (prevProps.onPrint !== nextProps.onPrint) return false;
  if (prevProps.onToggleFullscreen !== nextProps.onToggleFullscreen) return false;
  if (prevProps.onClearSelection !== nextProps.onClearSelection) return false;

  // ReactNode comparisons (reference equality)
  if (prevProps.bulkActions !== nextProps.bulkActions) return false;
  if (prevProps.headerActions !== nextProps.headerActions) return false;

  return true;
}

export const CustomTableToolbar = memo(TableToolbarInner, areToolbarPropsEqual) as typeof TableToolbarInner;
