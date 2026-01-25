import { VerificationEmailBase } from "@/components/emails/verification-email-base";

interface VerificationEmailProps {
  confirmLink: string;
}

export const VerificationEmail = ({ confirmLink }: VerificationEmailProps) => {
  return (
    <VerificationEmailBase
      confirmLink={confirmLink}
      bodyText="Hemos recibido una solicitud para reenviar el enlace de verificación. Haz clic en el botón de abajo para verificar tu dirección de correo."
      ignoreText="Si no solicitaste este correo, puedes ignorarlo."
    />
  );
};
