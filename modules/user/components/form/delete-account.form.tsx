"use client";

import { memo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  FormTextField,
  FormPasswordField,
  FormErrorAlert,
} from "@/components/ui/form-fields";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { DeleteAccountViewModel } from "../../view-model/user.view-model";
import { useTranslations } from "next-intl";

export const DeleteAccountForm = memo(function DeleteAccountForm() {
  const t = useTranslations("DeleteAccount");
  const tCommon = useTranslations("Common");
  const { handleSubmit, form, isPending, error } = DeleteAccountViewModel();
  const dialogOpenRef = useRef(false);

  const onSubmit = async () => {
    const values = form.getValues();
    await handleSubmit(values);
  };

  const confirmation = form.watch("confirmation");
  const password = form.watch("password");
  const deleteWord = t("deleteWord");
  const canDelete = confirmation === deleteWord && password.length > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-destructive/10 p-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <p className="font-medium text-destructive">{t("title")}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {t("warning")}
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <FormPasswordField
            control={form.control}
            name="password"
            label={t("confirmPassword")}
            autoComplete="current-password"
            disabled={isPending}
          />

          <FormTextField
            control={form.control}
            name="confirmation"
            label={
              <>
                {t("typeDelete")}{" "}
                <span className="font-mono font-bold text-destructive">
                  {deleteWord}
                </span>
              </>
            }
            placeholder={deleteWord}
            disabled={isPending}
            inputClassName="font-mono"
          />

          <FormErrorAlert error={error} />

          <AlertDialog
            open={dialogOpenRef.current}
            onOpenChange={(open) => {
              dialogOpenRef.current = open;
            }}
          >
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              disabled={isPending || !canDelete}
              onClick={() => {
                dialogOpenRef.current = true;
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("deleteButton")}
            </Button>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  {t("dialogTitle")}
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>{t("dialogDescription")}</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>{t("deleteProfile")}</li>
                    <li>{t("deleteHistory")}</li>
                    <li>{t("deleteAccess")}</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  {tCommon("cancel")}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onSubmit}
                  disabled={isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {tCommon("deleting")}
                    </>
                  ) : (
                    t("confirmDelete")
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>
    </div>
  );
});
