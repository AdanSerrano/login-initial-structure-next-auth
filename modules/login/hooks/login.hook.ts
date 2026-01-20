"use client";

import { loginAction } from "@/modules/login/actions/login.actions";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  LoginUser,
  LoginActionInput,
  createLoginFormSchema,
} from "../validations/schema/login.schema";
import { useReCaptcha } from "@/hooks/use-recaptcha";

interface TwoFactorState {
  required: boolean;
  email: string | null;
  dialogOpen: boolean;
}

interface PendingDeletionState {
  isPending: boolean;
  email: string | null;
  scheduledDeletionDate: Date | null;
  daysRemaining: number | null;
  dialogOpen: boolean;
}

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [twoFactor, setTwoFactor] = useState<TwoFactorState>({
    required: false,
    email: null,
    dialogOpen: false,
  });
  const [pendingDeletion, setPendingDeletion] = useState<PendingDeletionState>({
    isPending: false,
    email: null,
    scheduledDeletionDate: null,
    daysRemaining: null,
    dialogOpen: false,
  });
  const [credentials, setCredentials] = useState<LoginActionInput | null>(null);
  const { getToken: getReCaptchaToken, isConfigured: isReCaptchaConfigured } = useReCaptcha();

  const form = useForm<LoginUser>({
    resolver: zodResolver(createLoginFormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const login = useCallback(
    async (values: LoginUser) => {
      setError(null);
      startTransition(async () => {
        try {
          console.log("[reCAPTCHA] isConfigured:", isReCaptchaConfigured);
          console.log("[reCAPTCHA] Obteniendo token para action: login");

          const recaptchaToken = await getReCaptchaToken("login");

          console.log("[reCAPTCHA] Token obtenido:", recaptchaToken ? `${recaptchaToken.substring(0, 20)}...` : "null");

          // Si reCAPTCHA está configurado pero no se pudo obtener el token, fallar
          if (isReCaptchaConfigured && !recaptchaToken) {
            console.log("[reCAPTCHA] ERROR: Configurado pero no se obtuvo token");
            setError("Error de verificación de seguridad. Intenta de nuevo.");
            toast.error("Error de verificación de seguridad. Intenta de nuevo.");
            return;
          }

          const actionInput: LoginActionInput = {
            ...values,
            recaptchaToken: recaptchaToken || undefined,
          };

          console.log("[reCAPTCHA] Enviando al servidor con token:", !!recaptchaToken);

          const result = await loginAction(actionInput);

          if (result?.error) {
            setError(result.error);
            toast.error(result.error);
            return;
          }

          if (result?.pendingDeletion && result?.email) {
            setCredentials(actionInput);
            setPendingDeletion({
              isPending: true,
              email: result.email,
              scheduledDeletionDate: result.scheduledDeletionDate || null,
              daysRemaining: result.daysRemaining ?? null,
              dialogOpen: true,
            });
            return;
          }

          if (result?.requiresTwoFactor && result?.email) {
            setCredentials(actionInput);
            setTwoFactor({
              required: true,
              email: result.email,
              dialogOpen: true,
            });
            toast.success("Código de verificación enviado a tu correo");
            return;
          }

          if (result?.success) {
            toast.success(result.success);
            const callbackUrl =
              searchParams.get("callbackUrl") || DEFAULT_LOGIN_REDIRECT;
            router.push(callbackUrl);
            router.refresh();
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Error al iniciar sesión";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      });
    },
    [router, searchParams, getReCaptchaToken, isReCaptchaConfigured]
  );

  const completeTwoFactorLogin = useCallback(async () => {
    if (!credentials) return;

    startTransition(async () => {
      try {
        const result = await loginAction(credentials);

        if (result?.error) {
          setError(result.error);
          toast.error(result.error);
          return;
        }

        if (result?.success && !result?.requiresTwoFactor) {
          toast.success("Inicio de sesión exitoso");
          const callbackUrl =
            searchParams.get("callbackUrl") || DEFAULT_LOGIN_REDIRECT;
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al iniciar sesión";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  }, [credentials, router, searchParams]);

  const cancelTwoFactor = useCallback(() => {
    setTwoFactor({ required: false, email: null, dialogOpen: false });
    setCredentials(null);
    setError(null);
  }, []);

  const closeTwoFactorDialog = useCallback(() => {
    setTwoFactor((prev) => ({ ...prev, dialogOpen: false }));
  }, []);

  const openTwoFactorDialog = useCallback(() => {
    setTwoFactor((prev) => ({ ...prev, dialogOpen: true }));
  }, []);

  const closePendingDeletionDialog = useCallback(() => {
    setPendingDeletion((prev) => ({ ...prev, dialogOpen: false }));
  }, []);

  const onAccountReactivated = useCallback(() => {
    setPendingDeletion({
      isPending: false,
      email: null,
      scheduledDeletionDate: null,
      daysRemaining: null,
      dialogOpen: false,
    });
    if (credentials) {
      login({
        identifier: credentials.identifier,
        password: credentials.password,
      });
    }
  }, [credentials, login]);

  return {
    login,
    isPending,
    error,
    form,
    twoFactor,
    pendingDeletion,
    completeTwoFactorLogin,
    cancelTwoFactor,
    closeTwoFactorDialog,
    openTwoFactorDialog,
    closePendingDeletionDialog,
    onAccountReactivated,
  };
};
