import { Suspense } from "react";
import { UserProfileView } from "@/modules/user/view/user.view";
import { UserProfileSkeleton } from "@/modules/user/components/user.skeleton";

export const metadata = {
  title: "Configuración",
  description: "Administra tu información de usuario",
};

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administra tu información personal y preferencias de cuenta.
        </p>
      </div>

      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfileView />
      </Suspense>
    </div>
  );
}
