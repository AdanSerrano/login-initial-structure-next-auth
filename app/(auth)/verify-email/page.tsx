"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { verifyEmailAction } from "./actions";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  const onSubmit = useCallback(async () => {
    if (!token) {
      setStatus("error");
      setMessage("Token de verificación no encontrado");
      return;
    }

    try {
      const result = await verifyEmailAction(token);

      if (result.error) {
        setStatus("error");
        setMessage(result.error);
      } else {
        setStatus("success");
        setMessage(result.success || "Email verificado correctamente");
      }
    } catch {
      setStatus("error");
      setMessage("Ocurrió un error al verificar el email");
    }
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6 p-6 text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Verificando tu email...
              </h1>
              <p className="text-muted-foreground">
                Por favor espera mientras verificamos tu correo electrónico.
              </p>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                ¡Email verificado!
              </h1>
              <p className="text-muted-foreground">{message}</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                Error de verificación
              </h1>
              <p className="text-muted-foreground">{message}</p>
            </div>
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
          </>
        )}
      </div>
    </div>
  );
}
