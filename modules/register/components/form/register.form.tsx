"use client";

import { Form } from "@/components/ui/form";
import {
  FormTextField,
  FormPasswordField,
  FormErrorAlert,
  FormSubmitButton,
} from "@/components/ui/form-fields";
import { PasswordStrengthIndicator } from "@/components/ui/password-strength-indicator";
import { RegisterViewModel } from "@/modules/register/view-model/register.view-model";
import { UserPlus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { memo, useDeferredValue } from "react";
import { useTranslations } from "next-intl";

export const RegisterForm = memo(function RegisterForm() {
  const t = useTranslations("Auth");
  const { handleRegister, isPending, error, form } = RegisterViewModel();
  const password = form.watch("password");
  const deferredPassword = useDeferredValue(password);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-5">
        <FormTextField
          control={form.control}
          name="email"
          type="email"
          label={`${t("email")} *`}
          placeholder={t("emailPlaceholder")}
          description={t("emailHint")}
          autoComplete="email"
          disabled={isPending}
        />

        <FormTextField
          control={form.control}
          name="userName"
          label={t("username")}
          placeholder={t("usernamePlaceholder")}
          description={t("usernameHint")}
          autoComplete="username"
          disabled={isPending}
        />

        <FormTextField
          control={form.control}
          name="name"
          label={t("fullName")}
          placeholder={t("fullNamePlaceholder")}
          description={t("nameHint")}
          autoComplete="name"
          disabled={isPending}
        />

        <div className="space-y-2">
          <FormPasswordField
            control={form.control}
            name="password"
            label={`${t("password")} *`}
            autoComplete="new-password"
            disabled={isPending}
          />
          <PasswordStrengthIndicator password={deferredPassword || ""} />
        </div>

        <FormPasswordField
          control={form.control}
          name="confirmPassword"
          label={`${t("confirmPassword")} *`}
          autoComplete="new-password"
          disabled={isPending}
        />

        <FormErrorAlert error={error} />

        <FormSubmitButton
          isPending={isPending}
          text={t("createAccount")}
          loadingText={t("registering")}
          icon={<UserPlus className="h-4 w-4" aria-hidden="true" />}
          fullWidth
        />

        <p className="text-center text-sm text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {t("login")}
          </Link>
        </p>
      </form>
    </Form>
  );
});
