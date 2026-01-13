import { z } from "zod";

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
    password: z.string({
      message: "Contraseña es requerida",
    }),
    // .min(8, {
    //   message: "La contraseña debe tener al menos 8 caracteres",
    // }),
    confirmPassword: z.string({
      message: "Confirmar contraseña es requerido",
    }),
    // .min(8, {
    //   message: "La confirmación de contraseña debe tener al menos 8 caracteres",
    // }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterUser = z.infer<typeof createRegisterFormSchema>;
