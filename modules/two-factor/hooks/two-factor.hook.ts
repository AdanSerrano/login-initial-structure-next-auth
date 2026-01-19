"use client";

import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  twoFactorSchema,
  TwoFactorInput,
} from "../validations/schema/two-factor.schema";
import {
  sendTwoFactorCodeAction,
  verifyTwoFactorCodeAction,
} from "../actions/two-factor.actions";

interface UseTwoFactorProps {
  email: string;
  onSuccess?: () => void;
}

export const useTwoFactor = ({ email, onSuccess }: UseTwoFactorProps) => {
  const [isPending, startTransition] = useTransition();
  const [isResending, startResendTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const form = useForm<TwoFactorInput>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
      email,
    },
  });

  const startCountdown = useCallback(() => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleVerify = useCallback(
    async (values: TwoFactorInput) => {
      setError(null);
      startTransition(async () => {
        try {
          const result = await verifyTwoFactorCodeAction(values);

          if (result.error) {
            setError(result.error);
            toast.error(result.error);
            return;
          }

          toast.success(result.success);
          onSuccess?.();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Error inesperado";
          setError(msg);
          toast.error(msg);
        }
      });
    },
    [onSuccess]
  );

  const handleResendCode = useCallback(async () => {
    if (countdown > 0) return;

    setError(null);
    startResendTransition(async () => {
      try {
        const result = await sendTwoFactorCodeAction({ email });

        if (result.error) {
          setError(result.error);
          toast.error(result.error);
          return;
        }

        toast.success("Nuevo código enviado a tu correo");
        startCountdown();
        form.reset({ code: "", email });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error inesperado";
        setError(msg);
        toast.error(msg);
      }
    });
  }, [email, countdown, startCountdown, form]);

  return {
    form,
    isPending,
    isResending,
    error,
    countdown,
    handleVerify,
    handleResendCode,
    startCountdown,
  };
};
