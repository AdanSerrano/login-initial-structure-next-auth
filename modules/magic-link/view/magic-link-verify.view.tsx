"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVerifyMagicLink } from "../hooks/magic-link.hook";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface MagicLinkVerifyViewProps {
  token: string | null;
}

export function MagicLinkVerifyView({ token }: MagicLinkVerifyViewProps) {
  const { isPending, error, success } = useVerifyMagicLink(token);

  if (!token) {
    return <ErrorState message="Token no proporcionado" />;
  }

  if (isPending) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (success) {
    return <SuccessState message={success} />;
  }

  return <LoadingState />;
}

function LoadingState() {
  return (
    <Card className="w-full border-border/40 shadow-lg">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Verificando enlace...
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Por favor espera mientras verificamos tu enlace de acceso
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SuccessState({ message }: { message: string }) {
  return (
    <Card className="w-full border-border/40 shadow-lg">
      <CardContent className="pt-6">
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center space-y-4 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle
              className="h-8 w-8 text-green-600 dark:text-green-400"
              aria-hidden="true"
            />
            <span className="sr-only">Inicio de sesión exitoso</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              ¡Bienvenido!
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {message}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Redirigiendo a tu cuenta...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <Card className="w-full border-border/40 shadow-lg">
      <CardContent className="pt-6">
        <div
          role="alert"
          aria-live="polite"
          className="flex flex-col items-center space-y-4 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <XCircle
              className="h-8 w-8 text-red-600 dark:text-red-400"
              aria-hidden="true"
            />
            <span className="sr-only">Error de verificación</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Error al iniciar sesión
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {message}
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Button asChild className="w-full">
              <Link href="/login">Solicitar nuevo enlace</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/login">Volver al inicio de sesión</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
