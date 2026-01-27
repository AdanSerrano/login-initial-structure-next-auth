"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  FormTextField,
  FormPasswordField,
  FormErrorAlert,
  FormSubmitButton,
} from "@/components/ui/form-fields";
import { LoginViewModel } from "@/modules/login/view-model/login.view-model";
import {
  LogIn,
  ShieldCheck,
  KeyRound,
  Wand2,
  AlertTriangle,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { memo, Suspense } from "react";
import { TwoFactorDialogContent } from "@/modules/two-factor/components/form/two-factor.form";
import { TwoFactorSkeleton } from "@/modules/two-factor/components/two-factor.skeleton";
import { ReactivateAccountDialog } from "../reactivate-account.dialog";
import { useTranslations } from "next-intl";

export const LoginForm = memo(function LoginForm() {
  const t = useTranslations("Auth");
  const tTwoFactor = useTranslations("TwoFactor");
  const {
    handleLogin,
    form,
    isPending,
    error,
    twoFactor,
    pendingDeletion,
    sessionExpired,
    completeTwoFactorLogin,
    cancelTwoFactor,
    closeTwoFactorDialog,
    openTwoFactorDialog,
    closePendingDeletionDialog,
    onAccountReactivated,
  } = LoginViewModel();

  const isTwoFactorPending = twoFactor.required && !!twoFactor.email;

  return (
    <>
      <Dialog
        open={twoFactor.dialogOpen && isTwoFactorPending}
        onOpenChange={(open) => !open && closeTwoFactorDialog()}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-lg"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-primary/20 via-primary/10 to-primary/5 ring-4 ring-primary/10 shadow-lg mb-2">
              <ShieldCheck
                className="h-8 w-8 text-primary"
                aria-hidden="true"
              />
            </div>
            <DialogTitle className="text-xl">{tTwoFactor("title")}</DialogTitle>
            <DialogDescription>{tTwoFactor("subtitle")}</DialogDescription>
          </DialogHeader>
          <Suspense fallback={<TwoFactorSkeleton />}>
            {twoFactor.email && (
              <TwoFactorDialogContent
                email={twoFactor.email}
                onSuccess={completeTwoFactorLogin}
                onBack={cancelTwoFactor}
              />
            )}
          </Suspense>
        </DialogContent>
      </Dialog>

      <ReactivateAccountDialog
        isOpen={pendingDeletion.dialogOpen}
        onOpenChange={closePendingDeletionDialog}
        email={pendingDeletion.email || ""}
        scheduledDeletionDate={pendingDeletion.scheduledDeletionDate || undefined}
        daysRemaining={pendingDeletion.daysRemaining || undefined}
        onSuccess={onAccountReactivated}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-5">
          {sessionExpired && (
            <div
              role="alert"
              className="flex items-center gap-3 rounded-xl bg-amber-500/10 px-4 py-3 border border-amber-500/20"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
                <AlertTriangle
                  className="h-5 w-5 text-amber-600"
                  aria-hidden="true"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {t("sessionClosed")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("sessionClosedFromDevice")}
                </p>
              </div>
            </div>
          )}

          {isTwoFactorPending && !twoFactor.dialogOpen && (
            <div className="flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 border border-primary/20">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <KeyRound
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {t("verificationPending")}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {t("codeSentTo", {
                    email:
                      twoFactor.email?.replace(/(.{2})(.*)(@.*)/, "$1***$3") ||
                      "",
                  })}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={openTwoFactorDialog}
                className="shrink-0"
              >
                {t("continue")}
              </Button>
            </div>
          )}

          <FormTextField
            control={form.control}
            name="identifier"
            label={t("emailOrUsername")}
            placeholder={t("emailOrUsernamePlaceholder")}
            autoComplete="username"
            disabled={isPending}
          />

          <FormPasswordField
            control={form.control}
            name="password"
            label={t("password")}
            autoComplete="current-password"
            disabled={isPending}
            labelExtra={
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            }
          />

          <FormErrorAlert error={error} />

          <FormSubmitButton
            isPending={isPending}
            text={t("login")}
            loadingText={t("loggingIn")}
            icon={<LogIn className="h-4 w-4" aria-hidden="true" />}
            fullWidth
          />

          <Link
            href="/magic-link"
            className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Wand2 className="h-4 w-4" />
            {t("loginWithMagicLink")}
          </Link>

          <p className="text-center text-sm text-muted-foreground">
            {t("noAccount")}{" "}
            <Link
              href="/register"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {t("createAccount")}
            </Link>
          </p>
        </form>
      </Form>
    </>
  );
});
