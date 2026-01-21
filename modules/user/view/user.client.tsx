"use client";

import { memo, useMemo, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  User,
  Mail,
  Key,
  Trash2,
  Shield,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { ProfileForm } from "../components/form/profile.form";
import { EmailForm } from "../components/form/email.form";
import { PasswordForm } from "../components/form/password.form";
import { DeleteAccountForm } from "../components/form/delete-account.form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserProfileClientProps {
  user: {
    name: string | null;
    userName: string | null;
    email: string | null;
    image: string | null;
    emailVerified: Date | null;
    isTwoFactorEnabled: boolean;
    createdAt: Date;
  };
}

interface SectionCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

const SectionCard = memo(function SectionCard({
  icon,
  iconBg,
  title,
  description,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <Card className={`border-border/50 shadow-lg h-full ${className}`}>
      <CardContent className="p-4 sm:p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div
            className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl shrink-0 ${iconBg}`}
          >
            {icon}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {description}
            </p>
          </div>
        </div>
        <div className="flex-1">{children}</div>
      </CardContent>
    </Card>
  );
});
SectionCard.displayName = "SectionCard";

const UserHeaderCard = memo(function UserHeaderCard({
  user,
  initials,
  formattedDate,
}: {
  user: UserProfileClientProps["user"];
  initials: string;
  formattedDate: string;
}) {
  return (
    <Card className="overflow-hidden border-0 shadow-xl">
      <div className="relative h-20 sm:h-24 bg-gradient-to-r from-primary/80 via-primary to-primary/80">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>
      <CardContent className="relative px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
          <div className="relative -mt-10 sm:-mt-12">
            <div className="absolute -inset-1 rounded-full bg-background" />
            <Avatar className="relative h-20 w-20 sm:h-24 sm:w-24 border-4 border-background shadow-xl">
              <AvatarImage src={user.image || undefined} alt={user.name || ""} />
              <AvatarFallback className="text-xl sm:text-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center sm:text-left flex-1 sm:mt-2 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold truncate">
              {user.name || "Sin nombre"}
            </h2>
            {user.userName && (
              <p className="text-muted-foreground text-sm sm:text-base truncate">
                @{user.userName}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mt-2 sm:mt-3">
              {user.emailVerified ? (
                <Badge
                  variant="default"
                  className="gap-1 bg-green-500 hover:bg-green-500/90 text-xs sm:text-sm"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span className="hidden xs:inline">Email </span>verificado
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1 text-xs sm:text-sm">
                  <AlertCircle className="h-3 w-3" />
                  <span className="hidden xs:inline">Email </span>sin verificar
                </Badge>
              )}
              {user.isTwoFactorEnabled && (
                <Badge variant="secondary" className="gap-1 text-xs sm:text-sm">
                  <Shield className="h-3 w-3" />
                  2FA
                </Badge>
              )}
              <Badge variant="outline" className="gap-1 text-xs sm:text-sm hidden sm:flex">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
UserHeaderCard.displayName = "UserHeaderCard";

const ProfileSection = memo(function ProfileSection({
  user,
}: {
  user: UserProfileClientProps["user"];
}) {
  return (
    <SectionCard
      icon={<User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
      iconBg="bg-primary/10"
      title="Información del perfil"
      description="Actualiza tu información personal"
    >
      <ProfileForm
        defaultValues={{
          name: user.name,
          userName: user.userName,
          image: user.image,
          email: user.email,
        }}
      />
    </SectionCard>
  );
});
ProfileSection.displayName = "ProfileSection";

const EmailSection = memo(function EmailSection({
  email,
  isVerified,
}: {
  email: string | null;
  isVerified: boolean;
}) {
  return (
    <SectionCard
      icon={<Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
      iconBg="bg-primary/10"
      title="Correo electrónico"
      description="Cambia tu dirección de correo"
    >
      <EmailForm currentEmail={email} isVerified={isVerified} />
    </SectionCard>
  );
});
EmailSection.displayName = "EmailSection";

const PasswordSection = memo(function PasswordSection() {
  return (
    <SectionCard
      icon={<Key className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
      iconBg="bg-primary/10"
      title="Cambiar contraseña"
      description="Actualiza tu contraseña para mantener tu cuenta segura"
    >
      <PasswordForm />
    </SectionCard>
  );
});
PasswordSection.displayName = "PasswordSection";

const DangerSection = memo(function DangerSection() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return (
    <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
      <Card className="border-destructive/30 shadow-lg">
        <CollapsibleTrigger asChild>
          <CardContent className="p-4 sm:p-6 cursor-pointer hover:bg-destructive/5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-destructive/10 shrink-0">
                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-destructive text-sm sm:text-base">
                    Zona de peligro
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Eliminar cuenta permanentemente
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground transition-transform duration-200 shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </CardContent>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
            <div className="border-t border-destructive/20 pt-4 sm:pt-6">
              <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-destructive/10 mb-4 sm:mb-6">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-destructive min-w-0">
                  <p className="font-medium">Atención: Esta acción es irreversible</p>
                  <p className="mt-1 text-destructive/80">
                    Al eliminar tu cuenta, perderás acceso a todos tus datos.
                  </p>
                </div>
              </div>
              <DeleteAccountForm />
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
});
DangerSection.displayName = "DangerSection";

export function UserProfileClient({ user }: UserProfileClientProps) {
  const initials = useMemo(() => {
    if (!user.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user.name]);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("es", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(user.createdAt));
  }, [user.createdAt]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <AnimatedSection animation="fade-down" delay={0}>
        <UserHeaderCard user={user} initials={initials} formattedDate={formattedDate} />
      </AnimatedSection>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 items-stretch">
        <AnimatedSection animation="fade-up" delay={100} className="h-full">
          <ProfileSection user={user} />
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={200} className="h-full">
          <EmailSection email={user.email} isVerified={!!user.emailVerified} />
        </AnimatedSection>
      </div>

      <AnimatedSection animation="fade-up" delay={300}>
        <PasswordSection />
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={400}>
        <DangerSection />
      </AnimatedSection>
    </div>
  );
}
