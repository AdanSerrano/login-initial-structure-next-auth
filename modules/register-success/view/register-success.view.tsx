"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { CheckCircle, Mail } from "lucide-react";
import Link from "next/link";

export const RegisterSuccessView = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
      <AnimatedSection animation="scale" delay={0} className="w-full max-w-md">
        <Card className="border-border/40 shadow-lg">
          <CardContent className="pt-6 px-4 sm:px-6">
            <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center">
              <AnimatedSection animation="scale" delay={100}>
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-green-600 dark:text-green-400" />
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={200}>
                <div className="space-y-2">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight md:text-2xl">
                    ¡Cuenta creada exitosamente!
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground md:text-base">
                    Hemos enviado un correo de verificación a tu dirección de email.
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={300} className="w-full">
                <div className="rounded-lg border bg-muted/50 p-3 sm:p-4 w-full">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 shrink-0" />
                    <div className="text-left text-xs sm:text-sm">
                      <p className="font-medium">Revisa tu bandeja de entrada</p>
                      <p className="text-muted-foreground mt-1">
                        Haz clic en el enlace de verificación que te enviamos para
                        activar tu cuenta. Si no lo encuentras, revisa tu carpeta de
                        spam.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={400} className="w-full">
                <div className="flex flex-col gap-3 w-full">
                  <Button asChild className="w-full">
                    <Link href="/login">Ir a iniciar sesión</Link>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    ¿No recibiste el correo?{" "}
                    <Link
                      href="/resend-verification"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Reenviar correo de verificación
                    </Link>
                  </p>
                </div>
              </AnimatedSection>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
};
