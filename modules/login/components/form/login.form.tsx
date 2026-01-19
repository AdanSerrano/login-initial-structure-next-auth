"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginViewModel } from "@/modules/login/view-model/login.view-model";
import { cn } from "@/lib/utils";
import { Loader2, LogIn, ShieldCheck, KeyRound } from "lucide-react";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/pasword-input";
import { memo } from "react";
import { TwoFactorDialogContent } from "@/modules/two-factor/components/form/two-factor.form";

export const LoginForm = memo(function LoginForm() {
  const {
    handleLogin,
    form,
    isPending,
    error,
    twoFactor,
    completeTwoFactorLogin,
    cancelTwoFactor,
    closeTwoFactorDialog,
    openTwoFactorDialog,
  } = LoginViewModel();

  const isTwoFactorPending = twoFactor.required && !!twoFactor.email;

  return (
    <>
      <Dialog
        open={twoFactor.dialogOpen && isTwoFactorPending}
        onOpenChange={(open) => !open && closeTwoFactorDialog()}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-lg"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-primary/20 via-primary/10 to-primary/5 ring-4 ring-primary/10 shadow-lg mb-2">
              <ShieldCheck className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <DialogTitle className="text-xl">Verificación en dos pasos</DialogTitle>
            <DialogDescription>
              Ingresa el código de seguridad enviado a tu correo
            </DialogDescription>
          </DialogHeader>
          {twoFactor.email && (
            <TwoFactorDialogContent
              email={twoFactor.email}
              onSuccess={completeTwoFactorLogin}
              onBack={cancelTwoFactor}
            />
          )}
        </DialogContent>
      </Dialog>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-5">
          {isTwoFactorPending && !twoFactor.dialogOpen && (
            <div className="flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 border border-primary/20">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <KeyRound className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Verificación pendiente
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Código enviado a {twoFactor.email?.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={openTwoFactorDialog}
                className="shrink-0"
              >
                Continuar
              </Button>
            </div>
          )}

          <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email o nombre de usuario</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="tu@email.com"
                  autoComplete="username"
                  aria-label="Email o nombre de usuario"
                  {...field}
                  disabled={isPending}
                  className={cn(
                    form.formState.errors.identifier && "border-destructive"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Contraseña</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="current-password"
                  aria-label="Contraseña"
                  {...field}
                  disabled={isPending}
                  className={cn(
                    "pr-10",
                    form.formState.errors.password && "border-destructive"
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
              Iniciando sesión...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
              Iniciar sesión
            </>
          )}
        </Button>

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
    </>
  );
});
