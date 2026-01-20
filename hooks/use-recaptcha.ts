"use client";

import { useReCaptchaContext } from "@/components/recaptcha/recaptcha-provider";
import { useCallback, useState, useEffect, useRef } from "react";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function useReCaptcha() {
  const [isVerifying, setIsVerifying] = useState(false);
  const { executeRecaptcha, isReady: contextIsReady } = useReCaptchaContext();
  const executeRecaptchaRef = useRef(executeRecaptcha);

  // Mantener la referencia actualizada
  useEffect(() => {
    executeRecaptchaRef.current = executeRecaptcha;
  }, [executeRecaptcha]);

  const isConfigured = !!RECAPTCHA_SITE_KEY;
  const isReady = isConfigured && contextIsReady;

  const getToken = useCallback(
    async (action: string): Promise<string | null> => {
      console.log("[useReCaptcha] getToken llamado con action:", action);
      console.log("[useReCaptcha] RECAPTCHA_SITE_KEY:", RECAPTCHA_SITE_KEY ? "configurado" : "NO configurado");
      console.log("[useReCaptcha] isConfigured:", isConfigured);
      console.log("[useReCaptcha] contextIsReady:", contextIsReady);
      console.log("[useReCaptcha] executeRecaptcha disponible:", !!executeRecaptchaRef.current);

      // Si no está configurado, permitir continuar sin token
      if (!isConfigured) {
        console.log("[useReCaptcha] No configurado, retornando null");
        return null;
      }

      // Si está configurado pero no está listo, esperar a que el provider se monte
      if (!executeRecaptchaRef.current) {
        console.log("[useReCaptcha] executeRecaptcha no disponible, esperando...");
        // Esperar hasta 5 segundos a que reCAPTCHA esté listo
        const maxWait = 5000;
        const interval = 100;
        let waited = 0;

        while (waited < maxWait && !executeRecaptchaRef.current) {
          await new Promise((resolve) => setTimeout(resolve, interval));
          waited += interval;
        }

        console.log("[useReCaptcha] Tiempo esperado:", waited, "ms");
        console.log("[useReCaptcha] executeRecaptcha después de esperar:", !!executeRecaptchaRef.current);

        if (!executeRecaptchaRef.current) {
          console.error("[useReCaptcha] reCAPTCHA no listo después de esperar 5s");
          return null;
        }
      }

      setIsVerifying(true);
      try {
        console.log("[useReCaptcha] Ejecutando reCAPTCHA...");
        const token = await executeRecaptchaRef.current(action);
        console.log("[useReCaptcha] Token obtenido exitosamente:", token ? "SÍ" : "NO");
        return token;
      } catch (error) {
        console.error("[useReCaptcha] Error ejecutando reCAPTCHA:", error);
        return null;
      } finally {
        setIsVerifying(false);
      }
    },
    [isConfigured, contextIsReady]
  );

  return { getToken, isReady, isVerifying, isConfigured };
}
