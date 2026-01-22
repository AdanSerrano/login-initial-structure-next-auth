import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, LayoutDashboard, Settings, CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";

export async function CtaButtons() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  if (isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/dashboard/services">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Ir al panel
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/dashboard/settings/profile">
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
      <Button size="lg" asChild>
        <Link href="/register">
          Crear cuenta gratis
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Button variant="outline" size="lg" asChild>
        <Link
          href="https://github.com/AdanSerrano/login-initial-structure-next-auth"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github className="mr-2 h-4 w-4" />
          Ver en GitHub
        </Link>
      </Button>
    </div>
  );
}

export async function BenefitsButton() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  if (isLoggedIn) {
    return (
      <Button asChild>
        <Link href="/dashboard/services">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Ir al panel
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild>
      <Link href="/register">
        Empezar ahora
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
}
