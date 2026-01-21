import type { ReactNode } from "react";

// ============================================
// COLUMN DEFINITION
// ============================================

export interface CustomColumnDef<TData> {
  id: string;
  accessorKey?: keyof TData;
  header: string | ReactNode | ((props: { sortDirection?: "asc" | "desc" | false }) => ReactNode);
  cell: (props: { row: TData; rowIndex: number; isSelected: boolean; isExpanded: boolean }) => ReactNode;
  // Sorting
  enableSorting?: boolean;
  sortingFn?: (a: TData, b: TData) => number;
  // Visibility
  enableHiding?: boolean;
  defaultHidden?: boolean;
  // Sizing
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  // Resizing
  enableResizing?: boolean;
  // Alignment
  align?: "left" | "center" | "right";
  // Pinning
  pinned?: "left" | "right" | false;
  // Custom classes
  headerClassName?: string;
  cellClassName?: string;
  // Footer
  footer?: string | ReactNode;
}

// ============================================
// STATE TYPES
// ============================================

export interface SortingState {
  id: string;
  desc: boolean;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export type ColumnVisibilityState = Record<string, boolean>;
export type ColumnSizingState = Record<string, number>;

// ============================================
// SELECTION CONFIG
// ============================================

export interface SelectionConfig<TData> {
  enabled: boolean;
  mode?: "single" | "multiple";
  showCheckbox?: boolean;
  selectedRows: Record<string, boolean>;
  onSelectionChange: (selection: Record<string, boolean>) => void;
  onRowSelect?: (row: TData) => void;
  selectOnRowClick?: boolean;
  // Disable selection for specific rows
  canSelect?: (row: TData) => boolean;
}

// ============================================
// EXPANSION CONFIG
// ============================================

export interface ExpansionConfig<TData> {
  enabled: boolean;
  expandedRows: Record<string, boolean>;
  onExpansionChange: (expansion: Record<string, boolean>) => void;
  renderContent: (row: TData) => ReactNode;
  expandOnClick?: boolean;
  canExpand?: (row: TData) => boolean;
  // Expand all by default
  expandAllByDefault?: boolean;
}

// ============================================
// PAGINATION CONFIG
// ============================================

export interface PaginationConfig {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
  pageSizeOptions?: number[];
  onPaginationChange: (pagination: PaginationState) => void;
  // Display options
  showPageNumbers?: boolean;
  showFirstLast?: boolean;
  showRowsInfo?: boolean;
  showSelectedInfo?: boolean;
  // Texts
  rowsInfoText?: (start: number, end: number, total: number) => string;
  selectedInfoText?: (count: number, total: number) => string;
}

// ============================================
// SORTING CONFIG
// ============================================

export interface SortingConfig {
  sorting: SortingState[];
  onSortingChange: (sorting: SortingState[]) => void;
  manualSorting?: boolean;
  enableMultiSort?: boolean;
  maxMultiSortColCount?: number;
}

// ============================================
// FILTER CONFIG
// ============================================

export interface FilterConfig {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  placeholder?: string;
  filterFn?: <T>(row: T, filter: string) => boolean;
  // Debounce
  debounceMs?: number;
  // Show clear button
  showClearButton?: boolean;
}

// ============================================
// COLUMN VISIBILITY CONFIG
// ============================================

export interface ColumnVisibilityConfig {
  enabled: boolean;
  columnVisibility: ColumnVisibilityState;
  onColumnVisibilityChange: (visibility: ColumnVisibilityState) => void;
  // Columns that cannot be hidden
  alwaysVisibleColumns?: string[];
}

// ============================================
// COLUMN RESIZING CONFIG
// ============================================

export interface ColumnResizingConfig {
  enabled: boolean;
  columnSizing: ColumnSizingState;
  onColumnSizingChange: (sizing: ColumnSizingState) => void;
  minColumnWidth?: number;
  maxColumnWidth?: number;
}

// ============================================
// VIRTUALIZATION CONFIG
// ============================================

export interface VirtualizationConfig {
  enabled: boolean;
  rowHeight?: number;
  overscan?: number;
}

// ============================================
// KEYBOARD NAVIGATION CONFIG
// ============================================

export interface KeyboardNavigationConfig {
  enabled: boolean;
  onEnter?: (row: unknown, rowIndex: number) => void;
  onEscape?: () => void;
  onDelete?: (row: unknown, rowIndex: number) => void;
  enableCellNavigation?: boolean;
}

// ============================================
// COLUMN PINNING CONFIG
// ============================================

export interface ColumnPinningConfig {
  enabled: boolean;
  leftPinnedColumns?: string[];
  rightPinnedColumns?: string[];
  onPinningChange?: (pinning: { left: string[]; right: string[] }) => void;
}

// ============================================
// PERSISTENCE CONFIG
// ============================================

export interface PersistenceConfig {
  enabled: boolean;
  key: string;
  include?: ('columnVisibility' | 'sorting' | 'density' | 'pageSize' | 'columnSizing' | 'columnPinning')[];
  storage?: 'localStorage' | 'sessionStorage';
}

// ============================================
// COPY CONFIG
// ============================================

export interface CopyConfig {
  enabled: boolean;
  format?: 'text' | 'csv' | 'json';
  includeHeaders?: boolean;
  onCopy?: (data: string) => void;
}

// ============================================
// PRINT CONFIG
// ============================================

export interface PrintConfig {
  enabled: boolean;
  title?: string;
  showLogo?: boolean;
  pageSize?: 'A4' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
}

// ============================================
// FULLSCREEN CONFIG
// ============================================

export interface FullscreenConfig {
  enabled: boolean;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

// ============================================
// STYLE CONFIG
// ============================================

export interface StyleConfig {
  striped?: boolean;
  hover?: boolean;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  density?: "compact" | "default" | "comfortable";
  borderStyle?: "default" | "none" | "horizontal" | "vertical" | "all";
  maxHeight?: number;
  minHeight?: number;
  rounded?: boolean;
  // Column borders
  showColumnBorders?: boolean;
}

// ============================================
// EXPORT CONFIG
// ============================================

export interface ExportConfig<TData> {
  enabled: boolean;
  formats?: ExportFormat[];
  filename?: string;
  onExport?: (format: ExportFormat, data: TData[]) => void;
  // Export options
  exportAllData?: boolean; // Export all data or just visible
  includeHeaders?: boolean;
}

// ============================================
// LOADING & EMPTY STATES
// ============================================

export interface LoadingConfig {
  isLoading?: boolean;
  isPending?: boolean;
  loadingText?: string;
  loadingOverlay?: ReactNode;
  showSkeletons?: boolean;
  skeletonCount?: number;
}

export interface EmptyStateConfig {
  message?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  customContent?: ReactNode;
}

// ============================================
// TOOLBAR CONFIG
// ============================================

export interface ToolbarConfig {
  show?: boolean;
  showSearch?: boolean;
  showExport?: boolean;
  showColumnVisibility?: boolean;
  showDensityToggle?: boolean;
  showRefresh?: boolean;
  showFullscreen?: boolean;
  showCopy?: boolean;
  showPrint?: boolean;
  onRefresh?: () => void;
  customStart?: ReactNode;
  customEnd?: ReactNode;
}

// ============================================
// MAIN DATATABLE PROPS
// ============================================

export interface CustomDataTableProps<TData> {
  // Data
  data: TData[];
  columns: CustomColumnDef<TData>[];
  getRowId: (row: TData) => string;

  // Core Features
  selection?: SelectionConfig<TData>;
  expansion?: ExpansionConfig<TData>;
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
  filter?: FilterConfig;

  // Advanced Features
  columnVisibility?: ColumnVisibilityConfig;
  columnResizing?: ColumnResizingConfig;
  columnPinning?: ColumnPinningConfig;
  virtualization?: VirtualizationConfig;
  keyboardNavigation?: KeyboardNavigationConfig;
  persistence?: PersistenceConfig;
  copy?: CopyConfig;
  print?: PrintConfig;
  fullscreen?: FullscreenConfig;

  // Appearance
  style?: StyleConfig;

  // Export
  export?: ExportConfig<TData>;

  // Loading states
  isLoading?: boolean;
  isPending?: boolean;
  loadingConfig?: LoadingConfig;

  // Empty state
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  emptyState?: EmptyStateConfig;

  // Row Events
  onRowClick?: (row: TData, event: React.MouseEvent) => void;
  onRowDoubleClick?: (row: TData, event: React.MouseEvent) => void;
  onRowContextMenu?: (row: TData, event: React.MouseEvent) => void;

  // Custom Slots
  toolbar?: ReactNode;
  toolbarConfig?: ToolbarConfig;
  headerActions?: ReactNode;
  bulkActions?: (selectedRows: TData[]) => ReactNode;
  footer?: ReactNode;
  caption?: ReactNode;

  // Classes
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  rowClassName?: string | ((row: TData, index: number) => string);
  toolbarClassName?: string;
  paginationClassName?: string;

  // Accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

// ============================================
// REF METHODS
// ============================================

export interface CustomDataTableRef<TData> {
  // Navigation
  scrollToRow: (index: number) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;

  // Export
  exportData: (format: ExportFormat) => void;

  // Filters
  resetFilters: () => void;
  setGlobalFilter: (filter: string) => void;

  // Sorting
  resetSorting: () => void;
  setSorting: (sorting: SortingState[]) => void;

  // Selection
  selectAll: () => void;
  clearSelection: () => void;
  selectRows: (rowIds: string[]) => void;
  toggleRowSelection: (rowId: string) => void;
  getSelectedRows: () => TData[];
  getSelectedRowIds: () => string[];

  // Expansion
  expandAll: () => void;
  collapseAll: () => void;
  expandRows: (rowIds: string[]) => void;
  toggleRowExpansion: (rowId: string) => void;

  // Column visibility
  setColumnVisibility: (visibility: ColumnVisibilityState) => void;
  toggleColumnVisibility: (columnId: string) => void;
  showAllColumns: () => void;
  hideColumn: (columnId: string) => void;
  getVisibleColumns: () => string[];

  // Pagination
  goToPage: (page: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;

  // Data access
  getVisibleData: () => TData[];
  getFilteredData: () => TData[];
  getAllData: () => TData[];
  getRowById: (id: string) => TData | undefined;

  // Focus management
  focusTable: () => void;
  focusRow: (index: number) => void;
}

// ============================================
// UTILITY TYPES
// ============================================

export type DensityType = "compact" | "default" | "comfortable";
export type AlignType = "left" | "center" | "right";
export type PinnedType = "left" | "right" | false;
export type ExportFormat = "csv" | "json" | "xlsx";
export type BorderStyleType = "default" | "none" | "horizontal" | "vertical" | "all";

// Density configurations
export const DENSITY_CONFIG = {
  compact: { rowHeight: "h-8", padding: "py-1 px-2", fontSize: "text-xs" },
  default: { rowHeight: "h-12", padding: "py-2 px-3", fontSize: "text-sm" },
  comfortable: { rowHeight: "h-16", padding: "py-3 px-4", fontSize: "text-base" },
} as const;

// Export format icons mapping
export const EXPORT_ICONS = {
  csv: "FileText",
  json: "FileJson",
  xlsx: "FileSpreadsheet",
} as const;
