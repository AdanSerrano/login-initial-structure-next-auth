"use client";

import { memo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Mail, ArrowLeft, RefreshCw, AlertCircle, ShieldCheck } from "lucide-react";
import { useTwoFactor } from "../../hooks/two-factor.hook";

interface TwoFactorDialogContentProps {
  email: string;
  onSuccess: () => void;
  onBack?: () => void;
}

export const TwoFactorDialogContent = memo(function TwoFactorDialogContent({
  email,
  onSuccess,
  onBack,
}: TwoFactorDialogContentProps) {
  const {
    form,
    isPending,
    isResending,
    error,
    countdown,
    handleVerify,
    handleResendCode,
    startCountdown,
  } = useTwoFactor({ email, onSuccess });

  useEffect(() => {
    startCountdown();
  }, [startCountdown]);

  const onSubmit = useCallback(
    (values: { code: string; email: string }) => {
      handleVerify(values);
    },
    [handleVerify]
  );

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1***$3");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3 rounded-xl bg-muted/50 px-4 py-3 border border-border/50">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Código enviado a</span>
          <span className="text-sm font-medium text-foreground">{maskedEmail}</span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-center gap-3 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive border border-destructive/20"
            >
              <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center py-2">
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isPending}
                    autoFocus
                    aria-label="Código de verificación de 6 dígitos"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage className="mt-3" />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-center">
            {countdown > 0 ? (
              <div className="flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xs font-bold text-primary">{countdown}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  segundos para reenviar
                </span>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResendCode}
                disabled={isResending}
                className="rounded-full px-4 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all"
                aria-busy={isResending}
              >
                {isResending ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" aria-hidden="true" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                    Reenviar código
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              disabled={isPending || form.watch("code").length !== 6}
              aria-busy={isPending}
            >
              {isPending ? (
                <>
                  <Spinner className="mr-2 h-5 w-5" aria-hidden="true" />
                  Verificando...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" aria-hidden="true" />
                  Verificar código
                </>
              )}
            </Button>

            {onBack && (
              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={onBack}
                disabled={isPending}
              >
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
});
