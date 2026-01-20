"use client";

import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { ReactNode, createContext, useContext, useState, useEffect } from "react";

interface ReCaptchaContextValue {
  executeRecaptcha: ((action: string) => Promise<string>) | null;
  isReady: boolean;
}

const ReCaptchaContext = createContext<ReCaptchaContextValue>({
  executeRecaptcha: null,
  isReady: false,
});

export function useReCaptchaContext() {
  return useContext(ReCaptchaContext);
}

interface ReCaptchaProviderProps {
  children: ReactNode;
}

// Componente interno que usa el hook de Google y propaga al contexto
function ReCaptchaContextBridge({ children }: { children: ReactNode }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("[ReCaptchaContextBridge] executeRecaptcha disponible:", !!executeRecaptcha);
    if (executeRecaptcha) {
      setIsReady(true);
      console.log("[ReCaptchaContextBridge] isReady = true");
    }
  }, [executeRecaptcha]);

  return (
    <ReCaptchaContext.Provider value={{ executeRecaptcha: executeRecaptcha || null, isReady }}>
      {children}
    </ReCaptchaContext.Provider>
  );
}

export function ReCaptchaProvider({ children }: ReCaptchaProviderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    console.log("[ReCaptchaProvider] Montando...");
    console.log("[ReCaptchaProvider] siteKey:", siteKey ? "configurado" : "NO configurado");
    setIsMounted(true);
  }, [siteKey]);

  // Si no hay site key, proveer contexto vacío
  if (!siteKey) {
    console.log("[ReCaptchaProvider] Sin siteKey, contexto vacío");
    return (
      <ReCaptchaContext.Provider value={{ executeRecaptcha: null, isReady: false }}>
        {children}
      </ReCaptchaContext.Provider>
    );
  }

  // Antes de montar, proveer contexto vacío para evitar errores de hidratación
  if (!isMounted) {
    console.log("[ReCaptchaProvider] Aún no montado, contexto vacío");
    return (
      <ReCaptchaContext.Provider value={{ executeRecaptcha: null, isReady: false }}>
        {children}
      </ReCaptchaContext.Provider>
    );
  }

  console.log("[ReCaptchaProvider] Renderizando GoogleReCaptchaProvider con key:", siteKey.substring(0, 10) + "...");

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
      language="es"
    >
      <ReCaptchaContextBridge>{children}</ReCaptchaContextBridge>
    </GoogleReCaptchaProvider>
  );
}
