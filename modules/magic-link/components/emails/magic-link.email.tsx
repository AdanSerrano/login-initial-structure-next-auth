import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface MagicLinkEmailProps {
  magicLink: string;
}

export const MagicLinkEmail = ({ magicLink }: MagicLinkEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Inicia sesión con un clic</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Inicia sesión en tu cuenta</Heading>
          <Text style={text}>
            Hemos recibido una solicitud para iniciar sesión en tu cuenta.
            Haz clic en el botón de abajo para acceder de forma segura.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={magicLink}>
              Iniciar sesión
            </Button>
          </Section>
          <Text style={text}>
            Si no solicitaste este enlace, puedes ignorar este correo de forma
            segura. Nadie podrá acceder a tu cuenta sin este enlace.
          </Text>
          <Text style={footer}>
            Este enlace expirará en 15 minutos. Si el botón no funciona, copia y
            pega el siguiente enlace en tu navegador:
          </Text>
          <Link href={magicLink} style={link}>
            {magicLink}
          </Link>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  marginBottom: "64px",
  borderRadius: "8px",
  maxWidth: "480px",
};

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.25",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.5",
  marginBottom: "16px",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#7c3aed",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
  marginTop: "32px",
};

const link = {
  color: "#7c3aed",
  fontSize: "14px",
  wordBreak: "break-all" as const,
};
