"use client";

import { memo, useCallback, useRef, useTransition } from "react";
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
import { FormErrorAlert } from "@/components/ui/form-fields";
import { Loader2, RefreshCcw, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { reactivateAccountAction } from "@/modules/user/actions/user.actions";
import { useTranslations, useLocale } from "next-intl";

interface ReactivateAccountDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  scheduledDeletionDate?: Date;
  daysRemaining?: number;
  onSuccess: () => void;
}

export const ReactivateAccountDialog = memo(function ReactivateAccountDialog({
  isOpen,
  onOpenChange,
  email,
  scheduledDeletionDate,
  daysRemaining,
  onSuccess,
}: ReactivateAccountDialogProps) {
  const t = useTranslations("ReactivateAccount");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const errorRef = useRef<string | null>(null);

  const formatDate = useCallback(
    (date: Date) => {
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(date));
    },
    [locale]
  );

  const handleReactivate = useCallback(() => {
    errorRef.current = null;
    startTransition(async () => {
      try {
        const result = await reactivateAccountAction(email);

        if (result?.error) {
          errorRef.current = result.error;
          toast.error(result.error);
          return;
        }

        toast.success(result.success || tCommon("success"));
        onOpenChange(false);
        onSuccess();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : tCommon("error");
        errorRef.current = message;
        toast.error(message);
      }
    });
  }, [email, onOpenChange, onSuccess, tCommon]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
            <AlertTriangle className="h-7 w-7 text-amber-600" />
          </div>
          <AlertDialogTitle className="text-center">
            {t("title")}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 text-center">
              <p>{t("description")}</p>

              {scheduledDeletionDate && (
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-center justify-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4" />
                    {t("deletionDate")} {formatDate(scheduledDeletionDate)}
                  </div>
                  {daysRemaining !== undefined && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {daysRemaining === 0
                        ? t("deletesToday")
                        : daysRemaining === 1
                          ? t("daysLeft", { count: 1 })
                          : t("daysLeftPlural", { count: daysRemaining })}
                    </p>
                  )}
                </div>
              )}

              <p className="text-sm">{t("reactivateQuestion")}</p>

              <FormErrorAlert error={errorRef.current} />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:flex-col sm:space-x-0 sm:space-y-2">
          <AlertDialogAction
            onClick={handleReactivate}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("reactivating")}
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                {t("reactivateButton")}
              </>
            )}
          </AlertDialogAction>
          <AlertDialogCancel disabled={isPending} className="w-full">
            {t("continueDelete")}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
