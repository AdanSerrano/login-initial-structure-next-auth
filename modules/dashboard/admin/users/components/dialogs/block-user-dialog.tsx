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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormAlert } from "@/components/ui/form-fields";
import { Ban, Unlock, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { AdminUser } from "../../types/admin-users.types";

interface BlockUserDialogProps {
  user: AdminUser | null;
  open: boolean;
  isPending: boolean;
  mode: "block" | "unblock";
  onClose: () => void;
  onBlock: (userId: string, reason?: string) => void;
  onUnblock: (userId: string) => void;
}

export const BlockUserDialog = memo(function BlockUserDialog({
  user,
  open,
  isPending,
  mode,
  onClose,
  onBlock,
  onUnblock,
}: BlockUserDialogProps) {
  const t = useTranslations("BlockUserDialog");
  const tCommon = useTranslations("Common");
  const reasonRef = useRef<HTMLTextAreaElement>(null);

  const handleClose = useCallback(() => {
    if (reasonRef.current) {
      reasonRef.current.value = "";
    }
    onClose();
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    if (!user) return;

    if (mode === "block") {
      const reason = reasonRef.current?.value || undefined;
      onBlock(user.id, reason);
    } else {
      onUnblock(user.id);
    }
  }, [user, mode, onBlock, onUnblock]);

  if (!user) return null;

  const isBlocking = mode === "block";
  const userName = user.name || user.email || "";

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isBlocking ? (
              <>
                <Ban className="h-5 w-5 text-destructive" />
                {t("blockTitle")}
              </>
            ) : (
              <>
                <Unlock className="h-5 w-5 text-green-600" />
                {t("unblockTitle")}
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isBlocking
              ? t("blockMessage", { user: userName })
              : t("unblockMessage", { user: userName })}
          </DialogDescription>
        </DialogHeader>

        {isBlocking && (
          <div className="space-y-4">
            <FormAlert variant="warning" message={t("blockWarning")} />

            <div className="space-y-2">
              <Label htmlFor="reason">{t("blockReason")}</Label>
              <Textarea
                ref={reasonRef}
                id="reason"
                placeholder={t("blockReasonPlaceholder")}
                rows={3}
                disabled={isPending}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button
            variant={isBlocking ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tCommon("processing")}
              </>
            ) : isBlocking ? (
              t("blockButton")
            ) : (
              t("unblockButton")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
