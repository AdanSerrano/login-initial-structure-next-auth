import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, LayoutDashboard, CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";

export async function HeroButtons() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  if (isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/dashboard/services">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Ir al panel
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" disabled className="gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          Sesión iniciada
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
        <Link href="/login">
          <Lock className="mr-2 h-4 w-4" />
          Iniciar sesión
        </Link>
      </Button>
    </div>
  );
}
