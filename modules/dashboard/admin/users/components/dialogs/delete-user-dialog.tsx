"use client";

import { memo, useCallback, useState } from "react";
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
import { AlertTriangle, Trash2 } from "lucide-react";
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
  const [reason, setReason] = useState("");

  const handleConfirm = useCallback(() => {
    if (!user) return;
    onDelete(user.id, reason.trim());
  }, [user, onDelete, reason]);

  const handleClose = useCallback(() => {
    setReason("");
    onClose();
  }, [onClose]);

  if (!user) return null;

  const isReasonValid = reason.trim().length >= 5;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Eliminar Usuario
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar a{" "}
            <strong>{user.name || user.email}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-2 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                El usuario será bloqueado y eliminado
              </p>
              <ul className="mt-2 list-inside list-disc text-muted-foreground space-y-1">
                <li>No podrá acceder al sistema</li>
                <li>
                  <strong>30 días de gracia</strong> para reactivar
                </li>
                <li>Después será permanente</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delete-reason" className="text-sm font-medium">
              Motivo de eliminación <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="delete-reason"
              placeholder="Escribe el motivo de la eliminación (mínimo 5 caracteres)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px] resize-none"
              disabled={isPending}
            />
            {reason.length > 0 && !isReasonValid && (
              <p className="text-xs text-destructive">
                El motivo debe tener al menos 5 caracteres
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending || !isReasonValid}
          >
            {isPending ? "Eliminando..." : "Eliminar usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
