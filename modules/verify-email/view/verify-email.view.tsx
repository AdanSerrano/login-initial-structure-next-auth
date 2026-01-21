import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { verifyEmailAction } from "../actions/verify-email.actions";

interface VerifyEmailViewProps {
  token?: string;
}

export async function VerifyEmailView({ token }: VerifyEmailViewProps) {
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
        <div className="w-full max-w-md">
          <ErrorState message="Token de verificación no encontrado" />
        </div>
      </div>
    );
  }

  const result = await verifyEmailAction(token);

  if (result.error) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
        <div className="w-full max-w-md">
          <ErrorState message={result.error} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
      <div className="w-full max-w-md">
        <SuccessState message={result.success || "Email verificado correctamente"} />
      </div>
    </div>
  );
}

function SuccessState({ message }: { message: string }) {
  return (
    <AnimatedSection animation="scale" delay={0}>
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
                <span className="sr-only">Verificación exitosa</span>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={200}>
              <div className="space-y-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight md:text-2xl">
                  ¡Email verificado!
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground md:text-base">{message}</p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={300} className="w-full">
              <Button asChild className="w-full">
                <Link href="/login">Iniciar sesión</Link>
              </Button>
            </AnimatedSection>
          </div>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <AnimatedSection animation="scale" delay={0}>
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
                  Error de verificación
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground md:text-base">{message}</p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={300} className="w-full">
              <div className="flex flex-col gap-3 w-full">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/resend-verification">
                    Solicitar nuevo enlace de verificación
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/login">Volver al inicio de sesión</Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
