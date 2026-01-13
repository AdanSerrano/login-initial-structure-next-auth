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
import { LoginViewModel } from "@/modules/login/view-model/login.view-model";

export const LoginForm = () => {
  const { handleLogin, form, isPending, error } = LoginViewModel();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email o nombre de usuario</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="email@ejemplo.com o nombreusuario"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>
                Ingresa tu email o nombre de usuario
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
              <FormDescription>Ingresa tu contraseña</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="text-sm text-destructive">{error}</div>}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>
    </Form>
  );
};
