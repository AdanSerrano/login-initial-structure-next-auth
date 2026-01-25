"use client";

import { usePathname } from "next/navigation";
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

const routeLabels: Record<string, string> = {
  "/dashboard/services": "Panel",
  "/dashboard/settings/profile": "Configuración",
  "/dashboard/settings/security": "Seguridad",
  "/dashboard/admin/users": "Gestión de Usuarios",
  "/dashboard/demo/table": "Demo DataTable",
};

export function DashboardHeader() {
  const pathname = usePathname();

  const currentLabel = routeLabels[pathname] || "Dashboard";
  const isSettingsPage = pathname.startsWith("/dashboard/settings");
  const isAdminPage = pathname.startsWith("/dashboard/admin");

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard/services">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          {isSettingsPage && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard/settings/profile">
                  Cuenta
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          {isAdminPage && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard/admin/users">
                  Administración
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbItem className="ml-auto">
            <ModeToggleWrapper />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
