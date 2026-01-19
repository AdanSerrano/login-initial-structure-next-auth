"use server";

import { sendVerificationEmail } from "@/lib/email/send-email";
import { generateVerificationToken } from "@/lib/tokens";
import { db } from "@/utils/db";

export const resendVerificationAction = async (email: string) => {
  try {
    // Buscar usuario por email
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Siempre devolver éxito para evitar enumeración de usuarios
    if (!user) {
      return {
        success:
          "Si existe una cuenta con ese email, recibirás un enlace de verificación.",
      };
    }

    // Si ya está verificado
    if (user.emailVerified) {
      return {
        success:
          "Si existe una cuenta con ese email, recibirás un enlace de verificación.",
      };
    }

    // Generar nuevo token y enviar email
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, verificationToken.token);

    return {
      success:
        "Si existe una cuenta con ese email, recibirás un enlace de verificación.",
    };
  } catch (error) {
    console.error("Error reenviando verificación:", error);
    return { error: "Error al enviar el correo de verificación" };
  }
};
