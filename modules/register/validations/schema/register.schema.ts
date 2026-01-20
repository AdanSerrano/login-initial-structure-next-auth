import { z } from "zod";
import {
  passwordSchema,
  confirmPasswordSchema,
  passwordMatchRefinement,
  calculatePasswordStrength,
} from "@/lib/validations/password.validation";

export const createRegisterFormSchema = z
  .object({
    email: z
      .string({
        message: "Email es requerido",
      })
      .email({
        message: "Email inválido",
      })
      .max(100, {
        message: "Email no puede tener más de 100 caracteres",
      }),
    userName: z
      .string({
        message: "Nombre de usuario es requerido",
      })
      .min(3, {
        message: "El nombre de usuario debe tener al menos 3 caracteres",
      })
      .max(50, {
        message: "El nombre de usuario no puede tener más de 50 caracteres",
      })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message:
          "El nombre de usuario solo puede contener letras, números y guiones bajos",
      })
      .optional(),
    name: z
      .string({
        message: "Nombre es requerido",
      })
      .max(100, {
        message: "El nombre no puede tener más de 100 caracteres",
      })
      .optional(),
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine(passwordMatchRefinement.check, {
    message: passwordMatchRefinement.message,
    path: passwordMatchRefinement.path,
  });

export type RegisterUser = z.infer<typeof createRegisterFormSchema>;

export const registerActionSchema = createRegisterFormSchema.extend({
  recaptchaToken: z.string().optional(),
});

export type RegisterActionInput = z.infer<typeof registerActionSchema>;

export { calculatePasswordStrength };
