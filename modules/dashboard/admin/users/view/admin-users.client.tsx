"use client";

import { memo, useCallback, useMemo, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AlertCircle, Ban, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomDataTable } from "@/components/custom-datatable";
import { AnimatedSection } from "@/components/ui/animated-section";

import {
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
  isNavigating: boolean;
}

const ErrorAlert = memo(function ErrorAlert({ error, onRetry, isNavigating }: ErrorAlertProps) {
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
          disabled={isNavigating}
          className="ml-4"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isNavigating ? "animate-spin" : ""}`} />
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

  // Estado de UI local (no datos del servidor)
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [activeDialog, setActiveDialog] = useState<AdminUsersDialogType>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Datos del servidor (readonly, vienen del Server Component)
  const { users, stats, pagination, error } = initialData;

  // Leer estado de URL para sincronizar UI
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

  // Navegar con router.replace - dispara re-fetch en Server Component con _rsc
  const navigate = useCallback(
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
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      setIsNavigating(true);
      router.replace(newUrl, { scroll: false });
      setTimeout(() => setIsNavigating(false), 100);
    },
    [searchParams, pathname, router, urlState]
  );

  // Handlers de navegación (disparan Server Component re-fetch)
  const handlePaginationChange = useCallback(
    (paginationUpdate: { pageIndex: number; pageSize: number }) => {
      setRowSelection({});
      navigate({
        page: paginationUpdate.pageIndex + 1,
        pageSize: paginationUpdate.pageSize,
      });
    },
    [navigate]
  );

  const handleSortingChange = useCallback(
    (sorting: AdminUsersSorting[]) => {
      navigate({
        sort: sorting.length > 0 ? sorting[0].id : DEFAULT_SORT,
        sortDir: sorting.length > 0 && sorting[0].desc ? "desc" : "asc",
        page: 1,
      });
    },
    [navigate]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      navigate({ search, page: 1 });
    },
    [navigate]
  );

  const handleFiltersChange = useCallback(
    (filters: AdminUsersFilters) => {
      navigate({
        role: filters.role,
        status: filters.status,
        page: 1,
      });
    },
    [navigate]
  );

  const resetFilters = useCallback(() => {
    navigate({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      sort: DEFAULT_SORT,
      sortDir: DEFAULT_SORT_DIR as "asc" | "desc",
      search: "",
      role: DEFAULT_ROLE as Role | "all",
      status: DEFAULT_STATUS as AdminUserStatus,
    });
  }, [navigate]);

  const handleRefresh = useCallback(() => {
    router.refresh();
    toast.success("Datos actualizados");
  }, [router]);

  // Dialog handlers
  const openDialog = useCallback((type: AdminUsersDialogType, user: AdminUser | null = null) => {
    setActiveDialog(type);
    setSelectedUser(user);
  }, []);

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
    setSelectedUser(null);
  }, []);

  // Actions que modifican datos (usan Server Actions y luego router.refresh)
  const blockUser = useCallback(
    async (userId: string, reason?: string) => {
      setIsPending(true);
      try {
        const result = await blockUserAction(userId, reason);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          closeDialog();
          router.refresh();
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al bloquear usuario");
      } finally {
        setIsPending(false);
      }
    },
    [closeDialog, router]
  );

  const unblockUser = useCallback(
    async (userId: string) => {
      setIsPending(true);
      try {
        const result = await unblockUserAction(userId);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          closeDialog();
          router.refresh();
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al desbloquear usuario");
      } finally {
        setIsPending(false);
      }
    },
    [closeDialog, router]
  );

  const changeRole = useCallback(
    async (userId: string, newRole: Role) => {
      setIsPending(true);
      try {
        const result = await changeRoleAction(userId, newRole);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          closeDialog();
          router.refresh();
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al cambiar rol");
      } finally {
        setIsPending(false);
      }
    },
    [closeDialog, router]
  );

  const deleteUser = useCallback(
    async (userId: string, reason: string) => {
      setIsPending(true);
      try {
        const result = await deleteUserAction(userId, reason);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          closeDialog();
          router.refresh();
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al eliminar usuario");
      } finally {
        setIsPending(false);
      }
    },
    [closeDialog, router]
  );

  const restoreUser = useCallback(
    async (userId: string) => {
      setIsPending(true);
      try {
        const result = await restoreUserAction(userId);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          closeDialog();
          router.refresh();
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al restaurar usuario");
      } finally {
        setIsPending(false);
      }
    },
    [closeDialog, router]
  );

  const bulkBlockUsers = useCallback(
    async (reason?: string) => {
      const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
      if (selectedIds.length === 0) {
        toast.error("No hay usuarios seleccionados");
        return;
      }

      setIsPending(true);
      try {
        const result = await bulkBlockUsersAction(selectedIds, reason);
        if (result.error) {
          toast.error(result.error);
        } else if (result.success) {
          toast.success(result.success);
          setRowSelection({});
          router.refresh();
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error al bloquear usuarios");
      } finally {
        setIsPending(false);
      }
    },
    [rowSelection, router]
  );

  const bulkDeleteUsers = useCallback(async () => {
    const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
    if (selectedIds.length === 0) {
      toast.error("No hay usuarios seleccionados");
      return;
    }

    setIsPending(true);
    try {
      const result = await bulkDeleteUsersAction(selectedIds);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        setRowSelection({});
        router.refresh();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar usuarios");
    } finally {
      setIsPending(false);
    }
  }, [rowSelection, router]);

  // Ref para acciones estables
  const actionsRef = useRef({
    onOpenDialog: openDialog,
  });
  actionsRef.current = { onOpenDialog: openDialog };

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
      selectedRows: rowSelection,
      onSelectionChange: setRowSelection,
    }),
    [rowSelection]
  );

  const paginationConfig: PaginationConfig = useMemo(
    () => ({
      pageIndex: urlState.page - 1,
      pageSize: urlState.pageSize,
      totalRows: pagination.totalRows,
      totalPages: pagination.totalPages,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      onPaginationChange: handlePaginationChange,
      showRowsInfo: true,
      showSelectedInfo: true,
    }),
    [urlState.page, urlState.pageSize, pagination.totalRows, pagination.totalPages, handlePaginationChange]
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
      showClearButton: true,
      // Usa el global de 700ms desde constants.ts
    }),
    [urlState.search, handleSearchChange]
  );

  const columnVisibilityConfig: ColumnVisibilityConfig = useMemo(
    () => ({
      enabled: true,
      columnVisibility: columnVisibility,
      onColumnVisibilityChange: setColumnVisibility,
      alwaysVisibleColumns: ["user", "actions"],
    }),
    [columnVisibility]
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
      expandedRows: expandedRows,
      onExpansionChange: setExpandedRows,
      renderContent: renderExpandedContent,
      expandOnClick: false,
    }),
    [expandedRows, renderExpandedContent]
  );

  const selectedCount = useMemo(
    () => Object.values(rowSelection).filter(Boolean).length,
    [rowSelection]
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

  const clearSelection = useCallback(() => setRowSelection({}), []);

  return (
    <div className="space-y-6">
      <AdminUsersHeader />

      {error && (
        <AnimatedSection animation="fade-up" delay={50}>
          <ErrorAlert
            error={error}
            onRetry={handleRefresh}
            isNavigating={isNavigating}
          />
        </AnimatedSection>
      )}

      <AnimatedSection animation="fade-up" delay={100}>
        <AdminUsersStatsSection stats={stats} />
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
              isPending={isPending}
              onBulkBlock={() => bulkBlockUsers()}
              onBulkDelete={bulkDeleteUsers}
              onClearSelection={clearSelection}
            />
          </div>

          <CustomDataTable
            data={users}
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
            isLoading={false}
            isPending={isNavigating || isPending}
            emptyMessage="No se encontraron usuarios"
          />
        </div>
      </AnimatedSection>

      <UserDetailsDialog
        user={selectedUser}
        open={activeDialog === "details"}
        onClose={closeDialog}
      />

      <BlockUserDialog
        user={selectedUser}
        open={activeDialog === "block" || activeDialog === "unblock"}
        isPending={isPending}
        mode={activeDialog === "block" ? "block" : "unblock"}
        onClose={closeDialog}
        onBlock={blockUser}
        onUnblock={unblockUser}
      />

      <ChangeRoleDialog
        user={selectedUser}
        open={activeDialog === "change-role"}
        isPending={isPending}
        onClose={closeDialog}
        onChangeRole={changeRole}
      />

      <DeleteUserDialog
        user={selectedUser}
        open={activeDialog === "delete"}
        isPending={isPending}
        onClose={closeDialog}
        onDelete={deleteUser}
      />

      <RestoreUserDialog
        user={selectedUser}
        open={activeDialog === "restore"}
        isPending={isPending}
        onClose={closeDialog}
        onRestore={restoreUser}
      />
    </div>
  );
}
