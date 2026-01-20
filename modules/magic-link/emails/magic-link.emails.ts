import { resend } from "@/utils/resend";
import { MagicLinkEmail } from "../components/emails/magic-link.email";

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export const sendMagicLinkEmail = async (email: string, token: string) => {
  const magicLink = `${domain}/magic-link?token=${token}`;

  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Tu enlace de inicio de sesión",
      react: MagicLinkEmail({ magicLink }),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending magic link email:", error);
    return { success: false, error: "Error al enviar el enlace mágico" };
  }
};
