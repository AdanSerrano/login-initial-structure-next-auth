"use client";

import { memo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const AuthError = memo(function AuthError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Auth error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-6 p-6 text-center">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertCircle className="size-7 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Error de autenticación</h1>
          <p className="text-muted-foreground">
            Ha ocurrido un error durante el proceso. Por favor, intenta de nuevo.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Intentar de nuevo
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
});

export default AuthError;
