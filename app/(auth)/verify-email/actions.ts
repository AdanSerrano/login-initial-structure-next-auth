"use server";

import { getVerificationTokenByToken } from "@/lib/tokens";
import { db } from "@/utils/db";

export const verifyEmailAction = async (token: string) => {
  try {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      return { error: "El token de verificación no existe o ya fue usado" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: "El token de verificación ha expirado" };
    }

    const existingUser = await db.user.findFirst({
      where: { email: existingToken.email },
    });

    if (!existingUser) {
      return { error: "El usuario no existe" };
    }

    // Actualizar el usuario como verificado
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    // Eliminar el token usado
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return { success: "¡Tu email ha sido verificado correctamente!" };
  } catch (error) {
    console.error("Error verificando email:", error);
    return { error: "Error al verificar el email" };
  }
};
