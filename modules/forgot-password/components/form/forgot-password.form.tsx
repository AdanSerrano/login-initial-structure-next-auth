"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  FormTextField,
  FormSubmitButton,
} from "@/components/ui/form-fields";
import { ForgotPasswordViewModel } from "../../view-model/forgot-password.view-model";
import { CheckCircle, KeyRound, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { memo } from "react";
import { useTranslations } from "next-intl";

export const ForgotPasswordForm = memo(function ForgotPasswordForm() {
  const t = useTranslations("ForgotPassword");
  const tAuth = useTranslations("Auth");
  const tCommon = useTranslations("Common");
  const { handleSubmit, form, isPending, sent } = ForgotPasswordViewModel();

  if (sent) {
    return <SuccessState />;
  }

  return (
    <Card className="w-full max-w-md border-border/40 shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
          <KeyRound className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <CardTitle className="text-xl font-bold sm:text-2xl">
          {t("title")}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {t("subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormTextField
              control={form.control}
              name="email"
              type="email"
              label={tAuth("email")}
              placeholder={tAuth("emailPlaceholder")}
              autoComplete="email"
              disabled={isPending}
            />

            <FormSubmitButton
              isPending={isPending}
              text={t("sendLink")}
              loadingText={tCommon("sending")}
              icon={<Mail className="h-4 w-4" aria-hidden="true" />}
              fullWidth
            />
          </form>
        </Form>
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
          >
            {t("backToLogin")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
});

function SuccessState() {
  const t = useTranslations("ForgotPassword");

  return (
    <Card className="w-full max-w-md border-border/40 shadow-lg">
      <CardContent className="pt-6">
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center space-y-6 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle
              className="h-8 w-8 text-green-600 dark:text-green-400"
              aria-hidden="true"
            />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              {t("successTitle")}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {t("successMessage")}
            </p>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 w-full">
            <div className="flex items-start gap-3">
              <Mail
                className="h-5 w-5 text-primary mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <div className="text-left text-sm">
                <p className="font-medium">{t("checkInbox")}</p>
                <p className="text-muted-foreground mt-1">{t("linkExpiry")}</p>
              </div>
            </div>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/login">{t("backToLogin")}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
