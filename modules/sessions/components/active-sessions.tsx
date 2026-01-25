"use client";

import { memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Monitor,
  Globe,
  Clock,
  LogOut,
  Loader2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useSessions } from "../hooks/use-sessions";
import { formatSessionInfo, getDeviceLabel } from "@/lib/device-parser";
import { formatRelativeTime } from "@/lib/date-utils";
import { DeviceIcon } from "@/components/device-icon";
import type { SessionData } from "../types/sessions.types";

interface ActiveSessionsProps {
  initialSessions: SessionData[];
  initialError?: string | null;
}

const SessionItem = memo(function SessionItem({
  session,
  onRevoke,
  isPending,
}: {
  session: SessionData;
  onRevoke: (id: string) => void;
  isPending: boolean;
}) {
  const deviceInfo = {
    deviceType: session.deviceType || "unknown",
    browser: session.browser || "Desconocido",
    os: session.os || "Desconocido",
  } as const;

  return (
    <div
      className={`flex items-center gap-4 rounded-xl p-4 transition-colors ${
        session.isCurrent
          ? "bg-primary/5 border border-primary/20"
          : "bg-muted/30 hover:bg-muted/50"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          session.isCurrent
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <DeviceIcon deviceType={session.deviceType} className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium truncate">
            {formatSessionInfo(deviceInfo)}
          </p>
          {session.isCurrent && (
            <Badge className="bg-primary hover:bg-primary/90 shrink-0">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Esta sesión
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
          <span className="truncate">
            {getDeviceLabel(session.deviceType || "unknown")}
          </span>
          {session.ipAddress && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {session.ipAddress}
              </span>
            </>
          )}
          <span>•</span>
          <span className="flex items-center gap-1 shrink-0">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(session.lastActive)}
          </span>
        </div>
      </div>

      {!session.isCurrent && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isPending}
              className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Cerrar esta sesión?</AlertDialogTitle>
              <AlertDialogDescription>
                Se cerrará la sesión en {deviceInfo.browser} ({deviceInfo.os}).
                El dispositivo tendrá que volver a iniciar sesión.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onRevoke(session.id)}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                Cerrar sesión
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
});

export const ActiveSessions = memo(function ActiveSessions({
  initialSessions,
  initialError,
}: ActiveSessionsProps) {
  const {
    sessions,
    isPending,
    error,
    revokeSession,
    revokeAllOther,
    refresh,
    hasOtherSessions,
  } = useSessions({ initialSessions, initialError });

  if (error) {
    return (
      <Card className="border-destructive/30 bg-destructive/5 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div className="text-center">
            <p className="font-medium text-destructive">Error al cargar</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
          <Button variant="outline" onClick={refresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Monitor className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Sesiones activas</CardTitle>
              <CardDescription>
                Dispositivos donde has iniciado sesión
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={refresh}
            disabled={isPending}
            className="shrink-0"
          >
            <RefreshCw
              className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
              <Monitor className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No hay sesiones activas</p>
          </div>
        ) : (
          <>
            {sessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                onRevoke={revokeSession}
                isPending={isPending}
              />
            ))}

            {hasOtherSessions && (
              <div className="pt-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                      )}
                      Cerrar todas las demás sesiones
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ¿Cerrar todas las demás sesiones?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Se cerrarán todas las sesiones excepto la actual. Los
                        dispositivos tendrán que volver a iniciar sesión.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={revokeAllOther}
                        className="bg-destructive text-white hover:bg-destructive/90"
                      >
                        Cerrar sesiones
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
});
