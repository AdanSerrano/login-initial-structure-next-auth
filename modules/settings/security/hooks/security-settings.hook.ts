"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  enableTwoFactorAction,
  disableTwoFactorAction,
} from "../actions/security-settings.actions";
import type { SecurityInfo } from "../services/security-settings.services";

interface UseSecuritySettingsProps {
  initialSecurityInfo: SecurityInfo | null;
  initialError?: string | null;
}

export function useSecuritySettings({
  initialSecurityInfo,
  initialError,
}: UseSecuritySettingsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const refreshSecurityInfo = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  const handleEnableTwoFactor = useCallback(() => {
    startTransition(async () => {
      const result = await enableTwoFactorAction();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      router.refresh();
    });
  }, [router]);

  const handleDisableTwoFactor = useCallback(() => {
    startTransition(async () => {
      const result = await disableTwoFactorAction();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      router.refresh();
    });
  }, [router]);

  return {
    securityInfo: initialSecurityInfo,
    error: initialError,
    isPending,
    handleEnableTwoFactor,
    handleDisableTwoFactor,
    refreshSecurityInfo,
  };
}
