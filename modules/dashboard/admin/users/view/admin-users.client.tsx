"use client";

import { memo, useSyncExternalStore, useTransition, useCallback, useMemo, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AlertCircle, Ban, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomDataTable } from "@/components/custom-datatable";
import { AnimatedSection } from "@/components/ui/animated-section";

import { adminUsersState } from "../state/admin-users.state";
import {
  getUsersAction,
  blockUserAction,
  unblockUserAction,
  changeRoleAction,
  deleteUserAction,
  restoreUserAction,
  bulkBlockUsersAction,
  bulkDeleteUsersAction,
} from "../actions/admin-users.actions";
import { createAdminUsersColumns } from "../components/columns/admin-users.columns";
import { AdminUsersStatsSection } from "../components/stats/admin-users-stats";
import { AdminUsersFiltersSection } from "../components/filters/admin-users-filters";
import {
  UserDetailsDialog,
  BlockUserDialog,
  ChangeRoleDialog,
  DeleteUserDialog,
  RestoreUserDialog,
} from "../components/dialogs";

import type { Role } from "@/app/prisma/enums";
import type {
  AdminUser,
  AdminUsersFilters,
  AdminUsersStats,
  AdminUsersPagination,
  AdminUsersSorting,
  AdminUsersDialogType,
  AdminUserStatus,
} from "../types/admin-users.types";
import type {
  StyleConfig,
  CopyConfig,
  PrintConfig,
  FullscreenConfig,
  ExportConfig,
  ToolbarConfig,
  ColumnVisibilityConfig,
  FilterConfig,
  SortingConfig,
  PaginationConfig,
  SelectionConfig,
  ExpansionConfig,
} from "@/components/custom-datatable";
import { UserExpandedContent } from "../components/expanded";

// Constantes de configuración
const STYLE_CONFIG: StyleConfig = {
  striped: true,
  hover: true,
  stickyHeader: true,
  density: "default",
  borderStyle: "horizontal",
  rounded: true,
};

const COPY_CONFIG: CopyConfig = {
  enabled: true,
  format: "csv",
  includeHeaders: true,
};

const PRINT_CONFIG: PrintConfig = {
  enabled: true,
  title: "Listado de Usuarios",
  pageSize: "A4",
  orientation: "landscape",
};

const FULLSCREEN_CONFIG: FullscreenConfig = {
  enabled: true,
};

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const PREFIX = "users";
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT = "createdAt";
const DEFAULT_SORT_DIR = "desc";
const DEFAULT_ROLE = "all";
const DEFAULT_STATUS = "all";

interface InitialData {
  users: AdminUser[];
  stats: AdminUsersStats | null;
  pagination: AdminUsersPagination;
  sorting: AdminUsersSorting[];
  filters: AdminUsersFilters;
  error: string | null;
}

interface AdminUsersClientProps {
  initialData: InitialData;
}

const AdminUsersHeader = memo(function AdminUsersHeader() {
  return (
    <AnimatedSection animation="fade-down" delay={0}>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestión de Usuarios
        </h1>
        <p className="text-muted-foreground">
          Administra los usuarios de la plataforma, sus roles y permisos.
        </p>
      </div>
    </AnimatedSection>
  );
});

interface ErrorAlertProps {
  error: string;
  onRetry: () => void;
  isPending: boolean;
}

const ErrorAlert = memo(function ErrorAlert({ error, onRetry, isPending }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" role="alert" aria-live="assertive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error al cargar usuarios</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{error}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={isPending}
          className="ml-4"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
          Reintentar
        </Button>
      </AlertDescription>
    </Alert>
  );
});

interface BulkActionsProps {
  selectedCount: number;
  isPending: boolean;
  onBulkBlock: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

const BulkActions = memo(function BulkActions({
  selectedCount,
  isPending,
  onBulkBlock,
  onBulkDelete,
  onClearSelection,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 rounded-md bg-muted/50 p-2">
      <span className="text-sm text-muted-foreground">
        {selectedCount} usuario{selectedCount > 1 ? "s" : ""} seleccionado
        {selectedCount > 1 ? "s" : ""}
      </span>
      <Button variant="outline" size="sm" onClick={onBulkBlock} disabled={isPending}>
        <Ban className="mr-2 h-4 w-4" />
        Bloquear
      </Button>
      <Button variant="destructive" size="sm" onClick={onBulkDelete} disabled={isPending}>
        <Trash2 className="mr-2 h-4 w-4" />
        Eliminar
      </Button>
      <Button variant="ghost" size="sm" onClick={onClearSelection}>
        Limpiar selección
      </Button>
    </div>
  );
});

export function AdminUsersClient({ initialData }: AdminUsersClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Inicializar el state global con los datos del servidor (solo una vez)
  const isInitializedRef = useRef(false);
  if (!isInitializedRef.current) {
    adminUsersState.setUsers(initialData.users);
    adminUsersState.setPagination(initialData.pagination);
    if (initialData.stats) {
      adminUsersState.setStats(initialData.stats);
    }
    adminUsersState.setFilters(initialData.filters);
    if (initialData.error) {
      adminUsersState.setError(initialData.error);
    }
    adminUsersState.setInitialized(true);
    isInitializedRef.current = true;
  }

  // useSyncExternalStore en lugar de useState + useEffect
  const state = useSyncExternalStore(
    adminUsersState.subscribe.bind(adminUsersState),
    adminUsersState.getSnapshot.bind(adminUsersState),
    adminUsersState.getServerSnapshot.bind(adminUsersState)
  );

  // Leer estado de URL
  const urlState = useMemo(() => {
    const getParam = (key: string) => searchParams.get(`${PREFIX}_${key}`);
    return {
      page: getParam("page") ? parseInt(getParam("page")!, 10) : DEFAULT_PAGE,
      pageSize: getParam("pageSize") ? parseInt(getParam("pageSize")!, 10) : DEFAULT_PAGE_SIZE,
      sort: getParam("sort") || DEFAULT_SORT,
      sortDir: (getParam("sortDir") || DEFAULT_SORT_DIR) as "asc" | "desc",
      search: getParam("search") || "",
      role: (getParam("role") || DEFAULT_ROLE) as Role | "all",
      status: (getParam("status") || DEFAULT_STATUS) as AdminUserStatus,
    };
  }, [searchParams]);

  // Actualizar URL sin useEffect
  const updateUrl = useCallback(
    (updates: Partial<typeof urlState>) => {
      const params = new URLSearchParams(searchParams.toString());
      const newState = { ...urlState, ...updates };

      if (newState.page === DEFAULT_PAGE) params.delete(`${PREFIX}_page`);
      else params.set(`${PREFIX}_page`, String(newState.page));

      if (newState.pageSize === DEFAULT_PAGE_SIZE) params.delete(`${PREFIX}_pageSize`);
      else params.set(`${PREFIX}_pageSize`, String(newState.pageSize));

      if (newState.sort === DEFAULT_SORT && newState.sortDir === DEFAULT_SORT_DIR) {
        params.delete(`${PREFIX}_sort`);
        params.delete(`${PREFIX}_sortDir`);
      } else {
        params.set(`${PREFIX}_sort`, newState.sort);
        params.set(`${PREFIX}_sortDir`, newState.sortDir);
      }

      if (!newState.search) params.delete(`${PREFIX}_search`);
      else params.set(`${PREFIX}_search`, newState.search);

      if (newState.role === DEFAULT_ROLE) params.delete(`${PREFIX}_role`);
      else params.set(`${PREFIX}_role`, newState.role);

      if (newState.status === DEFAULT_STATUS) params.delete(`${PREFIX}_status`);
      else params.set(`${PREFIX}_status`, newState.status);

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    },
    [searchParams, pathname, router, urlState]
  );

  // Fetch con Server Action directamente (sin useEffect)
  const fetchUsers = useCallback(
    (params: typeof urlState) => {
      startTransition(async () => {
        adminUsersState.setLoading(true);

        const sorting: AdminUsersSorting[] = params.sort
          ? [{ id: params.sort, desc: params.sortDir === "desc" }]
          : [];

        const filters: AdminUsersFilters = {
          search: params.search,
          role: params.role,
          status: params.status,
        };

        const result = await getUsersAction({
          page: params.page,
          limit: params.pageSize,
          sorting,
          filters,
        });

        if (result.error) {
          adminUsersState.setError(result.error);
          toast.error(result.error);
        } else if (result.data) {
          adminUsersState.setError(null);
          adminUsersState.setUsers(result.data.users);
          adminUsersState.setStats(result.data.stats);
          adminUsersState.setPagination({
            pageIndex: params.page - 1,
            pageSize: params.pageSize,
            totalRows: result.data.pagination.total,
            totalPages: result.data.pagination.totalPages,
          });
          adminUsersState.setFilters(filters);
        }

        adminUsersState.setLoading(false);
      });
    },
    []
  );

  const handleRefresh = useCallback(() => {
    fetchUsers(urlState);
    toast.success("Datos actualizados");
  }, [fetchUsers, urlState]);

  // Handlers que actualizan URL y disparan fetch
  const handlePaginationChange = useCallback(
    (pagination: { pageIndex: number; pageSize: number }) => {
      const newParams = {
        ...urlState,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      };
      updateUrl(newParams);
      fetchUsers(newParams);
    },
    [urlState, updateUrl, fetchUsers]
  );

  const handleSortingChange = useCallback(
    (sorting: AdminUsersSorting[]) => {
      const newParams = {
        ...urlState,
        sort: sorting.length > 0 ? sorting[0].id : DEFAULT_SORT,
        sortDir: sorting.length > 0 && sorting[0].desc ? "desc" as const : "asc" as const,
        page: 1,
      };
      updateUrl(newParams);
      fetchUsers(newParams);
    },
    [urlState, updateUrl, fetchUsers]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      const newParams = { ...urlState, search, page: 1 };
      updateUrl(newParams);
      fetchUsers(newParams);
    },
    [urlState, updateUrl, fetchUsers]
  );

  const handleFiltersChange = useCallback(
    (filters: AdminUsersFilters) => {
      const newParams = {
        ...urlState,
        role: filters.role,
        status: filters.status,
        page: 1,
      };
      updateUrl(newParams);
      fetchUsers(newParams);
    },
    [urlState, updateUrl, fetchUsers]
  );

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    const keysToDelete: string[] = [];
    params.forEach((_, key) => {
      if (key.startsWith(`${PREFIX}_`)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => params.delete(key));

    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });

    fetchUsers({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      sort: DEFAULT_SORT,
      sortDir: DEFAULT_SORT_DIR as "asc" | "desc",
      search: "",
      role: DEFAULT_ROLE as Role | "all",
      status: DEFAULT_STATUS as AdminUserStatus,
    });
  }, [searchParams, pathname, router, fetchUsers]);

  // Actions
  const blockUser = useCallback(
    (userId: string, reason?: string) => {
      startTransition(async () => {
        adminUsersState.setPending(true);
        const result = await blockUserAction(userId, reason);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          adminUsersState.closeDialog();
          fetchUsers(urlState);
        }
        adminUsersState.setPending(false);
      });
    },
    [fetchUsers, urlState]
  );

  const unblockUser = useCallback(
    (userId: string) => {
      startTransition(async () => {
        adminUsersState.setPending(true);
        const result = await unblockUserAction(userId);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          adminUsersState.closeDialog();
          fetchUsers(urlState);
        }
        adminUsersState.setPending(false);
      });
    },
    [fetchUsers, urlState]
  );

  const changeRole = useCallback(
    (userId: string, newRole: Role) => {
      startTransition(async () => {
        adminUsersState.setPending(true);
        const result = await changeRoleAction(userId, newRole);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          adminUsersState.closeDialog();
          fetchUsers(urlState);
        }
        adminUsersState.setPending(false);
      });
    },
    [fetchUsers, urlState]
  );

  const deleteUser = useCallback(
    (userId: string, reason: string) => {
      startTransition(async () => {
        adminUsersState.setPending(true);
        const result = await deleteUserAction(userId, reason);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          adminUsersState.closeDialog();
          fetchUsers(urlState);
        }
        adminUsersState.setPending(false);
      });
    },
    [fetchUsers, urlState]
  );

  const restoreUser = useCallback(
    (userId: string) => {
      startTransition(async () => {
        adminUsersState.setPending(true);
        const result = await restoreUserAction(userId);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          adminUsersState.closeDialog();
          fetchUsers(urlState);
        }
        adminUsersState.setPending(false);
      });
    },
    [fetchUsers, urlState]
  );

  const bulkBlockUsers = useCallback(
    (reason?: string) => {
      const selectedIds = Object.keys(state.rowSelection).filter((id) => state.rowSelection[id]);
      if (selectedIds.length === 0) {
        toast.error("No hay usuarios seleccionados");
        return;
      }

      startTransition(async () => {
        adminUsersState.setPending(true);
        const result = await bulkBlockUsersAction(selectedIds, reason);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          adminUsersState.clearSelection();
          fetchUsers(urlState);
        }
        adminUsersState.setPending(false);
      });
    },
    [state.rowSelection, fetchUsers, urlState]
  );

  const bulkDeleteUsers = useCallback(() => {
    const selectedIds = Object.keys(state.rowSelection).filter((id) => state.rowSelection[id]);
    if (selectedIds.length === 0) {
      toast.error("No hay usuarios seleccionados");
      return;
    }

    startTransition(async () => {
      adminUsersState.setPending(true);
      const result = await bulkDeleteUsersAction(selectedIds);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        adminUsersState.clearSelection();
        fetchUsers(urlState);
      }
      adminUsersState.setPending(false);
    });
  }, [state.rowSelection, fetchUsers, urlState]);

  // Ref para acciones estables
  const actionsRef = useRef({
    onOpenDialog: (dialog: AdminUsersDialogType, user: AdminUser) => {
      adminUsersState.openDialog(dialog, user);
    },
  });

  // Columnas memoizadas
  const columns = useMemo(
    () => createAdminUsersColumns(actionsRef.current),
    []
  );

  // Configs memoizadas
  const selectionConfig: SelectionConfig<AdminUser> = useMemo(
    () => ({
      enabled: true,
      mode: "multiple",
      showCheckbox: true,
      selectedRows: state.rowSelection,
      onSelectionChange: adminUsersState.setRowSelection.bind(adminUsersState),
    }),
    [state.rowSelection]
  );

  const paginationConfig: PaginationConfig = useMemo(
    () => ({
      pageIndex: urlState.page - 1,
      pageSize: urlState.pageSize,
      totalRows: state.pagination.totalRows,
      totalPages: state.pagination.totalPages,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      onPaginationChange: handlePaginationChange,
      showRowsInfo: true,
      showSelectedInfo: true,
    }),
    [urlState.page, urlState.pageSize, state.pagination.totalRows, state.pagination.totalPages, handlePaginationChange]
  );

  const sortingState: AdminUsersSorting[] = useMemo(
    () => (urlState.sort ? [{ id: urlState.sort, desc: urlState.sortDir === "desc" }] : []),
    [urlState.sort, urlState.sortDir]
  );

  const sortingConfig: SortingConfig = useMemo(
    () => ({
      sorting: sortingState,
      onSortingChange: handleSortingChange,
      manualSorting: true,
    }),
    [sortingState, handleSortingChange]
  );

  const filterConfig: FilterConfig = useMemo(
    () => ({
      globalFilter: urlState.search,
      onGlobalFilterChange: handleSearchChange,
      placeholder: "Buscar por nombre, email o usuario...",
      debounceMs: 700,
      showClearButton: true,
    }),
    [urlState.search, handleSearchChange]
  );

  const columnVisibilityConfig: ColumnVisibilityConfig = useMemo(
    () => ({
      enabled: true,
      columnVisibility: state.columnVisibility,
      onColumnVisibilityChange: adminUsersState.setColumnVisibility.bind(adminUsersState),
      alwaysVisibleColumns: ["user", "actions"],
    }),
    [state.columnVisibility]
  );

  const toolbarConfig: ToolbarConfig = useMemo(
    () => ({
      show: true,
      showSearch: true,
      showColumnVisibility: true,
      showDensityToggle: true,
      showRefresh: true,
      showFullscreen: true,
      showCopy: true,
      showPrint: true,
      showExport: true,
      onRefresh: handleRefresh,
    }),
    [handleRefresh]
  );

  const exportConfig: ExportConfig<AdminUser> = useMemo(
    () => ({
      enabled: true,
      formats: ["csv", "json"],
      filename: "usuarios",
      includeHeaders: true,
    }),
    []
  );

  const renderExpandedContent = useCallback(
    (user: AdminUser) => <UserExpandedContent user={user} />,
    []
  );

  const expansionConfig: ExpansionConfig<AdminUser> = useMemo(
    () => ({
      enabled: true,
      expandedRows: state.expandedRows,
      onExpansionChange: adminUsersState.setExpandedRows.bind(adminUsersState),
      renderContent: renderExpandedContent,
      expandOnClick: false,
    }),
    [state.expandedRows, renderExpandedContent]
  );

  const selectedCount = useMemo(
    () => Object.values(state.rowSelection).filter(Boolean).length,
    [state.rowSelection]
  );

  const filters: AdminUsersFilters = useMemo(
    () => ({
      search: urlState.search,
      role: urlState.role,
      status: urlState.status,
    }),
    [urlState.search, urlState.role, urlState.status]
  );

  const getRowId = useCallback((row: AdminUser) => row.id, []);

  return (
    <div className="space-y-6">
      <AdminUsersHeader />

      {state.error && (
        <AnimatedSection animation="fade-up" delay={50}>
          <ErrorAlert
            error={state.error}
            onRetry={handleRefresh}
            isPending={isPending || state.isPending}
          />
        </AnimatedSection>
      )}

      <AnimatedSection animation="fade-up" delay={100}>
        <AdminUsersStatsSection stats={state.stats} />
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={200}>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <AdminUsersFiltersSection
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={resetFilters}
            />
            <BulkActions
              selectedCount={selectedCount}
              isPending={isPending || state.isPending}
              onBulkBlock={() => bulkBlockUsers()}
              onBulkDelete={bulkDeleteUsers}
              onClearSelection={adminUsersState.clearSelection.bind(adminUsersState)}
            />
          </div>

          <CustomDataTable
            data={state.users}
            columns={columns}
            getRowId={getRowId}
            selection={selectionConfig}
            expansion={expansionConfig}
            pagination={paginationConfig}
            sorting={sortingConfig}
            filter={filterConfig}
            columnVisibility={columnVisibilityConfig}
            toolbarConfig={toolbarConfig}
            style={STYLE_CONFIG}
            export={exportConfig}
            copy={COPY_CONFIG}
            print={PRINT_CONFIG}
            fullscreen={FULLSCREEN_CONFIG}
            isLoading={state.isLoading}
            isPending={isPending || state.isPending}
            emptyMessage="No se encontraron usuarios"
          />
        </div>
      </AnimatedSection>

      <UserDetailsDialog
        user={state.selectedUser}
        open={state.activeDialog === "details"}
        onClose={adminUsersState.closeDialog.bind(adminUsersState)}
      />

      <BlockUserDialog
        user={state.selectedUser}
        open={state.activeDialog === "block" || state.activeDialog === "unblock"}
        isPending={isPending || state.isPending}
        mode={state.activeDialog === "block" ? "block" : "unblock"}
        onClose={adminUsersState.closeDialog.bind(adminUsersState)}
        onBlock={blockUser}
        onUnblock={unblockUser}
      />

      <ChangeRoleDialog
        user={state.selectedUser}
        open={state.activeDialog === "change-role"}
        isPending={isPending || state.isPending}
        onClose={adminUsersState.closeDialog.bind(adminUsersState)}
        onChangeRole={changeRole}
      />

      <DeleteUserDialog
        user={state.selectedUser}
        open={state.activeDialog === "delete"}
        isPending={isPending || state.isPending}
        onClose={adminUsersState.closeDialog.bind(adminUsersState)}
        onDelete={deleteUser}
      />

      <RestoreUserDialog
        user={state.selectedUser}
        open={state.activeDialog === "restore"}
        isPending={isPending || state.isPending}
        onClose={adminUsersState.closeDialog.bind(adminUsersState)}
        onRestore={restoreUser}
      />
    </div>
  );
}
