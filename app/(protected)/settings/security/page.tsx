import { SecuritySettingsView } from "@/modules/settings/security/view/security-settings.view";

export const metadata = {
  title: "Seguridad",
  description: "Gestiona la seguridad de tu cuenta",
};

export default function SecuritySettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Seguridad</h1>
        <p className="text-muted-foreground">
          Protege tu cuenta con autenticación de dos factores y gestiona tus
          sesiones activas.
        </p>
      </div>

      <SecuritySettingsView />
    </div>
  );
}
