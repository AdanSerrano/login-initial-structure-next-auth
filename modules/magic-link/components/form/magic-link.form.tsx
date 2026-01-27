"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormTextField,
  FormErrorAlert,
  FormSubmitButton,
} from "@/components/ui/form-fields";
import { MagicLinkViewModel } from "@/modules/magic-link/view-model/magic-link.view-model";
import { Wand2, CheckCircle, KeyRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { memo } from "react";
import { useTranslations } from "next-intl";

export const MagicLinkForm = memo(function MagicLinkForm() {
  const t = useTranslations("MagicLink");
  const tAuth = useTranslations("Auth");
  const { handleSubmit, form, isPending, error, success } =
    MagicLinkViewModel();

  if (success) {
    return (
      <div className="flex flex-col items-center space-y-4 text-center py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{t("successTitle")}</h3>
          <p className="text-sm text-muted-foreground">{success}</p>
          <p className="text-xs text-muted-foreground">{t("successMessage")}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => form.reset()}
          className="mt-4"
        >
          {t("sendAnother")}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <div className="text-center space-y-2 pb-2">
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <FormTextField
          control={form.control}
          name="email"
          type="email"
          label={tAuth("email")}
          placeholder={tAuth("emailPlaceholder")}
          autoComplete="email"
          disabled={isPending}
        />

        <FormErrorAlert error={error} />

        <FormSubmitButton
          isPending={isPending}
          text={t("sendLink")}
          loadingText={t("sendingLink")}
          icon={<Wand2 className="h-4 w-4" aria-hidden="true" />}
          fullWidth
        />

        <Link
          href="/login"
          className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <KeyRound className="h-4 w-4" />
          {tAuth("loginWithPassword")}
        </Link>

        <p className="text-center text-sm text-muted-foreground">
          {tAuth("noAccount")}{" "}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {tAuth("createAccount")}
          </Link>
        </p>
      </form>
    </Form>
  );
});
