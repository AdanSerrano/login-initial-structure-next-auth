import { memo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserSessionAction } from "../actions/services.actions";
import { ServicesClientWrapper } from "./services.client";
import {
  Shield,
  ShieldCheck,
  ShieldOff,
  Settings,
  Mail,
  Crown,
  ArrowRight,
  Activity,
  KeyRound,
} from "lucide-react";

export async function ServicesView() {
  const result = await getUserSessionAction();

  if (result.error || !result.user) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-destructive text-center">{result.error}</p>
        </CardContent>
      </Card>
    );
  }

  const { user } = result;

  return (
    <ServicesClientWrapper>
      <UserProfileCard user={user} />
      <QuickStatsCard user={user} />
      <SecurityStatusCard user={user} />
      <QuickActionCard
        href="/settings/profile"
        icon={<Settings className="h-5 w-5" />}
        title="Configuración"
        description="Edita tu perfil y preferencias de cuenta"
        color="blue"
      />
      <QuickActionCard
        href="/settings/security"
        icon={<Shield className="h-5 w-5" />}
        title="Seguridad"
        description="2FA y gestión de sesiones activas"
        color="green"
      />
      <QuickActionCard
        href="/settings/profile"
        icon={<KeyRound className="h-5 w-5" />}
        title="Contraseña"
        description="Actualiza tu contraseña de acceso"
        color="orange"
      />
    </ServicesClientWrapper>
  );
}

interface UserData {
  id: string;
  name: string | null;
  userName: string | null;
  email: string | null;
  image: string | null;
  role: string;
  isTwoFactorEnabled: boolean;
}

const UserProfileCard = memo(function UserProfileCard({
  user,
}: {
  user: UserData;
}) {
  return (
    <Card className="md:col-span-2 lg:col-span-1 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Tu perfil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
            <AvatarFallback className="text-base sm:text-lg bg-primary/10 text-primary">
              {user.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <p className="font-semibold truncate">{user.name ?? "Usuario"}</p>
            {user.userName && (
              <p className="text-sm text-muted-foreground truncate">
                @{user.userName}
              </p>
            )}
            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

const QuickStatsCard = memo(function QuickStatsCard({
  user,
}: {
  user: UserData;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Estado de cuenta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Rol</span>
          </div>
          <Badge variant="secondary">{user.role}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Email</span>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-200">
            Verificado
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Estado</span>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-200">
            Activo
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
});

const SecurityStatusCard = memo(function SecurityStatusCard({
  user,
}: {
  user: UserData;
}) {
  const is2FAEnabled = user.isTwoFactorEnabled;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Seguridad
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full shrink-0 ${
              is2FAEnabled ? "bg-green-500/10" : "bg-muted"
            }`}
          >
            {is2FAEnabled ? (
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
            ) : (
              <ShieldOff className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm sm:text-base">
              {is2FAEnabled ? "Protegido" : "Sin protección"}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {is2FAEnabled
                ? "2FA activado en tu cuenta"
                : "Activa 2FA para mayor seguridad"}
            </p>
          </div>
        </div>
        {!is2FAEnabled && (
          <Link
            href="/settings/security"
            className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 sm:py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            Activar 2FA
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
});

const QuickActionCard = memo(function QuickActionCard({
  href,
  icon,
  title,
  description,
  color = "primary",
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: "primary" | "green" | "blue" | "orange";
}) {
  const colorClasses = {
    primary:
      "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
    green:
      "bg-green-500/10 text-green-600 group-hover:bg-green-500 group-hover:text-white",
    blue: "bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white",
    orange:
      "bg-orange-500/10 text-orange-600 group-hover:bg-orange-500 group-hover:text-white",
  };

  return (
    <Link href={href} className="group">
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/20">
        <CardContent className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6">
          <div
            className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${colorClasses[color]}`}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm sm:text-base">{title}</p>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});
