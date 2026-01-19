// Servicio de envío de emails
// Puedes usar Resend, Nodemailer, SendGrid, etc.
// Por ahora usamos console.log para desarrollo

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/verify-email?token=${token}`;

  // En producción, reemplaza esto con tu servicio de email preferido
  // Ejemplo con Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "noreply@tudominio.com",
  //   to: email,
  //   subject: "Confirma tu correo electrónico",
  //   html: `...`
  // });

  console.log("📧 Email de verificación:");
  console.log("Para:", email);
  console.log("Link:", confirmLink);

  // Simular envío exitoso en desarrollo
  return { success: true };
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/reset-password?token=${token}`;

  console.log("📧 Email de recuperación de contraseña:");
  console.log("Para:", email);
  console.log("Link:", resetLink);

  return { success: true };
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  console.log("📧 Email de código 2FA:");
  console.log("Para:", email);
  console.log("Código:", token);

  return { success: true };
};
