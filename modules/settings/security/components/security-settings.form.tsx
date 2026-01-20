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
  Shield,
  ShieldCheck,
  ShieldOff,
  AlertTriangle,
  Loader2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { SecuritySettingsViewModel } from "../view-model/security-settings.view-model";
import { SecuritySettingsSkeleton } from "./security-settings.skeleton";
import { ActiveSessions } from "@/modules/sessions/components/active-sessions";
import { RecentActivity } from "@/modules/sessions/components/recent-activity";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export const SecuritySettingsForm = memo(function SecuritySettingsForm() {
  const {
    securityInfo,
    isLoading,
    isPending,
    error,
    handleEnableTwoFactor,
    handleDisableTwoFactor,
    refreshSecurityInfo,
  } = SecuritySettingsViewModel();

  if (isLoading) {
    return <SecuritySettingsSkeleton />;
  }

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
          <Button variant="outline" onClick={refreshSecurityInfo}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!securityInfo) {
    return null;
  }

  const isTwoFactorEnabled = securityInfo.isTwoFactorEnabled;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/50 shadow-lg">
        <div className={`h-1.5 ${isTwoFactorEnabled ? "bg-green-500" : "bg-muted"}`} />
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isTwoFactorEnabled ? "bg-green-500/10" : "bg-primary/10"}`}>
              <Shield className={`h-5 w-5 ${isTwoFactorEnabled ? "text-green-500" : "text-primary"}`} />
            </div>
            <div>
              <CardTitle className="text-lg">Autenticación de dos factores</CardTitle>
              <CardDescription>
                Protege tu cuenta con verificación adicional
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl bg-muted/30 p-4">
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isTwoFactorEnabled ? "bg-green-500/10" : "bg-muted"}`}>
                {isTwoFactorEnabled ? (
                  <ShieldCheck className="h-6 w-6 text-green-500" />
                ) : (
                  <ShieldOff className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">Verificación por email</p>
                  {isTwoFactorEnabled ? (
                    <Badge className="bg-green-500 hover:bg-green-500/90">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Activo
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactivo</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {isTwoFactorEnabled
                    ? `Código enviado a ${securityInfo.email?.replace(/(.{2})(.*)(@.*)/, "$1***$3")}`
                    : "Recibe un código de verificación al iniciar sesión"}
                </p>
              </div>
            </div>

            {isTwoFactorEnabled ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={isPending} className="shrink-0">
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldOff className="mr-2 h-4 w-4" />
                    )}
                    Desactivar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Desactivar 2FA?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tu cuenta será menos segura sin la autenticación de dos
                      factores. ¿Estás seguro de que deseas continuar?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDisableTwoFactor}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      Desactivar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button onClick={handleEnableTwoFactor} disabled={isPending} className="shrink-0">
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="mr-2 h-4 w-4" />
                )}
                Activar 2FA
              </Button>
            )}
          </div>

          {securityInfo.lockedUntil && (
            <div className="flex items-center gap-3 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive">Cuenta bloqueada</p>
                <p className="text-xs text-destructive/80">
                  Hasta {formatDate(securityInfo.lockedUntil)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ActiveSessions />

      <RecentActivity />
    </div>
  );
});
