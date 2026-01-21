"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { ProfileViewModel } from "../../view-model/user.view-model";

interface ProfileFormProps {
  defaultValues?: {
    name?: string | null;
    userName?: string | null;
    image?: string | null;
    email?: string | null;
  };
}

export const ProfileForm = memo(function ProfileForm({
  defaultValues,
}: ProfileFormProps) {
  const { handleSubmit, form, isPending, error } = ProfileViewModel({
    defaultValues: {
      name: defaultValues?.name ?? "",
      userName: defaultValues?.userName ?? "",
      image: defaultValues?.image ?? "",
    },
  });

  const watchedImage = form.watch("image");
  const watchedName = form.watch("name");

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={watchedImage || undefined} alt={watchedName} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {getInitials(watchedName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de imagen de perfil</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://ejemplo.com/tu-foto.jpg"
                      disabled={isPending}
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Tu nombre"
                    disabled={isPending}
                    className="bg-background"
                  />
                </FormControl>
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
                    {...field}
                    placeholder="usuario123"
                    disabled={isPending}
                    className="bg-background"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Solo letras, números, guiones y guiones bajos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
});
