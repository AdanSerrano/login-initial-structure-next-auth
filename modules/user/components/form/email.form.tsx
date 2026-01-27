"use client";

import { memo } from "react";
import { Form } from "@/components/ui/form";
import {
  FormTextField,
  FormPasswordField,
  FormErrorAlert,
  FormSubmitButton,
  FormButtonGroup,
  FormInfoBox,
} from "@/components/ui/form-fields";
import { Mail, ShieldCheck } from "lucide-react";
import { EmailViewModel } from "../../view-model/user.view-model";
import { useTranslations } from "next-intl";

interface EmailFormProps {
  currentEmail?: string | null;
  isVerified?: boolean;
}

export const EmailForm = memo(function EmailForm({
  currentEmail,
  isVerified,
}: EmailFormProps) {
  const t = useTranslations("EmailSettings");
  const tCommon = useTranslations("Common");
  const { handleSubmit, form, isPending, error } = EmailViewModel();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormInfoBox
          icon={
            <div className="rounded-full bg-primary/10 p-2">
              <Mail className="h-4 w-4 text-primary" />
            </div>
          }
        >
          <div className="flex items-center gap-2">
            <p className="font-medium">
              {currentEmail || tCommon("notConfigured")}
            </p>
            {isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600">
                <ShieldCheck className="h-3 w-3" />
                {tCommon("verified")}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t("currentEmail")}
          </p>
        </FormInfoBox>

        <div className="space-y-4">
          <FormTextField
            control={form.control}
            name="email"
            type="email"
            label={t("newEmail")}
            placeholder={t("newEmailPlaceholder")}
            description={t("newEmailHint")}
            disabled={isPending}
          />

          <FormPasswordField
            control={form.control}
            name="currentPassword"
            label={t("confirmPassword")}
            description={t("confirmPasswordHint")}
            autoComplete="current-password"
            disabled={isPending}
          />
        </div>

        <FormErrorAlert error={error} />

        <FormButtonGroup align="right">
          <FormSubmitButton
            isPending={isPending}
            text={t("changeEmail")}
            loadingText={tCommon("updating")}
          />
        </FormButtonGroup>
      </form>
    </Form>
  );
});
