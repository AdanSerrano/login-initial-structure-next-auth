"use client";

import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormOTPField,
  FormErrorAlert,
  FormSubmitButton,
} from "@/components/ui/form-fields";
import { Spinner } from "@/components/ui/spinner";
import { Mail, ArrowLeft, RefreshCw, ShieldCheck } from "lucide-react";
import { useTwoFactor } from "../../hooks/two-factor.hook";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("TwoFactor");
  const tCommon = useTranslations("Common");
  const {
    form,
    isPending,
    isResending,
    error,
    countdown,
    handleVerify,
    handleResendCode,
  } = useTwoFactor({ email, onSuccess });

  const onSubmit = useCallback(
    (values: { code: string; email: string }) => {
      handleVerify(values);
    },
    [handleVerify]
  );

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, "$1***$3");
  const codeValue = form.watch("code");
  const isCodeComplete = codeValue?.length === 6;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3 rounded-xl bg-muted/50 px-4 py-3 border border-border/50">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">
            {t("codeSentTo")}
          </span>
          <span className="text-sm font-medium text-foreground">
            {maskedEmail}
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormErrorAlert error={error} />

          <FormOTPField
            control={form.control}
            name="code"
            length={6}
            showSeparator
            disabled={isPending}
          />

          <div className="flex items-center justify-center">
            {countdown > 0 ? (
              <div className="flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xs font-bold text-primary">
                    {countdown}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {t("secondsToResend")}
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
                    {t("resending")}
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t("resendCode")}
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <FormSubmitButton
              isPending={isPending}
              text={t("verifyCode")}
              loadingText={t("verifying")}
              icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
              disabled={!isCodeComplete}
              className="h-11 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              fullWidth
            />

            {onBack && (
              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
                onClick={onBack}
                disabled={isPending}
              >
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                {tCommon("cancel")}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
});
