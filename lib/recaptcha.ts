const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

const RECAPTCHA_SCORE_THRESHOLD = 0.5;

export interface ReCaptchaVerifyResult {
  success: boolean;
  score?: number;
  action?: string;
  error?: string;
}

export async function verifyReCaptcha(
  token: string,
  expectedAction?: string
): Promise<ReCaptchaVerifyResult> {
  console.log("[verifyReCaptcha] Iniciando verificación");
  console.log("[verifyReCaptcha] RECAPTCHA_SECRET_KEY:", RECAPTCHA_SECRET_KEY ? "configurado" : "NO configurado");
  console.log("[verifyReCaptcha] Token recibido:", token ? `${token.substring(0, 20)}...` : "null");
  console.log("[verifyReCaptcha] Expected action:", expectedAction);

  if (!RECAPTCHA_SECRET_KEY) {
    console.warn("[verifyReCaptcha] Secret key no configurado, saltando verificación");
    return { success: true };
  }

  if (!token) {
    console.log("[verifyReCaptcha] Token vacío");
    return { success: false, error: "Token de verificación no proporcionado" };
  }

  try {
    console.log("[verifyReCaptcha] Enviando petición a Google...");
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const data = await response.json();
    console.log("[verifyReCaptcha] Respuesta de Google:", JSON.stringify(data));

    if (!data.success) {
      console.error("[verifyReCaptcha] Verificación fallida:", data["error-codes"]);
      return {
        success: false,
        error: "Verificación de seguridad fallida. Intenta de nuevo.",
      };
    }

    console.log("[verifyReCaptcha] Score:", data.score, "Action:", data.action);

    if (data.score < RECAPTCHA_SCORE_THRESHOLD) {
      console.warn(`[verifyReCaptcha] Score muy bajo: ${data.score} < ${RECAPTCHA_SCORE_THRESHOLD}`);
      return {
        success: false,
        score: data.score,
        error: "Actividad sospechosa detectada. Intenta de nuevo.",
      };
    }

    if (expectedAction && data.action !== expectedAction) {
      console.warn(
        `[verifyReCaptcha] Action no coincide: esperado ${expectedAction}, recibido ${data.action}`
      );
      return {
        success: false,
        error: "Verificación de seguridad inválida.",
      };
    }

    console.log("[verifyReCaptcha] Verificación EXITOSA");
    return {
      success: true,
      score: data.score,
      action: data.action,
    };
  } catch (error) {
    console.error("[verifyReCaptcha] Error en verificación:", error);
    return {
      success: false,
      error: "Error al verificar la seguridad. Intenta de nuevo.",
    };
  }
}

export function isReCaptchaEnabled(): boolean {
  return !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
}
