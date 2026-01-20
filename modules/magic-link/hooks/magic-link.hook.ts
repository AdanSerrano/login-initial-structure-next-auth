"use client";

import { requestMagicLinkAction } from "../actions/magic-link.actions";
import {
  requestMagicLinkSchema,
  RequestMagicLinkInput,
} from "../validations/schema/magic-link.schema";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const useRequestMagicLink = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<RequestMagicLinkInput>({
    resolver: zodResolver(requestMagicLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const requestMagicLink = useCallback(async (values: RequestMagicLinkInput) => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const result = await requestMagicLinkAction(values);

        if (result.error) {
          setError(result.error);
          toast.error(result.error);
          return;
        }

        if (result.success) {
          setSuccess(result.success);
          toast.success(result.success);
          form.reset();
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al solicitar magic link";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  }, [form]);

  return {
    requestMagicLink,
    isPending,
    error,
    success,
    form,
  };
};

export const useVerifyMagicLink = (token: string | null) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const verifyToken = useCallback(async () => {
    if (!token) {
      setError("Token no proporcionado");
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      const result = await signIn("magic-link", {
        token,
        redirect: false,
      });

      if (result?.error) {
        setError("El enlace es inválido o ha expirado");
        setIsPending(false);
        return;
      }

      if (result?.ok) {
        setSuccess("Sesión iniciada correctamente");
        toast.success("Sesión iniciada correctamente");

        const callbackUrl =
          searchParams.get("callbackUrl") || DEFAULT_LOGIN_REDIRECT;
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al verificar el enlace";
      setError(errorMessage);
      setIsPending(false);
    }
  }, [token, router, searchParams]);

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token, verifyToken]);

  return {
    isPending,
    error,
    success,
  };
};
