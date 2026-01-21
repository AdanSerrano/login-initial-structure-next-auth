"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useVerifyMagicLink } from "../hooks/magic-link.hook";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface MagicLinkVerifyViewProps {
  token: string | null;
}

export function MagicLinkVerifyView({ token }: MagicLinkVerifyViewProps) {
  const { isPending, error, success } = useVerifyMagicLink(token);

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
        <AnimatedSection animation="scale" delay={0} className="w-full max-w-md">
          <ErrorState message="Token no proporcionado" />
        </AnimatedSection>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
        <AnimatedSection animation="scale" delay={0} className="w-full max-w-md">
          <LoadingState />
        </AnimatedSection>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
        <AnimatedSection animation="scale" delay={0} className="w-full max-w-md">
          <ErrorState message={error} />
        </AnimatedSection>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
        <AnimatedSection animation="scale" delay={0} className="w-full max-w-md">
          <SuccessState message={success} />
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
      <AnimatedSection animation="scale" delay={0} className="w-full max-w-md">
        <LoadingState />
      </AnimatedSection>
    </div>
  );
}

function LoadingState() {
  return (
    <Card className="w-full border-border/40 shadow-lg">
      <CardContent className="pt-6 px-4 sm:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight md:text-2xl">
              Verificando enlace...
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground md:text-base">
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
      <CardContent className="pt-6 px-4 sm:px-6">
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center space-y-4 text-center"
        >
          <AnimatedSection animation="scale" delay={100}>
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle
                className="h-7 w-7 sm:h-8 sm:w-8 text-green-600 dark:text-green-400"
                aria-hidden="true"
              />
              <span className="sr-only">Inicio de sesión exitoso</span>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={200}>
            <div className="space-y-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight md:text-2xl">
                ¡Bienvenido!
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground md:text-base">
                {message}
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade" delay={300}>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Redirigiendo a tu cuenta...
            </p>
          </AnimatedSection>
        </div>
      </CardContent>
    </Card>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <Card className="w-full border-border/40 shadow-lg">
      <CardContent className="pt-6 px-4 sm:px-6">
        <div
          role="alert"
          aria-live="polite"
          className="flex flex-col items-center space-y-4 text-center"
        >
          <AnimatedSection animation="scale" delay={100}>
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <XCircle
                className="h-7 w-7 sm:h-8 sm:w-8 text-red-600 dark:text-red-400"
                aria-hidden="true"
              />
              <span className="sr-only">Error de verificación</span>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={200}>
            <div className="space-y-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight md:text-2xl">
                Error al iniciar sesión
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground md:text-base">
                {message}
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={300} className="w-full">
            <div className="flex flex-col gap-3 w-full">
              <Button asChild className="w-full">
                <Link href="/login">Solicitar nuevo enlace</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/login">Volver al inicio de sesión</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </CardContent>
    </Card>
  );
}
