"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Cookie, Shield, ChartBar, Settings2, ChevronLeft } from "lucide-react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "cookie-consent";
const COOKIE_PREFERENCES_KEY = "cookie-preferences";
const COOKIE_MAX_AGE = 365;

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
};

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] =
    useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const consent = Cookies.get(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      const savedPreferences = Cookies.get(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        try {
          setPreferences(JSON.parse(savedPreferences));
        } catch {
          setPreferences(defaultPreferences);
        }
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    Cookies.set(COOKIE_CONSENT_KEY, "true", { expires: COOKIE_MAX_AGE });
    Cookies.set(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs), {
      expires: COOKIE_MAX_AGE,
    });
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    });
  };

  const acceptNecessary = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    });
  };

  const savePreferences = () => {
    saveConsent(preferences);
  };

  return (
    <Drawer open={showBanner} dismissible={false} modal={true}>
      <DrawerContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <DrawerTitle>Configuración de Cookies</DrawerTitle>
                <DrawerDescription>
                  Utilizamos cookies para mejorar tu experiencia
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>

          <div className="px-4 pb-2">
            {!showSettings ? (
              <p className="text-sm text-muted-foreground text-center">
                Este sitio utiliza cookies para garantizar la seguridad de tu
                sesión, mejorar el rendimiento y personalizar tu experiencia. Al
                continuar navegando, aceptas nuestra{" "}
                <Link
                  href="/privacy"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  política de privacidad
                </Link>
                .
              </p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-600 shrink-0" />
                    <div>
                      <Label className="font-medium text-sm">
                        Cookies necesarias
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Esenciales para la seguridad
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked
                    disabled
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <ChartBar className="h-5 w-5 text-blue-600 shrink-0" />
                    <div>
                      <Label className="font-medium text-sm">
                        Cookies analíticas
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Nos ayudan a mejorar
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, analytics: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Settings2 className="h-5 w-5 text-purple-600 shrink-0" />
                    <div>
                      <Label className="font-medium text-sm">
                        Cookies funcionales
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Recordar preferencias
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.functional}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, functional: checked }))
                    }
                  />
                </div>
              </div>
            )}
          </div>

          <DrawerFooter>
            {!showSettings ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button
                  variant="outline"
                  className="sm:w-auto"
                  onClick={() => setShowSettings(true)}
                >
                  Configurar
                </Button>
                <Button
                  variant="outline"
                  className="sm:w-auto"
                  onClick={acceptNecessary}
                >
                  Solo necesarias
                </Button>
                <Button className="sm:flex-1 sm:max-w-[200px]" onClick={acceptAll}>
                  Aceptar todas
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button
                  variant="outline"
                  className="sm:w-auto"
                  onClick={() => setShowSettings(false)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Volver
                </Button>
                <Button
                  className="sm:flex-1 sm:max-w-[200px]"
                  onClick={savePreferences}
                >
                  Guardar preferencias
                </Button>
              </div>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function useCookieConsent() {
  const [preferences, setPreferences] =
    useState<CookiePreferences>(defaultPreferences);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = Cookies.get(COOKIE_CONSENT_KEY);
    setHasConsent(!!consent);

    if (consent) {
      const savedPreferences = Cookies.get(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        try {
          setPreferences(JSON.parse(savedPreferences));
        } catch {
          setPreferences(defaultPreferences);
        }
      }
    }
  }, []);

  const resetConsent = () => {
    Cookies.remove(COOKIE_CONSENT_KEY);
    Cookies.remove(COOKIE_PREFERENCES_KEY);
    setHasConsent(false);
    setPreferences(defaultPreferences);
    window.location.reload();
  };

  return { preferences, hasConsent, resetConsent };
}
