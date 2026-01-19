import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface TwoFactorCodeEmailProps {
  code: string;
}

export const TwoFactorCodeEmail = ({ code }: TwoFactorCodeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Tu código de verificación: {code}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Código de verificación</Heading>
          <Text style={text}>
            Usa el siguiente código para completar tu inicio de sesión:
          </Text>
          <Section style={codeContainer}>
            <Text style={codeStyle}>{code}</Text>
          </Section>
          <Text style={textMuted}>
            Este código expira en 10 minutos. Si no solicitaste este código,
            puedes ignorar este correo.
          </Text>
          <Text style={textSmall}>
            Por seguridad, nunca compartas este código con nadie.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e6ebf1",
  borderRadius: "8px",
  margin: "0 auto",
  padding: "40px",
  maxWidth: "465px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.25",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "24px",
  textAlign: "center" as const,
};

const codeContainer = {
  backgroundColor: "#f4f4f5",
  borderRadius: "8px",
  margin: "24px 0",
  padding: "24px",
};

const codeStyle = {
  color: "#1a1a1a",
  fontSize: "32px",
  fontWeight: "700",
  letterSpacing: "8px",
  textAlign: "center" as const,
  margin: "0",
};

const textMuted = {
  color: "#8898aa",
  fontSize: "14px",
  lineHeight: "20px",
  marginTop: "24px",
  textAlign: "center" as const,
};

const textSmall = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  marginTop: "16px",
  textAlign: "center" as const,
};
