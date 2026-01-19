"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { resendVerificationAction } from "./actions";

export default function ResendVerificationPage() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Por favor ingresa tu email");
      return;
    }

    startTransition(async () => {
      const result = await resendVerificationAction(email);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        setSent(true);
      }
    });
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6 p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              ¡Correo enviado!
            </h1>
            <p className="text-muted-foreground">
              Si existe una cuenta con ese email, recibirás un nuevo enlace de
              verificación.
            </p>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 w-full">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-left text-sm">
                <p className="font-medium">Revisa tu bandeja de entrada</p>
                <p className="text-muted-foreground mt-1">
                  El enlace expirará en 1 hora. Si no lo encuentras, revisa tu
                  carpeta de spam.
                </p>
              </div>
            </div>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Volver al inicio de sesión</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto flex w-full max-w-md flex-col space-y-6 p-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Reenviar verificación
          </h1>
          <p className="text-muted-foreground">
            Ingresa tu email y te enviaremos un nuevo enlace de verificación.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              autoComplete="email"
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Enviar enlace de verificación
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya verificaste tu cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
