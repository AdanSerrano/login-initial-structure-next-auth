import { z } from "zod";

export const twoFactorSchema = z.object({
  code: z
    .string({
      message: "El código es requerido",
    })
    .length(6, {
      message: "El código debe tener 6 dígitos",
    })
    .regex(/^\d+$/, {
      message: "El código solo debe contener números",
    }),
  email: z.string().email({
    message: "Email inválido",
  }),
});

export type TwoFactorInput = z.infer<typeof twoFactorSchema>;

export const sendTwoFactorSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
});

export type SendTwoFactorInput = z.infer<typeof sendTwoFactorSchema>;
