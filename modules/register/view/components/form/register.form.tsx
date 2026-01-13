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
import { RegisterViewModel } from "@/modules/register/view-model/register.view-model";

export const RegisterForm = () => {
  const { handleRegister, isPending, error, form } = RegisterViewModel();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-8">
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
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>Ingresa tu dirección de email</FormDescription>
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
                  placeholder="nombreusuario"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                Ingresa tu nombre de usuario (opcional)
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
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                Ingresa tu nombre completo (opcional)
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
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                Ingresa tu contraseña (mínimo 8 caracteres)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>Confirma tu contraseña</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="text-sm text-destructive">{error}</div>}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Registrando..." : "Registrarse"}
        </Button>
      </form>
    </Form>
  );
};
