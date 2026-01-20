"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MagicLinkViewModel } from "@/modules/magic-link/view-model/magic-link.view-model";
import { cn } from "@/lib/utils";
import { Loader2, Wand2, CheckCircle, KeyRound } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

export const MagicLinkForm = memo(function MagicLinkForm() {
  const { handleSubmit, form, isPending, error, success } = MagicLinkViewModel();

  if (success) {
    return (
      <div className="flex flex-col items-center space-y-4 text-center py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">¡Enlace enviado!</h3>
          <p className="text-sm text-muted-foreground">
            {success}
          </p>
          <p className="text-xs text-muted-foreground">
            Revisa tu bandeja de entrada y haz clic en el enlace para iniciar
            sesión. El enlace expira en 15 minutos.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          className="mt-4"
        >
          Enviar otro enlace
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="text-center space-y-2 pb-2">
          <p className="text-sm text-muted-foreground">
            Te enviaremos un enlace mágico a tu correo para iniciar sesión sin
            contraseña.
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  aria-label="Email"
                  {...field}
                  disabled={isPending}
                  className={cn(
                    form.formState.errors.email && "border-destructive"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20"
          >
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Enviando enlace...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Enviar enlace mágico
            </>
          )}
        </Button>

        <Link
          href="/login"
          className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <KeyRound className="h-4 w-4" />
          Iniciar sesión con contraseña
        </Link>

        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Crear cuenta
          </Link>
        </p>
      </form>
    </Form>
  );
});
