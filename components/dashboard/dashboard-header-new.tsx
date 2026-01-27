"use client";

import { memo, useMemo } from "react";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModeToggleWrapper } from "../mode-toggle-wrapper";
import { LocaleSwitcher } from "@/components/locale-switcher";

function DashboardHeaderComponent() {
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  const routeLabels = useMemo(
    () => ({
      "/dashboard/services": t("dashboard"),
      "/dashboard/settings/profile": t("settings"),
      "/dashboard/settings/security": t("security"),
      "/dashboard/admin/users": t("usersManagement"),
    }),
    [t]
  );

  const currentLabel = useMemo(() => {
    return routeLabels[pathname as keyof typeof routeLabels] || t("dashboard");
  }, [pathname, routeLabels, t]);

  const isSettingsPage = pathname.startsWith("/dashboard/settings");
  const isAdminPage = pathname.startsWith("/dashboard/admin");

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard/services">{t("dashboard")}</BreadcrumbLink>
          </BreadcrumbItem>
          {isSettingsPage && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard/settings/profile">
                  {t("account")}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          {isAdminPage && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard/admin/users">
                  {t("admin")}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbItem className="ml-auto flex items-center gap-2">
            <LocaleSwitcher compact />
            <ModeToggleWrapper />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}

export const DashboardHeader = memo(DashboardHeaderComponent);
DashboardHeader.displayName = "DashboardHeader";
