"use client";

import { memo, useMemo } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Settings,
  Shield,
  KeyRound,
  Home,
  Table,
  Users,
  FolderOpen,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { Role } from "@/app/prisma/enums";

interface NavItem {
  titleKey: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const mainNavItemsConfig: NavItem[] = [
  {
    titleKey: "home",
    url: "/",
    icon: Home,
  },
  {
    titleKey: "dashboard",
    url: "/dashboard/services",
    icon: LayoutDashboard,
  },
];

const adminNavItemsConfig: NavItem[] = [
  {
    titleKey: "users",
    url: "/dashboard/admin/users",
    icon: Users,
  },
  {
    titleKey: "files",
    url: "/dashboard/admin/files-manager",
    icon: FolderOpen,
  },
];

const settingsNavItemsConfig: NavItem[] = [
  {
    titleKey: "settings",
    url: "/dashboard/settings/profile",
    icon: Settings,
  },
  {
    titleKey: "security",
    url: "/dashboard/settings/security",
    icon: Shield,
  },
];

interface AppSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: Role | null;
  };
}

function AppSidebarComponent({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const isAdmin = user.role === Role.ADMIN;

  // Memoizar items de navegación con traducciones
  const mainNavItems = useMemo(
    () =>
      mainNavItemsConfig.map((item) => ({
        ...item,
        title: t(item.titleKey),
      })),
    [t]
  );

  const adminNavItems = useMemo(
    () =>
      adminNavItemsConfig.map((item) => ({
        ...item,
        title: t(item.titleKey),
      })),
    [t]
  );

  const settingsNavItems = useMemo(
    () =>
      settingsNavItemsConfig.map((item) => ({
        ...item,
        title: t(item.titleKey),
      })),
    [t]
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <KeyRound className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Nexus</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {t("dashboard")}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("home")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>{t("admin")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>{t("account")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export const AppSidebar = memo(AppSidebarComponent);
AppSidebar.displayName = "AppSidebar";
