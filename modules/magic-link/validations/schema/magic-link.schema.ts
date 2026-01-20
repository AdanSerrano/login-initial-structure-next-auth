import { z } from "zod";

export const requestMagicLinkSchema = z.object({
  email: z.string().email("Ingresa un email válido"),
});

export const verifyMagicLinkSchema = z.object({
  token: z.string().min(1, "Token requerido"),
});

export type RequestMagicLinkInput = z.infer<typeof requestMagicLinkSchema>;
export type VerifyMagicLinkInput = z.infer<typeof verifyMagicLinkSchema>;

export const requestMagicLinkActionSchema = requestMagicLinkSchema.extend({
  recaptchaToken: z.string().optional(),
});

export type RequestMagicLinkActionInput = z.infer<typeof requestMagicLinkActionSchema>;
