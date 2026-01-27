"use client";

import { memo, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AdminUser } from "../../types/admin-users.types";

interface DeleteUserDialogProps {
  user: AdminUser | null;
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onDelete: (userId: string, reason: string) => void;
}

export const DeleteUserDialog = memo(function DeleteUserDialog({
  user,
  open,
  isPending,
  onClose,
  onDelete,
}: DeleteUserDialogProps) {
  const t = useTranslations("DeleteUserDialog");
  const tCommon = useTranslations("Common");
  const reasonRef = useRef<HTMLTextAreaElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const validateReason = useCallback(() => {
    const reason = reasonRef.current?.value.trim() || "";
    const isValid = reason.length >= 5;

    if (errorRef.current) {
      errorRef.current.classList.toggle("hidden", isValid || reason.length === 0);
    }

    return isValid ? reason : null;
  }, []);

  const handleConfirm = useCallback(() => {
    if (!user) return;
    const reason = validateReason();
    if (reason) {
      onDelete(user.id, reason);
    }
  }, [user, onDelete, validateReason]);

  const handleClose = useCallback(() => {
    if (reasonRef.current) {
      reasonRef.current.value = "";
    }
    if (errorRef.current) {
      errorRef.current.classList.add("hidden");
    }
    onClose();
  }, [onClose]);

  const handleReasonChange = useCallback(() => {
    validateReason();
  }, [validateReason]);

  if (!user) return null;

  const userName = user.name || user.email || "";

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>
            {t("confirmMessage", { user: userName })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-200">
                {t("warning1")}
              </p>
              <ul className="mt-2 list-inside list-disc text-muted-foreground space-y-1">
                <li>{t("warning2")}</li>
                <li>
                  <strong>{t("warning3")}</strong>
                </li>
                <li>{t("warning4")}</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delete-reason" className="text-sm font-medium">
              {t("reasonLabel")} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              ref={reasonRef}
              id="delete-reason"
              placeholder={t("reasonPlaceholder")}
              className="min-h-[80px] resize-none"
              disabled={isPending}
              onChange={handleReasonChange}
            />
            <p
              ref={errorRef}
              className="text-xs text-destructive hidden"
            >
              {t("reasonError")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tCommon("deleting")}
              </>
            ) : (
              t("deleteButton")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
