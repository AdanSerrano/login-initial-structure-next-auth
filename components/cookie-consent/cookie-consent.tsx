"use client";

import { useCallback, useSyncExternalStore } from "react";
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

// Store for cookie consent state
type CookieConsentState = {
  hasConsent: boolean;
  preferences: CookiePreferences;
  showBanner: boolean;
  showSettings: boolean;
};

let cookieConsentState: CookieConsentState = {
  hasConsent: false,
  preferences: defaultPreferences,
  showBanner: false,
  showSettings: false,
};

const listeners = new Set<() => void>();
let initializationTimer: ReturnType<typeof setTimeout> | null = null;

function emitChange() {
  listeners.forEach((listener) => listener());
}

function readCookieState(): { hasConsent: boolean; preferences: CookiePreferences } {
  const consent = Cookies.get(COOKIE_CONSENT_KEY);
  const hasConsent = !!consent;

  let preferences = defaultPreferences;
  if (hasConsent) {
    const savedPreferences = Cookies.get(COOKIE_PREFERENCES_KEY);
    if (savedPreferences) {
      try {
        preferences = JSON.parse(savedPreferences);
      } catch {
        preferences = defaultPreferences;
      }
    }
  }

  return { hasConsent, preferences };
}

function initializeCookieState() {
  const { hasConsent, preferences } = readCookieState();

  if (!hasConsent && !cookieConsentState.showBanner) {
    // Show banner after delay if no consent
    initializationTimer = setTimeout(() => {
      cookieConsentState = {
        ...cookieConsentState,
        hasConsent: false,
        preferences: defaultPreferences,
        showBanner: true,
      };
      emitChange();
    }, 1000);
  } else {
    cookieConsentState = {
      ...cookieConsentState,
      hasConsent,
      preferences,
    };
    emitChange();
  }
}

function subscribeToCookieConsent(callback: () => void): () => void {
  listeners.add(callback);

  // Initialize on first subscription
  if (listeners.size === 1) {
    initializeCookieState();
  }

  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && initializationTimer) {
      clearTimeout(initializationTimer);
      initializationTimer = null;
    }
  };
}

function getCookieConsentSnapshot(): CookieConsentState {
  return cookieConsentState;
}

// Cached server snapshot to avoid infinite loop
const SERVER_SNAPSHOT: CookieConsentState = {
  hasConsent: false,
  preferences: defaultPreferences,
  showBanner: false,
  showSettings: false,
};

function getCookieConsentServerSnapshot(): CookieConsentState {
  return SERVER_SNAPSHOT;
}

function setShowSettings(show: boolean) {
  cookieConsentState = { ...cookieConsentState, showSettings: show };
  emitChange();
}

function setPreferences(preferences: CookiePreferences) {
  cookieConsentState = { ...cookieConsentState, preferences };
  emitChange();
}

function saveConsent(prefs: CookiePreferences) {
  Cookies.set(COOKIE_CONSENT_KEY, "true", { expires: COOKIE_MAX_AGE });
  Cookies.set(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs), {
    expires: COOKIE_MAX_AGE,
  });
  cookieConsentState = {
    hasConsent: true,
    preferences: prefs,
    showBanner: false,
    showSettings: false,
  };
  emitChange();
}

function resetConsent() {
  Cookies.remove(COOKIE_CONSENT_KEY);
  Cookies.remove(COOKIE_PREFERENCES_KEY);
  cookieConsentState = {
    hasConsent: false,
    preferences: defaultPreferences,
    showBanner: false,
    showSettings: false,
  };
  emitChange();
  window.location.reload();
}

export function CookieConsentBanner() {
  const state = useSyncExternalStore(
    subscribeToCookieConsent,
    getCookieConsentSnapshot,
    getCookieConsentServerSnapshot
  );

  const { showBanner, showSettings, preferences } = state;

  const handleAcceptAll = useCallback(() => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    });
  }, []);

  const handleAcceptNecessary = useCallback(() => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    });
  }, []);

  const handleSavePreferences = useCallback(() => {
    saveConsent(preferences);
  }, [preferences]);

  const handleToggleSettings = useCallback((show: boolean) => {
    setShowSettings(show);
  }, []);

  const handleAnalyticsChange = useCallback((checked: boolean) => {
    setPreferences({ ...preferences, analytics: checked });
  }, [preferences]);

  const handleFunctionalChange = useCallback((checked: boolean) => {
    setPreferences({ ...preferences, functional: checked });
  }, [preferences]);

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
                    onCheckedChange={handleAnalyticsChange}
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
                    onCheckedChange={handleFunctionalChange}
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
                  onClick={() => handleToggleSettings(true)}
                >
                  Configurar
                </Button>
                <Button
                  variant="outline"
                  className="sm:w-auto"
                  onClick={handleAcceptNecessary}
                >
                  Solo necesarias
                </Button>
                <Button className="sm:flex-1 sm:max-w-[200px]" onClick={handleAcceptAll}>
                  Aceptar todas
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button
                  variant="outline"
                  className="sm:w-auto"
                  onClick={() => handleToggleSettings(false)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Volver
                </Button>
                <Button
                  className="sm:flex-1 sm:max-w-[200px]"
                  onClick={handleSavePreferences}
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
  const state = useSyncExternalStore(
    subscribeToCookieConsent,
    getCookieConsentSnapshot,
    getCookieConsentServerSnapshot
  );

  return {
    preferences: state.preferences,
    hasConsent: state.hasConsent,
    resetConsent,
  };
}
