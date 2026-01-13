import { z } from "zod";

export const createLoginFormSchema = z.object({
  identifier: z.string().min(1, {
    message: "El email o nombre de usuario es requerido",
  }),
  password: z.string().min(1, {
    message: "La contraseña es requerida",
  }),
});

export type LoginUser = z.infer<typeof createLoginFormSchema>;
