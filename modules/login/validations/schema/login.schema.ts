import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,50}$/;

export const createLoginFormSchema = z.object({
  identifier: z
    .string({
      message: "El email o nombre de usuario es requerido",
    })
    .min(1, {
      message: "El email o nombre de usuario es requerido",
    })
    .max(100, {
      message: "El identificador no puede tener más de 100 caracteres",
    })
    .refine(
      (val) => emailRegex.test(val) || usernameRegex.test(val),
      {
        message: "Ingresa un email válido o un nombre de usuario (letras, números y guiones bajos)",
      }
    ),
  password: z.string().min(1, {
    message: "La contraseña es requerida",
  }),
});

export type LoginUser = z.infer<typeof createLoginFormSchema>;

export const loginActionSchema = createLoginFormSchema.extend({
  recaptchaToken: z.string().optional(),
});

export type LoginActionInput = z.infer<typeof loginActionSchema>;
