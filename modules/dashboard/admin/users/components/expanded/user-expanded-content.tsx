"use client";

import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  AtSign,
  Calendar,
  Clock,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Ban,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Hash,
  Key,
} from "lucide-react";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { Role } from "@/app/prisma/enums";
import type { AdminUser } from "../../types/admin-users.types";

interface UserExpandedContentProps {
  user: AdminUser;
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  className?: string;
}

const InfoItem = memo(function InfoItem({
  icon,
  label,
  value,
  className = "",
}: InfoItemProps) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span className="text-sm">{value}</span>
      </div>
    </div>
  );
});

export const UserExpandedContent = memo(function UserExpandedContent({
  user,
}: UserExpandedContentProps) {
  const GRACE_PERIOD_DAYS = 30;

  const getGracePeriodInfo = () => {
    if (!user.deletedAt) return null;
    const deletedDate = new Date(user.deletedAt);
    const daysElapsed = differenceInDays(new Date(), deletedDate);
    const daysRemaining = Math.max(0, GRACE_PERIOD_DAYS - daysElapsed);
    return { daysElapsed, daysRemaining };
  };

  const gracePeriod = getGracePeriodInfo();

  return (
    <div className="p-4 bg-muted/30">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Información Básica */}
        <Card className="border-0 shadow-none bg-background">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              Información Básica
            </h4>
            <Separator />
            <div className="space-y-3">
              <InfoItem
                icon={<Hash className="h-4 w-4" />}
                label="ID de Usuario"
                value={
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                    {user.id}
                  </code>
                }
              />
              <InfoItem
                icon={<User className="h-4 w-4" />}
                label="Nombre"
                value={user.name || "No especificado"}
              />
              <InfoItem
                icon={<AtSign className="h-4 w-4" />}
                label="Username"
                value={user.userName ? `@${user.userName}` : "No especificado"}
              />
              <InfoItem
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={user.email || "No especificado"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card className="border-0 shadow-none bg-background">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Seguridad
            </h4>
            <Separator />
            <div className="space-y-3">
              <InfoItem
                icon={
                  user.role === Role.ADMIN ? (
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  ) : (
                    <Shield className="h-4 w-4" />
                  )
                }
                label="Rol"
                value={
                  <Badge variant={user.role === Role.ADMIN ? "default" : "secondary"}>
                    {user.role === Role.ADMIN ? "Administrador" : "Usuario"}
                  </Badge>
                }
              />
              <InfoItem
                icon={
                  user.emailVerified ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )
                }
                label="Email Verificado"
                value={
                  user.emailVerified ? (
                    <span className="text-green-600">
                      Sí -{" "}
                      {format(new Date(user.emailVerified), "dd/MM/yyyy HH:mm")}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No verificado</span>
                  )
                }
              />
              <InfoItem
                icon={
                  user.isTwoFactorEnabled ? (
                    <Key className="h-4 w-4 text-green-500" />
                  ) : (
                    <Key className="h-4 w-4 text-muted-foreground" />
                  )
                }
                label="Autenticación 2FA"
                value={
                  user.isTwoFactorEnabled ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Activo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Desactivado
                    </Badge>
                  )
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Estado de la Cuenta */}
        <Card className="border-0 shadow-none bg-background overflow-hidden min-w-0">
          <CardContent className="p-4 space-y-4 min-w-0">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span className="truncate">Estado de la Cuenta</span>
            </h4>
            <Separator />
            <div className="space-y-3 min-w-0">
              {user.isBlocked && !user.deletedAt && (
                <div className="p-3 rounded-md border border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/30 space-y-2">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <Ban className="h-4 w-4 shrink-0" />
                    <span className="font-medium text-sm">Bloqueada</span>
                  </div>
                  {user.blockedAt && (
                    <p className="text-xs text-muted-foreground pl-6">
                      {format(new Date(user.blockedAt), "dd/MM/yy HH:mm", {
                        locale: es,
                      })}
                    </p>
                  )}
                  {user.blockedReason && (
                    <p className="text-xs pl-6 break-words whitespace-normal">
                      <span className="text-muted-foreground">Razón: </span>
                      {user.blockedReason}
                    </p>
                  )}
                </div>
              )}

              {user.deletedAt && (
                <div className="p-3 rounded-md border border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/30 space-y-2 overflow-hidden">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <Trash2 className="h-4 w-4 shrink-0" />
                    <span className="font-medium text-sm truncate">Eliminada</span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-6 truncate">
                    {format(new Date(user.deletedAt), "dd/MM/yy HH:mm", {
                      locale: es,
                    })}
                  </p>
                  {gracePeriod && gracePeriod.daysRemaining > 0 && (
                    <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 pl-6">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      <span className="text-xs truncate">
                        {gracePeriod.daysRemaining}d para reactivar
                      </span>
                    </div>
                  )}
                  {gracePeriod && gracePeriod.daysRemaining === 0 && (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 pl-6">
                      <XCircle className="h-3 w-3 shrink-0" />
                      <span className="text-xs truncate">Gracia expirado</span>
                    </div>
                  )}
                </div>
              )}

              {!user.isBlocked && !user.deletedAt && (
                <div className="p-3 rounded-md border border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/30 overflow-hidden">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span className="font-medium text-sm truncate">Activa</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 pl-6 truncate">
                    Acceso normal
                  </p>
                </div>
              )}

              {!user.emailVerified && !user.deletedAt && !user.isBlocked && (
                <div className="p-3 rounded-md border border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/30 overflow-hidden">
                  <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span className="font-medium text-sm truncate">
                      Sin verificar
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 pl-6 truncate">
                    Verificar email
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fechas */}
        <Card className="border-0 shadow-none bg-background">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fechas
            </h4>
            <Separator />
            <div className="space-y-3">
              <InfoItem
                icon={<Calendar className="h-4 w-4" />}
                label="Fecha de Registro"
                value={
                  <div className="flex flex-col">
                    <span>
                      {format(new Date(user.createdAt), "dd/MM/yyyy HH:mm", {
                        locale: es,
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(user.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </div>
                }
              />
              <InfoItem
                icon={<Clock className="h-4 w-4" />}
                label="Última Actualización"
                value={
                  <div className="flex flex-col">
                    <span>
                      {format(new Date(user.updatedAt), "dd/MM/yyyy HH:mm", {
                        locale: es,
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(user.updatedAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </div>
                }
              />
              {user.blockedAt && (
                <InfoItem
                  icon={<Ban className="h-4 w-4 text-destructive" />}
                  label="Fecha de Bloqueo"
                  value={
                    <span className="text-destructive">
                      {format(new Date(user.blockedAt), "dd/MM/yyyy HH:mm", {
                        locale: es,
                      })}
                    </span>
                  }
                />
              )}
              {user.deletedAt && (
                <InfoItem
                  icon={<Trash2 className="h-4 w-4 text-destructive" />}
                  label="Fecha de Eliminación"
                  value={
                    <span className="text-destructive">
                      {format(new Date(user.deletedAt), "dd/MM/yyyy HH:mm", {
                        locale: es,
                      })}
                    </span>
                  }
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
