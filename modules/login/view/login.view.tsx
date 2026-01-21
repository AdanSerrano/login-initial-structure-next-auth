"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { LoginForm } from "../components/form/login.form";

export const LoginView = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
      <AnimatedSection animation="scale" delay={0} className="w-full max-w-md">
        <Card className="border-border/40 shadow-lg">
          <CardHeader className="space-y-1 text-center px-4 sm:px-6">
            <AnimatedSection animation="fade-down" delay={100}>
              <CardTitle className="text-xl font-bold sm:text-2xl">
                Iniciar Sesión
              </CardTitle>
            </AnimatedSection>
            <AnimatedSection animation="fade" delay={200}>
              <CardDescription className="text-sm sm:text-base">
                Ingresa tus credenciales para continuar
              </CardDescription>
            </AnimatedSection>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <AnimatedSection animation="fade-up" delay={300}>
              <LoginForm />
            </AnimatedSection>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
};
