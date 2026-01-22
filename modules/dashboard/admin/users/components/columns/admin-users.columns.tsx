"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Ban,
  Unlock,
  UserCog,
  Trash2,
  Shield,
  ShieldCheck,
  RotateCcw,
  Check,
  X,
  Mail,
  AtSign,
  Calendar,
  Clock,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { CustomColumnDef } from "@/components/custom-datatable";
import type { AdminUser, AdminUsersDialogType } from "../../types/admin-users.types";
import { Role } from "@/app/prisma/enums";

interface ColumnActions {
  onOpenDialog: (dialog: AdminUsersDialogType, user: AdminUser) => void;
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getUserStatus(user: AdminUser): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  if (user.deletedAt) {
    return { label: "Eliminado", variant: "destructive" };
  }
  if (user.isBlocked) {
    return { label: "Bloqueado", variant: "destructive" };
  }
  if (!user.emailVerified) {
    return { label: "Sin verificar", variant: "secondary" };
  }
  return { label: "Activo", variant: "default" };
}

export function createAdminUsersColumns(
  actions: ColumnActions
): CustomColumnDef<AdminUser>[] {
  return [
    {
      id: "user",
      accessorKey: "name",
      header: "Usuario",
      enableSorting: true,
      minWidth: 200,
      cell: ({ row }) => {
        const isBlocked = row.isBlocked && !row.deletedAt;
        const isDeleted = !!row.deletedAt;

        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar
                className={`h-10 w-10 ${
                  isDeleted
                    ? "opacity-50 grayscale"
                    : isBlocked
                    ? "ring-2 ring-destructive ring-offset-2"
                    : ""
                }`}
              >
                <AvatarImage src={row.image || undefined} alt={row.name || ""} />
                <AvatarFallback>{getInitials(row.name)}</AvatarFallback>
              </Avatar>
              {isBlocked && (
                <div
                  className="absolute -bottom-1 -right-1 rounded-full bg-destructive p-1"
                  title="Usuario bloqueado"
                >
                  <Ban className="h-3 w-3 text-destructive-foreground" />
                </div>
              )}
              {isDeleted && (
                <div
                  className="absolute -bottom-1 -right-1 rounded-full bg-muted p-1"
                  title="Usuario eliminado"
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span
                  className={`font-medium ${
                    isDeleted ? "text-muted-foreground line-through" : ""
                  }`}
                >
                  {row.name || "Sin nombre"}
                </span>
                {isBlocked && (
                  <Badge variant="destructive" className="h-5 gap-1 text-xs">
                    <Ban className="h-3 w-3" />
                    Bloqueado
                  </Badge>
                )}
              </div>
              {row.userName && (
                <span className="text-xs text-muted-foreground">
                  @{row.userName}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      enableSorting: true,
      minWidth: 180,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.email || "Sin email"}</span>
        </div>
      ),
    },
    {
      id: "role",
      accessorKey: "role",
      header: "Rol",
      enableSorting: true,
      align: "center",
      cell: ({ row }) => {
        const isAdmin = row.role === Role.ADMIN;
        return (
          <Badge
            variant={isAdmin ? "default" : "secondary"}
            className="gap-1"
          >
            {isAdmin ? (
              <ShieldCheck className="h-3 w-3" />
            ) : (
              <Shield className="h-3 w-3" />
            )}
            {isAdmin ? "Admin" : "Usuario"}
          </Badge>
        );
      },
    },
    {
      id: "status",
      header: "Estado",
      enableSorting: false,
      align: "center",
      cell: ({ row }) => {
        const status = getUserStatus(row);
        return <Badge variant={status.variant}>{status.label}</Badge>;
      },
    },
    {
      id: "emailVerified",
      accessorKey: "emailVerified",
      header: "Email Verificado",
      enableSorting: true,
      align: "center",
      defaultHidden: true,
      cell: ({ row }) =>
        row.emailVerified ? (
          <div className="flex items-center justify-center gap-1">
            <Check className="h-4 w-4 text-green-500" />
            <span className="text-xs text-muted-foreground">
              {format(new Date(row.emailVerified), "dd/MM/yy")}
            </span>
          </div>
        ) : (
          <X className="h-4 w-4 text-muted-foreground mx-auto" />
        ),
    },
    {
      id: "twoFactor",
      accessorKey: "isTwoFactorEnabled",
      header: "2FA",
      enableSorting: true,
      align: "center",
      cell: ({ row }) =>
        row.isTwoFactorEnabled ? (
          <Badge variant="default" className="gap-1">
            <Check className="h-3 w-3" />
            Activo
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <X className="h-3 w-3" />
            No
          </Badge>
        ),
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Registrado",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm">
            {format(new Date(row.createdAt), "dd MMM yyyy", { locale: es })}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(row.createdAt), {
              addSuffix: true,
              locale: es,
            })}
          </span>
        </div>
      ),
    },
    {
      id: "updatedAt",
      accessorKey: "updatedAt",
      header: "Última Actualización",
      enableSorting: true,
      defaultHidden: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(row.updatedAt), {
              addSuffix: true,
              locale: es,
            })}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const isDeleted = !!row.deletedAt;
        const isBlocked = row.isBlocked;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => actions.onOpenDialog("details", row)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>

              {isDeleted ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => actions.onOpenDialog("restore", row)}
                    className="text-green-600 focus:text-green-600"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Restaurar cuenta
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuSeparator />

                  {isBlocked ? (
                    <DropdownMenuItem
                      onClick={() => actions.onOpenDialog("unblock", row)}
                    >
                      <Unlock className="mr-2 h-4 w-4" />
                      Desbloquear
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => actions.onOpenDialog("block", row)}
                    >
                      <Ban className="mr-2 h-4 w-4" />
                      Bloquear
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={() => actions.onOpenDialog("change-role", row)}
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Cambiar rol
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => actions.onOpenDialog("delete", row)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
