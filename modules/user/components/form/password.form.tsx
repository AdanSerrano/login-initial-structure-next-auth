"use client";

import { memo, useMemo } from "react";
import { Form } from "@/components/ui/form";
import {
  FormPasswordField,
  FormErrorAlert,
  FormSubmitButton,
  FormButtonGroup,
  type PasswordStrengthLabels,
} from "@/components/ui/form-fields";
import { PasswordViewModel } from "../../view-model/user.view-model";
import { useTranslations } from "next-intl";

export const PasswordForm = memo(function PasswordForm() {
  const t = useTranslations("PasswordSettings");
  const { handleSubmit, form, isPending, error } = PasswordViewModel();

  const strengthLabels: PasswordStrengthLabels = useMemo(
    () => ({
      requirements: t("requirements"),
      minChars: t("minChars"),
      uppercase: t("uppercase"),
      lowercase: t("lowercase"),
      number: t("number"),
      specialChar: t("specialChar"),
    }),
    [t]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormPasswordField
          control={form.control}
          name="currentPassword"
          label={t("currentPassword")}
          autoComplete="current-password"
          disabled={isPending}
        />

        <FormPasswordField
          control={form.control}
          name="newPassword"
          label={t("newPassword")}
          autoComplete="new-password"
          disabled={isPending}
          showStrengthIndicator
          showRequirements
          strengthLabels={strengthLabels}
        />

        <FormPasswordField
          control={form.control}
          name="confirmPassword"
          label={t("confirmNewPassword")}
          autoComplete="new-password"
          disabled={isPending}
        />

        <FormErrorAlert error={error} />

        <FormButtonGroup align="right">
          <FormSubmitButton
            isPending={isPending}
            text={t("changePassword")}
            loadingText={t("changing")}
          />
        </FormButtonGroup>
      </form>
    </Form>
  );
});
