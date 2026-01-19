"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import { RegisterViewModel } from "@/modules/register/view-model/register.view-model";
import { cn } from "@/lib/utils";
import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/pasword-input";

export const RegisterForm = () => {
  const { handleRegister, isPending, error, form } = RegisterViewModel();
  const password = form.watch("password");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  {...field}
                  disabled={isPending}
                  className={cn(
                    form.formState.errors.email && "border-destructive"
                  )}
                />
              </FormControl>
              <FormDescription>
                Usaremos este email para verificar tu cuenta
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de usuario</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="mi_usuario"
                  autoComplete="username"
                  {...field}
                  disabled={isPending}
                  className={cn(
                    form.formState.errors.userName && "border-destructive"
                  )}
                />
              </FormControl>
              <FormDescription>
                Solo letras, números y guiones bajos (opcional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Juan Pérez"
                  autoComplete="name"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                Cómo te gustaría que te llamemos (opcional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña *</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                  disabled={isPending}
                  className={cn(
                    "pr-10",
                    form.formState.errors.password && "border-destructive"
                  )}
                />
              </FormControl>
              <PasswordStrengthIndicator password={password || ""} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña *</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                  disabled={isPending}
                  className={cn(
                    "pr-10",
                    form.formState.errors.confirmPassword && "border-destructive"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando cuenta...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Crear cuenta
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </form>
    </Form>
  );
};
