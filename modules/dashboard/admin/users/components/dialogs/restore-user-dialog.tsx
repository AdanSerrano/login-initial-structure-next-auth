"use client";

import { memo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, CheckCircle } from "lucide-react";
import type { AdminUser } from "../../types/admin-users.types";

interface RestoreUserDialogProps {
  user: AdminUser | null;
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onRestore: (userId: string) => void;
}

export const RestoreUserDialog = memo(function RestoreUserDialog({
  user,
  open,
  isPending,
  onClose,
  onRestore,
}: RestoreUserDialogProps) {
  const handleConfirm = useCallback(() => {
    if (!user) return;
    onRestore(user.id);
  }, [user, onRestore]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <RotateCcw className="h-5 w-5" />
            Restaurar Usuario
          </DialogTitle>
          <DialogDescription>
            ¿Deseas restaurar la cuenta de{" "}
            <strong>{user.name || user.email}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-2 rounded-md bg-green-50 p-3 dark:bg-green-900/20">
            <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
            <div className="text-sm">
              <p className="font-medium text-green-800 dark:text-green-200">
                El usuario podrá acceder nuevamente
              </p>
              <ul className="mt-2 list-inside list-disc text-muted-foreground">
                <li>La cuenta será reactivada inmediatamente</li>
                <li>El usuario podrá iniciar sesión normalmente</li>
                <li>Todos sus datos serán preservados</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Restaurando..." : "Restaurar usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
