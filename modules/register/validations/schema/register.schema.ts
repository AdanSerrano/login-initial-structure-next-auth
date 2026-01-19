import { z } from "zod";

// Regex para validar fortaleza de contraseña
const passwordStrengthRegex = {
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
};

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
    password: z
      .string({
        message: "Contraseña es requerida",
      })
      .min(8, {
        message: "La contraseña debe tener al menos 8 caracteres",
      })
      .refine((val) => passwordStrengthRegex.hasUppercase.test(val), {
        message: "La contraseña debe contener al menos una mayúscula",
      })
      .refine((val) => passwordStrengthRegex.hasLowercase.test(val), {
        message: "La contraseña debe contener al menos una minúscula",
      })
      .refine((val) => passwordStrengthRegex.hasNumber.test(val), {
        message: "La contraseña debe contener al menos un número",
      })
      .refine((val) => passwordStrengthRegex.hasSpecialChar.test(val), {
        message:
          'La contraseña debe contener al menos un carácter especial (!@#$%^&*(),.?":{}|<>)',
      }),
    confirmPassword: z.string({
      message: "Confirmar contraseña es requerido",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterUser = z.infer<typeof createRegisterFormSchema>;

// Helper para calcular fortaleza de contraseña (usado en el componente)
export const calculatePasswordStrength = (
  password: string
): {
  score: number;
  label: string;
  color: string;
} => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (passwordStrengthRegex.hasUppercase.test(password)) score++;
  if (passwordStrengthRegex.hasLowercase.test(password)) score++;
  if (passwordStrengthRegex.hasNumber.test(password)) score++;
  if (passwordStrengthRegex.hasSpecialChar.test(password)) score++;

  if (score <= 2) return { score, label: "Débil", color: "bg-red-500" };
  if (score <= 4) return { score, label: "Media", color: "bg-yellow-500" };
  return { score, label: "Fuerte", color: "bg-green-500" };
};
