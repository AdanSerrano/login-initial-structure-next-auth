"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "../components/form/login.form";
import { useEffect } from "react";

export const LoginView = () => {
  useEffect(() => {
    document.body.classList.add("show-recaptcha-badge");
    return () => {
      document.body.classList.remove("show-recaptcha-badge");
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/20">
      <Card className="w-full max-w-md border-border/40 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl font-bold sm:text-2xl">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Ingresa tus credenciales para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};
