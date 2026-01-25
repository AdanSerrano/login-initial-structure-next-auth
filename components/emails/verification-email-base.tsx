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

interface VerificationEmailBaseProps {
  confirmLink: string;
  previewText?: string;
  headingText?: string;
  bodyText: string;
  ignoreText: string;
  buttonText?: string;
}

export const VerificationEmailBase = ({
  confirmLink,
  previewText = "Confirma tu correo electrónico",
  headingText = "Confirma tu correo electrónico",
  bodyText,
  ignoreText,
  buttonText = "Verificar email",
}: VerificationEmailBaseProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{headingText}</Heading>
          <Text style={text}>{bodyText}</Text>
          <Section style={buttonContainer}>
            <Button style={button} href={confirmLink}>
              {buttonText}
            </Button>
          </Section>
          <Text style={text}>{ignoreText}</Text>
          <Text style={footer}>
            Este enlace expirará en 1 hora. Si el botón no funciona, copia y pega
            el siguiente enlace en tu navegador:
          </Text>
          <Link href={confirmLink} style={link}>
            {confirmLink}
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
  backgroundColor: "#0f172a",
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
  color: "#2563eb",
  fontSize: "14px",
  wordBreak: "break-all" as const,
};
