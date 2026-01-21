import { Suspense } from "react";
import { ServicesView } from "@/modules/services/view/services.view";
import { ServicesSkeleton } from "@/modules/services/components/services.skeleton";
import { auth } from "@/auth";

export const metadata = {
  title: "Mi cuenta",
  description: "Panel de control de tu cuenta",
};

export default async function ServicesPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] || "Usuario";

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Bienvenido, {firstName}
        </h1>
        <p className="text-muted-foreground">
          Aquí puedes ver y gestionar la información de tu cuenta.
        </p>
      </div>

      <Suspense fallback={<ServicesSkeleton />}>
        <ServicesView />
      </Suspense>
    </div>
  );
}
