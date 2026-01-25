import { VerificationEmailBase } from "@/components/emails/verification-email-base";

interface VerificationEmailProps {
  confirmLink: string;
}

export const VerificationEmail = ({ confirmLink }: VerificationEmailProps) => {
  return (
    <VerificationEmailBase
      confirmLink={confirmLink}
      bodyText="Gracias por registrarte. Haz clic en el botón de abajo para verificar tu dirección de correo electrónico."
      ignoreText="Si no creaste esta cuenta, puedes ignorar este correo."
    />
  );
};
